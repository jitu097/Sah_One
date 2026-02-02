import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";

// --- Internal Mutations (Called by other backend functions) ---

export const create = internalMutation({
    args: {
        recipientId: v.string(), // userId (Convex ID) or "admin"
        recipientFirebaseUid: v.optional(v.string()), // Store Firebase UID for reference
        type: v.union(
            v.literal("order"),
            v.literal("booking"),
            v.literal("payment"),
            v.literal("offer"),
            v.literal("system")
        ),
        title: v.string(),
        message: v.string(),
        referenceId: v.optional(v.string()), // orderId, bookingId
        isAdmin: v.boolean(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("notifications", {
            recipientId: args.recipientId,
            recipientFirebaseUid: args.recipientFirebaseUid,
            type: args.type,
            title: args.title,
            message: args.message,
            referenceId: args.referenceId,
            isRead: false, // Default to unread
            isAdmin: args.isAdmin,
            createdAt: Date.now(),
        });
    },
});

// --- User Queries & Mutations ---

export const getUserNotifications = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        // Resolve User ID: check if the input is a Firebase UID
        let convexUserId = args.userId;
        let firebaseUid = args.userId; // Assume input might be firebaseUid

        // Try to find user by Firebase UID to get their real Convex ID
        const userByFirebase = await ctx.db
            .query("users")
            .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", args.userId))
            .first();

        if (userByFirebase) {
            convexUserId = userByFirebase._id;
            firebaseUid = userByFirebase.firebaseUid;
        }

        // Query 1: Notifications by Convex ID (New format)
        const notificationsByConvexId = await ctx.db
            .query("notifications")
            .withIndex("by_recipient", (q) => q.eq("recipientId", convexUserId))
            .order("desc")
            .take(50);

        // Query 2: Notifications by Firebase UID (Old format / Legacy)
        // Only run if the IDs are different to avoid redundant queries (though minimal cost)
        let notificationsByFirebaseUid: typeof notificationsByConvexId = [];
        if (convexUserId !== firebaseUid) {
            notificationsByFirebaseUid = await ctx.db
                .query("notifications")
                .withIndex("by_recipient", (q) => q.eq("recipientId", firebaseUid))
                .order("desc")
                .take(50);
        }

        // Combine and Deduplicate
        const allNotifications = [...notificationsByConvexId, ...notificationsByFirebaseUid];
        const uniqueNotifications = Array.from(new Map(allNotifications.map(item => [item._id, item])).values());

        // Sort by createdAt desc
        uniqueNotifications.sort((a, b) => b.createdAt - a.createdAt);

        return uniqueNotifications.filter(n => !n.isAdmin).slice(0, 50);
    },
});

export const getUnreadCount = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        let convexUserId = args.userId;
        let firebaseUid = args.userId;

        const userByFirebase = await ctx.db
            .query("users")
            .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", args.userId))
            .first();

        if (userByFirebase) {
            convexUserId = userByFirebase._id;
            firebaseUid = userByFirebase.firebaseUid;
        }

        const byConvexId = await ctx.db
            .query("notifications")
            .withIndex("by_recipient_and_read", (q) =>
                q.eq("recipientId", convexUserId).eq("isRead", false)
            )
            .collect();

        let byFirebaseId: typeof byConvexId = [];
        if (convexUserId !== firebaseUid) {
            byFirebaseId = await ctx.db
                .query("notifications")
                .withIndex("by_recipient_and_read", (q) =>
                    q.eq("recipientId", firebaseUid).eq("isRead", false)
                )
                .collect();
        }

        // Unique count
        const all = [...byConvexId, ...byFirebaseId];
        const unique = new Set(all.map(n => n._id));

        // Start with unique size
        // We need to filter !isAdmin just in case
        let count = 0;
        for (const n of all) {
            if (!n.isAdmin && unique.has(n._id)) {
                count++;
                unique.delete(n._id); // ensure we don't double count if same obj ref (though safer to use Set of IDs)
            }
        }

        // Actually, cleaner way:
        const uniqueNotifications = Array.from(new Map(all.map(item => [item._id, item])).values());
        return uniqueNotifications.filter(n => !n.isAdmin).length;
    },
});

export const markAsRead = mutation({
    args: { notificationId: v.id("notifications") },
    handler: async (ctx, args) => {
        const notification = await ctx.db.get(args.notificationId);
        if (!notification) throw new Error("Notification not found");

        // Ideally check if ctx.auth.getUserIdentity().tokenIdentifier === notification.recipientId

        await ctx.db.patch(args.notificationId, { isRead: true });
    },
});

export const markAllAsRead = mutation({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        let convexUserId = args.userId;
        let firebaseUid = args.userId;

        const userByFirebase = await ctx.db
            .query("users")
            .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", args.userId))
            .first();

        if (userByFirebase) {
            convexUserId = userByFirebase._id;
            firebaseUid = userByFirebase.firebaseUid;
        }

        const unreadConvex = await ctx.db
            .query("notifications")
            .withIndex("by_recipient_and_read", (q) =>
                q.eq("recipientId", convexUserId).eq("isRead", false)
            )
            .collect();

        const unreadFirebase = (convexUserId !== firebaseUid) ? await ctx.db
            .query("notifications")
            .withIndex("by_recipient_and_read", (q) =>
                q.eq("recipientId", firebaseUid).eq("isRead", false)
            )
            .collect() : [];

        const allUnread = [...unreadConvex, ...unreadFirebase];
        const processedIds = new Set();

        for (const n of allUnread) {
            if (!n.isAdmin && !processedIds.has(n._id)) {
                await ctx.db.patch(n._id, { isRead: true });
                processedIds.add(n._id);
            }
        }
    },
});

// --- Admin Queries & Mutations ---

export const getAdminNotifications = query({
    handler: async (ctx) => {
        // Security: Validate admin role here via ctx.auth

        const notifications = await ctx.db
            .query("notifications")
            .withIndex("by_admin", (q) => q.eq("isAdmin", true))
            .order("desc")
            .take(50);

        return notifications;
    },
});

export const getAdminUnreadCount = query({
    handler: async (ctx) => {
        // Security check...

        // We can't use a compound index with "isAdmin" easily unless we define it, 
        // but we can filter or reuse recipientId="admin" convention if we stick to it?
        // The Schema has `.index("by_admin", ["isAdmin"])`.

        // Let's rely on filter for now for simplicity or add index if needed.
        // Actually, we can use the "by_admin" index and filter in memory since unread count shouldn't be massive,
        // OR just use recipientId="admin" convention which maps to by_recipient_and_read.

        // If we establish that for Admin notifications, recipientId IS 'admin' (single admin system as requested),
        // then we can just use:

        const notifications = await ctx.db
            .query("notifications")
            .withIndex("by_recipient_and_read", (q) =>
                q.eq("recipientId", "admin").eq("isRead", false)
            )
            .collect();

        return notifications.length;
    },
});

export const markAdminAllAsRead = mutation({
    handler: async (ctx) => {
        // Security check...

        const unread = await ctx.db
            .query("notifications")
            .withIndex("by_recipient_and_read", (q) =>
                q.eq("recipientId", "admin").eq("isRead", false)
            )
            .collect();

        for (const n of unread) {
            await ctx.db.patch(n._id, { isRead: true });
        }
    }
});
