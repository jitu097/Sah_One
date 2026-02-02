import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateCoupon } from "./lib/couponUtils";

/**
 * Get the current user's cart with calculated totals and coupon status.
 */
export const getCart = query({
    args: { userId: v.optional(v.string()) }, // Allow passing userId explicitly or derive from auth
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        const userId = identity?.uid || args.userId;

        if (!userId) {
            return { items: [], subtotal: 0, discount: 0, total: 0, coupon: null };
        }

        // 1. Get Cart
        const cart = await ctx.db
            .query("carts")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .unique();

        if (!cart) {
            return { items: [], subtotal: 0, discount: 0, total: 0, coupon: null };
        }

        // 2. Get Cart Items
        const cartItems = await ctx.db
            .query("cartItems")
            .withIndex("by_cart", (q) => q.eq("cartId", cart._id))
            .collect();

        // 3. Join with Menu Items or Serving Hours to get fresh prices/details
        const itemsWithDetails = await Promise.all(
            cartItems.map(async (item) => {
                // Check if this is a serving hours item (string ID) or menu item (Convex ID)
                const isServingItem = item.itemType === "serving" || (typeof item.itemId === "string" && item.itemId.startsWith("special_"));

                if (isServingItem) {
                    // For serving hours items, we need to fetch from servingHoursConfig
                    const servingHours = await ctx.db.query("servingHoursConfig").first();
                    if (!servingHours) return null;

                    // Search in all slots for the item
                    let foundItem = null;
                    const slots = [servingHours.breakfast, servingHours.lunch, servingHours.dinner];
                    
                    for (const slot of slots) {
                        if (slot?.items) {
                            foundItem = slot.items.find(i => i.id === item.itemId);
                            if (foundItem) break;
                        }
                    }

                    if (!foundItem || !foundItem.isActive) return null; // Item not found or inactive

                    return {
                        ...item,
                        name: foundItem.name,
                        image: foundItem.image || "/image.png",
                        price: foundItem.price,
                        category: "Special Menu",
                        fullPrice: foundItem.price,
                        halfPrice: undefined,
                        hasHalfPortion: false
                    };
                } else {
                    // Regular menu item
                    const menuItem = await ctx.db.get(item.itemId as any);
                    if (!menuItem) return null; // Item might have been deleted

                    // Determine price based on portion
                    let price = menuItem.fullPrice;
                    if (item.selectedPortion === "half" && menuItem.hasHalfPortion && menuItem.halfPrice) {
                        price = menuItem.halfPrice;
                    }

                    return {
                        ...item,
                        name: menuItem.name,
                        image: menuItem.image,
                        price: price,
                        category: menuItem.category,
                        fullPrice: menuItem.fullPrice,
                        halfPrice: menuItem.halfPrice,
                        hasHalfPortion: menuItem.hasHalfPortion
                    };
                }
            })
        );

        // Filter out nulls (deleted items)
        const activeItems = itemsWithDetails.filter((i) => i !== null) as NonNullable<typeof itemsWithDetails[number]>[];

        // 4. Calculate Subtotal
        const subtotal = activeItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        // 5. Apply Coupon Logic
        let discount = 0;
        let couponStatus = null;
        let finalTotal = subtotal;

        if (cart.couponCode) {
            const coupon = await ctx.db
                .query("offers")
                .withIndex("by_code", (q) => q.eq("code", cart.couponCode!))
                .unique();

            if (coupon) {
                // Validate Coupon
                const validation = validateCoupon(coupon, activeItems, subtotal);

                if (validation.isValid) {
                    discount = validation.discountAmount;
                    finalTotal = validation.finalTotal;
                    couponStatus = {
                        code: coupon.code,
                        discountAmount: discount,
                        description: coupon.description,
                        title: coupon.title
                    };
                } else {
                    // Coupon became invalid (e.g. cart value dropped below min). 
                    // We notify frontend via specific flag, but strictly we could just NOT return it.
                    // Ideally we might want to auto-remove it here, but read-only Query cannot mutate.
                    // Frontend should detect "couponCode exists in cart but returned couponStatus is null" 
                    // and maybe show an error or just ignore it.
                    // For better UX, we can return an error message in the payload.
                    couponStatus = {
                        code: cart.couponCode,
                        error: validation.error,
                        isInvalid: true
                    };
                }
            } else {
                // Coupon code exists in cart but not found in DB (maybe deleted)
                couponStatus = { code: cart.couponCode, error: "Coupon not found", isInvalid: true };
            }
        }

        return {
            cartId: cart._id,
            items: activeItems.map(item => ({
                id: item._id, // cartItem ID
                itemId: item.itemId, // menu item ID
                name: item.name,
                image: item.image,
                quantity: item.quantity,
                price: item.price,
                selectedPortion: item.selectedPortion,
                category: item.category
            })),
            subtotal,
            discount,
            total: finalTotal,
            coupon: couponStatus
        };
    },
});

