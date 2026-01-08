import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Database Schema for Sah One Food Delivery App
 */
export default defineSchema({
  // Users table - for regular customers
  users: defineTable({
    firebaseUid: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.string(), // "user", "admin", "delivery"
    address: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_firebase_uid", ["firebaseUid"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  // Admins table - for admin users
  admins: defineTable({
    firebaseUid: v.string(),
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    role: v.string(), // "admin"
    permissions: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_firebase_uid", ["firebaseUid"])
    .index("by_email", ["email"]),

  // Delivery personnel table
  delivery: defineTable({
    firebaseUid: v.string(),
    email: v.string(),
    name: v.string(),
    phone: v.string(),
    role: v.string(), // "delivery"
    vehicleNumber: v.optional(v.string()),
    isAvailable: v.boolean(),
    currentOrders: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_firebase_uid", ["firebaseUid"])
    .index("by_email", ["email"])
    .index("by_availability", ["isAvailable"]),

  // Menu items
  menuItems: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    category: v.string(), // "breakfast", "lunch", "dinner"
    image: v.optional(v.string()),
    isAvailable: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_availability", ["isAvailable"]),

  // Orders
  orders: defineTable({
    userId: v.string(), // Reference to users._id
    items: v.array(v.object({
      itemId: v.string(),
      name: v.string(),
      quantity: v.number(),
      price: v.number(),
    })),
    totalAmount: v.number(),
    status: v.string(), // "pending", "confirmed", "preparing", "out-for-delivery", "delivered", "cancelled"
    deliveryAddress: v.string(),
    deliveryPersonId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_delivery_person", ["deliveryPersonId"]),

  // Offers
  offers: defineTable({
    title: v.string(),
    description: v.string(),
    code: v.string(),
    discountType: v.string(), // "percentage", "fixed"
    discountValue: v.number(),
    minOrderAmount: v.optional(v.number()),
    maxDiscount: v.optional(v.number()),
    validFrom: v.number(),
    validTo: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_code", ["code"])
    .index("by_active", ["isActive"]),

  // Special Serving Hours
  specialServingHours: defineTable({
    date: v.string(), // Format: "YYYY-MM-DD"
    dayOfWeek: v.string(), // "monday", "tuesday", etc.
    openingTime: v.string(), // Format: "HH:MM"
    closingTime: v.string(), // Format: "HH:MM"
    isClosed: v.boolean(),
    reason: v.optional(v.string()), // e.g., "Holiday", "Special Event"
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_date", ["date"])
    .index("by_day", ["dayOfWeek"]),

  // Restaurant Settings
  restaurantSettings: defineTable({
    settingKey: v.string(),
    settingValue: v.string(),
    description: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_key", ["settingKey"]),

  // Reports/Analytics
  reports: defineTable({
    reportType: v.string(), // "daily", "weekly", "monthly"
    date: v.string(),
    totalOrders: v.number(),
    totalRevenue: v.number(),
    totalDeliveries: v.number(),
    topSellingItems: v.optional(v.array(v.object({
      itemId: v.string(),
      itemName: v.string(),
      quantity: v.number(),
    }))),
    createdAt: v.number(),
  })
    .index("by_type", ["reportType"])
    .index("by_date", ["date"]),
});
