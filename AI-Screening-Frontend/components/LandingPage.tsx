'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight, Brain, Target, Clock,
  Users, CheckCircle2, Building2, User,
  BarChart3, Star
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Screening',
    desc: 'Our AI reads every CV in seconds, scoring candidates against the exact skills and experience the role demands.',
    color: 'text-[var(--accent-primary)]',
    bg: 'bg-[rgba(74,158,191,0.12)] border-[rgba(74,158,191,0.36)]',
  },
  {
    icon: BarChart3,
    title: 'Instant Rankings',
    desc: 'Candidates are ranked from best to worst match automatically — no spreadsheets, no guesswork.',
    color: 'text-[var(--accent-primary)]',
    bg: 'bg-[rgba(74,158,191,0.12)] border-[rgba(74,158,191,0.36)]',
  },
  {
    icon: Target,
    title: 'Explained Decisions',
    desc: 'Every score comes with clear strengths, skill gaps, and a plain-English recommendation.',
    color: 'text-[var(--accent-primary)]',
    bg: 'bg-[rgba(74,158,191,0.12)] border-[rgba(74,158,191,0.36)]',
  },
  {
    icon: Star,
    title: 'Smart Job Feed',
    desc: 'Job seekers see roles matched to their skills and preferences first — no more scrolling through irrelevant listings.',
    color: 'text-[var(--accent-primary)]',
    bg: 'bg-[rgba(74,158,191,0.12)] border-[rgba(74,158,191,0.36)]',
  },
]

const stats = [
  { value: '10,000+', label: 'Candidates Screened' },
  { value: '< 30s', label: 'Per Screening' },
  { value: '94%', label: 'Accuracy Rate' },
  { value: '500+', label: 'Hires Made' },
]

const howItWorks = [
  { role: 'Recruiter', steps: ['Post your job', 'Receive applications', 'Run AI screening in one click', 'Interview the top matches'] },
  { role: 'Job Seeker', steps: ['Sign up & set your skills', 'Browse your personalised feed', 'Apply in minutes', 'Get matched to the right roles'] },
]

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden pt-28 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-[-180px] left-[15%] w-[520px] h-[520px] rounded-full bg-brand-purple/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-210px] right-[10%] w-[460px] h-[460px] rounded-full bg-brand-pink/20 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.1] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, var(--accent-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative max-w-[1200px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-transparent border border-[rgba(168,212,230,0.28)] text-[var(--accent-light)] text-sm font-medium mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
            AI-Powered Talent Screening
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-[46px] sm:text-[58px] lg:text-[70px] font-bold text-[var(--text-primary)] mb-6 leading-[1.08] tracking-[-0.03em]"
          >
            Your AI Hiring Engine
            <br />
            <span className="text-[var(--accent-light)]">for Better Decisions</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-[var(--text-secondary)] max-w-[560px] mx-auto mb-10 leading-relaxed"
          >
            TalentAI screens, ranks, and explains candidate fit in seconds so your team can focus on interviews, not manual filtering.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link href="/auth" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/auth" className="btn-secondary flex items-center gap-2 text-base px-8 py-4">
              Watch Demo
            </Link>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {[
              { icon: Brain, label: 'AI-Powered Analysis', color: 'text-[var(--accent-light)]' },
              { icon: Clock, label: 'Screens in Seconds', color: 'text-[var(--accent-light)]' },
              { icon: Target, label: 'Smart Ranking', color: 'text-[var(--accent-light)]' },
              { icon: Users, label: 'Recruiter + Candidate', color: 'text-[var(--accent-light)]' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-md bg-[rgba(17,29,45,0.65)] border border-[var(--border)] text-sm text-[var(--text-secondary)]">
                <Icon className={`w-4 h-4 ${color}`} />
                {label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto px-6 py-8 rounded-lg border border-[var(--border)] bg-[rgba(17,29,45,0.82)]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map(({ value, label }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }} className="lg:border-r lg:border-[var(--border)] last:lg:border-r-0">
                <p className="font-display text-3xl font-bold text-[var(--accent-primary)] mb-1">{value}</p>
                <p className="text-sm text-[var(--text-muted)]">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl font-bold text-[var(--text-primary)] mb-4">Everything you need to hire well</h2>
          <p className="text-[var(--text-secondary)] max-w-xl mx-auto">One platform for recruiters and job seekers powered by fast, explainable AI workflows.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, title, desc, color, bg }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card-hover p-8"
            >
              <div className={`w-12 h-12 rounded-md border flex items-center justify-center mb-5 ${bg}`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <h3 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-2">{title}</h3>
              <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-display text-4xl font-bold text-[var(--text-primary)] mb-4">How it works</h2>
            <p className="text-[var(--text-secondary)]">Simple for everyone involved.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {howItWorks.map(({ role, steps }) => (
              <div key={role} className="glass-card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-md flex items-center justify-center bg-[rgba(74,158,191,0.12)] border border-[rgba(74,158,191,0.34)]">
                    {role === 'Recruiter' ? <Building2 className="w-5 h-5 text-[var(--accent-primary)]" /> : <User className="w-5 h-5 text-[var(--accent-primary)]" />}
                  </div>
                  <h3 className="font-display text-xl font-semibold text-[var(--text-primary)]">{role}</h3>
                </div>
                <ol className="space-y-3">
                  {steps.map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-[rgba(74,158,191,0.16)] border border-[rgba(74,158,191,0.36)] text-[var(--accent-light)] text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-[var(--text-secondary)] text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-transparent border border-[rgba(168,212,230,0.28)] text-[var(--accent-light)] text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)]" />
            Ready to get started?
          </div>
          <h2 className="font-display text-5xl font-bold text-[var(--text-primary)] mb-5">
            Join Talent<span className="text-[var(--accent-primary)]">AI</span> today
          </h2>
          <p className="text-[var(--text-secondary)] text-lg mb-10">
            Whether you&apos;re hiring or job hunting — we&apos;ve got you covered.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-[var(--text-muted)]">
            {['No credit card required', 'Free to use', 'AI screening included'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent-primary)]" />{t}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      <footer className="border-t border-[var(--border)] py-8 px-4">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold uppercase font-display tracking-[0.22em] text-[var(--text-primary)]">Talent</span>
            <span className="text-sm font-bold uppercase font-display tracking-[0.01em] text-[var(--accent-primary)]">AI</span>
          </div>
          <p className="text-sm text-[var(--text-muted)]">© 2026 TalentAI. AI-Powered Talent Screening.</p>
        </div>
      </footer>
    </div>
  )
}
