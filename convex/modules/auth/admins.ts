import { mutation, query } from "../../_generated/server";
import { v } from "convex/values";

/**
 * Create or update admin in Convex database
 */
export const createOrUpdateAdmin = mutation({
  args: {
    firebaseUid: v.string(),
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    role: v.string(),
    permissions: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { firebaseUid, email, role, ...otherData } = args;

    // Check if admin already exists
    const existingAdmin = await ctx.db
      .query("admins")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", firebaseUid))
      .first();

    const timestamp = Date.now();

    if (existingAdmin) {
      // Update existing admin
      await ctx.db.patch(existingAdmin._id, {
        ...otherData,
        updatedAt: timestamp,
      });
      return existingAdmin._id;
    } else {
      // Create new admin
      const adminId = await ctx.db.insert("admins", {
        firebaseUid,
        email,
        role,
        ...otherData,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      return adminId;
    }
  },
});

/**
 * Get admin by Firebase UID
 */
export const getAdminByFirebaseUid = query({
  args: { firebaseUid: v.string() },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", args.firebaseUid))
      .first();
    return admin;
  },
});

/**
 * Get admin by email
 */
export const getAdminByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    return admin;
  },
});

/**
 * Get all admins
 */
export const getAllAdmins = query({
  handler: async (ctx) => {
    return await ctx.db.query("admins").collect();
  },
});
