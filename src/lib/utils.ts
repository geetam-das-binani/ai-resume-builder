import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ResumeServerData } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fileReplacer(key: unknown, value: unknown) {
  if (typeof value === "object" && value !== null && "name" in value) {
    return {
      name: (value as File).name,
      type: (value as File).type,
      size: (value as File).size,
      lastModified: (value as File).lastModified,
    };
  } else return value;
}

export function mapToResumeValues(data: ResumeServerData) {
  return {
    id: data?.id,
    title: data?.title || undefined,
    description: data?.description || undefined,
    photo: data?.photoUrl || undefined,
    firstName: data?.firstName || undefined,
    lastName: data?.lastName || undefined,
    jobTitle: data?.jobTitle || undefined,
    city: data?.city || undefined,
    country: data?.country || undefined,
    phone: data?.phone || undefined,
    email: data?.email || undefined,
    workExperiences: data?.workExperiences?.map((work) => ({
      position: work?.position || undefined,
      company: work?.company || undefined,
      startDate: work?.startDate?.toISOString().split("T")[0] || undefined,
      endDate: work?.endDate?.toISOString().split("T")[0] || undefined,
      description: work?.description || undefined,
      id: work?.id,
    })),
    educations: data?.educations?.map((education) => ({
      id: education?.id,
      school: education?.school || undefined,
      degree: education.degree || undefined,
      startDate: education.startDate?.toISOString().split("T")[0] || undefined,
      endDate: education.endDate?.toISOString().split("T")[0] || undefined,
    })),
    skills: data.skills,
    borderStyle: data.borderStyle,
    colorHex: data?.colorHex,
    summary:data?.summary || undefined
  };
}
