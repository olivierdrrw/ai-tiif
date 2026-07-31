"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { plans } from "@/features/billing/types/plan";

export default function PricingPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  async function handleChoosePlan(planId: string) {
    if (planId === "free") return;

    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error ?? "Checkout is not available right now.");
      }
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-white sm:text-5xl">
          Simple, honest pricing
        </h1>
        <p className="mt-4 text-lg text-slate-400">
          Start free. Upgrade when TIIF becomes part of your daily routine.
        </p>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const isFeatured = plan.id === "premium";

          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl border p-8 transition-all duration-300 ${
                isFeatured
                  ? "border-navy-400/40 bg-navy-500/[0.06] shadow-[0_20px_100px_rgba(62, 99, 176,.15)]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              {isFeatured && (
                <span className="absolute -top-3 left-8 rounded-full bg-navy-500 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
                  Most popular
                </span>
              )}

              <h2 className="text-sm font-medium uppercase tracking-wide text-slate-400">
                {plan.name}
              </h2>

              <div className="mt-3 flex items-end gap-1">
                <span className="text-5xl font-bold text-white">
                  ${plan.monthlyPrice}
                </span>
                <span className="pb-1 text-slate-500">/month</span>
              </div>

              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-300">
                    <Check size={16} className="mt-0.5 shrink-0 text-navy-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleChoosePlan(plan.id)}
                disabled={loadingPlan === plan.id}
                className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3 font-medium transition disabled:opacity-60 ${
                  isFeatured
                    ? "bg-navy-500 text-white hover:bg-navy-400"
                    : "border border-white/10 text-white hover:bg-white/5"
                }`}
              >
                {loadingPlan === plan.id && <Loader2 size={14} className="animate-spin" />}
                {plan.monthlyPrice === 0 ? "Get started free" : "Choose plan"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
