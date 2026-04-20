'use client'

import { motion } from 'framer-motion'
import { Users, Clock, TrendingUp, Award } from 'lucide-react'

const stats = [
  { icon: Users, value: '10,000+', label: 'Candidates Screened', color: 'text-brand-violet' },
  { icon: Clock, value: '< 30s', label: 'Average Screen Time', color: 'text-brand-pink' },
  { icon: TrendingUp, value: '94%', label: 'Accuracy Rate', color: 'text-brand-orange' },
  { icon: Award, value: '500+', label: 'Hires Made', color: 'text-emerald-400' },
]

export function StatsBar() {
  return (
    <section className="border-y border-white/5 bg-dark-800/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map(({ icon: Icon, value, label, color }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className={`p-2.5 rounded-xl bg-dark-700/50 border border-white/5 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
