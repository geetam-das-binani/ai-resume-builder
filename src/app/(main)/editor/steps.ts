import React from "react";
import GenerateInfoForm from "./forms/GenerateInfoForm";
import PersonalInfoForm from "./forms/PersonalInfoForm";

export const steps: Array<{
  title: string;
  component: React.ComponentType;
  key: string;
}> = [
  {
    title: "General Info",
    component: GenerateInfoForm,
    key: "general-info",
  },
  {
    title: "Personal Info",
    component: PersonalInfoForm,
    key: "personal-info",
  },
];
