import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './hooks/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#38bdf8',
          cyan: '#0ea5e9',
          purple: '#38bdf8', // Mapping to blue
          violet: '#0ea5e9', // Mapping to deep blue
          indigo: '#0369a1',
          pink: '#7dd3fc',   // Mapping to light blue
          orange: '#0ea5e9',
          glow: 'rgba(56, 189, 248, 0.4)',
        },
        dark: {
          950: '#020617',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(168,212,230,0.35), transparent)',
        'card-glow': 'radial-gradient(ellipse at top right, rgba(74,158,191,0.1), transparent 60%)',
      },
      fontFamily: {
        sans: ['Satoshi', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Satoshi', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 12px rgba(74,158,191,0.12)' },
          '100%': { boxShadow: '0 0 20px rgba(74,158,191,0.2)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'glow-purple': '0 1px 3px rgba(74,158,191,0.08)',
        'glow-pink': '0 2px 6px rgba(74,158,191,0.08)',
        'glow-orange': '0 4px 20px rgba(74,158,191,0.08)',
        'card': '0 1px 3px rgba(74,158,191,0.08)',
        'card-hover': '0 4px 20px rgba(74,158,191,0.12)',
      },
    },
  },
  plugins: [],
}

export default config
