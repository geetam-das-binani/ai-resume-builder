import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
export const metadata: Metadata = {
  title: "Your Resumes",
};
const Resumes = () => {
  return (
    <main className="max-w-7xl mx-auto px-3 py-6 w-full space-y-6">
      <Button asChild className=" mx-auto flex w-fit gap-2">
        <Link  href={"/editor"}>
          <PlusSquare className="size-5 " />
          New Resume
        </Link>
      </Button>
      
    </main>
  );
};

export default Resumes;
