'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import { JobDetailsClient } from '@/components/JobDetailsClient'
import { getAllJobs } from '@/lib/jobs'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function JobDetailsPage({ params }: PageProps) {
  const { id } = use(params)
  const job = getAllJobs().find((j) => j.id === id)

  if (!job) notFound()

  return <JobDetailsClient job={job} />
}
