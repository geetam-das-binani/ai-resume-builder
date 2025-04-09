"use client";
import LoadingButton from "@/components/LoadingButton";
import { createCreatePortalSession } from "@/components/premium/action";
import React, { useState } from "react";
import { toast } from "sonner";

const ManageSubscriptionsButton = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      const redirectUrl = await createCreatePortalSession()
      if (redirectUrl) window.location.href = redirectUrl;
    } catch (error: any) {
      toast.error(error.message || "Failed to create checkout session");
    } finally {
      setLoading(false);
    }
  };
  return (
    <LoadingButton loading={loading} onClick={handleClick}>
      Manage Subscriptions
    </LoadingButton>
  );
};

export default ManageSubscriptionsButton;
