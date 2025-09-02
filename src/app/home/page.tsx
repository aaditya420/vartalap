import { redirect } from "next/navigation";
import Image from "next/image";

import { auth } from "~/server/auth";
import { SignOutButton } from "../_components/sign-out-button";

export default async function ComingSoon() {
  const session = await auth();

  // Redirect to home if user is not authenticated
  if (!session?.user) {
    redirect("/");
  }

  return (
    <main className="relative min-h-screen text-white bg-hero-dark flex flex-col">
      <div className="vignette absolute inset-0" />
      {/* Header */}
      <header className="relative z-10 flex justify-between items-center p-6 md:p-8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl border border-white/10 bg-zinc-900/70 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <svg className="w-5 h-5 text-white/80" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight text-white/90">Vartalap</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Image
              src={session.user.image ?? "/placeholder-avatar.png"}
              alt={session.user.name ?? "User"}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full border border-white/10 object-cover"
            />
            <span className="text-sm font-medium">{session.user.name}</span>
          </div>
          <SignOutButton />
        </div>
      </header>

      {/* Centered Coming Soon Message */}
      <section className="relative z-10 flex-1 flex items-center justify-center px-6 md:px-8">
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl tracking-tight text-white/90">
          Coming Soon!
        </h1>
      </section>
    </main>
  );
}
