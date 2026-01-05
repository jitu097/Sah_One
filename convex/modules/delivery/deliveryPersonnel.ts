import { mutation, query } from "../../_generated/server";
import { v } from "convex/values";

/**
 * Create or update delivery person in Convex database
 */
export const createOrUpdateDelivery = mutation({
  args: {
    firebaseUid: v.string(),
    email: v.string(),
    name: v.string(),
    phone: v.string(),
    role: v.string(),
    vehicleNumber: v.optional(v.string()),
    isAvailable: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { firebaseUid, email, role, ...otherData } = args;

    // Check if delivery person already exists
    const existingDelivery = await ctx.db
      .query("delivery")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", firebaseUid))
      .first();

    const timestamp = Date.now();

    if (existingDelivery) {
      // Update existing delivery person
      await ctx.db.patch(existingDelivery._id, {
        ...otherData,
        updatedAt: timestamp,
      });
      return existingDelivery._id;
    } else {
      // Create new delivery person
      const deliveryId = await ctx.db.insert("delivery", {
        firebaseUid,
        email,
        role,
        ...otherData,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      return deliveryId;
    }
  },
});

/**
 * Get delivery person by Firebase UID
 */
export const getDeliveryByFirebaseUid = query({
  args: { firebaseUid: v.string() },
  handler: async (ctx, args) => {
    const delivery = await ctx.db
      .query("delivery")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", args.firebaseUid))
      .first();
    return delivery;
  },
});

/**
 * Get all available delivery persons
 */
export const getAvailableDelivery = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("delivery")
      .withIndex("by_availability", (q) => q.eq("isAvailable", true))
      .collect();
  },
});
