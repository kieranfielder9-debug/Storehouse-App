import { useState, useEffect } from 'react'
import { TopNav, Footer } from './Shell.jsx'
import Home from './Home.jsx'
import Module from './Module.jsx'
import Lesson from './Lesson.jsx'
import Parent from './Parent.jsx'
import Completion from './Completion.jsx'

export default function WisdomWalletSite() {
  const initial = new URLSearchParams(window.location.search).get('view') || 'home'
  const [view, setView] = useState(initial)

  useEffect(() => {
    const onPop = () => {
      const v = new URLSearchParams(window.location.search).get('view') || 'home'
      setView(v)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const go = (v) => {
    const url = new URL(window.location)
    url.searchParams.set('site', 'wisdom-wallet')
    url.searchParams.set('view', v)
    window.history.pushState({}, '', url)
    setView(v)
    window.scrollTo(0, 0)
  }

  return (
    <div className="min-h-screen bg-midnight text-white">
      <TopNav active={view === 'parent' ? 'family' : 'library'}/>
      {view === 'home'       && <Home       onOpenModule={() => go('module')}/>}
      {view === 'module'     && <Module     onBack={() => go('home')} onStartLesson={() => go('lesson')}/>}
      {view === 'lesson'     && <Lesson     onBack={() => go('module')} onComplete={() => go('completion')}/>}
      {view === 'parent'     && <Parent     />}
      {view === 'completion' && <Completion />}
      <Footer/>
    </div>
  )
}
