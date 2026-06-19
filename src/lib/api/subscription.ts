import { apiRequest } from "./client";

// ── Types ─────────────────────────────────────────────────────────────────────

export type PlanTier = "trial" | "starter" | "growth" | "enterprise";
export type BillingCycle = "monthly" | "annual";
export type SubscriptionStatus = "trial" | "pending" | "active" | "expired" | "cancelled";

export interface PlanFeatures {
  can_use_advanced_filters: boolean;
  can_use_eligibility_check: boolean;
  can_use_interest_signals: boolean;
  can_extract_documents: boolean;
  can_export_data: boolean;
  can_access_api: boolean;
  has_priority_support: boolean;
}

export interface PlanApi {
  id: string;
  tier: PlanTier;
  name: string;
  price_monthly: number;
  price_yearly: number;
  is_trial: boolean;
  max_firms: number;            // -1 = unlimited
  recommendation_count: number; // -1 = unlimited
  features: PlanFeatures;
}

export interface UserSubscriptionApi {
  id: string;
  plan: PlanApi;
  status: SubscriptionStatus;
  is_active: boolean;
  billing_cycle: BillingCycle | null;
  cancel_at_period_end: boolean;
  trial_started_at: string | null;
  trial_ends_at: string | null;
  days_remaining: number | null;
  current_period_start: string | null;
  current_period_end: string | null;
  cf_subscription_id: string | null;
  created_at: string;
}

// ── API functions ─────────────────────────────────────────────────────────────

/** Public — no auth required. Returns Starter, Growth, Enterprise plans. */
export async function getPlans(): Promise<PlanApi[]> {
  return apiRequest<PlanApi[]>("/subscriptions/plans/");
}

/** Authenticated — returns the current user's subscription + nested plan. */
export async function getMySubscription(): Promise<UserSubscriptionApi> {
  return apiRequest<UserSubscriptionApi>("/subscriptions/me/");
}

/**
 * Activate a paid plan after successful payment.
 * In production this should be triggered by a Razorpay webhook on the backend,
 * but this endpoint can be used after a test/manual payment confirmation.
 */
export async function activatePlan(planTier: PlanTier): Promise<UserSubscriptionApi> {
  return apiRequest<UserSubscriptionApi>("/subscriptions/activate/", {
    method: "POST",
    body: { plan_slug: planTier },
  });
}

/**
 * Initiate a Cashfree subscription.
 * Returns auth_link — redirect the user there for UPI mandate authorization.
 */
export async function subscribeToPlan(
  planTier: PlanTier,
  billingCycle: BillingCycle,
  phone: string,
): Promise<{ auth_link: string; cf_subscription_id: string }> {
  return apiRequest("/subscriptions/subscribe/", {
    method: "POST",
    body: { plan_tier: planTier, billing_cycle: billingCycle, phone },
  });
}

/** Cancel the current active subscription at period end. */
export async function cancelSubscription(): Promise<{ detail: string }> {
  return apiRequest("/subscriptions/cancel/", { method: "POST" });
}
