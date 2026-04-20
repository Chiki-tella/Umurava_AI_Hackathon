import { jobs } from '@/lib/mockData'
import { notFound } from 'next/navigation'
import { ApplicationFormClient } from '@/components/ApplicationFormClient'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ApplyPage({ params }: PageProps) {
  const { id } = await params
  const job = jobs.find((j) => j.id === id)

  if (!job) notFound()

  return <ApplicationFormClient job={job} />
}

export async function generateStaticParams() {
  return jobs.map((job) => ({ id: job.id }))
}
