import { Id } from "../_generated/dataModel";

export const calculateDeliveryCharge = async (ctx: any, cartTotal: number) => {
  const rules = await ctx.db
    .query("deliveryChargeRules")
    .withIndex("by_active", (q: any) => q.eq("isActive", true))
    .collect();

  if (!rules || rules.length === 0) {
    return { fee: 0, hasRules: false, matchedRuleId: null as Id<"deliveryChargeRules"> | null };
  }

  const sorted = [...rules].sort(
    (a, b) => b.minOrderAmount - a.minOrderAmount
  );

  const matched = sorted.find((r) => cartTotal >= r.minOrderAmount);
  if (!matched) {
    return { fee: 0, hasRules: true, matchedRuleId: null as Id<"deliveryChargeRules"> | null };
  }

  return { fee: matched.deliveryFee, hasRules: true, matchedRuleId: matched._id };
};
