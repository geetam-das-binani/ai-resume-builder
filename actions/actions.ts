"use server";

import { ai } from "@/lib/geminiai";
import prisma from "@/lib/prisma";
import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  ResumeValues,
  WorkExperienceSingle,
} from "@/lib/validation";
import { auth } from "@clerk/nextjs/server";
import { del, put } from "@vercel/blob";
import path from "path";

const saveResume = async (values: ResumeValues) => {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const { id } = values;

    const { photo, workExperiences, educations, ...resumeValues } = values;

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
          photoUrl: newPhotoUrl, // undefined fields are ingored in prisma updates
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
const generateSummary = async (input: GenerateSummaryInput) => {
  try {
    //  TODO : BLOCK FOR NON PREMUIM USERS

    const { educations, jobTitle, skills, workExperiences } =
      generateSummarySchema.parse(input);
    const systemMessage = `
      You are a job resume generator AI. Your task is to write a professional introduction summary for a resume given the user's provided data.
      Only return the summary and do not include any other information in the response. Keep it concise and professional.
      `;
    const userMessage = `
    Please generate a professional resume summary from this data:

    Job title: ${jobTitle || "N/A"}

    Work experience:
    ${workExperiences
      ?.map(
        (exp) => `
        Position: ${exp.position || "N/A"} at ${exp.company || "N/A"} from ${
          exp.startDate || "N/A"
        } to ${exp.endDate || "Present"}

        Description:
        ${exp.description || "N/A"}
        `
      )
      .join("\n\n")}

      Education:
    ${educations
      ?.map(
        (edu) => `
        Degree: ${edu.degree || "N/A"} at ${edu.school || "N/A"} from ${
          edu.startDate || "N/A"
        } to ${edu.endDate || "N/A"}
        `
      )
      .join("\n\n")}

      Skills:
      ${skills}
    `;

    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: userMessage,
      config: {
        systemInstruction: systemMessage,
      },
    });

    const response = (await result.text) as string;
    if (!response) throw new Error("Failed to generate summary");

    return response;
  } catch (error) {
    throw new Error("Failed to generate summary");
  }
};

const generateWorkExperience = async (input: GenerateWorkExperienceInput) => {
  try {
    //  TODO : BLOCK FOR NON PREMIUM USERS
    const { description } = generateWorkExperienceSchema.parse(input);
    const systemMessage = `
    You are a job resume generator AI. Your task is to generate a single work experience entry based on the user input.
    Your response must adhere to the following structure. You can omit fields if they can't be inferred from the provided data, but don't add any new ones.
  
    {
      "Job title": "<job title>",
      "Company": "<company name>",
      "Start date": "<format: YYYY-MM-DD> (only if provided)",
      "End date": "<format: YYYY-MM-DD> (only if provided)",
      "Description": "<an optimized description in bullet format>"
    }
    `;

    const userMessage = `
    Please provide a work experience entry from this description:
    ${description}
    `;

    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: userMessage,
      config: {
        systemInstruction: systemMessage,
      },
    });

    // Ensure we extract the text correctly
    const responseText = (await result.text) as string;
   

    // Ensure JSON parsing works
    let cleanedText = responseText.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
    }

    

    // Parse JSON safely
    let data;
    try {
      data = JSON.parse(cleanedText);
    } catch (jsonError) {
      console.error("JSON Parsing Error:", jsonError);
      throw new Error("AI response was not in the expected JSON format.");
    }

    
    return {
      position: data["Job title"] || "",
      company: data["Company"] || "",
      startDate: data["Start date"] || "",
      endDate: data["End date"] || "",
      description: data["Description"] || "",
    } satisfies WorkExperienceSingle;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Failed to generate work experience information");
  }
};

export { saveResume, generateSummary, generateWorkExperience };
