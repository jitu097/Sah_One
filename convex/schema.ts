import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Convex Database Schema
 * Time Complexity: O(1) for schema definition
 * Optimized with proper indexes for efficient querying
 */

export default defineSchema({
  // Users table - indexed by email for O(1) lookups
  users: defineTable({
    name: v.string(),
    email: v.string(),
    passwordHash: v.string(),
    phone: v.string(),
    role: v.union(v.literal("user"), v.literal("admin"), v.literal("delivery")),
    address: v.optional(
      v.array(
        v.object({
          street: v.string(),
          city: v.string(),
          state: v.string(),
          zipCode: v.string(),
          isDefault: v.boolean(),
        })
      )
    ),
    profileImage: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"]) // O(log n) email lookup
    .index("by_role", ["role"]) // O(log n) role-based queries
    .index("by_active_role", ["isActive", "role"]), // Compound index for filtering

  // Menu Items table - indexed by category and availability
  menuItems: defineTable({
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
    isAvailable: v.boolean(),
    preparationTime: v.number(), // in minutes
    ingredients: v.optional(v.array(v.string())),
    rating: v.number(),
    reviewCount: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"]) // O(log n) category filtering
    .index("by_availability", ["isAvailable"]) // O(log n) availability check
    .index("by_category_availability", ["category", "isAvailable"]) // Compound index
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["category", "isAvailable"],
    }), // Full-text search O(log n)

  // Orders table - indexed by user, status, and delivery person
  orders: defineTable({
    userId: v.id("users"),
    items: v.array(
      v.object({
        menuItemId: v.id("menuItems"),
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
      })
    ),
    totalAmount: v.number(),
    deliveryAddress: v.object({
      street: v.string(),
      city: v.string(),
      state: v.string(),
      zipCode: v.string(),
    }),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("preparing"),
      v.literal("out_for_delivery"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    paymentStatus: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    paymentMethod: v.union(
      v.literal("cash"),
      v.literal("card"),
      v.literal("upi"),
      v.literal("wallet")
    ),
    deliveryPersonId: v.optional(v.id("users")),
    estimatedDeliveryTime: v.optional(v.number()),
    actualDeliveryTime: v.optional(v.number()),
    specialInstructions: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]) // O(log n) user orders
    .index("by_status", ["status"]) // O(log n) status filtering
    .index("by_delivery_person", ["deliveryPersonId"]) // O(log n) delivery queries
    .index("by_user_status", ["userId", "status"]) // Compound index
    .index("by_created_at", ["createdAt"]) // O(log n) chronological ordering
    .index("by_status_created", ["status", "createdAt"]), // For real-time dashboard

  // Payments table - indexed by order and status
  payments: defineTable({
    orderId: v.id("orders"),
    userId: v.id("users"),
    amount: v.number(),
    paymentMethod: v.union(
      v.literal("cash"),
      v.literal("card"),
      v.literal("upi"),
      v.literal("wallet")
    ),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("failed"),
      v.literal("refunded")
    ),
    transactionId: v.optional(v.string()),
    razorpayOrderId: v.optional(v.string()),
    razorpayPaymentId: v.optional(v.string()),
    razorpaySignature: v.optional(v.string()),
    failureReason: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_order", ["orderId"]) // O(log n) order payment lookup
    .index("by_user", ["userId"]) // O(log n) user payment history
    .index("by_status", ["status"]) // O(log n) payment status queries
    .index("by_transaction", ["transactionId"]), // O(log n) transaction tracking

  // Table Bookings - for restaurant reservations
  tableBookings: defineTable({
    userId: v.id("users"),
    guestName: v.string(),
    guestPhone: v.string(),
    numberOfGuests: v.number(),
    bookingDate: v.number(),
    bookingTime: v.string(),
    specialRequests: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("completed")
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]) // O(log n) user bookings
    .index("by_status", ["status"]) // O(log n) status filtering
    .index("by_booking_date", ["bookingDate"]) // O(log n) date-based queries
    .index("by_date_status", ["bookingDate", "status"]), // Compound index

  // Sessions table - for managing user sessions (replaces Redis)
  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
    deviceInfo: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    isActive: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_token", ["token"]) // O(log n) token lookup
    .index("by_user", ["userId"]) // O(log n) user sessions
    .index("by_expires", ["expiresAt"]) // O(log n) cleanup queries
    .index("by_user_active", ["userId", "isActive"]), // Active sessions per user
});
