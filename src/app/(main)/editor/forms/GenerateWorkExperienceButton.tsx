import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperienceSingle,
} from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { WandSparkles } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { generateWorkExperience } from "../../../../../actions/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import LoadingButton from "@/components/LoadingButton";

interface GenerateWorkExperienceButtonProps {
  onWorExperienceGenerated: (workExperience: WorkExperienceSingle) => void;
}
const GenerateWorkExperienceButton: React.FC<
  GenerateWorkExperienceButtonProps
> = ({ onWorExperienceGenerated }) => {
  const [showInputDialog, setShowInputDialog] = useState(false);
  return (
    <>
      <Button
        variant={"outline"}
        type="button"
        // TODO : BLOCK FOR NON PREMUIM USERS
        onClick={() => setShowInputDialog(true)}
      >
        <WandSparkles className="size-4" />
        Smart Fill (AI)
      </Button>

      <InputDialog
        open={showInputDialog}
        onOpenChange={setShowInputDialog}
        onWorExperienceGenerated={(workExperience) => {
          onWorExperienceGenerated(workExperience);
          setShowInputDialog(false);
        }}
      />
    </>
  );
};

export default GenerateWorkExperienceButton;

interface InputDialogProps extends GenerateWorkExperienceButtonProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
function InputDialog({
  onOpenChange,
  onWorExperienceGenerated,
  open,
}: InputDialogProps) {
  const form = useForm<GenerateWorkExperienceInput>({
    resolver: zodResolver(generateWorkExperienceSchema),
    defaultValues: {
      description: "",
    },
  });
  async function onSubmit(input: GenerateWorkExperienceInput) {
    try {
      const response = await generateWorkExperience(input);

      onWorExperienceGenerated(response as WorkExperienceSingle);
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate work experience summary");
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Work Experience</DialogTitle>
          <DialogDescription>
            Describe this work experience and the AI will generate an optimized
            entry for you.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={`E.g. from nov 2019 to dec 2020 I worked at google as a software engineer ,tasks were :...`}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <LoadingButton type="submit" loading={form.formState.isSubmitting}>
              Generate
            </LoadingButton>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
