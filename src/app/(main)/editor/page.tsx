import { Metadata } from "next";
import React from "react";
import ResumeEditor from "./ResumeEditor";
export const metadata: Metadata = {
  title: "Design your resume",
};

const Editor = () => {
  return <ResumeEditor/>;
};

export default Editor;
