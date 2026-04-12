"use client";

import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";

export default function JobDetails() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">
          Backend Engineer (Job {id})
        </h1>

        <p className="text-gray-600 mb-4">
          We are looking for a skilled backend engineer with Node.js experience.
        </p>

        <div className="mb-4">
          <h2 className="font-semibold">Required Skills</h2>
          <ul className="list-disc ml-5 text-gray-600">
            <li>Node.js</li>
            <li>MongoDB</li>
            <li>API Development</li>
          </ul>
        </div>

        <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
          Apply Now
        </button>
      </div>
    </div>
  );
}