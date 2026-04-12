"use client";

import Navbar from "../components/Navbar";
import { useState } from "react";

export default function ApplyPage() {
  const [form, setForm] = useState({});

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">Apply for Job</h1>

        <div className="space-y-4">
          <input className="w-full p-2 border rounded" placeholder="First Name" />
          <input className="w-full p-2 border rounded" placeholder="Last Name" />
          <input className="w-full p-2 border rounded" placeholder="Email" />

          <textarea
            className="w-full p-2 border rounded"
            placeholder="Skills (e.g Node.js, React)"
          />

          <textarea
            className="w-full p-2 border rounded"
            placeholder="Experience"
          />

          <input
            type="file"
            className="w-full p-2 border rounded"
          />

          <button className="w-full bg-black text-white py-2 rounded-lg">
            Submit Application
          </button>
        </div>
      </div>
    </div>
  );
}