import { Doc, Id } from "../_generated/dataModel";

export type CartItemWithDetails = {
    itemId: Id<"menuItems">;
    name: string;
    price: number;
    quantity: number;
    category: string;
    fullPrice: number;
    halfPrice?: number;
    selectedPortion?: string;
};

export type CouponValidationResult = {
    isValid: boolean;
    error?: string;
    discountAmount: number;
    finalTotal: number;
};

export function validateCoupon(
    coupon: Doc<"offers">,
    cartItems: CartItemWithDetails[],
    cartSubtotal: number
): CouponValidationResult {
    const now = Date.now();

    // 1. Basic Validity Checks
    if (!coupon.isActive) {
        return { isValid: false, error: "Coupon is not active", discountAmount: 0, finalTotal: cartSubtotal };
    }
    if (now < coupon.validFrom || now > coupon.validTo) {
        return { isValid: false, error: "Coupon has expired", discountAmount: 0, finalTotal: cartSubtotal };
    }
    if (coupon.minOrderAmount && cartSubtotal < coupon.minOrderAmount) {
        return {
            isValid: false,
            error: `Minimum cart value of ₹${coupon.minOrderAmount} required`,
            discountAmount: 0,
            finalTotal: cartSubtotal
        };
    }

    // 2. Filter Eligible Items
    // If specific items are defined, only they are eligible.
    // If specific categories are defined, only items in those categories are eligible.
    // If neither, ALL items are eligible.

    let eligibleItemsSubtotal = 0;

    const hasItemRestrictions = coupon.items && coupon.items.length > 0;
    const hasCategoryRestrictions = coupon.categories && coupon.categories.length > 0;

    if (!hasItemRestrictions && !hasCategoryRestrictions) {
        // All items eligible
        eligibleItemsSubtotal = cartSubtotal;
    } else {
        // Calculate subtotal only for eligible items
        cartItems.forEach((item) => {
            const isItemEligible = hasItemRestrictions && coupon.items?.includes(item.itemId);
            const isCategoryEligible = hasCategoryRestrictions && coupon.categories?.includes(item.category);

            if ((hasItemRestrictions && isItemEligible) || (hasCategoryRestrictions && isCategoryEligible) || (!hasItemRestrictions && !hasCategoryRestrictions)) {
                // Compatible with "Specific items OR Specific categories"
                eligibleItemsSubtotal += item.price * item.quantity;
            }
        });

        if (eligibleItemsSubtotal === 0) {
            return {
                isValid: false,
                error: "Coupon not applicable to items in cart",
                discountAmount: 0,
                finalTotal: cartSubtotal
            };
        }
    }

    // 3. Calculate Discount
    let discount = 0;
    if (coupon.discountType === "percentage") {
        discount = (eligibleItemsSubtotal * coupon.discountValue) / 100;
    } else if (coupon.discountType === "fixed") {
        discount = coupon.discountValue;
    } else if (coupon.discountType === "bogo") {
        // BOGO Logic: Buy X Get Y Free
        // Defaults: Buy 1 Get 1
        const buyQty = coupon.buyQuantity || 1;
        const getQty = coupon.getQuantity || 1;

        cartItems.forEach((item) => {
            // Check eligibility per item
            const isItemEligible = hasItemRestrictions && coupon.items?.includes(item.itemId);
            const isCategoryEligible = hasCategoryRestrictions && coupon.categories?.includes(item.category);
            const isEligible = (hasItemRestrictions && isItemEligible) || (hasCategoryRestrictions && isCategoryEligible) || (!hasItemRestrictions && !hasCategoryRestrictions);

            if (isEligible) {
                const freeQty = Math.floor(item.quantity / (buyQty + getQty)) * getQty;
                discount += freeQty * item.price;
            }
        });
    }

    // 4. Cap Discount
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
    }

    // Ensure discount doesn't exceed subtotal (sanity check)
    if (discount > cartSubtotal) {
        discount = cartSubtotal;
    }

    return {
        isValid: true,
        discountAmount: Math.floor(discount), // Round down for clean numbers
        finalTotal: cartSubtotal - Math.floor(discount)
    };
}
