import { Metadata } from "next";
import React from "react";
import ResumeEditor from "./ResumeEditor";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { resumeDataInclude } from "@/lib/types";
export const metadata: Metadata = {
  title: "Design your resume",
};
interface PageProps {
  searchParams: Promise<{ resumeId?: string }>;
}
const Editor = async ({ searchParams }: PageProps) => {
  const { resumeId } = await searchParams;
  const { userId } = await auth();

  if (!userId) return null;
  const resumeToEdit = resumeId
    ? await prisma.resume.findUnique({
        where: {
          id: resumeId,
          userId,
        },
        include: resumeDataInclude,
      })
    : null;
  return <ResumeEditor resumeToEdit={resumeToEdit} />;
};

export default Editor;
