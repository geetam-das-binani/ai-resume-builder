import Image from "next/image";
import logo from "@/assets/logo.png";
import resumePreview from "@/assets/resumePreview.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-center gap-6 bg-gray-100 px-5 py-12 text-gray-900 text-center md:text-start md:flex-row lg:gap-12">
      <div className="max-w-prose space-y-3">
        <Image
          src={logo}
          alt="Logo"
          width={150}
          height={150}
          className="mx-auto md:mx-0"
        />
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl scroll-m-20">
          Create a{" "}
          <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent inline-block">
            Perfect Resume
          </span>{" "}
          in Minutes
        </h1>
        <p className="text-lg text-gray-500">
          ResumeGenie is an{" "}
          <span className="font-bold">AI-powered resume builder</span> that
          helps you create a professional resume in minutes.
        </p>
        <Button size={"lg"} asChild variant={"premium"}>
          <Link href={"/resumes"}>Get Started</Link>
        </Button>
      </div>
      <div>
        <Image
          src={resumePreview}
          alt="resumePreview"
          width={600}
          className="shadow-md lg:rotate-[1.5deg]"
        />
      </div>
    </main>
  );
}
