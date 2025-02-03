import Image from "next/image"; 
import logo from "@/assets/logo.png"; 
import ResumePreview from "@/assets/resumePreview.png"; 
import { Button } from "@/components/ui/button"; 
import Link from "next/link"; 

// Defining the Home component, which serves as the main page
export default function Home() {
  return (
    <main 
      // Main container styles for responsive design and centralized content
      className="md:flex-start flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 px-5 py-12 text-center text-gray-900 md:flex-row lg:gap-12"
    >
      {/* Left section: Contains the logo, heading, description, and CTA button */}
      <div className="max-w-prose space-y-3">
        {/* Logo image */}
        <Image
          src={logo}
          alt="Logo"
          width={150}
          height={150}
          className="mx-auto md:ms-0" // Centered on small screens, aligned left on larger screens
        />
        {/* Main heading with gradient text effect */}
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Create a{" "}
          <span className="inline-block bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            Perfect Resume
          </span>{" "}
          in Minutes
        </h1>
        {/* Subheading description */}
        <p className="text-lg text-gray-500">
          Our <span className="font-bold">AI resume builder</span> helps you
          design a professional resume!
        </p>
        {/* Call-to-action button wrapped with a Link component for navigation */}
        <Button asChild size="lg" variant="premium">
          <Link href="/resumes">Get Started</Link>
        </Button>
      </div>

      {/* Right section: Displays the resume preview image */}
      <div>
        <Image
          src={ResumePreview}
          alt="Resume preview"
          width={600}
          className="shadow-md lg:rotate-[-1.5deg]" // Adds a subtle rotation effect on large screens
        />
      </div>
    </main>
  );
}