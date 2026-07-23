import { Component } from 'react'

/** Catches render errors anywhere in the tree and shows a fallback screen
 *  instead of a blank white page. The global error/unhandledrejection
 *  listeners in Storehouse.jsx catch non-React errors as toasts, but a
 *  thrown render error would leave the app frozen without this boundary. */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, message: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Something went wrong.' }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-midnight p-6">
          <div className="text-center max-w-sm">
            <p className="text-lg font-bold text-white mb-2">Something went wrong</p>
            <p className="text-sm text-white/50 mb-4">{this.state.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal1 to-teal2 text-white font-bold text-sm"
            >
              Reload app
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
