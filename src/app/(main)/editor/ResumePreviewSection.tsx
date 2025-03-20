import ResumePreview from "@/components/ResumePreview";
import { EditorFormProps } from "@/lib/types";
import React from "react";

interface ResumePreviewSectionProps extends EditorFormProps {}
const ResumePreviewSection = ({
  resumeData,
  setResumeData,
}: ResumePreviewSectionProps) => {
  return (
    <div className="hidden w-1/2 md:flex">
      <div className="flex w-full justify-center overflow-y-auto p-3 bg-secondary">
        <ResumePreview
          resumeData={resumeData}
          className="max-w-2xl shadow-md"
        />
      </div>
    </div>
  );
};

export default ResumePreviewSection;
