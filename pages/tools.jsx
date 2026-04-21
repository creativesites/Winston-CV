import Head from 'next/head';
import Link from 'next/link';
import Layout from '../src/layouts/Layout';

const tools = [
  {
    id: 'glass-studio',
    name: 'Luxe Glass & Pattern Studio',
    tagline: 'High-end design playground for glassmorphism UI and SVG textures.',
    description:
      'A live interaction tool for creating premium design elements. Features a draggable mesh gradient engine, fractal noise texture lab, and real-time backdrop-filter controls. Export optimized CSS and SVG code instantly.',
    features: [
      'Interactive Mesh Gradient Engine with draggable points',
      'High-end Glassmorphism Editor (Blur, Tint, Shadows)',
      'Fractal Noise & Film Grain generator',
      'Real-time CSS & SVG code export',
      'Curated premium presets for instant inspiration',
    ],
    type: 'Web App',
    action: { label: 'Launch Studio', href: '/free-tools/glass-studio/index.html', external: false },
    color: 'accent',
  },
  {
    id: 'branding-guidelines',
    name: 'Brand Identity Builder',
    tagline: 'Create a full brand guidelines document in your browser.',
    description:
      'A web-based tool for building complete brand identity systems. Enter your brand name, logo, and colors, then customize positioning, tone of voice, typography, customer profiles, and digital expressions. Export a ready-to-use DOCX guidelines document.',
    features: [
      'Brand setup modal — enter your name, initials, tagline, and logo',
      'Live color palette editor with 4 built-in presets',
      'Typography scale controls with Google Fonts integration',
      'Tone of voice, messaging, and persona presets',
      'Site preview across 4 layout patterns',
      'One-click DOCX export with all content',
    ],
    type: 'Web App',
    action: { label: 'Launch Tool', href: '/free-tools/branding-guidelines/index.html', external: false },
    color: 'accent',
  },
  {
    id: 'wp-guard',
    name: 'WP Guard',
    tagline: 'Premium security hardening and snippet generator for WordPress.',
    description:
      'A professional WordPress security utility. Generate hardened security snippets to disable XML-RPC, restrict REST API, prevent user enumeration, and clean up the WordPress header. Export as a ready-to-use plugin.',
    features: [
      'Clean WordPress Header — remove version, rsd, and wlwmanifest tags',
      'Disable XML-RPC & Pingbacks completely',
      'Restrict REST API to authenticated users only',
      'Generic login error messages to prevent username scanning',
      'Disable author archives and username enumeration',
      'One-click Download as Plugin for immediate hardening',
    ],
    type: 'WordPress Plugin',
    action: { label: 'Download ZIP', href: '/free-tools/wordpress-plugins/wp-guard.zip', external: false },
    color: 'accent-amber',
  },
  {
    id: 'bulk-media-organizer',
    name: 'Bulk Media Organizer',
    tagline: 'Upload and organize WordPress media by year and month.',
    description:
      'A WordPress plugin for bulk uploading media files into specific year/month folders, with duplicate detection, dry-run validation, and a full 4-step media audit and migration workflow for moving media between sites.',
    features: [
      'Bulk upload images, PDFs, and videos to any date folder',
      'Duplicate detection by SHA1 hash and filename/size',
      'Dry-run mode to validate batches before uploading',
      '4-step audit workflow: export manifest → audit → export batches → import ZIP',
      'Server limits displayed inline',
      'Drag-and-drop file selection with live file counter',
    ],
    type: 'WordPress Plugin',
    action: { label: 'Download ZIP', href: '/free-tools/wordpress-plugins/media-month-uploader.zip', external: false },
    color: 'accent-purple',
  },
  {
    id: 'wp-db-cleaner',
    name: 'WP Database Cleaner',
    tagline: 'Enterprise-grade WordPress database optimization and maintenance.',
    description:
      'A full-featured WordPress admin tool for cleaning and optimizing your database. Remove revisions, transients, orphaned metadata, spam, and auto-drafts — with a health score dashboard, dry-run preview, scheduled automation, email reports, and a full activity log.',
    features: [
      'Database health score with animated ring indicator',
      'Dry-run mode — preview exactly what will be deleted',
      'Scheduled auto-cleaning: daily, weekly, or monthly via WP-Cron',
      'Email reports after every scheduled run',
      '13 clean operations: revisions, transients, orphaned meta, duplicates, and more',
      'Table size analyzer with reclaimable space estimate',
      'Full activity log with live vs dry-run history',
      'Per-post revision limit and unapproved comment age controls',
    ],
    type: 'WordPress Plugin',
    action: { label: 'Download ZIP', href: '/free-tools/wordpress-plugins/wp-db-cleaner.zip', external: false },
    color: 'accent-teal',
  },
  {
    id: 'plugin-theme-downloader',
    name: 'Plugin & Theme Downloader',
    tagline: 'Download any installed plugin or theme as a ZIP.',
    description:
      'A WordPress admin utility that lets you download any installed plugin or theme as a clean ZIP file directly from the dashboard. Useful for backups, migrations, or moving a custom theme to another site without FTP access.',
    features: [
      'Download any active or inactive plugin as a ZIP',
      'Full theme support including child themes',
      'Clean dashboard with Plugins and Themes tabs',
      'One-click download links added to the standard Plugins list',
      'WordPress nonces and capability checks for admin-only access',
      'Automatic temporary file cleanup after download',
    ],
    type: 'WordPress Plugin',
    action: { label: 'Download ZIP', href: '/free-tools/wordpress-plugins/plugin-downloader.zip', external: false },
    color: 'accent-emerald',
  },
];

