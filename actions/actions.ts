"use server";

import prisma from "@/lib/prisma";
import { resumeSchema, ResumeValues } from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { del, put } from "@vercel/blob";
import path from "path";

const saveResume = async (values: ResumeValues) => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
    
    const { id } = values;
   
    
    const { photo, workExperiences, educations, ...resumeValues } =
      values

    const existingResume = id
      ? await prisma.resume.findUnique({
          where: { id, userId },
        })
      : null;

    if (id && !existingResume) throw new Error("Resume not found");

    let newPhotoUrl: string | undefined | null = undefined;

   
    if (typeof photo === "object" && photo !== null && "name" in photo) {
      if (existingResume?.photoUrl) {
        await del(existingResume.photoUrl);
      }
      const blob = await put(
        `resume_photos/${path.extname(photo.name)}`,
        photo,
        { access: "public" }
      );
      newPhotoUrl = blob.url;
    } else if (photo === null) {
      if (existingResume?.photoUrl) {
        await del(existingResume.photoUrl);
      }
      newPhotoUrl = null;
    }

    
    if (id) {
      return await prisma.resume.update({
        where: { id, userId },
        data: {
          ...resumeValues,
          photoUrl: newPhotoUrl,   // undefined fields are ingored in prisma updates
          workExperiences: {
            deleteMany: {},
            create: workExperiences?.map((exp) => ({
              ...exp,
              startDate: exp.startDate ? new Date(exp.startDate) : undefined,
              endDate: exp.endDate ? new Date(exp.endDate) : undefined,
            })),
          },
          educations: {
            deleteMany: {},
            create: educations?.map((edu) => ({
              ...edu,
              startDate: edu.startDate ? new Date(edu.startDate) : undefined,
              endDate: edu.endDate ? new Date(edu.endDate) : undefined,
            })),
          },
          updatedAt: new Date(),
        },
      });
    } else {
      return await prisma.resume.create({
        data: {
          ...resumeValues,
          photoUrl: newPhotoUrl,
          userId,
          workExperiences: {
            create: workExperiences?.map((exp) => ({
              ...exp,
              startDate: exp.startDate ? new Date(exp.startDate) : undefined,
              endDate: exp.endDate ? new Date(exp.endDate) : undefined,
            })),
          },
          educations: {
            create: educations?.map((edu) => ({
              ...edu,
              startDate: edu.startDate ? new Date(edu.startDate) : undefined,
              endDate: edu.endDate ? new Date(edu.endDate) : undefined,
            })),
          },
        },
      });
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to save resume");
  }
};

export { saveResume };
