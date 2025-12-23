import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Menu Item Queries and Mutations
 * Optimized for fast filtering and searching - O(log n) complexity
 */

// ============= QUERIES =============

// Get all menu items - O(n) but with pagination support
export const getAllMenuItems = query({
    args: {
        limit: v.optional(v.number()),
        cursor: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit || 50;

        let query = ctx.db.query("menuItems").order("desc");

        // Pagination support
        if (args.cursor) {
            query = query.paginate({ cursor: args.cursor, numItems: limit });
        }

        return await query.take(limit);
    },
});

// Get menu item by ID - O(1)
export const getMenuItemById = query({
    args: { menuItemId: v.id("menuItems") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.menuItemId);
    },
});

// Get available menu items - O(log n) using index
export const getAvailableMenuItems = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("menuItems")
            .withIndex("by_availability", (q) => q.eq("isAvailable", true))
            .collect();
    },
});

// Get menu items by category - O(log n) using index
export const getMenuItemsByCategory = query({
    args: {
        category: v.union(
            v.literal("Pizza"),
            v.literal("Burgers"),
            v.literal("Chinese"),
            v.literal("Indian"),
            v.literal("Salads"),
            v.literal("Beverages"),
            v.literal("Desserts")
        ),
        availableOnly: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const availableOnly = args.availableOnly ?? true;

        if (availableOnly) {
            return await ctx.db
                .query("menuItems")
                .withIndex("by_category_availability", (q) =>
                    q.eq("category", args.category).eq("isAvailable", true)
                )
                .collect();
        }

        return await ctx.db
            .query("menuItems")
            .withIndex("by_category", (q) => q.eq("category", args.category))
            .collect();
    },
});

// Search menu items by name - O(log n) using search index
export const searchMenuItems = query({
    args: {
        searchTerm: v.string(),
        category: v.optional(
            v.union(
                v.literal("Pizza"),
                v.literal("Burgers"),
                v.literal("Chinese"),
                v.literal("Indian"),
                v.literal("Salads"),
                v.literal("Beverages"),
                v.literal("Desserts")
            )
        ),
        availableOnly: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const availableOnly = args.availableOnly ?? true;

        let query = ctx.db
            .query("menuItems")
            .withSearchIndex("search_name", (q) => q.search("name", args.searchTerm));

        // Apply filters
        if (args.category) {
            query = query.filter((q) => q.eq(q.field("category"), args.category));
        }

        if (availableOnly) {
            query = query.filter((q) => q.eq(q.field("isAvailable"), true));
        }

        return await query.collect();
    },
});

// Get popular menu items (by rating) - O(n log n) for sorting
export const getPopularMenuItems = query({
    args: {
        limit: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const limit = args.limit || 10;

        const items = await ctx.db
            .query("menuItems")
            .withIndex("by_availability", (q) => q.eq("isAvailable", true))
            .collect();

        // Sort by rating and review count - O(n log n)
        return items
            .sort((a, b) => {
                if (b.rating !== a.rating) return b.rating - a.rating;
                return b.reviewCount - a.reviewCount;
            })
            .slice(0, limit);
    },
});

// ============= MUTATIONS =============

// Create new menu item - O(1) insert + O(log n) index update
export const createMenuItem = mutation({
    args: {
        name: v.string(),
        description: v.string(),
        price: v.number(),
        category: v.union(
            v.literal("Pizza"),
            v.literal("Burgers"),
            v.literal("Chinese"),
            v.literal("Indian"),
            v.literal("Salads"),
            v.literal("Beverages"),
            v.literal("Desserts")
        ),
        image: v.string(),
        preparationTime: v.number(),
        ingredients: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const menuItemId = await ctx.db.insert("menuItems", {
            ...args,
            isAvailable: true,
            rating: 0,
            reviewCount: 0,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });

        return menuItemId;
    },
});

// Update menu item - O(1)
export const updateMenuItem = mutation({
    args: {
        menuItemId: v.id("menuItems"),
        name: v.optional(v.string()),
        description: v.optional(v.string()),
        price: v.optional(v.number()),
        category: v.optional(
            v.union(
                v.literal("Pizza"),
                v.literal("Burgers"),
                v.literal("Chinese"),
                v.literal("Indian"),
                v.literal("Salads"),
                v.literal("Beverages"),
                v.literal("Desserts")
            )
        ),
        image: v.optional(v.string()),
        preparationTime: v.optional(v.number()),
        ingredients: v.optional(v.array(v.string())),
    },
    handler: async (ctx, args) => {
        const { menuItemId, ...updates } = args;

        await ctx.db.patch(menuItemId, {
            ...updates,
            updatedAt: Date.now(),
        });

        return menuItemId;
    },
});

// Toggle menu item availability - O(1)
export const toggleMenuItemAvailability = mutation({
    args: {
        menuItemId: v.id("menuItems"),
        isAvailable: v.boolean(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.menuItemId, {
            isAvailable: args.isAvailable,
            updatedAt: Date.now(),
        });

        return args.menuItemId;
    },
});

// Delete menu item - O(1)
export const deleteMenuItem = mutation({
    args: { menuItemId: v.id("menuItems") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.menuItemId);
        return args.menuItemId;
    },
});
