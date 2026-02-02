import { mutation, query } from "../../_generated/server";
import { internal } from "../../_generated/api";
import { v } from "convex/values";
import { Id } from "../../_generated/dataModel";

/**
 * Create a new table booking
 */
export const createBooking = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    phone: v.string(),
    guests: v.number(),
    date: v.string(),
    time: v.string(),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();

    const bookingId = await ctx.db.insert("bookings", {
      userId: args.userId,
      name: args.name,
      phone: args.phone,
      guests: args.guests,
      date: args.date,
      time: args.time,
      status: "pending",
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    // Notify Admin of new booking
    await ctx.scheduler.runAfter(0, internal.notifications.create, {
      recipientId: "admin",
      type: "booking",
      title: "New Table Booking",
      message: `${args.name} booked a table for ${args.guests} on ${args.date} at ${args.time}`,
      referenceId: bookingId,
      isAdmin: true,
    });

    return bookingId;
  },
});

/**
 * Get all bookings (Admin only)
 */
export const getAllBookings = query({
  handler: async (ctx) => {
    const bookings = await ctx.db.query("bookings").collect();
    // Sort by date and time, newest first
    return bookings.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/**
 * Get bookings by user ID
 */
export const getBookingsByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const bookings = await ctx.db
      .query("bookings")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    return bookings.sort((a, b) => b.createdAt - a.createdAt);
  },
});

/**
 * Get bookings by status
 */
export const getBookingsByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("bookings")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

/**
 * Update booking status (Admin only)
 */
export const updateBookingStatus = mutation({
  args: {
    bookingId: v.id("bookings"),
    status: v.string(), // "accepted", "rejected", "cancelled"
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();

    await ctx.db.patch(args.bookingId, {
      status: args.status,
      updatedAt: timestamp,
    });

    const booking = await ctx.db.get(args.bookingId);
    if (booking) {
      // Resolve user.userId to firebaseUid
      const user = await ctx.db.get(booking.userId as Id<"users">);
      if (user && user.firebaseUid) {
        await ctx.scheduler.runAfter(0, internal.notifications.create, {
          recipientId: user._id,
          recipientFirebaseUid: user.firebaseUid,
          type: "booking",
          title: `Booking ${args.status}`,
          message: `Your booking for ${booking.date} has been ${args.status}`,
          referenceId: args.bookingId,
          isAdmin: false,
        });
      }
    }

    return args.bookingId;
  },
});

/**
 * Delete a booking
 */
export const deleteBooking = mutation({
  args: {
    bookingId: v.id("bookings"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.bookingId);
    return { success: true };
  },
});

/**
 * Get pending bookings count (for admin notifications)
 */
export const getPendingBookingsCount = query({
  handler: async (ctx) => {
    const pendingBookings = await ctx.db
      .query("bookings")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    return pendingBookings.length;
  },
});
