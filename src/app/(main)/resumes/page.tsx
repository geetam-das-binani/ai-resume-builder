import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { resumeDataInclude } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { PlusSquare } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import ResumeItem from "./ResumeItem";
export const metadata: Metadata = {
  title: "Your Resumes",
};
const Resumes = async () => {
  const { userId } = await auth();
  if (!userId) return null;
  const [resumes, totalCount] = await Promise.all([
    prisma.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      include: resumeDataInclude,
    }),
    prisma.resume.count({ where: { userId } }),
  ]);
  // TODO : check quota for non premuim users
  return (
    <main className="max-w-7xl mx-auto px-3 py-6 w-full space-y-6">
      <Button asChild className=" mx-auto flex w-fit gap-2">
        <Link href={"/editor"}>
          <PlusSquare className="size-5 " />
          New Resume
        </Link>
      </Button>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold">Your Resumes</h1>
        <p>Total : {totalCount || 0}</p>
      </div>
      <div className="flex flex-col sm:grid grid-cols-2 md:grid-cols-3 gap-3 lg:grid-cols-4 w-full">
        {resumes?.length &&
          resumes.map((resume) => <ResumeItem
          resume={resume}
          key={resume.id} />)}
      </div>
    </main>
  );
};

export default Resumes;
