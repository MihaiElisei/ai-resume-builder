"use server";

import openai from "@/lib/openai";
import {
  GenerateSummaryInput,
  generateSummarySchema,
  GenerateWorkExperienceInput,
  generateWorkExperienceSchema,
  WorkExperience,
} from "@/lib/validation";

// Function to generate a professional resume summary based on user-provided data
export async function generateSummary(input: GenerateSummaryInput) {
  // Extract and validate the input data using the schema
  const { jobTitle, workExperiences, educations, skills } =
    generateSummarySchema.parse(input);

  // System message defining the AI's task and the expected response format
  const systemMessage = `
    You are a job resume generator AI. Your task is to write a professional introduction summary for a resume given the user's provided data.
    Only return the summary and do not include any other information in the response. Keep it concise and professional.
    `;

  // User message containing structured data for the AI to generate the summary
  const userMessage = `
    Please generate a professional resume summary from this data:

    Job title: ${jobTitle || "N/A"}

    Work experience:
    ${workExperiences
      ?.map(
        (exp) => `
        Position: ${exp.position || "N/A"} at ${exp.company || "N/A"} from ${exp.startDate || "N/A"} to ${exp.endDate || "Present"}

        Description:
        ${exp.description || "N/A"}
        `,
      )
      .join("\n\n")}

      Education:
    ${educations
      ?.map(
        (edu) => `
        Degree: ${edu.degree || "N/A"} at ${edu.school || "N/A"} from ${edu.startDate || "N/A"} to ${edu.endDate || "N/A"}
        `,
      )
      .join("\n\n")}

      Skills:
      ${skills}
    `;

  // OpenAI API call to generate the summary
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  // Extract the AI's response from the completion result
  const aiResponse = completion.choices[0].message.content;

  // Throw an error if no response is returned
  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }

  // Return the generated summary
  return aiResponse;
}

// Function to generate a single work experience entry based on user input
export async function generateWorkExperience(
  input: GenerateWorkExperienceInput,
) {
  // Extract and validate the input description using the schema
  const { description } = generateWorkExperienceSchema.parse(input);

  // System message defining the AI's task and the expected response format
  const systemMessage = `
    You are a job resume generator AI. Your task is to generate a single work experience entry based on the user input.
    Your response must adhere to the following structure. You can omit fields if they can't be inferred from the provided data, but don't add any new ones.
  
    Job title: <job title>
    Company: <company name>
    Start date: <format: YYYY-MM-DD> (only if provided)
    End date: <format: YYYY-MM-DD> (only if provided)
    Description: <an optimized description in bullet format, might be inferred from the job title>
    `;

  // User message containing the description for the AI to generate the work experience
  const userMessage = `
    Please provide a work experience entry from this description:
    ${description}
    `;

  // OpenAI API call to generate the work experience entry
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  // Extract the AI's response from the completion result
  const aiResponse = completion.choices[0].message.content;

  // Throw an error if no response is returned
  if (!aiResponse) {
    throw new Error("Failed to generate AI response");
  }

  // Parse and extract structured fields from the AI's response
  return {
    position: aiResponse.match(/Job title: (.*)/)?.[1] || "",
    company: aiResponse.match(/Company: (.*)/)?.[1] || "",
    description: (aiResponse.match(/Description:([\s\S]*)/)?.[1] || "").trim(),
    startDate: aiResponse.match(/Start date: (\d{4}-\d{2}-\d{2})/)?.[1],
    endDate: aiResponse.match(/End date: (\d{4}-\d{2}-\d{2})/)?.[1],
  } satisfies WorkExperience; // Ensure the returned object satisfies the WorkExperience type
}