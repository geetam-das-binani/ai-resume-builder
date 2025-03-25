"use client"
import ResumePreview from "@/components/ResumePreview";
import { EditorFormProps } from "@/lib/types";
import React from "react";
import ColorPicker from "./ColorPicker";
import BorderStyleButton from "./BorderStyleButton";
import { cn } from "@/lib/utils";

interface ResumePreviewSectionProps extends EditorFormProps {
  className?: string;
}
const ResumePreviewSection = ({
  resumeData,
  setResumeData,
  className,
}: ResumePreviewSectionProps) => {
  return (
    <div
      className={cn("hidden md:w-1/2 md:flex relative group w-full", className)}
    >
      <div className="absolute transition-opacity group-hover:opacity-100 opacity-50 xl:opacity-100 top-1 left-1 flex flex-col gap-3 flex-none lg:left-3 lg:top-3">
        <ColorPicker
          color={resumeData?.colorHex}
          onChange={(color) =>
            setResumeData({ ...resumeData, colorHex: color?.hex })
          }
        />
        <BorderStyleButton
          borderStyle={resumeData?.borderStyle}
          onChange={(borderStyle) =>
            setResumeData({ ...resumeData, borderStyle })
          }
        />
      </div>
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