/**
 * Add item to cart or update quantity if exists.
 */
export const addToCart = mutation({
    args: {
        userId: v.string(),
        itemId: v.union(v.id("menuItems"), v.string()), // Support both menu items and serving hours items
        quantity: v.number(),
        selectedPortion: v.optional(v.string()), // "full" or "half"
        itemType: v.optional(v.string()) // "menu" or "serving"
    },
    handler: async (ctx, args) => {
        const userId = args.userId;
        if (!userId) throw new Error("User ID is required");

        // Determine if this is a serving hours item or menu item
        const isServingItem = args.itemType === "serving" || (typeof args.itemId === "string" && args.itemId.startsWith("special_"));

        // Validate item exists
        if (isServingItem) {
            const servingHours = await ctx.db.query("servingHoursConfig").first();
            if (!servingHours) throw new Error("Serving hours not configured");
            
            let foundItem = null;
            const slots = [servingHours.breakfast, servingHours.lunch, servingHours.dinner];
            for (const slot of slots) {
                if (slot?.items) {
                    foundItem = slot.items.find(i => i.id === args.itemId);
                    if (foundItem) break;
                }
            }
            if (!foundItem) throw new Error("Serving hours item not found");
            if (!foundItem.isActive) throw new Error("Item is not available");
        } else {
            const menuItem = await ctx.db.get(args.itemId as any);
            if (!menuItem) throw new Error("Menu item not found");
        }

        // 1. Get or Create Cart
        let cart = await ctx.db
            .query("carts")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .unique();

        if (!cart) {
            const cartId = await ctx.db.insert("carts", {
                userId,
                updatedAt: Date.now(),
            });
            cart = await ctx.db.get(cartId);
        }

        if (!cart) throw new Error("Failed to create cart");

        // 2. Check if item exists in cart (matching ID AND portion)
        // Note: We need to match portion too. A "Half Butter Chicken" is different from "Full Butter Chicken"
        const existingItems = await ctx.db
            .query("cartItems")
            .withIndex("by_cart_and_item", (q) => q.eq("cartId", cart!._id).eq("itemId", args.itemId))
            .collect();

        const portionToMatch = args.selectedPortion || "full"; // Default to full if not specified
        const existingItem = existingItems.find(i => (i.selectedPortion || "full") === portionToMatch);

        if (existingItem) {
            await ctx.db.patch(existingItem._id, {
                quantity: existingItem.quantity + args.quantity,
            });
        } else {
            await ctx.db.insert("cartItems", {
                cartId: cart._id,
                itemId: args.itemId,
                quantity: args.quantity,
                selectedPortion: portionToMatch,
                itemType: isServingItem ? "serving" : "menu",
            });
        }

        // Touch cart updated time
        await ctx.db.patch(cart._id, { updatedAt: Date.now() });
    },
});

/**
 * Update quantity of a specific cart item entry.
 */
export const updateQuantity = mutation({
    args: {
        cartItemId: v.id("cartItems"),
        quantity: v.number()
    },
    handler: async (ctx, args) => {
        if (args.quantity <= 0) {
            await ctx.db.delete(args.cartItemId);
        } else {
            await ctx.db.patch(args.cartItemId, { quantity: args.quantity });
        }
    }
});

/**
 * Clear the entire cart.
 */
export const clearCart = mutation({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const userId = args.userId;

        const cart = await ctx.db
            .query("carts")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .unique();

        if (cart) {
            // Delete all items
            const items = await ctx.db
                .query("cartItems")
                .withIndex("by_cart", (q) => q.eq("cartId", cart._id))
                .collect();

            await Promise.all(items.map(i => ctx.db.delete(i._id)));

            // Reset coupon
            await ctx.db.patch(cart._id, { couponCode: undefined, updatedAt: Date.now() });
        }
    }
});

/**
 * Apply a coupon to the cart.
 */
export const applyCoupon = mutation({
    args: {
        code: v.string(),
        userId: v.string()
    },
    handler: async (ctx, args) => {
        const userId = args.userId;

        const cart = await ctx.db
            .query("carts")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .unique();

        if (!cart) throw new Error("No active cart found");

        // Verify coupon exists
        const coupon = await ctx.db
            .query("offers")
            .withIndex("by_code", (q) => q.eq("code", args.code))
            .unique();

        if (!coupon) throw new Error("Invalid coupon code");

        // We do basic check here, but real validation happens on getCart or creating order
        if (!coupon.isActive) throw new Error("Coupon is not active");

        await ctx.db.patch(cart._id, {
            couponCode: args.code,
            updatedAt: Date.now()
        });
    }
});

/**
 * Remove coupon from cart.
 */
export const removeCoupon = mutation({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const userId = args.userId;

        const cart = await ctx.db
            .query("carts")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .unique();

        if (cart) {
            await ctx.db.patch(cart._id, {
                couponCode: undefined,
                updatedAt: Date.now()
            });
        }
    }
});
