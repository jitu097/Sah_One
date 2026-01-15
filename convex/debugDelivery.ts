import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listDeliveryUsers = query({
    handler: async (ctx) => {
        return await ctx.db.query("delivery").collect();
    },
});

export const manualCreateDelivery = mutation({
    args: {
        firebaseUid: v.string(),
        email: v.string(),
        name: v.string(),
    },
    handler: async (ctx, args) => {
        // Check if exists
        const existing = await ctx.db
            .query("delivery")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .first();

        if (existing) {
            if (existing.firebaseUid !== args.firebaseUid) {
                // Patch UID if email matches but UID is wrong (e.g. wiped firebase)
                await ctx.db.patch(existing._id, { firebaseUid: args.firebaseUid });
                return "Updated UID for existing user";
            }
            return "User already exists with correct UID";
        }

        await ctx.db.insert("delivery", {
            firebaseUid: args.firebaseUid,
            email: args.email,
            name: args.name,
            phone: "9999999999",
            role: "delivery",
            isAvailable: true,
            currentOrders: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        });
        return "Created new delivery user";
    },
});
