import LoadingButton from "@/components/LoadingButton";
import { ResumeValues } from "@/lib/validation";
import { WandSparklesIcon } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { generateSummary } from "../../../../../actions/actions";
import usePremiumModal from "@/app/hooks/usePremiumModal";
import { useSubscriptionLevel } from "../../resumes/SubscriptionLevelProvider";
import { canUseAITools } from "@/lib/permissions";

interface GenerateSummaryButtonProps {
  resumeData: ResumeValues;
  onSummaryGenerated: (summary: string) => void;
}
const GenerateSummaryButton = ({
  onSummaryGenerated,
  resumeData,
}: GenerateSummaryButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { setOpen } = usePremiumModal();
  const subscriptionLevel = useSubscriptionLevel();
  async function handleClick() {
    if (!canUseAITools(subscriptionLevel)) {
      setOpen(true);
      return;
    }
    try {
      setLoading(true);
      const response = await generateSummary(resumeData);

      if (response) {
        onSummaryGenerated(response);
        toast.success("Summary generated successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate summary", {
        description: "Something went wrong, please try again",
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <LoadingButton
      loading={loading}
      type="button"
      className=""
      variant="outline"
      onClick={handleClick}
    >
      <WandSparklesIcon className="size-4" />
      Generate (AI)
    </LoadingButton>
  );
};

export default GenerateSummaryButton;
