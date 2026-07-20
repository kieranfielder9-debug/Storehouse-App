import { BookOpen, Sparkles, ChevronRight, Award, Heart, Briefcase, Clock, Star, Shield } from 'lucide-react'

export const MODULES = [
  // Kids
  { id: 'k1', track: 'kids',   title: "The Widow's Mite",            verse: 'Mark 12:41-44',     duration: '15 min', lessons: 4, badge: 'Generous Heart',  color: 'from-amber-400 to-orange-500',   emoji: '💝', desc: "Why a tiny coin made Jesus smile. Learn that God sees the heart behind every gift, not the size of it." },
  { id: 'k2', track: 'kids',   title: 'Joseph & the Storehouse Years',verse: 'Genesis 41',        duration: '20 min', lessons: 5, badge: 'Wise Saver',      color: 'from-teal1 to-teal2',            emoji: '🌾', desc: 'How Joseph saved Egypt during seven years of plenty. Saving for the future is a calling, not just a habit.' },
  { id: 'k3', track: 'kids',   title: 'Saving for a Big Goal',        verse: 'Proverbs 21:5',     duration: '12 min', lessons: 3, badge: 'Patient Planner', color: 'from-fuchsia-400 to-purple-500', emoji: '🎯', desc: 'Diligent plans lead to plenty. Set a goal, track it weekly, and watch God multiply small acts of patience.' },
  // Teens
  { id: 't1', track: 'teens',  title: 'The Parable of the Talents',   verse: 'Matthew 25:14-30',  duration: '25 min', lessons: 6, badge: 'Faithful Steward',color: 'from-teal1 to-teal2',            emoji: '⚖️', desc: "Every gift, skill and pound is on loan. Discover what it means to be 'faithful with little' — and trusted with much." },
  { id: 't2', track: 'teens',  title: 'Avoiding Debt Traps',          verse: 'Proverbs 22:7',     duration: '18 min', lessons: 4, badge: 'Free & Clear',    color: 'from-rose-500 to-pink-500',      emoji: '🔓', desc: "'The borrower is slave to the lender' — practical biblical strategies to spot, avoid, and break free from credit traps." },
  { id: 't3', track: 'teens',  title: 'Your First Job & Tithing',     verse: '2 Corinthians 9:7', duration: '22 min', lessons: 5, badge: 'Cheerful Giver',  color: 'from-amber-400 to-orange-500',   emoji: '💼', desc: 'Your first payslip is a milestone. Build the habit of giving cheerfully from the start — it shapes a lifetime.' },
  // Adults
  { id: 'a1', track: 'adults', title: 'Investing with Eternity in Mind',verse: 'Matthew 6:19-21',  duration: '30 min', lessons: 7, badge: 'Eternal Investor',color: 'from-blue-500 to-indigo-500',    emoji: '⏳', desc: 'Store up treasures in heaven — and let that vision shape every portfolio choice on earth.' },
  { id: 'a2', track: 'adults', title: 'Generous Giving Patterns',     verse: 'Malachi 3:10',      duration: '25 min', lessons: 6, badge: 'Open Hand',       color: 'from-teal1 to-teal2',            emoji: '🤲', desc: "Bring the whole tithe. Build automated, joyful giving rhythms across church, mission, and the poor." },
  { id: 'a3', track: 'adults', title: 'Teaching Kids About Money',    verse: 'Proverbs 22:6',     duration: '28 min', lessons: 6, badge: 'Wise Mentor',     color: 'from-fuchsia-500 to-purple-500', emoji: '👨‍👦', desc: 'Train up a child. The 7 conversations every Christian parent should have about money before age 18.' }
]

export const TRACKS = [
  { key: 'kids',   label: 'Kids',   age: 'Ages 5-11',   icon: Heart,     color: 'from-amber-400 to-orange-500'    },
  { key: 'teens',  label: 'Teens',  age: 'Ages 12-17',  icon: BookOpen,  color: 'from-teal1 to-teal2'              },
  { key: 'adults', label: 'Adults', age: 'Ages 18+',    icon: Briefcase, color: 'from-blue-500 to-indigo-500'      },
  { key: 'family', label: 'Family', age: 'All together',icon: Sparkles,  color: 'from-fuchsia-500 to-purple-500'   }
]

export const STATS = { learners: '2,840', families: '512', modules: 47, completions: '14,200' }

export const ICONS = { ChevronRight, Award, Clock, Star, Shield, Sparkles }
