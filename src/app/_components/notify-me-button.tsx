'use client'

import { useState } from "react";

export function NotifyMeButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [isNotified, setIsNotified] = useState(false);

  const handleNotifyMe = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsNotified(true);
      // Reset after 3 seconds for demo
      setTimeout(() => setIsNotified(false), 3000);
    }, 1500);
  };

  if (isNotified) {
    return (
      <button className="btn-secondary px-4 py-2 text-sm cursor-not-allowed">
        ✓ Subscribed!
      </button>
    );
  }

  return (
    <button 
      onClick={handleNotifyMe}
      disabled={isLoading}
      className="btn-primary px-4 py-2 text-sm inline-flex items-center justify-center min-w-[90px]"
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
      ) : (
        'Notify Me'
      )}
    </button>
  );
}
