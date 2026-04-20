import { jobs } from '@/lib/mockData'
import { notFound } from 'next/navigation'
import { JobDetailsClient } from '@/components/JobDetailsClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function JobDetailsPage({ params }: PageProps) {
  const { id } = await params
  const job = jobs.find((j) => j.id === id)

  if (!job) notFound()

  return <JobDetailsClient job={job} />
}

export async function generateStaticParams() {
  return jobs.map((job) => ({ id: job.id }))
}
