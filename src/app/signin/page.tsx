'use client'

import { signIn } from "next-auth/react"
import { useEffect } from "react"

export default function SignIn() {
  useEffect(() => {
    // Automatically redirect to Google OAuth
    void signIn("google", { callbackUrl: "/home" })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-800 to-black relative text-white flex items-center justify-center before:absolute before:inset-0 before:bg-gradient-to-tr before:from-white/3 before:via-black/20 before:to-white/8 before:pointer-events-none">
      <div className="text-center relative z-10">
        <div className="mb-4">
          <div className="w-16 h-16 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white/80" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Vartalap</h1>
        </div>
        <p className="text-gray-400">Redirecting to Google Sign In...</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
        </div>
      </div>
    </div>
  )
}
