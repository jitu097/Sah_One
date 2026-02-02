import { mutation, query } from "../../_generated/server";
import { internal } from "../../_generated/api";
import { v } from "convex/values";
import { Id } from "../../_generated/dataModel";

/**
 * Create a new order
 */
export const createOrder = mutation({
  args: {
    userId: v.string(),
    items: v.array(
      v.object({
        itemId: v.string(),
        name: v.string(),
        quantity: v.number(),
        price: v.number(),
        portion: v.optional(v.string()),
        image: v.optional(v.string()),
      })
    ),
    totalAmount: v.number(),
    deliveryAddress: v.string(),
    customerName: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    paymentMethod: v.optional(v.string()),
    deliveryCharge: v.optional(v.number()),
    subtotal: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();

    const orderId = await ctx.db.insert("orders", {
      userId: args.userId,
      items: args.items,
      totalAmount: args.totalAmount,
      deliveryAddress: args.deliveryAddress,
      customerName: args.customerName,
      customerPhone: args.customerPhone,
      customerEmail: args.customerEmail,
      paymentMethod: args.paymentMethod || 'Cash on Delivery',
      deliveryCharge: args.deliveryCharge || 0,
      subtotal: args.subtotal || args.totalAmount,
      status: "pending",
      deliveryPersonId: undefined,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    // Notify Admin of new order
    await ctx.scheduler.runAfter(0, internal.notifications.create, {
      recipientId: "admin",
      type: "order",
      title: "New Order Received",
      message: `New order from ${args.customerName || "Customer"} for ₹${args.totalAmount}`,
      referenceId: orderId,
      isAdmin: true,
    });

    return orderId;
  },
});

/**
 * Get all orders (Admin only)
 */
export const getAllOrders = query({
  handler: async (ctx) => {
    return await ctx.db.query("orders").collect();
  },
});

/**
 * Get orders by user ID
 */
export const getOrdersByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

/**
 * Get orders by status
 */
export const getOrdersByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

/**
 * Get orders by delivery person
 */
export const getOrdersByDeliveryPerson = query({
  args: { deliveryPersonId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_delivery_person", (q) =>
        q.eq("deliveryPersonId", args.deliveryPersonId)
      )
      .collect();
  },
});

/**
 * Get single order by ID
 */
export const getOrderById = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});

/**
 * Update order status (Admin/Delivery)
 */
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    await ctx.db.patch(args.orderId, {
      status: args.status,
      updatedAt: Date.now(),
    });

    // Notify User of status update
    // Notify User of status update
    // Need to get Firebase UID from the user record because frontend queries by Firebase UID
    // Need to get Firebase UID from the user record because frontend queries by Firebase UID
    const user = await ctx.db.get(order.userId as Id<"users">);
    if (user && user.firebaseUid) {
      await ctx.scheduler.runAfter(0, internal.notifications.create, {
        recipientId: user._id,
        recipientFirebaseUid: user.firebaseUid,
        type: "order",
        title: "Order Status Update",
        message: `Your order is now ${args.status}`,
        referenceId: args.orderId,
        isAdmin: false,
      });
    }

    return { success: true };
  },
});

/**
 * Assign delivery person to order (Admin only)
 */
export const assignDeliveryPerson = mutation({
  args: {
    orderId: v.id("orders"),
    deliveryPersonId: v.string(),
  },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    await ctx.db.patch(args.orderId, {
      deliveryPersonId: args.deliveryPersonId,
      status: "out-for-delivery",
      updatedAt: Date.now(),
    });

    // Notify User
    // Notify User
    // Notify User
    const user = await ctx.db.get(order.userId as Id<"users">);
    if (user && user.firebaseUid) {
      await ctx.scheduler.runAfter(0, internal.notifications.create, {
        recipientId: user._id,
        recipientFirebaseUid: user.firebaseUid,
        type: "order",
        title: "Order Out for Delivery",
        message: "Your order is on the way!",
        referenceId: args.orderId,
        isAdmin: false,
      });
    }

    return { success: true };
  },
});

/**
 * Cancel order
 */
export const cancelOrder = mutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const order = await ctx.db.get(args.orderId);
    if (!order) throw new Error("Order not found");

    await ctx.db.patch(args.orderId, {
      status: "cancelled",
      updatedAt: Date.now(),
    });

    // Notify User if admin cancelled, or Admin if user cancelled?
    // For now, assuming this action notifies the User (e.g. if Admin cancelled it).
    // If user cancelled their own order, they shouldn't verify get a notification? 
    // Just notify User to be safe/consistent.
    // Notify User
    const user = await ctx.db.get(order.userId as Id<"users">);
    if (user && user.firebaseUid) {
      await ctx.scheduler.runAfter(0, internal.notifications.create, {
        recipientId: user._id,
        recipientFirebaseUid: user.firebaseUid,
        type: "order",
        title: "Order Cancelled",
        message: "Your order has been cancelled.",
        referenceId: args.orderId,
        isAdmin: false,
      });
    }

    // Also Notify Admin about cancellation
    await ctx.scheduler.runAfter(0, internal.notifications.create, {
      recipientId: "admin",
      type: "order",
      title: "Order Cancelled",
      message: `Order #${args.orderId} was cancelled.`,
      referenceId: args.orderId,
      isAdmin: true,
    });

    return { success: true };
  },
});

/**
 * Get recent orders (last 50)
 */
export const getRecentOrders = query({
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    return orders
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 50);
  },
});

/**
 * Get order statistics (Admin only)
 */
export const getOrderStatistics = query({
  handler: async (ctx) => {
    const allOrders = await ctx.db.query("orders").collect();

    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter(o => o.status === "pending").length;
    const confirmedOrders = allOrders.filter(o => o.status === "confirmed").length;
    const preparingOrders = allOrders.filter(o => o.status === "preparing").length;
    const outForDelivery = allOrders.filter(o => o.status === "out-for-delivery").length;
    const deliveredOrders = allOrders.filter(o => o.status === "delivered").length;
    const cancelledOrders = allOrders.filter(o => o.status === "cancelled").length;

    const totalRevenue = allOrders
      .filter(o => o.status === "delivered")
      .reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      preparingOrders,
      outForDelivery,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
    };
  },
});
