import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../src/layouts/Layout';
import { posts, getPostBySlug } from '../../src/data/blog';

export async function getStaticPaths() {
  return {
    paths: posts.map((p) => ({ params: { slug: p.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);
  const currentIndex = posts.findIndex((p) => p.slug === params.slug);
  const prev = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const next = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  return { props: { post, prev, next } };
}

export default function BlogPost({ post, prev, next }) {
  if (!post) return null;

  return (
    <Layout>
      <Head>
        <title>{post.title} — Winston Chikazhe</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={`https://winston.work/${post.image}`} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.dateISO} />
      </Head>

      {/* Header */}
      <section className="pt-32 pb-12 border-b border-border-subtle">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-text-muted hover:text-text-primary text-sm mb-8 transition-colors group"
          >
            <ArrowLeftIcon className="group-hover:-translate-x-0.5 transition-transform" />
            Back to Blog
          </Link>

          <div className="flex items-center gap-3 mb-5">
            <span className="tag-accent">{post.category}</span>
            <span className="text-text-muted text-sm">{post.date}</span>
            <span className="text-border-subtle">·</span>
            <span className="text-text-muted text-sm">{post.readTime}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-text-primary leading-tight mb-6">
            {post.title}
          </h1>

          <p className="text-text-muted text-xl leading-relaxed mb-8">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-4 pt-6 border-t border-border-subtle">
            <img
              src="assets/images/winns.jpg"
              alt="Winston Chikazhe"
              className="w-11 h-11 rounded-full object-cover object-top border border-border-subtle"
            />
            <div>
              <p className="text-text-primary font-semibold text-sm">Winston Chikazhe</p>
              <p className="text-text-muted text-xs">AI &amp; Full-Stack Engineer · Lusaka, Zambia</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cover image */}
      <div className="max-w-4xl mx-auto px-6 md:px-8 py-10">
        <div className="rounded-2xl overflow-hidden h-64 md:h-96 bg-surface border border-border-subtle">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Article body */}
      <article className="max-w-3xl mx-auto px-6 md:px-8 pb-20">
        <div className="prose-content">
          {post.content.map((block, i) => (
            <ContentBlock key={i} block={block} />
          ))}
        </div>

        {/* Tags / share */}
        <div className="mt-14 pt-8 border-t border-border-subtle flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-text-muted text-sm">Filed under:</span>
            <span className="tag-accent">{post.category}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-text-muted text-sm">Share:</span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://winston.work/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent transition-colors text-sm font-medium"
            >
              Twitter
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://winston.work/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent transition-colors text-sm font-medium"
            >
              LinkedIn
            </a>
          </div>
        </div>

        {/* Author card */}
        <div className="mt-10 card flex flex-col sm:flex-row gap-6 items-start sm:items-center">
          <img
            src="assets/images/winns.jpg"
            alt="Winston Chikazhe"
            className="w-16 h-16 rounded-xl object-cover object-top flex-shrink-0 border border-border-subtle"
          />
          <div>
            <p className="text-text-primary font-bold mb-1">Winston Chikazhe</p>
            <p className="text-text-muted text-sm leading-relaxed mb-3">
              AI &amp; Full-Stack Engineer with 7+ years building intelligent systems and web applications. Based in Lusaka, Zambia — working globally.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/creativesites"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent text-sm font-semibold hover:underline"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/winston-tinashe-5939b91b6/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent text-sm font-semibold hover:underline"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        {/* Prev / Next navigation */}
        {(prev || next) && (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {prev ? (
              <Link
                href={`/blog/${prev.slug}`}
                className="group card hover:border-accent/40 transition-all"
              >
                <p className="text-text-muted text-xs mb-2 flex items-center gap-1">
                  <ArrowLeftIcon /> Previous
                </p>
                <p className="text-text-primary text-sm font-semibold group-hover:text-accent transition-colors line-clamp-2">
                  {prev.title}
                </p>
              </Link>
            ) : <div />}
            {next ? (
              <Link
                href={`/blog/${next.slug}`}
                className="group card hover:border-accent/40 transition-all text-right"
              >
                <p className="text-text-muted text-xs mb-2 flex items-center gap-1 justify-end">
                  Next <ArrowRightIcon />
                </p>
                <p className="text-text-primary text-sm font-semibold group-hover:text-accent transition-colors line-clamp-2">
                  {next.title}
                </p>
              </Link>
            ) : <div />}
          </div>
        )}
      </article>
    </Layout>
  );
}

function ContentBlock({ block }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p className="text-text-dim text-lg leading-8 mb-6">{block.text}</p>
      );

    case 'heading':
      return (
        <h2 className="text-text-primary text-2xl md:text-3xl font-bold mt-12 mb-5">
          {block.text}
        </h2>
      );

    case 'subheading':
      return (
        <h3 className="text-text-primary text-xl font-semibold mt-8 mb-4">
          {block.text}
        </h3>
      );

    case 'quote':
      return (
        <blockquote className="my-8 pl-6 border-l-4 border-accent relative">
          <p className="text-text-primary text-xl italic leading-relaxed font-medium">
            &ldquo;{block.text}&rdquo;
          </p>
          {block.author && (
            <cite className="text-text-muted text-sm mt-2 block not-italic">
              — {block.author}
            </cite>
          )}
        </blockquote>
      );

    case 'list':
      return (
        <div className="my-6">
          {block.heading && (
            <p className="text-text-primary font-semibold mb-3">{block.heading}</p>
          )}
          <ul className="space-y-3">
            {block.items.map((item, i) => (
              <li key={i} className="flex gap-3 text-text-dim text-base leading-7">
                <span className="text-accent mt-1.5 flex-shrink-0">
                  <CheckIcon />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );

    default:
      return null;
  }
}

function ArrowLeftIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ArrowRightIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}
