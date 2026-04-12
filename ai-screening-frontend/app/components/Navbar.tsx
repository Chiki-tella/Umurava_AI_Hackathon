"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-sm px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">TalentAI</h1>

      <div className="space-x-6">
        <Link href="/jobs" className="text-gray-600 hover:text-black">
          Jobs
        </Link>
        <Link href="/dashboard" className="text-gray-600 hover:text-black">
          Dashboard
        </Link>
      </div>
    </nav>
  );
}