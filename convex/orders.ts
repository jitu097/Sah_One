import { v } from "convex/values";
import { query } from "./_generated/server";

/**
 * Order Queries
 * Optimized with indexes for O(log n) lookups
 */

// Get order by ID - O(1)
export const getOrderById = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});

// Get orders by user - O(log n) using index
export const getOrdersByUser = query({
  args: {
    userId: v.id("users"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    
    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .order("desc")
      .take(limit);
  },
});

// Get orders by user and status - O(log n) using compound index
export const getOrdersByUserAndStatus = query({
  args: {
    userId: v.id("users"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("preparing"),
      v.literal("out_for_delivery"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_user_status", (q) => 
        q.eq("userId", args.userId).eq("status", args.status)
      )
      .collect();
  },
});

// Get orders by status - O(log n) using index
export const getOrdersByStatus = query({
  args: {
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("preparing"),
      v.literal("out_for_delivery"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 100;
    
    return await ctx.db
      .query("orders")
      .withIndex("by_status_created", (q) => q.eq("status", args.status))
      .order("desc")
      .take(limit);
  },
});

// Get orders assigned to delivery person - O(log n)
export const getOrdersByDeliveryPerson = query({
  args: {
    deliveryPersonId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_delivery_person", (q) => 
        q.eq("deliveryPersonId", args.deliveryPersonId)
      )
      .order("desc")
      .collect();
  },
});

// Get active orders for delivery person (not delivered/cancelled) - O(log n)
export const getActiveDeliveryOrders = query({
  args: {
    deliveryPersonId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_delivery_person", (q) => 
        q.eq("deliveryPersonId", args.deliveryPersonId)
      )
      .collect();
    
    // Filter active orders - O(n) where n = delivery person's orders
    return orders.filter(
      (order) => order.status !== "delivered" && order.status !== "cancelled"
    );
  },
});

// Get recent orders (for admin dashboard) - O(log n)
export const getRecentOrders = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 20;
    
    return await ctx.db
      .query("orders")
      .withIndex("by_created_at")
      .order("desc")
      .take(limit);
  },
});

// Get orders by date range - O(log n) + filtering
export const getOrdersByDateRange = query({
  args: {
    startDate: v.number(),
    endDate: v.number(),
  },
  handler: async (ctx, args) => {
    const orders = await ctx.db
      .query("orders")
      .withIndex("by_created_at")
      .collect();
    
    // Filter by date range - O(n)
    return orders.filter(
      (order) => order.createdAt >= args.startDate && order.createdAt <= args.endDate
    );
  },
});

// Get order statistics (for admin dashboard) - O(n)
export const getOrderStatistics = query({
  args: {
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let orders = await ctx.db.query("orders").collect();
    
    // Filter by date if provided
    if (args.startDate && args.endDate) {
      orders = orders.filter(
        (order) => order.createdAt >= args.startDate! && order.createdAt <= args.endDate!
      );
    }
    
    // Calculate statistics - O(n)
    const stats = {
      totalOrders: orders.length,
      pending: 0,
      confirmed: 0,
      preparing: 0,
      out_for_delivery: 0,
      delivered: 0,
      cancelled: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
    };
    
    orders.forEach((order) => {
      stats[order.status]++;
      if (order.paymentStatus === "completed") {
        stats.totalRevenue += order.totalAmount;
      }
    });
    
    stats.averageOrderValue = 
      stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0;
    
    return stats;
  },
});

// Get order with populated data (user info, menu items) - O(1) + O(m) where m = items count
export const getOrderWithDetails = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) return null;
    
    // Get user details - O(1)
    const user = await ctx.db.get(order.userId);
    
    // Get delivery person details if assigned - O(1)
    let deliveryPerson = null;
    if (order.deliveryPersonId) {
      deliveryPerson = await ctx.db.get(order.deliveryPersonId);
    }
    
    return {
      ...order,
      user: user ? { name: user.name, email: user.email, phone: user.phone } : null,
      deliveryPerson: deliveryPerson 
        ? { name: deliveryPerson.name, phone: deliveryPerson.phone } 
        : null,
    };
  },
});
