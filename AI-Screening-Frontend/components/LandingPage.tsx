'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Zap, Sparkles, ArrowRight, Brain, Target, Clock,
  Users, TrendingUp, CheckCircle2, Building2, User,
  BarChart3, Star
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Screening',
    desc: 'Our AI reads every CV in seconds, scoring candidates against the exact skills and experience the role demands.',
    color: 'text-brand-violet',
    bg: 'bg-brand-purple/10 border-brand-purple/20',
  },
  {
    icon: BarChart3,
    title: 'Instant Rankings',
    desc: 'Candidates are ranked from best to worst match automatically — no spreadsheets, no guesswork.',
    color: 'text-brand-pink',
    bg: 'bg-brand-pink/10 border-brand-pink/20',
  },
  {
    icon: Target,
    title: 'Explained Decisions',
    desc: 'Every score comes with clear strengths, skill gaps, and a plain-English recommendation.',
    color: 'text-brand-orange',
    bg: 'bg-brand-orange/10 border-brand-orange/20',
  },
  {
    icon: Star,
    title: 'Smart Job Feed',
    desc: 'Job seekers see roles matched to their skills and preferences first — no more scrolling through irrelevant listings.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/20',
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
      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-purple/20 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-brand-pink/15 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-0 left-1/2 w-80 h-80 bg-brand-orange/10 rounded-full blur-3xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '4s' }} />

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.15] pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(124,58,237,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-violet text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Talent Screening
            <span className="w-1.5 h-1.5 rounded-full bg-brand-violet animate-pulse" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]"
          >
            Hire Smarter,{' '}
            <span className="gradient-text">Not Harder</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Instead of a recruiter reading 100 CVs manually, TalentAI does it in seconds —
            ranking the best candidates and explaining exactly why they&apos;re a great fit.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link href="/auth" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
              <Sparkles className="w-5 h-5" />
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/auth" className="btn-secondary flex items-center gap-2 text-base px-8 py-4">
              Sign In
            </Link>
          </motion.div>

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {[
              { icon: Brain, label: 'AI-Powered Analysis', color: 'text-brand-violet' },
              { icon: Clock, label: 'Screens in Seconds', color: 'text-brand-pink' },
              { icon: Target, label: 'Smart Ranking', color: 'text-brand-orange' },
              { icon: Users, label: 'For Both Sides', color: 'text-emerald-400' },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-dark-800/60 border border-white/5 text-sm text-gray-300">
                <Icon className={`w-4 h-4 ${color}`} />
                {label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="border-y border-white/5 bg-dark-800/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map(({ value, label }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                <p className="text-3xl font-bold gradient-text mb-1">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold text-white mb-4">Everything you need to hire well</h2>
          <p className="text-gray-400 max-w-xl mx-auto">One platform for recruiters and job seekers — powered by AI at every step.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {features.map(({ icon: Icon, title, desc, color, bg }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-7 hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 ${bg}`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="bg-dark-800/30 border-y border-white/5 py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold text-white mb-4">How it works</h2>
            <p className="text-gray-400">Simple for everyone involved.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {howItWorks.map(({ role, steps }) => (
              <div key={role} className="glass-card p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${role === 'Recruiter' ? 'bg-brand-orange/10 border border-brand-orange/20' : 'bg-brand-purple/10 border border-brand-purple/20'}`}>
                    {role === 'Recruiter' ? <Building2 className="w-5 h-5 text-brand-orange" /> : <User className="w-5 h-5 text-brand-violet" />}
                  </div>
                  <h3 className="text-xl font-semibold text-white">{role}</h3>
                </div>
                <ol className="space-y-3">
                  {steps.map((step, i) => (
                    <li key={step} className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-brand-purple/20 border border-brand-purple/30 text-brand-violet text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-gray-300 text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-28 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-violet text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Ready to get started?
          </div>
          <h2 className="text-5xl font-bold text-white mb-5">
            Join <span className="gradient-text">TalentAI</span> today
          </h2>
          <p className="text-gray-400 text-lg mb-10">
            Whether you&apos;re hiring or job hunting — we&apos;ve got you covered.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
              <Sparkles className="w-5 h-5" />
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
            {['No credit card required', 'Free to use', 'AI screening included'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />{t}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 py-8 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-brand-purple to-brand-pink flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">Talent<span className="gradient-text">AI</span></span>
          </div>
          <p className="text-sm text-gray-600">© 2026 TalentAI. AI-Powered Talent Screening.</p>
        </div>
      </footer>
    </div>
  )
}
