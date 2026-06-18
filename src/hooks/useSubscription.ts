"use client";

import { useEffect, useState } from "react";
import { getMySubscription, type UserSubscriptionApi, type PlanFeatures } from "@/lib/api/subscription";

interface UseSubscriptionReturn {
  subscription: UserSubscriptionApi | null;
  loading: boolean;
  /** True while on trial or an active paid plan. */
  isActive: boolean;
  /** True only during trial window. */
  isTrial: boolean;
  /** True when trial has ended and no paid plan is active. */
  isExpired: boolean;
  /** Days left in trial, or null if not on trial. */
  daysRemaining: number | null;
  /** Returns true if the current plan grants this feature flag. */
  canUse: (feature: keyof PlanFeatures) => boolean;
  /** Refetch the subscription (call after a plan upgrade). */
  refresh: () => void;
}

export function useSubscription(): UseSubscriptionReturn {
  const [subscription, setSubscription] = useState<UserSubscriptionApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getMySubscription()
      .then((data) => { if (!cancelled) setSubscription(data); })
      .catch(() => { /* silent — user may not be logged in yet */ })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [tick]);

  const status = subscription?.status ?? null;

  return {
    subscription,
    loading,
    isActive:     subscription?.is_active ?? false,
    isTrial:      status === "trial",
    isExpired:    status === "expired" || status === "cancelled",
    daysRemaining: subscription?.days_remaining ?? null,
    canUse: (feature) => subscription?.plan.features[feature] ?? false,
    refresh: () => setTick((t) => t + 1),
  };
}
