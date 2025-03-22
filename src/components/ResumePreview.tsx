import useDimension from "@/app/hooks/useDimension";
import { EditorFormProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import Image from "next/image";

import React, { useEffect, useRef, useState } from "react";

interface ResumePreviewProps extends Omit<EditorFormProps, "setResumeData"> {
  className?: string;
}
const ResumePreview = ({ resumeData, className }: ResumePreviewProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { height, width } = useDimension(containerRef);
  return (
    <div
      ref={containerRef}
      className={`${cn(
        "bg-white text-black h-fit w-full aspect-[210/297]",
        className
      )}`}
    >
      <div
        className={`${cn("space-y-6 p-6", !width && "hidden")}`}
        style={{ zoom: (1 / 794) * width }}
      >
        <PersonalnfoHeader resumeData={resumeData} />
        <SummarySection resumeData={resumeData} />
        <WorkExperienceSection resumeData={resumeData} />
        
      </div>
    </div>
  );
};

export default ResumePreview;

interface ResumeSectionProps {
  resumeData: ResumeValues;
}

function PersonalnfoHeader({ resumeData = {} }: ResumeSectionProps) {
  const { photo, firstName, lastName, city, country, phone, jobTitle, email } =
    resumeData;
  const [photoSrc, setPhotoSrc] = useState(photo instanceof File ? "" : photo);
  useEffect(() => {
    const objectUrl = photo instanceof File ? URL.createObjectURL(photo) : "";
    if (objectUrl) setPhotoSrc(objectUrl);
    if (photo === null) setPhotoSrc("");
    return () => URL.revokeObjectURL(objectUrl);
  }, [photo]);

  return (
    <div className="flex items-center gap-6">
      {photoSrc && (
        <Image
          src={photoSrc}
          className="aspect-square object-cover"
          alt="profile photo"
          width={100}
          height={100}
        />
      )}
      <div className="space-y-2.5">
        <div className="space-y-1">
          <p className="text-3xl font-bold">
            {firstName} {lastName}
          </p>
          <p className="font-medium">{jobTitle}</p>
        </div>
        <p className="text-xs text-gray-500">
          {city}
          {city && country && ", "}
          {country}
          {(city || country) && (phone || email) ? " • " : ""}
          {[phone, email].filter(Boolean).join(" • ")}
        </p>
      </div>
    </div>
  );
}

function SummarySection({ resumeData = {} }: ResumeSectionProps) {
  const { summary } = resumeData;

  if (!summary) return null;

  return (
    <>
      <hr className="border-2" />
      <div className="space-y-3 break-inside-avoid">
        <p className="text-lg font-semibold">Professional Profile</p>
        <div className="whitespace-pre-line text-sm">{summary}</div>
      </div>
    </>
  );
}

function WorkExperienceSection({ resumeData = {} }: ResumeSectionProps) {
  const { workExperiences } = resumeData;

  const workExperienceNotEmpty = workExperiences?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0
  ) as ResumeValues["workExperiences"];

  if (!workExperienceNotEmpty?.length) return null;

  return (
    <>
      <hr className="border-2" />
      <div className="space-y-3">
        <p className="text-lg font-semibold">Work Experience</p>
        {workExperienceNotEmpty?.map((exp, i) => (
          <div className="break-inside-avoid space-y-1" key={i}>
            <div className="flex items-center justify-between">{exp.position}</div>
          </div>
        ))}
      </div>
    </>
  );
}
