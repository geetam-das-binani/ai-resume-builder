"use client"
import React, { useEffect, useRef, useState } from "react";
import useDimension from "@/app/hooks/useDimension";
import { EditorFormProps } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ResumeValues } from "@/lib/validation";
import Image from "next/image";
import { formatDate } from "date-fns";
import { Badge } from "./ui/badge";
import { BorderStyles } from "@/app/(main)/editor/BorderStyleButton";

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
        <EducationSection resumeData={resumeData} />
        <SkillsSection resumeData={resumeData} />
      </div>
    </div>
  );
};

export default ResumePreview;

interface ResumeSectionProps {
  resumeData: ResumeValues;
}

function PersonalnfoHeader({ resumeData = {} }: ResumeSectionProps) {
  const {
    photo,
    firstName,
    lastName,
    city,
    country,
    phone,
    jobTitle,
    email,
    colorHex,
    borderStyle,
  } = resumeData;
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
          style={{
            borderRadius:
              borderStyle === BorderStyles.SQUARE
                ? "0px"
                : borderStyle === BorderStyles.CIRCLE
                ? "9999px"
                : "10%",
          }}
        />
      )}
      <div className="space-y-2.5">
        <div className="space-y-1">
          <p
            style={{ color: colorHex, borderBottom: borderStyle }}
            className="text-3xl font-bold"
          >
            {firstName} {lastName}
          </p>
          <p
            style={{ color: colorHex, borderBottom: borderStyle }}
            className="font-medium"
          >
            {jobTitle}
          </p>
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
  const { summary, colorHex } = resumeData;

  if (!summary) return null;

  return (
    <>
      <hr style={{ borderColor: colorHex }} className="border-2" />
      <div className="space-y-3 break-inside-avoid">
        <p style={{ color: colorHex }} className="text-lg font-semibold">
          Professional Profile
        </p>
        <div className="whitespace-pre-line text-sm">{summary}</div>
      </div>
    </>
  );
}

function WorkExperienceSection({ resumeData = {} }: ResumeSectionProps) {
  const { workExperiences, colorHex } = resumeData;

  const workExperienceNotEmpty = workExperiences?.filter(
    (exp) => Object.values(exp).filter(Boolean).length > 0
  ) as ResumeValues["workExperiences"];

  if (!workExperienceNotEmpty?.length) return null;

  return (
    <>
      <hr className="border-2" style={{ borderColor: colorHex }} />
      <div className="space-y-3">
        <p style={{ color: colorHex }} className="text-lg font-semibold">
          Work Experience
        </p>
        {workExperienceNotEmpty?.map((exp, i) => (
          <div className="break-inside-avoid space-y-1" key={i}>
            <div
              style={{ color: colorHex }}
              className="flex items-center justify-between text-sm font-semibold"
            >
              <span>{exp.position}</span>
              {exp.startDate && (
                <span className="text-gray-500">
                  {formatDate(exp.startDate, "MM/yyy")} -{" "}
                  {exp.endDate ? formatDate(exp.endDate, "MM/yyy") : "Present"}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold">{exp.company}</p>
            <div className="whitespace-pre-line text-xs">{exp.description}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function EducationSection({ resumeData = {} }: ResumeSectionProps) {
  const { educations, colorHex } = resumeData;

  const educationNotEmpty = educations?.filter(
    (edu) => Object.values(edu).filter(Boolean).length > 0
  ) as ResumeValues["educations"];

  if (!educationNotEmpty?.length) return null;

  return (
    <>
      <hr style={{ borderColor: colorHex }} className="border-2" />
      <div className="space-y-3">
        <p style={{ color: colorHex }} className="text-lg font-semibold">
          Education
        </p>
        {educationNotEmpty?.map((edu, i) => (
          <div className="break-inside-avoid space-y-1" key={i}>
            <div
              style={{ color: colorHex }}
              className="flex items-center justify-between text-sm font-semibold"
            >
              <span>{edu.degree}</span>
              {edu.startDate && (
                <span>
                  {edu.startDate &&
                    `${formatDate(edu.startDate, "MM/yyy")}  ${
                      edu.endDate
                        ? `- ${formatDate(edu.endDate, "MM/yyy")}`
                        : ""
                    }`}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold">{edu.school}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function SkillsSection({ resumeData = {} }: ResumeSectionProps) {
  const { skills, colorHex, borderStyle } = resumeData;

  if (!skills?.length) return null;

  return (
    <>
      <hr style={{ borderColor: colorHex }} className="border-2" />
      <div className="space-y-3 break-inside-avoid">
        <p style={{ color: colorHex }} className="text-lg font-semibold">
          Skills
        </p>
        <div className="flex break-inside-avoid flex-wrap gap-2">
          {skills?.map((skill, i) => (
            <Badge
              style={{
                backgroundColor: colorHex,
                borderRadius:
                  borderStyle === BorderStyles.SQUARE
                    ? "0px"
                    : borderStyle === BorderStyles.CIRCLE
                    ? "9999px"
                    : "8px",
              }}
              className="bg-black text-white rounded-md hover:bg-black"
              key={i}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </>
  );
}
