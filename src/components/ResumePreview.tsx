import { EditorFormProps } from "@/lib/types";
import { cn } from "@/lib/utils";

import React from "react";

interface ResumePreviewProps extends Omit<EditorFormProps, "setResumeData"> {
  className?: string;
}
const ResumePreview = ({ resumeData, className }: ResumePreviewProps) => {
  return (
    <div
      className={`${cn(
        "bg-white text-black h-fit w-full aspect-[210/297]",
        className
      )}`}
    >
      <h1 className="p-6 text-3xl font-bold">
        This text should change based on the data entered in the form
      </h1>
    </div>
  );
};

export default ResumePreview;