const colorMap = {
  accent: {
    tag: 'tag-accent',
    icon: 'bg-accent/10 text-accent',
    border: 'border-accent/20 hover:border-accent/50',
    btn: 'btn-primary',
  },
  'accent-purple': {
    tag: 'bg-accent-purple/10 text-accent-purple border border-accent-purple/20 text-xs font-semibold px-2.5 py-1 rounded-full',
    icon: 'bg-accent-purple/10 text-accent-purple',
    border: 'border-accent-purple/20 hover:border-accent-purple/50',
    btn: 'bg-accent-purple text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-accent-purple/90 transition-colors inline-flex items-center gap-2',
  },
  'accent-emerald': {
    tag: 'bg-accent-emerald/10 text-accent-emerald border border-accent-emerald/20 text-xs font-semibold px-2.5 py-1 rounded-full',
    icon: 'bg-accent-emerald/10 text-accent-emerald',
    border: 'border-accent-emerald/20 hover:border-accent-emerald/50',
    btn: 'bg-accent-emerald text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-accent-emerald/90 transition-colors inline-flex items-center gap-2',
  },
  'accent-teal': {
    tag: 'bg-teal-500/10 text-teal-600 border border-teal-500/20 text-xs font-semibold px-2.5 py-1 rounded-full',
    icon: 'bg-teal-500/10 text-teal-600',
    border: 'border-teal-500/20 hover:border-teal-500/50',
    btn: 'bg-teal-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors inline-flex items-center gap-2',
  },
  'accent-amber': {
    tag: 'bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-semibold px-2.5 py-1 rounded-full',
    icon: 'bg-amber-500/10 text-amber-500',
    border: 'border-amber-500/20 hover:border-amber-500/50',
    btn: 'bg-amber-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-amber-500/90 transition-colors inline-flex items-center gap-2',
  },
};

export default function Tools() {
  return (
    <Layout>
      <Head>
        <title>Free Tools — Winston Chikazhe</title>
        <meta
          title="Free Tools — Winston Chikazhe"
          name="description"
          content="Free developer tools built by Winston Chikazhe — a glassmorphism studio, brand identity builder, WP Guard security hardening, and more."
        />
      </Head>

      {/* Hero */}
      <section className="pt-32 pb-16 border-b border-border-subtle">
        <div className="section-container">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Free Tools</p>
          <h1 className="text-5xl md:text-6xl font-black text-text-primary mb-4">
            Tools I{' '}
            <span className="gradient-text">Built & Use</span>
          </h1>
          <p className="text-text-muted text-lg max-w-2xl">
            Utilities I built while working on real client projects — generalized and released free for anyone to use.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-20">
        <div className="section-container">
          <div className="grid grid-cols-1 gap-8">
            {tools.map((tool) => {
              const colors = colorMap[tool.color];
              return (
                <article
                  key={tool.id}
                  className={`card p-0 overflow-hidden border ${colors.border} transition-colors duration-300`}
                >
                  <div className="p-8 md:p-10">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      {/* Left: content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                          <span className={colors.tag || `tag-accent text-xs font-semibold px-2.5 py-1 rounded-full`}>
                            {tool.type}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-text-primary mb-2">{tool.name}</h2>
                        <p className="text-accent font-medium text-sm mb-4">{tool.tagline}</p>
                        <p className="text-text-muted text-sm leading-relaxed mb-6">{tool.description}</p>

                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-8">
                          {tool.features.map((f, i) => (
                            <li key={i} className="flex items-start gap-2 text-text-muted text-sm">
                              <CheckIcon />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>

                        <a
                          href={tool.action.href}
                          target={tool.action.external ? '_blank' : undefined}
                          rel={tool.action.external ? 'noopener noreferrer' : undefined}
                          className={colors.btn || 'btn-primary'}
                        >
                          {tool.action.label}
                          {tool.action.label.startsWith('Download') ? <DownloadIcon /> : <ArrowIcon />}
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 mt-0.5 shrink-0 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
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
