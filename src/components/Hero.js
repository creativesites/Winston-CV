import { useEffect, useState } from 'react';

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="started-section"
      className="relative min-h-screen flex items-center bg-grid overflow-hidden"
    >
      {/* Glow blobs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-purple-600/8 rounded-full blur-3xl pointer-events-none" />

      <div className="section-container w-full pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left — Text */}
          <div className="order-2 lg:order-1 space-y-8">
            {/* Available badge */}
            <div
              className={`transition-all duration-700 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow" />
                Available for new opportunities
              </span>
            </div>

            {/* Name */}
            <div
              className={`space-y-3 transition-all duration-700 delay-100 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <p className="text-text-muted text-lg font-medium">Hi, I&apos;m</p>
              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black text-text-primary leading-none tracking-tight">
                
                
                <span className="gradient-text">Winston</span>
              </h1>
              <p className="text-xl sm:text-2xl text-text-dim font-medium">
                AI &amp; Full-Stack Engineer
              </p>
            </div>

            {/* Bio */}
            <p
              className={`text-text-muted text-lg leading-relaxed max-w-lg transition-all duration-700 delay-200 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              I build intelligent systems and polished web experiences — from AI
              chatbots serving government departments to mobile apps used by
              thousands. Based in Zambia, working globally.
            </p>

            {/* Stats */}
            <div
              className={`flex gap-8 transition-all duration-700 delay-300 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {[
                { num: '7+', label: 'Years Experience' },
                { num: '33+', label: 'Projects Shipped' },
                { num: '5', label: 'Countries Served' },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-bold text-text-primary">{s.num}</p>
                  <p className="text-text-muted text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div
              className={`flex flex-wrap gap-4 transition-all duration-700 delay-400 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <a href="#works-section" className="btn-primary">
                View My Work
                <ArrowDownIcon />
              </a>
              <a href="/assets/docs/Winston-CV.pdf" download className="btn-outline">
                Download CV
                <DownloadIcon />
              </a>
            </div>

            {/* Socials */}
            <div
              className={`flex items-center gap-5 transition-all duration-700 delay-500 ${
                loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <a
                href="https://github.com/creativesites"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-text-primary transition-colors"
                aria-label="GitHub"
              >
                <GitHubIcon />
              </a>
              <a
                href="https://www.linkedin.com/in/winston-tinashe-5939b91b6/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-accent transition-colors"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </a>
              <a
                href="https://www.youtube.com/channel/UCzT3j_bJn13BaDcNxW2Ljeg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted hover:text-red-400 transition-colors"
                aria-label="YouTube"
              >
                <YouTubeIcon />
              </a>
            </div>
          </div>

          {/* Right — Photo */}
          <div
            className={`order-1 lg:order-2 flex justify-center lg:justify-end transition-all duration-1000 delay-200 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-2xl bg-accent-gradient blur-2xl opacity-20 scale-105" />

              {/* Photo */}
              <div className="relative w-72 h-80 sm:w-80 sm:h-96 rounded-2xl overflow-hidden border border-border-subtle">
                <img
                  src="assets/images/hero.png"
                  alt="Winston Chikazhe"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/60 via-transparent to-transparent" />
              </div>

              {/* Floating badge — top right */}
              <div className="absolute -top-4 -right-4 bg-surface border border-border-subtle rounded-xl px-4 py-3 shadow-xl animate-float">
                <p className="text-xs text-text-muted">Current role</p>
                <p className="text-sm font-semibold text-text-primary">AI Engineer</p>
                <p className="text-xs text-accent">@ Myavana</p>
              </div>

              {/* Floating badge — bottom left */}
              <div className="absolute -bottom-4 -left-4 bg-surface border border-border-subtle rounded-xl px-4 py-3 shadow-xl animate-float" style={{ animationDelay: '1.5s' }}>
                <p className="text-xs text-text-muted">Open to</p>
                <p className="text-sm font-semibold text-accent-emerald">Remote Work</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted">
        <p className="text-xs">Scroll</p>
        <div className="w-px h-10 bg-gradient-to-b from-text-muted to-transparent" />
      </div>
    </section>
  );
}

function ArrowDownIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}
