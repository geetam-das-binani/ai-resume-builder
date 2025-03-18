import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { personalInfoSchema, PersonalInfoValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

const PersonalInfoForm = () => {
  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      photo: undefined,
      firstName: "",
      lastName: "",
      city: "",
      country: "",
      phone: "",
      jobTitle: "",
      email: "",
    },
  });
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center space-y-1.5">
        <h2 className="text-2xl font-semibold">Personal Info</h2>
        <p className="text-sm text-muted-foreground">Tell us about yourself</p>
      </div>
      <Form {...form}>
        <form className="space-y-3">
          <FormField 
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input autoFocus {...field} placeholder="My Cool Resume" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default PersonalInfoForm;
