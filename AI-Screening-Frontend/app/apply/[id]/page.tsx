'use client'

import { use } from 'react'
import { notFound } from 'next/navigation'
import { ApplicationFormClient } from '@/components/ApplicationFormClient'
import { getAllJobs } from '@/lib/jobs'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function ApplyPage({ params }: PageProps) {
  const { id } = use(params)
  const job = getAllJobs().find((j) => j.id === id)

  if (!job) notFound()

  return <ApplicationFormClient job={job} />
}
