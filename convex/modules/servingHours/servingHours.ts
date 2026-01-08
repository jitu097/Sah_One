import { mutation, query } from "../../_generated/server";
import { v } from "convex/values";

/**
 * Get all special serving hours
 */
export const getAllServingHours = query({
  handler: async (ctx) => {
    return await ctx.db.query("specialServingHours").collect();
  },
});

/**
 * Get serving hours by date
 */
export const getServingHoursByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("specialServingHours")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .first();
  },
});

/**
 * Get serving hours by day of week
 */
export const getServingHoursByDay = query({
  args: { dayOfWeek: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("specialServingHours")
      .withIndex("by_day", (q) => q.eq("dayOfWeek", args.dayOfWeek))
      .collect();
  },
});

/**
 * Create or update serving hours (Admin only)
 */
export const setServingHours = mutation({
  args: {
    date: v.string(),
    dayOfWeek: v.string(),
    openingTime: v.string(),
    closingTime: v.string(),
    isClosed: v.boolean(),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if serving hours already exist for this date
    const existing = await ctx.db
      .query("specialServingHours")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .first();

    const timestamp = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        dayOfWeek: args.dayOfWeek,
        openingTime: args.openingTime,
        closingTime: args.closingTime,
        isClosed: args.isClosed,
        reason: args.reason,
        updatedAt: timestamp,
      });
      return existing._id;
    } else {
      const servingHoursId = await ctx.db.insert("specialServingHours", {
        ...args,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      return servingHoursId;
    }
  },
});

/**
 * Delete serving hours (Admin only)
 */
export const deleteServingHours = mutation({
  args: { servingHoursId: v.id("specialServingHours") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.servingHoursId);
    return { success: true };
  },
});

/**
 * Check if restaurant is open on a specific date and time
 */
export const checkRestaurantOpen = query({
  args: {
    date: v.string(),
    time: v.string(),
  },
  handler: async (ctx, args) => {
    const servingHours = await ctx.db
      .query("specialServingHours")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .first();

    if (!servingHours) {
      return { isOpen: true, message: "Normal operating hours" };
    }

    if (servingHours.isClosed) {
      return {
        isOpen: false,
        message: servingHours.reason || "Restaurant is closed",
      };
    }

    const timeValue = args.time.replace(":", "");
    const openingValue = servingHours.openingTime.replace(":", "");
    const closingValue = servingHours.closingTime.replace(":", "");

    if (timeValue >= openingValue && timeValue <= closingValue) {
      return {
        isOpen: true,
        message: `Open from ${servingHours.openingTime} to ${servingHours.closingTime}`,
      };
    }

    return {
      isOpen: false,
      message: `Closed. Opens at ${servingHours.openingTime}`,
    };
  },
});

/**
 * Get upcoming special hours (next 30 days)
 */
export const getUpcomingSpecialHours = query({
  handler: async (ctx) => {
    const allHours = await ctx.db.query("specialServingHours").collect();
    const today = new Date().toISOString().split("T")[0];
    
    return allHours
      .filter(hours => hours.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 30);
  },
});
