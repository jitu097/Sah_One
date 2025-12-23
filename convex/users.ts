import { v } from "convex/values";
import { query } from "./_generated/server";

/**
 * User Queries
 * All queries are optimized with O(log n) complexity using indexes
 */

// Get user by ID - O(1)
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// Get user by email - O(log n) using index
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();
  },
});

// Get all active users by role - O(log n) using compound index
export const getUsersByRole = query({
  args: { 
    role: v.union(v.literal("user"), v.literal("admin"), v.literal("delivery")),
    isActive: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const isActive = args.isActive ?? true;
    return await ctx.db
      .query("users")
      .withIndex("by_active_role", (q) => 
        q.eq("isActive", isActive).eq("role", args.role)
      )
      .collect();
  },
});

// Get active delivery personnel - O(log n)
export const getActiveDeliveryPersonnel = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("users")
      .withIndex("by_active_role", (q) => 
        q.eq("isActive", true).eq("role", "delivery")
      )
      .collect();
  },
});

// Get user profile with address - O(1)
export const getUserProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;
    
    // Exclude password hash from response
    const { passwordHash, ...userProfile } = user;
    return userProfile;
  },
});
