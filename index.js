import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/screen", async (req, res) => {
  const { job, candidates } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    const prompt = `
    You are an AI recruiter assistant.

    Job Description:
    ${job}

    Candidates:
    ${JSON.stringify(candidates)}

    Task:
    Score, rank, and explain each candidate.
    Return JSON format.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    res.json({ output: response });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));