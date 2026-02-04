import { mutation, query } from "../../_generated/server";
import { v } from "convex/values";
import { verifyAdmin } from "../../lib/auth";

const getFirebaseUid = (identity: any) => {
  return identity?.subject || identity?.tokenIdentifier || null;
};

const ensureAdmin = async (ctx: any) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Unauthorized");

  const firebaseUid = getFirebaseUid(identity);
  if (!firebaseUid) throw new Error("Unauthorized");

  try {
    await verifyAdmin(ctx, firebaseUid);
  } catch (error) {
    const user = await ctx.db
      .query("users")
      .withIndex("by_firebase_uid", (q: any) => q.eq("firebaseUid", firebaseUid))
      .first();
    if (!user || user.role !== "admin") {
      throw new Error("Access denied: Admins only");
    }
  }
};

const validateRule = (minOrderAmount: number, deliveryFee: number) => {
  if (minOrderAmount < 0 || deliveryFee < 0) {
    throw new Error("Invalid values: amounts must be non-negative");
  }
};

export const getActiveDeliveryChargeRules = query({
  handler: async (ctx) => {
    const rules = await ctx.db
      .query("deliveryChargeRules")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    return rules.sort((a, b) => b.minOrderAmount - a.minOrderAmount);
  },
});

export const getAllDeliveryChargeRules = query({
  handler: async (ctx) => {
    await ensureAdmin(ctx);
    const rules = await ctx.db.query("deliveryChargeRules").collect();
    return rules.sort((a, b) => b.minOrderAmount - a.minOrderAmount);
  },
});

export const createDeliveryChargeRule = mutation({
  args: {
    minOrderAmount: v.number(),
    deliveryFee: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ensureAdmin(ctx);
    validateRule(args.minOrderAmount, args.deliveryFee);

    const existing = await ctx.db
      .query("deliveryChargeRules")
      .withIndex("by_min_order", (q) => q.eq("minOrderAmount", args.minOrderAmount))
      .first();

    if (existing) {
      throw new Error("A rule with this minimum order amount already exists");
    }

    const now = Date.now();
    return await ctx.db.insert("deliveryChargeRules", {
      minOrderAmount: args.minOrderAmount,
      deliveryFee: args.deliveryFee,
      isActive: args.isActive,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateDeliveryChargeRule = mutation({
  args: {
    ruleId: v.id("deliveryChargeRules"),
    minOrderAmount: v.number(),
    deliveryFee: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ensureAdmin(ctx);
    validateRule(args.minOrderAmount, args.deliveryFee);

    const existing = await ctx.db
      .query("deliveryChargeRules")
      .withIndex("by_min_order", (q) => q.eq("minOrderAmount", args.minOrderAmount))
      .first();

    if (existing && existing._id !== args.ruleId) {
      throw new Error("A rule with this minimum order amount already exists");
    }

    await ctx.db.patch(args.ruleId, {
      minOrderAmount: args.minOrderAmount,
      deliveryFee: args.deliveryFee,
      isActive: args.isActive,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

export const deleteDeliveryChargeRule = mutation({
  args: { ruleId: v.id("deliveryChargeRules") },
  handler: async (ctx, args) => {
    await ensureAdmin(ctx);
    await ctx.db.delete(args.ruleId);
    return { success: true };
  },
});
