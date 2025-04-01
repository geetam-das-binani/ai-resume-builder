"use client";
import ResumePreview from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ResumeServerData } from "@/lib/types";
import { mapToResumeValues } from "@/lib/utils";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { formatDate } from "date-fns";
import { MoreVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { deleteResume } from "../../../../actions/actions";
import { toast } from "sonner";

interface ResumeItemProps {
  resume: ResumeServerData;
}
const ResumeItem = ({ resume }: ResumeItemProps) => {
  const wasUpdated =
    resume.updatedAt !== resume.createdAt ||
    resume.updatedAt > resume.createdAt;
  return (
    <div className="group relative border rounded-lg border-transparent hover:border-border transition-colors bg-secondary p-3">
      <div className="space-y-3">
        <Link
          className="inline-block w-full text-center"
          href={`/editor?resumeId=${resume.id}`}
        >
          <p className="font-semibold line-clamp-1">
            {resume.title || "No title"}
          </p>
          {resume.description && (
            <p className="line-clamp-2 text-sm">{resume.description}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {wasUpdated ? "Updated" : "Created"} on{" "}
            {formatDate(resume.updatedAt, "MMM d, yyyy h:mm a")}
          </p>
        </Link>
        <Link
          className="inline-block w-full relative"
          href={`/editor?resumeId=${resume.id}`}
        >
          <ResumePreview
            className="shadow-sm group-hover:shadow-lg transition-shadow overflow-hidden"
            resumeData={resume ? mapToResumeValues(resume) : {}}
          />

          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </Link>
      </div>
      <MoreMenu resumeId={resume.id} />
    </div>
  );
};

export default ResumeItem;

interface MoreMenuProps {
  resumeId: string;
}
function MoreMenu({ resumeId }: MoreMenuProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"ghost"}
            size={"icon"}
            className="absolute right-0.5 top-[-.1rem] opacity-0 transition-opacity group-hover:opacity-100"
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white hover:bg-white dark:hover:bg-gray-800 dark:bg-gray-800 p-1 rounded-md">
          <DropdownMenuItem
            onClick={() => setShowDeleteConfirmation(true)}
            className="flex items-center gap-2"
          >
            <Trash2 className="size-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteConfirmation resumeId={resumeId} />
    </>
  );
}
function DeleteConfirmation({ resumeId }: MoreMenuProps) {
  const [isLoading, setIsLoading] = useState(false);
  const handleResumeDelete = async () => {
    setIsLoading(true);
    try {
      await deleteResume(resumeId);
    } catch (error) {
      toast.error("Failed to delete resume");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="">
     
    </div>
  );
}
