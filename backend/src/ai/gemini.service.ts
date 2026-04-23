import axios from "axios";
import { IJobSeeker } from "../models/user.model";
import { IJob } from "../models/job.model";
import { aiScreeningResponseSchema } from "../utils/validation";
import { AppError } from "../utils/AppError";

type AIScreeningResult = {
  name: string;
  score: number;
  strengths: string[];
  gaps: string[];
  recommendation: string;
  rank: number;
};

const sanitizeGeminiJson = (rawText: string): string =>
  rawText.replace(/```json|```/g, "").trim();

export const screenCandidates = async (
  job: IJob,
  applicants: IJobSeeker[]
): Promise<AIScreeningResult[]> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new AppError("GEMINI_API_KEY is missing", 500);
  }

  const prompt = `You are an AI recruiter.

Analyze the job and applicants.

Return ONLY JSON.

For each candidate include:
* name
* score
* strengths
* gaps
* recommendation
* rank

Be consistent and objective.

Job:
${JSON.stringify(
    {
      title: job.title,
      description: job.description,
      requiredSkills: job.requiredSkills,
      experience: job.experience
    },
    null,
    2
  )}

Applicants:
${JSON.stringify(
    applicants.map((applicant) => ({
      name: applicant.fullName,
      email: applicant.email,
      skills: applicant.skills,
      experience: (applicant as any).experience || "Not provided",
      education: (applicant as any).education || "Not provided",
      resumeUrl: (applicant as any).resumeUrl ?? null
    })),
    null,
    2
  )}
`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      }
    );

    const rawText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    const parsedJson = JSON.parse(sanitizeGeminiJson(rawText));
    return aiScreeningResponseSchema.parse(parsedJson);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new AppError("AI response was not valid JSON", 502);
    }
    throw new AppError("Failed to screen candidates with AI service", 502);
  }
};
