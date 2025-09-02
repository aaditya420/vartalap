'use client'

import Link from "next/link";
import { useState } from "react";

export function GetStartedButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    // The navigation will happen via Link, but we set loading state for UX
  };

  return (
    <Link
      href="/signin"
      onClick={handleClick}
      className="btn-primary text-base min-w-[200px]"
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Loading...
        </>
      ) : (
        'Get Started'
      )}
    </Link>
  );
}

export function SignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
  };

  return (
    <Link
      href="/signin"
      onClick={handleClick}
      className="btn-secondary px-5 py-2 text-sm min-w-[80px]"
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
      ) : (
        'Sign in'
      )}
    </Link>
  );
}

export function WatchDemoButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    // Add demo functionality here
    setTimeout(() => setIsLoading(false), 2000); // Reset after 2 seconds for demo
  };

  return (
    <button 
      onClick={handleClick}
      className="btn-secondary text-base min-w-[160px]"
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Loading...
        </>
      ) : (
        'Documentation'
      )}
    </button>
  );
}
