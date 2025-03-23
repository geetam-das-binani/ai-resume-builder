"use client";

import React, { useState } from "react";

import { useSearchParams } from "next/navigation";
import { steps } from "./steps";
import BreadCrumbs from "./BreadCrumbs";
import Footer from "./Footer";
import { ResumeValues } from "@/lib/validation";
import ResumePreviewSection from "./ResumePreviewSection";
import { cn } from "@/lib/utils";
import useAutoSaveResume from "@/app/hooks/useAutoSaveResume";
import { useUnloadWarning } from "@/app/hooks/useUnloadWarning";

const ResumeEditor = () => {
  const searchParams = useSearchParams();
  const currentStep = searchParams.get("step") || steps[0].key;

  const [resumeData, setResumeData] = useState<ResumeValues>();
  const [showSmResumePreview, setShowSmResumePreview] = useState(false);
  const { hasUnsavedChanges, isSaving } = useAutoSaveResume(
    resumeData as ResumeValues
  );
  useUnloadWarning(hasUnsavedChanges);
  function setStep(key: string) {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("step", key);
    window.history.pushState(null, "", `?${newSearchParams.toString()}`);
  }
  const FormComponent = steps.find(
    (step) => step.key === currentStep
  )?.component;

  return (
    <div className="flex flex-col grow">
      <header className="border-b px-3 py-5 text-center space-y-1.5">
        <h1 className="text-2xl font-bold">Design Your Resume</h1>
        <p className="text-sm text-muted-foreground">
          Follow the steps below to create your resume.Your Progress will be
          saved automatically
        </p>
      </header>
      <main className="relative grow">
        <div className="absolute bottom-0 top-0 flex w-full">
          <div
            className={cn(
              "w-full md:w-1/2 p-3 overflow-y-auto space-y-6 md:block",
              showSmResumePreview && "hidden"
            )}
          >
            <BreadCrumbs currentStep={currentStep} setCurrentStep={setStep} />
            {FormComponent && (
              <FormComponent
                resumeData={resumeData as ResumeValues}
                setResumeData={setResumeData}
              />
            )}
          </div>
          <div className="grow md:border-r" />
          <ResumePreviewSection
            resumeData={resumeData as ResumeValues}
            setResumeData={setResumeData}
            className={cn(showSmResumePreview ? "flex" : "hidden")}
          />
        </div>
      </main>
      <Footer
        setSmResumePreview={setShowSmResumePreview}
        showSmResumePreview={showSmResumePreview}
        currentStep={currentStep}
        setCurrentStep={setStep}
        isSaving={isSaving}
      />
    </div>
  );
};

export default ResumeEditor;
