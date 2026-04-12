import Link from "next/link";

export default function JobCard({ job }: any) {
  const isOpen = job.status === "Open";

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition duration-300">
      <h2 className="text-lg font-semibold text-gray-800">
        {job.title}
      </h2>

      <p className="text-sm text-gray-500">{job.company}</p>

      <div className="mt-2 flex items-center justify-between">
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            isOpen ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
          }`}
        >
          {job.status}
        </span>
      </div>

      <div className="mt-3 text-sm text-gray-600">
        <p>📅 Start: {job.startDate}</p>
        <p>⏳ Deadline: {job.deadline}</p>
      </div>

      <Link href={`/jobs/${job.id}`}>
        <button className="mt-4 w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition">
          View Details
        </button>
      </Link>
    </div>
  );
}