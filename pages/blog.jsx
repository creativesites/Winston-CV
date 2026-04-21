import Link from 'next/link';
import Head from 'next/head';
import Layout from '../src/layouts/Layout';
import { posts } from '../src/data/blog';

export default function Blog() {
  const [featured, ...rest] = posts;

  return (
    <Layout>
      <Head>
        <title>Blog — Winston Chikazhe</title>
        <meta name="description" content="Thoughts on AI, remote work, and building software from Africa for the world." />
      </Head>

      {/* Hero */}
      <section className="pt-32 pb-16 border-b border-border-subtle">
        <div className="section-container">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Blog</p>
          <h1 className="text-5xl md:text-6xl font-black text-text-primary mb-4">
            Articles &amp; <span className="gradient-text">Insights</span>
          </h1>
          <p className="text-text-muted text-xl max-w-xl">
            Thoughts on AI, remote engineering, and building software from Africa for the world.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="section-container">
          {/* Featured post */}
          <div className="mb-14">
            <p className="text-text-muted text-xs font-semibold uppercase tracking-widest mb-5">
              Featured
            </p>
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-border-subtle hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
                <div className="relative h-64 lg:h-auto overflow-hidden bg-surface">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="bg-surface p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="tag-accent">{featured.category}</span>
                    <span className="text-text-muted text-xs">{featured.readTime}</span>
                  </div>
                  <h2 className="text-text-primary text-2xl lg:text-3xl font-bold leading-snug mb-4 group-hover:text-accent transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-text-muted text-base leading-relaxed mb-6">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted text-sm">{featured.date}</span>
                    <span className="text-accent text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read article
                      <ArrowRightIcon />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Remaining posts */}
          <div>
            <p className="text-text-muted text-xs font-semibold uppercase tracking-widest mb-5">
              More Articles
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rest.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function PostCard({ post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="card p-0 overflow-hidden hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10">
        <div className="relative h-48 overflow-hidden bg-surface">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface/60 to-transparent" />
        </div>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <span className="tag-accent">{post.category}</span>
            <span className="text-text-muted text-xs">{post.readTime}</span>
          </div>
          <h3 className="text-text-primary font-bold text-xl leading-snug mb-3 group-hover:text-accent transition-colors">
            {post.title}
          </h3>
          <p className="text-text-muted text-sm leading-relaxed mb-4 line-clamp-2">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between border-t border-border-subtle pt-4">
            <span className="text-text-muted text-xs">{post.date}</span>
            <span className="text-accent text-sm font-semibold inline-flex items-center gap-1 group-hover:gap-2 transition-all">
              Read more <ArrowRightIcon />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
