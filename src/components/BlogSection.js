import Link from 'next/link';
import { useInView } from '../hooks/useInView';

const posts = [
  {
    id: 1,
    slug: 'navigating-remote-work',
    title: 'Navigating the World of Remote Work',
    date: 'October 31, 2022',
    image: 'assets/images/blog1.jpg',
    excerpt:
      'Working remotely as a software engineer has become more than just a trend. The freedom to work from anywhere brings exciting opportunities — but also unique challenges.',
  },
  {
    id: 2,
    slug: 'power-of-ai-in-modern-business',
    title: 'The Power of AI in Modern Business: A Deep Dive',
    date: 'April 12, 2023',
    image: 'assets/images/blog2.jpg',
    excerpt:
      "AI is no longer a futuristic concept — it's a present-day reality transforming industries. I've witnessed firsthand the profound impact of AI on businesses of all sizes.",
  },
  {
    id: 3,
    slug: 'african-developers-global-tech',
    title: 'How African Developers Thrive in the Global Tech Industry',
    date: 'June 28, 2023',
    image: 'assets/images/blog3.jpg',
    excerpt:
      'The global tech industry often seems distant from regions like Africa, yet unique challenges shape the journeys of developers who build world-class software from the continent.',
  },
];

export default function BlogSection() {
  const [ref, inView] = useInView();

  return (
    <section id="blog-section" className="py-24 border-t border-border-subtle">
      <div className="section-container">
        <div
          ref={ref}
          className={`transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">
            Blog
          </p>
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="section-heading mb-1">
                Latest <span className="gradient-text">Articles</span>
              </h2>
              <p className="text-text-muted">Thoughts on AI, engineering, and remote work.</p>
            </div>
            <Link href="/blog" className="btn-outline text-sm hidden sm:inline-flex">
              View All Posts
              <ArrowRightIcon />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <article
                key={post.id}
                className={`group card p-0 overflow-hidden transition-all duration-700 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="relative h-44 overflow-hidden bg-surface">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent" />
                </div>

                <div className="p-5">
                  <p className="text-text-muted text-xs mb-2">{post.date}</p>
                  <h3 className="text-text-primary font-semibold text-base leading-snug mb-3 group-hover:text-accent transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="text-text-muted text-sm leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-accent text-sm font-semibold inline-flex items-center gap-1 group/link"
                  >
                    Read more
                    <ArrowRightIcon className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link href="/blog" className="btn-outline text-sm">
              View All Posts
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ArrowRightIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}
