import Navbar from "../components/Navbar";
import JobCard from "../components/JobCard";

const jobs = [
  {
    id: 1,
    title: "Backend Engineer",
    company: "Umurava",
    status: "Open",
    startDate: "2026-04-01",
    deadline: "2026-04-20",
  },
  {
    id: 2,
    title: "Frontend Developer",
    company: "Tech Corp",
    status: "Closed",
    startDate: "2026-03-10",
    deadline: "2026-04-01",
  },
];

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Available Jobs
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );
}