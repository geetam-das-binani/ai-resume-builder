import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { steps } from "./steps";
import { FileUserIcon, PenLineIcon } from "lucide-react";

interface FooterProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
  showSmResumePreview: boolean;
  setSmResumePreview: (show: boolean) => void;
}
const Footer = ({
  currentStep,
  setCurrentStep,
  setSmResumePreview,
  showSmResumePreview,
}: FooterProps) => {
  const previousStep = steps.find(
    (_, index) =>
      index === steps.findIndex((step) => step.key === currentStep) - 1
  )?.key;
  const nextStep = steps.find(
    (_, index) =>
      index === steps.findIndex((step) => step.key === currentStep) + 1
  )?.key;
  return (
    <footer className="w-full border-t px-3 py-5">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant={"secondary"}
            disabled={!previousStep}
            onClick={() => setCurrentStep(previousStep || steps[0].key)}
          >
            Previous step
          </Button>
          <Button
            disabled={!nextStep}
            onClick={() =>
              setCurrentStep(nextStep || steps[steps.length - 1].key)
            }
          >
            Next step
          </Button>
        </div>
        <Button
          variant={"outline"}
          size={"icon"}
          className="md:hidden"
          title={showSmResumePreview ? "Show Input Form" : "Show Resume Preview"}
          onClick={() => setSmResumePreview(!showSmResumePreview)}
        >
          {showSmResumePreview ? <PenLineIcon /> : <FileUserIcon />}
        </Button>
        <div className="flex items-center gap-3">
          <Button asChild variant={"secondary"}>
            <Link href={"/resumes"}>Close</Link>
          </Button>
          <p className="text-muted-foreground opacity-0"> Saving...</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
