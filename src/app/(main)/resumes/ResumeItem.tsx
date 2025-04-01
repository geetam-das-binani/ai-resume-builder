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
import { Menu, MoreVertical, Printer, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useRef, useState, useTransition } from "react";
import { deleteResume } from "../../../../actions/actions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import LoadingButton from "@/components/LoadingButton";
import { useReactToPrint } from "react-to-print";
interface ResumeItemProps {
  resume: ResumeServerData;
}
const ResumeItem = ({ resume }: ResumeItemProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: resume.title || "resume",
  });
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
            contentRef={contentRef}
          />

          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
        </Link>
      </div>
      <MoreMenu resumeId={resume.id} onPrintClick={reactToPrintFn} />
    </div>
  );
};

export default ResumeItem;

interface MoreMenuProps {
  resumeId: string;
  onPrintClick: () => void;
}
function MoreMenu({ resumeId, onPrintClick}: MoreMenuProps) {
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
          <DropdownMenuItem
            onClick={() => onPrintClick()}
            className="flex items-center gap-2"
          >
            <Printer className="size-4" /> Print
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteConfirmation
        resumeId={resumeId}
        onOpenChange={setShowDeleteConfirmation}
        open={showDeleteConfirmation}
      />
    </>
  );
}
interface DeleteConfirmationProps extends Omit<MoreMenuProps,"onPrintClick"> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  
}
function DeleteConfirmation({
  resumeId,
  onOpenChange,
  open,
}: DeleteConfirmationProps) {
  const [isPending, startTransition] = useTransition();
  const handleResumeDelete = async () => {
    startTransition(async () => {
      try {
        await deleteResume(resumeId);
        onOpenChange(false);
      } catch (error) {
        console.log(error);
        toast.error("Failed to delete resume");
      }
    });
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Resume ?</DialogTitle>
          <DialogDescription>
            This will permanently delete the resume.This action cannot be undone
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant="destructive"
            onClick={handleResumeDelete}
            loading={isPending}
          >
            Delete
          </LoadingButton>
          <Button variant={"secondary"} onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
