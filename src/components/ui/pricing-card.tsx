"use client";

import NumberFlow from "@number-flow/react";
import { AnimatePresence, motion, LayoutGroup } from "framer-motion";
import { Check, User } from "lucide-react";
import { useState } from "react";

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number | null;
  yearlyPrice: number | null;
  features: string[];
  cta: string;
  highlighted?: boolean;
  disabled?: boolean;
  onSelect: () => void;
}

interface PricingCardProps {
  plans: PricingPlan[];
  defaultPlan?: string;
}

const TRANSITION = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

export function PricingCard({ plans, defaultPlan }: PricingCardProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState(defaultPlan ?? plans[0]?.id);

  return (
    <div className="w-full max-w-[480px] flex flex-col gap-6 p-5 sm:p-6 rounded-2xl border border-border bg-background shadow-sm not-prose">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-2">
        <h2 className="text-2xl font-semibold text-foreground tracking-tight">
          Select a Plan
        </h2>

        {/* Billing toggle */}
        <LayoutGroup>
          <div className="bg-muted p-1 h-10 w-full rounded-xl ring-1 ring-border flex">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`flex-1 h-full rounded-lg text-sm font-medium relative transition-colors duration-200 ${
                billingCycle === "monthly"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {billingCycle === "monthly" && (
                <motion.div
                  layoutId="billing-tab"
                  className="absolute inset-0 bg-background rounded-lg shadow-sm ring-1 ring-border"
                  transition={TRANSITION}
                />
              )}
              <span className="relative z-10">Monthly</span>
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`flex-1 h-full rounded-lg text-sm font-medium relative transition-colors duration-200 flex items-center justify-center gap-2 ${
                billingCycle === "yearly"
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {billingCycle === "yearly" && (
                <motion.div
                  layoutId="billing-tab"
                  className="absolute inset-0 bg-background rounded-lg shadow-sm ring-1 ring-border"
                  transition={TRANSITION}
                />
              )}
              <span className="relative z-10">Yearly</span>
              <span className="relative z-10 bg-primary text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase text-primary-foreground tracking-tight whitespace-nowrap">
                20% OFF
              </span>
            </button>
          </div>
        </LayoutGroup>
      </div>

      {/* Plan cards */}
      <div className="flex flex-col gap-3">
        {plans.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const price = billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
          const isFree = price === 0;
          const isCustom = price === null;

          return (
            <div
              key={plan.id}
              onClick={() => {
                setSelectedPlan(plan.id);
              }}
              className="relative cursor-pointer"
            >
              <div
                className={`relative rounded-xl bg-card transition-all duration-200 ${
                  isSelected
                    ? "border-2 border-primary"
                    : "border border-border"
                }`}
              >
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    {/* Radio + name */}
                    <div className="flex gap-4">
                      <div className="mt-1 shrink-0">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                            isSelected ? "border-primary" : "border-muted-foreground/30"
                          }`}
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="w-2.5 h-2.5 rounded-full bg-primary"
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                              />
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-foreground leading-tight">
                          {plan.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {plan.description}
                        </p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      {isCustom ? (
                        <span className="text-lg font-semibold text-foreground">Custom</span>
                      ) : (
                        <div className="text-lg font-semibold text-foreground">
                          {isFree ? (
                            <span>$0</span>
                          ) : (
                            <NumberFlow
                              value={price!}
                              format={{ style: "currency", currency: "USD" }}
                            />
                          )}
                        </div>
                      )}
                      {!isCustom && (
                        <div className="text-xs text-muted-foreground/60">
                          /{billingCycle === "monthly" ? "mo" : "yr"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expandable features */}
                  <AnimatePresence initial={false}>
                    {isSelected && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pt-5 flex flex-col gap-4">
                          {/* Features list */}
                          <div className="flex flex-col gap-2.5">
                            {plan.features.map((feature, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05, duration: 0.25 }}
                                className="flex items-center gap-2.5 text-sm text-foreground/80"
                              >
                                <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                                {feature}
                              </motion.div>
                            ))}
                          </div>

                          <div className="h-px bg-border" />

                          {/* CTA */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              plan.onSelect();
                            }}
                            disabled={plan.disabled}
                            className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                              plan.highlighted
                                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
                                : "bg-muted text-foreground hover:bg-muted/80 border border-border"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {plan.cta}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
