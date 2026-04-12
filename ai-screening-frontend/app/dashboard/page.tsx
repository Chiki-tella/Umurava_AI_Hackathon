import Navbar from "../components/Navbar";

const candidates = [
  {
    name: "John Doe",
    score: 85,
    strengths: ["Node.js", "API Development"],
    gaps: ["No Cloud Experience"],
    recommendation: "Strong Candidate",
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">Screening Results</h1>

        {candidates.map((c, i) => (
          <div key={i} className="bg-white p-4 rounded-xl shadow mb-4">
            <h2 className="font-semibold">{c.name}</h2>

            <p className="text-sm">
              Score:
              <span className="ml-2 font-bold text-green-600">
                {c.score}
              </span>
            </p>

            <p>Strengths: {c.strengths.join(", ")}</p>
            <p>Gaps: {c.gaps.join(", ")}</p>
            <p className="font-semibold">{c.recommendation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}