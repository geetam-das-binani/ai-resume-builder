import { SubscriptionLevel } from "./subscriptions";

const canCreateResume =  (
  subscriptionLevel: SubscriptionLevel,
  currentResumeCount: number
) => {
  try {
    const maxResumeMap: Record<SubscriptionLevel, number> = {
      free: 1,
      pro: 3,
      pro_plus: Infinity,
    };
    const maxResumes = maxResumeMap[subscriptionLevel];
    return currentResumeCount < maxResumes;
  } catch (error) {
    console.error(error);
    throw new Error("Error checking resume limit");
  }
};

const canUseAITools =  (subscriptionLevel: SubscriptionLevel) =>
  subscriptionLevel !== "free";

const canUseDesignCustomizations =  (
  subscriptionLevel: SubscriptionLevel
) => subscriptionLevel === "pro_plus";

export { canCreateResume, canUseAITools, canUseDesignCustomizations };
