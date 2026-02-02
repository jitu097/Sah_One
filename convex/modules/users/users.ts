import { mutation, query } from "../../_generated/server";
import { internal } from "../../_generated/api";
import { v } from "convex/values";

/**
 * Create or update user in Convex database
 */
export const createOrUpdateUser = mutation({
  args: {
    firebaseUid: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.string(),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { firebaseUid, email, role, ...otherData } = args;

    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", firebaseUid))
      .first();

    const timestamp = Date.now();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        ...otherData,
        updatedAt: timestamp,
      });
      return existingUser._id;
    } else {
      // Create new user
      const userId = await ctx.db.insert("users", {
        firebaseUid,
        email,
        role,
        ...otherData,
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      // Notify Admin of new user
      if (role === 'user') {
        await ctx.scheduler.runAfter(0, internal.notifications.create, {
          recipientId: "admin",
          type: "system",
          title: "New User Joined",
          message: `${otherData.name || "New User"} just joined!`,
          referenceId: userId,
          isAdmin: true,
        });

        // Welcome notification for the user
        // Welcome notification for the user
        await ctx.scheduler.runAfter(0, internal.notifications.create, {
          recipientId: userId,
          recipientFirebaseUid: firebaseUid,
          type: "system",
          title: "Welcome to Sah One!",
          message: "Thanks for joining us. Enjoy ordering!",
          referenceId: userId,
          isAdmin: false,
        });
      }

      return userId;
    }
  },
});

/**
 * Update user details (address, phone, name)
 */
export const updateUser = mutation({
  args: {
    firebaseUid: v.string(),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { firebaseUid, ...updates } = args;

    const user = await ctx.db
      .query("users")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", firebaseUid))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      ...updates,
      updatedAt: Date.now(),
    });

    return user._id;
  },
});

/**
 * Get user by Firebase UID
 */
export const getUserByFirebaseUid = query({
  args: { firebaseUid: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", args.firebaseUid))
      .first();
    return user;
  },
});

/**
 * Get user by email
 */
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    return user;
  },
});

/**
 * Get all users
 */
export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});
