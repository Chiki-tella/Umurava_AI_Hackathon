"use client";
import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [job, setJob] = useState("");
  const [candidates, setCandidates] = useState("");
  const [results, setResults] = useState<any[]>([]);

  const handleSubmit = async () => {
    try {
      const parsedCandidates = JSON.parse(candidates);

      const res = await axios.post("http://localhost:3000/screen", {
        job,
        candidates: parsedCandidates,
      });

      setResults(res.data);
    } catch (err) {
      alert("Invalid JSON or server error");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>AI Talent Screening</h1>

      {/* Job Input */}
      <h2>Job Description</h2>
      <textarea
        rows={4}
        style={{ width: "100%" }}
        placeholder="Enter job requirements..."
        value={job}
        onChange={(e) => setJob(e.target.value)}
      />

      {/* Candidates Input */}
      <h2>Candidates (JSON)</h2>
      <textarea
        rows={8}
        style={{ width: "100%" }}
        placeholder="Paste candidates JSON..."
        value={candidates}
        onChange={(e) => setCandidates(e.target.value)}
      />

      {/* Button */}
      <button onClick={handleSubmit} style={{ marginTop: "10px" }}>
        Screen Candidates
      </button>

      {/* Results */}
      <h2>Results</h2>
      {results.map((r, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginTop: "10px",
          }}
        >
          <h3>{r.name}</h3>
          <p>Score: {r.score}</p>
          <p>Strengths: {r.strengths.join(", ")}</p>
          <p>Gaps: {r.gaps.join(", ")}</p>
          <p><b>{r.recommendation}</b></p>
        </div>
      ))}
    </div>
  );
}