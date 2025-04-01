"use client";
import usePremiumModal from "@/app/hooks/usePremiumModal";
import { Button } from "@/components/ui/button";
import { PlusSquare } from "lucide-react";
import Link from "next/link";
import React from "react";

interface CreateResumeButtonProps {
  canCreate: boolean;
}
const CreateResumeButton: React.FC<CreateResumeButtonProps> = ({
  canCreate,
}) => {
  const premiumModal = usePremiumModal();

  return canCreate ? (
    <Button asChild className="mx-auto flex w-fit gap-2">
      <Link href={"/editor"}>
        <PlusSquare className="size-5 " />
        New Resume
      </Link>
    </Button>
  ) : (
    <Button
      className="mx-auto flex w-fit gap-2"
      onClick={() => premiumModal.setOpen(true)}
    >
      <PlusSquare className="size-5 " />
      New Resume
    </Button>
  );
};

export default CreateResumeButton;
