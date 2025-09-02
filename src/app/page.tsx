import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "~/server/auth";
import { GetStartedButton, SignInButton, WatchDemoButton } from "./_components/cta-buttons";
import { IconNode, IconPython, IconGo, IconRust, IconJava, IconElixir, IconDotnet, IconRest, IconSmtp, IconBolt } from "./_components/icons";
import HeroCube from "./_components/hero-cube";

export default async function Home() {
  const session = await auth();

  // Redirect to coming soon page if user is authenticated
  if (session?.user) {
    redirect("/home");
  }

  return (
    <>
      {/* Hero Section */}
      <main className="relative min-h-screen text-white bg-hero-dark">
        <div className="vignette absolute inset-0" />
        {/* Header */}
        <header className="relative z-20 mx-auto max-w-[1200px] px-6 md:px-8 pt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl border border-white/10 bg-zinc-900/70 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <svg className="w-5 h-5 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight text-white/90">Vartalap</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Testimonials</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <SignInButton />
            <Link href="#get-started" className="btn-primary hidden sm:inline-flex px-5 py-2 text-sm">Get started</Link>
          </div>
        </header>

        {/* Hero Content */}
        <section className="relative z-10 mx-auto max-w-[1200px] px-6 md:px-8 pt-16 pb-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: Copy */}
            <div className="space-y-7">
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.9] tracking-tight">
                <span className="text-white">Voice AI</span>
                <br />
                <span className="text-white/60">for</span>
                <br />
                <span className="text-white">everyone</span>
              </h1>
              <p className="text-lg md:text-xl text-white/70 max-w-xl">
                Deliver natural, real‑time voice experiences. Powerful APIs, enterprise security, and beautiful DX — ready for scale.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <GetStartedButton />
                <WatchDemoButton />
              </div>
              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4 pt-2 max-w-md">
                <div className="glass-card p-4 text-center">
                  <div className="text-2xl font-semibold text-white">99.9%</div>
                  <div className="text-xs text-white/60">Accuracy</div>
                </div>
                <div className="glass-card p-4 text-center">
                  <div className="text-2xl font-semibold text-white">&lt; 100ms</div>
                  <div className="text-xs text-white/60">Latency</div>
                </div>
                <div className="glass-card p-4 text-center">
                  <div className="text-2xl font-semibold text-white">50+</div>
                  <div className="text-xs text-white/60">Languages</div>
                </div>
              </div>
            </div>

            {/* Right: Visual (Three.js cube) */}
            <HeroCube />
          </div>
        </section>

        {/* Small benefits row under hero */}
        <div className="container mx-auto px-6 pt-4 pb-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="pt-8 grid md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                  <span className="text-gray-400">Real-time processing</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-400">Multi-language support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center border border-white/10">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-400">Enterprise security</span>
                </div>
              </div>
            </div>
          </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 bg-zinc-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display tracking-tight text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to build the next generation of voice-powered applications
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all duration-200">
              <div className="w-14 h-14 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Advanced Speech Recognition</h3>
              <p className="text-gray-400">
                State-of-the-art ASR technology with support for 50+ languages and dialects.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all duration-200">
              <div className="w-14 h-14 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4v2h8v-2h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 12H4V4h16v10z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Real-time Streaming</h3>
              <p className="text-gray-400">
                Ultra-low latency streaming for natural, conversational experiences.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all duration-200">
              <div className="w-14 h-14 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Custom Models</h3>
              <p className="text-gray-400">
                Train and deploy custom voice models tailored to your specific use case.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all duration-200">
              <div className="w-14 h-14 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Enterprise Security</h3>
              <p className="text-gray-400">
                Bank-grade encryption and compliance with SOC2, GDPR, and HIPAA.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all duration-200">
              <div className="w-14 h-14 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Easy Integration</h3>
              <p className="text-gray-400">
                Simple REST APIs and SDKs for all major programming languages.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 transition-all duration-200">
              <div className="w-14 h-14 bg-zinc-800 border border-zinc-700 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-white/80" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">99.9% Uptime</h3>
              <p className="text-gray-400">
                Global infrastructure with automatic failover and 24/7 monitoring.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-black">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display tracking-tight text-white mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive voice AI solutions for every business need
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Custom Voice Assistant Development</h3>
                <p className="text-gray-400 mb-6">
                  Build tailored voice assistants that understand your domain-specific language and integrate seamlessly with your existing systems.
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                    <span>Custom wake word detection</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                    <span>Domain-specific NLP models</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                    <span>Multi-platform deployment</span>
                  </li>
                </ul>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Voice Analytics & Insights</h3>
                <p className="text-gray-400 mb-6">
                  Gain deep insights into user behavior and conversation patterns with advanced analytics and reporting.
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                    <span>Real-time conversation analytics</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                    <span>Sentiment analysis</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                    <span>Performance optimization</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">API Integration Services</h3>
                <p className="text-gray-400 mb-6">
                  Seamlessly integrate voice capabilities into your existing applications with our robust APIs and expert support.
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                    <span>RESTful API integration</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                    <span>WebSocket real-time streaming</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                    <span>SDK support for all platforms</span>
                  </li>
                </ul>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">24/7 Support & Maintenance</h3>
                <p className="text-gray-400 mb-6">
                  Round-the-clock technical support and proactive maintenance to ensure your voice AI systems run smoothly.
                </p>
                <ul className="space-y-2 text-gray-400">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                    <span>24/7 technical support</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                    <span>Proactive monitoring</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-white/30 rounded-full"></div>
                    <span>Regular updates & improvements</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-zinc-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display tracking-tight text-white mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Trusted by leading companies worldwide
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <div className="flex text-white/70">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <blockquote className="text-gray-300 mb-6">
                &quot;Vartalap&apos;s voice AI has transformed our customer service. We&apos;ve seen a 40% reduction in response time and significantly improved customer satisfaction.&quot;
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white/70 font-bold">SJ</span>
                </div>
                <div>
                  <div className="text-white font-semibold">Sarah Johnson</div>
                  <div className="text-gray-400 text-sm">CTO, TechCorp Inc.</div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <div className="flex text-white/70">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <blockquote className="text-gray-300 mb-6">
                &quot;The integration was seamless and the accuracy is impressive. Our users love the natural conversation flow and multilingual support.&quot;
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white/70 font-bold">MR</span>
                </div>
                <div>
                  <div className="text-white font-semibold">Michael Rodriguez</div>
                  <div className="text-gray-400 text-sm">Product Manager, InnovateLabs</div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
              <div className="flex items-center mb-6">
                <div className="flex text-white/70">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <blockquote className="text-gray-300 mb-6">
                &quot;Outstanding performance and reliability. The real-time processing capabilities have enabled us to create truly interactive experiences.&quot;
              </blockquote>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white/70 font-bold">AC</span>
                </div>
                <div>
                  <div className="text-white font-semibold">Amanda Chen</div>
                  <div className="text-gray-400 text-sm">Head of Engineering, VoiceFlow</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations (sleek) */}
      <section className="bg-black py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="text-center mb-10">
            <div className="mx-auto w-20 h-20 rounded-2xl border border-white/10 bg-white/5 flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_60px_rgba(0,0,0,0.6)]">
              <IconBolt className="w-8 h-8 text-white/80" />
            </div>
            <h2 className="mt-6 text-4xl md:text-5xl font-display tracking-tight">
              <span className="text-white">Integrate this afternoon</span>
            </h2>
            <p className="mt-4 text-white/70 max-w-2xl mx-auto">
              A simple, elegant interface to add real‑time voice to your app. Drop‑in SDKs for your favorite stacks.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center mb-10">
            <span className="pill pill-active"><IconNode className="pill-icon"/>Node.js</span>
            <span className="pill"><IconPython className="pill-icon"/>Python</span>
            <span className="pill"><IconGo className="pill-icon"/>Go</span>
            <span className="pill"><IconRust className="pill-icon"/>Rust</span>
            <span className="pill"><IconJava className="pill-icon"/>Java</span>
            <span className="pill"><IconElixir className="pill-icon"/>Elixir</span>
            <span className="pill"><IconDotnet className="pill-icon"/>.NET</span>
            <span className="pill"><IconRest className="pill-icon"/>REST</span>
            <span className="pill"><IconSmtp className="pill-icon"/>SMTP</span>
          </div>

          <div className="code-window">
            <div className="code-tabs">
              <span className="tab tab-active">Node.js</span>
              <span className="tab">Next.js</span>
              <span className="tab">Express</span>
              <span className="tab">Bun</span>
            </div>
            <pre className="p-6 md:p-8 text-sm leading-6 text-white/85 overflow-x-auto">
{`import { Vartalap } from '@vartalap/sdk';

const client = new Vartalap({ apiKey: process.env.VARTALAP_API_KEY! });

const stream = await client.speech.start({
  language: 'en',
  model: 'realtime-1',
});

stream.on('transcript', (t) => console.log(t.text));
stream.say('Hello, world');
`}
            </pre>
          </div>
        </div>
      </section>

      {/* Logo strip */}
      <section className="bg-black py-20">
        <div className="mx-auto max-w-[1100px] px-6">
          <p className="text-center text-white/60 mb-8">Companies of all sizes trust Vartalap.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 items-center text-white/80">
            {['Raycast','Leap','Payload','Supabase','Decathlon','Gumroad','Mistral','Anghami'].map((b)=> (
              <div key={b} className="text-center text-sm tracking-wider border border-white/10 rounded-xl py-4 bg-white/5">
                {b}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-black border-t border-zinc-800 pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-zinc-900 border border-white/10 rounded-lg flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <svg className="w-6 h-6 text-white/80" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                  </svg>
                </div>
                <span className="text-2xl font-semibold text-white/90">Vartalap</span>
              </div>
              <p className="text-gray-400">
                The future of conversational AI, available today.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a href="#" className="text-white/60 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.404-5.965 1.404-5.965s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z.017 0z"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-white font-semibold">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2025 Vartalap. All rights reserved.
            </p>
            <div className="flex space-x-6 text-white/60 text-sm mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
