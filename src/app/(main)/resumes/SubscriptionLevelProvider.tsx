"use client";
import { SubscriptionLevel } from "@/lib/subscriptions";
import React, { createContext, useContext } from "react";
const SubscriptionLevelContext = createContext<SubscriptionLevel | undefined>(
  undefined
);
interface SubscriptionLevelProviderProps {
  children: React.ReactNode;
  userSubscriptionLevel: SubscriptionLevel;
}

export const SubscriptionLevelProvider: React.FC<SubscriptionLevelProviderProps> = ({
  children,
  userSubscriptionLevel,
}) => {
  return (
    <SubscriptionLevelContext.Provider value={userSubscriptionLevel}>
      {children}
    </SubscriptionLevelContext.Provider>
  );
};



export const useSubscriptionLevel = () => {
  const context = useContext(SubscriptionLevelContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyProvider");
  }
  return context as SubscriptionLevel;
};
