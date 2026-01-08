import { mutation, query } from "../../_generated/server";
import { v } from "convex/values";

/**
 * Get all menu items
 */
export const getAllMenuItems = query({
  handler: async (ctx) => {
    return await ctx.db.query("menuItems").collect();
  },
});

/**
 * Get available menu items
 */
export const getAvailableMenuItems = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("menuItems")
      .withIndex("by_availability", (q) => q.eq("isAvailable", true))
      .collect();
  },
});

/**
 * Get menu items by category
 */
export const getMenuItemsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("menuItems")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

/**
 * Get single menu item by ID
 */
export const getMenuItemById = query({
  args: { itemId: v.id("menuItems") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.itemId);
  },
});

/**
 * Create new menu item (Admin only)
 */
export const createMenuItem = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(),
    image: v.optional(v.string()),
    isAvailable: v.boolean(),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();

    const itemId = await ctx.db.insert("menuItems", {
      ...args,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    return itemId;
  },
});

/**
 * Update menu item (Admin only)
 */
export const updateMenuItem = mutation({
  args: {
    itemId: v.id("menuItems"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    category: v.optional(v.string()),
    image: v.optional(v.string()),
    isAvailable: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { itemId, ...updates } = args;

    await ctx.db.patch(itemId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Delete menu item (Admin only)
 */
export const deleteMenuItem = mutation({
  args: { itemId: v.id("menuItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.itemId);
    return { success: true };
  },
});

/**
 * Toggle menu item availability (Admin only)
 */
export const toggleMenuItemAvailability = mutation({
  args: {
    itemId: v.id("menuItems"),
    isAvailable: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.itemId, {
      isAvailable: args.isAvailable,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Search menu items by name
 */
export const searchMenuItems = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const allItems = await ctx.db.query("menuItems").collect();
    
    return allItems.filter((item) =>
      item.name.toLowerCase().includes(args.searchTerm.toLowerCase())
    );
  },
});
