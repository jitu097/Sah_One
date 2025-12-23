import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

/**
 * Delivery Management and Tracking
 * Boilerplate for managing delivery operations and real-time tracking
 */

// ============= QUERIES =============

// Get active deliveries for a delivery person
export const getActiveDeliveries = query({
    args: {
        deliveryPersonId: v.id("users"),
    },
    handler: async (ctx, args) => {
        // Get orders assigned to this delivery person that are not delivered/cancelled
        const orders = await ctx.db
            .query("orders")
            .withIndex("by_delivery_person", (q) =>
                q.eq("deliveryPersonId", args.deliveryPersonId)
            )
            .collect();

        // Filter active deliveries
        return orders.filter(
            (order) => order.status !== "delivered" && order.status !== "cancelled"
        );
    },
});

// Get delivery statistics for a delivery person
export const getDeliveryStats = query({
    args: {
        deliveryPersonId: v.id("users"),
        startDate: v.optional(v.number()),
        endDate: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        let orders = await ctx.db
            .query("orders")
            .withIndex("by_delivery_person", (q) =>
                q.eq("deliveryPersonId", args.deliveryPersonId)
            )
            .collect();

        // Filter by date range if provided
        if (args.startDate && args.endDate) {
            orders = orders.filter(
                (order) => order.createdAt >= args.startDate! && order.createdAt <= args.endDate!
            );
        }

        // Calculate statistics
        const stats = {
            totalDeliveries: orders.filter((o) => o.status === "delivered").length,
            activeDeliveries: orders.filter(
                (o) => o.status !== "delivered" && o.status !== "cancelled"
            ).length,
            cancelledDeliveries: orders.filter((o) => o.status === "cancelled").length,
            totalEarnings: 0, // TODO: Implement delivery fee calculation
        };

        return stats;
    },
});

// ============= MUTATIONS =============

// Update delivery location (for real-time tracking)
export const updateDeliveryLocation = mutation({
    args: {
        orderId: v.id("orders"),
        latitude: v.number(),
        longitude: v.number(),
    },
    handler: async (ctx, args) => {
        // TODO: Implement location tracking once schema is extended
        // This is boilerplate for future real-time tracking feature
        return args.orderId;
    },
});

// Mark delivery as completed
export const completeDelivery = mutation({
    args: {
        orderId: v.id("orders"),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.orderId, {
            status: "delivered",
            actualDeliveryTime: Date.now(),
            updatedAt: Date.now(),
        });

        return args.orderId;
    },
});

// Accept delivery assignment
export const acceptDelivery = mutation({
    args: {
        orderId: v.id("orders"),
        deliveryPersonId: v.id("users"),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.orderId, {
            deliveryPersonId: args.deliveryPersonId,
            status: "out_for_delivery",
            updatedAt: Date.now(),
        });

        return args.orderId;
    },
});

// Reject delivery assignment
export const rejectDelivery = mutation({
    args: {
        orderId: v.id("orders"),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.orderId, {
            deliveryPersonId: undefined,
            status: "confirmed", // Return to confirmed status
            updatedAt: Date.now(),
        });

        return args.orderId;
    },
});
