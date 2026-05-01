'use client'

import Link from 'next/link'
import { Sparkles, ArrowRight, Brain, Zap, Target } from 'lucide-react'
import { motion } from 'framer-motion'

interface HeroSectionProps {
  jobCount: number
}

export function HeroSection({ jobCount }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Animated orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute top-20 right-1/4 w-80 h-80 bg-brand-pink/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-brand-orange/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--accent-primary) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-violet text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          AI-Powered Talent Screening
          <span className="w-1.5 h-1.5 rounded-full bg-brand-violet animate-pulse" />
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
        >
          Hire Smarter,{' '}
          <span className="gradient-text">Not Harder</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Our AI screens hundreds of CVs in seconds, ranks the best candidates, and explains exactly why they&apos;re a great fit — so you can focus on what matters.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link href="/dashboard" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
            <Sparkles className="w-5 h-5" />
            Try AI Screening
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="#jobs" className="btn-secondary flex items-center gap-2 text-base px-8 py-4">
            Browse {jobCount} Open Roles
          </Link>
        </motion.div>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {[
            { icon: Brain, label: 'AI-Powered Analysis', color: 'text-brand-violet' },
            { icon: Zap, label: 'Instant Screening', color: 'text-brand-pink' },
            { icon: Target, label: 'Smart Ranking', color: 'text-brand-orange' },
          ].map(({ icon: Icon, label, color }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-dark-900/50 border border-white/5 text-sm text-gray-300"
            >
              <Icon className={`w-4 h-4 ${color}`} />
              {label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
