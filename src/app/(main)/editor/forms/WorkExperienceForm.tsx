import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form";
import { EditorFormProps } from "@/lib/types";
import { workExperienceSchema, WorkExperienceValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Form, useFieldArray, useForm } from "react-hook-form";

const WorkExperienceForm = ({ resumeData, setResumeData }: EditorFormProps) => {
  const form = useForm<WorkExperienceValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      workExperiences: resumeData?.workExperiences || [],
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      // update resume data
      setResumeData({
        ...resumeData,
        workExperiences:
          values.workExperiences?.filter((exp) => exp !== undefined) || [],
      });
    });
    return () => unsubscribe();
  }, [form, resumeData, setResumeData]);

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "workExperiences",
  });
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Work Experience</h2>
        <p className="text-sm text-muted-foreground">
          Add many work experience
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          {fields?.map((field) => (
            <WorkExperienceItem key={field.id} />
          ))}
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={() =>
                append({
                  company: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                  position: "",
                })
              }
            ></Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default WorkExperienceForm;

function WorkExperienceItem() {
  return <div>work</div>;
}
