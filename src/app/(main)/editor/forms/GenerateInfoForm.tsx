import { generateInfoSchema, GenerateInfoValues } from "@/lib/validation";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
const GenerateInfoForm = () => {
  const form = useForm<GenerateInfoValues>({
    resolver: zodResolver(generateInfoSchema),
    defaultValues: {
      description: "",
      title: "",
    },
  });
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">General Info</h2>
        <p className="text-sm text-muted-foreground">
          Thi will not appear on your resume
        </p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input autoFocus {...field} placeholder="My Cool Resume" />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input  {...field} placeholder="A resume made with AI" />
                </FormControl>
                <FormDescription>
                    Describe what this resume is for.
                </FormDescription>
                <FormMessage/>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default GenerateInfoForm;
