"use client";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Check } from "lucide-react";
import { Button } from "../ui/button";
import usePremiumModal from "@/app/hooks/usePremiumModal";
import { toast } from "sonner";
import { createCheckoutSession } from "./action";
import { env } from "@/env";

const premiumFeatures = ["AI tools", "Up to 3 resumes"];
const premiumPlusFeatures = [
  "AI tools",
  "Infinite resumes",
  "Design customizations",
];
const PremiumModal = () => {
  const { open, setOpen } = usePremiumModal();
  const [loading, setLoading] = useState(false);

  const handlePremiumClick = async (priceId: string) => {
    try {
      setLoading(true);
      const redirectUrl = (await createCheckoutSession(priceId)) as string;
      if (redirectUrl) window.location.href = redirectUrl;
    } catch (error: any) {
      toast.error(error.message || "Failed to create checkout session");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!loading) setOpen(open);
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Resume Builder AI Premuim</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <p>Get a premium subscription to unlock more features</p>
          <div className="flex">
            <div className="flex w-1/2 flex-col space-y-5">
              <h3 className="text-center text-lg font-bold">Premium</h3>
              <ul className="space-y-2 list-inside">
                {premiumFeatures.map((feature) => (
                  <li className="flex items-center space-x-2" key={feature}>
                    <Check className="size-4 text-green-500" />
                    <p>{feature}</p>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() =>
                  handlePremiumClick(
                    env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_MONTHLY
                  )
                }
                disabled={loading}
                className="mt-8"
              >
                Get Premium
              </Button>
            </div>
            <div className="border-l mx-6"></div>
            <div className="flex w-1/2 flex-col space-y-5">
              <h3 className="text-center text-lg font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                Premium Plus
              </h3>
              <ul className="space-y-2 list-inside">
                {premiumPlusFeatures.map((feature) => (
                  <li className="flex items-center space-x-2" key={feature}>
                    <Check className="size-4 text-green-500" />
                    <p>{feature}</p>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() =>
                  handlePremiumClick(
                  env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO_PLUS_MONTHLY
                  )
                }
                variant={"premium"}
                disabled={loading}
              >
                Get Premium Plus
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumModal;
