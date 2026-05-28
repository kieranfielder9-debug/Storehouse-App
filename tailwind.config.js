/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        midnight: '#0B0F19',
        trustnavy: '#111C30',
        navydeep: '#0E1626',
        navysoft: '#172238',
        teal1: '#0D9488',
        teal2: '#14B8A6',
        gold: '#F4C56A'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        glow: '0 10px 40px -10px rgba(20,184,166,0.35)',
        card: '0 8px 30px -10px rgba(0,0,0,0.6)'
      },
      keyframes: {
        progress: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' }
        },
        flashIn: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' }
        },
        pulseGlow: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(20,184,166,0.55)' },
          '50%': { boxShadow: '0 0 0 18px rgba(20,184,166,0)' }
        }
      },
      animation: {
        progress: 'progress 5s linear forwards',
        flashIn: 'flashIn 250ms ease-out forwards',
        slideUp: 'slideUp 300ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards',
        pulseGlow: 'pulseGlow 2s ease-out infinite'
      }
    }
  },
  plugins: []
}
