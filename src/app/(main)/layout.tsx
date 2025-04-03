import React from "react";
import Navbar from "./Navbar";
import PremiumModal from "@/components/premium/PremiumModal";
import { getUserSubscriptionLevel } from "@/lib/subscriptions";
import { auth } from "@clerk/nextjs/server";
import { SubscriptionLevelProvider } from "./resumes/SubscriptionLevelProvider";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const { userId } = await auth();
  if (!userId) return null;
  const userSubscriptionLevel = await getUserSubscriptionLevel(userId);
  
  return (
    <SubscriptionLevelProvider userSubscriptionLevel={userSubscriptionLevel}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        {children}
        <PremiumModal />
      </div>
    </SubscriptionLevelProvider>
  );
};

export default Layout;
