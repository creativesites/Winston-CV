import { useInView } from '../hooks/useInView';

const testimonials = [
  {
    id: 1,
    quote:
      "Winston's backend development skills using Node.js have been indispensable. He's not just a developer; he's a reliable problem solver who consistently delivers high-quality code on time.",
    name: 'Candace Mitchel Harris',
    role: 'CEO',
    company: 'Myavana',
    avatar: 'assets/images/candace.webp',
  },
  {
    id: 2,
    quote:
      "Winston's ability to create stunning websites on platforms like WordPress and Webflow is remarkable. His designs are not only visually appealing but also optimized for performance and user experience.",
    name: 'Andrea Ward',
    role: 'CEO',
    company: 'Empire One Consulting',
    avatar: 'assets/images/andrea.jpeg',
  },
  {
    id: 3,
    quote:
      'I had the pleasure of collaborating with Winston on a challenging Dialogflow project. His proficiency in chatbot development and AI integration made the project a resounding success. His dedication and clear communication were key to our achievements.',
    name: 'Ben Ayed',
    role: 'Manager',
    company: 'AutoServe, CA',
    avatar: 'assets/images/ben.jpeg',
  },
  {
    id: 4,
    quote:
      "As the manager of our Zambia team, Winston showcased exceptional leadership skills. His strategic thinking and technical expertise were vital in achieving our project goals. He's a true asset to any team.",
    name: 'Varun Sharma',
    role: 'CEO & Founder',
    company: 'Propzi, Canada',
    avatar: 'assets/images/varun.png',
  },
  {
    id: 5,
    quote:
      "Winston's multidisciplinary skills are a true asset. From mobile app development to graphic design, he brings a wealth of knowledge to the table. His contributions have consistently exceeded our expectations.",
    name: 'Ted Battreal',
    role: 'Chief Executive Officer',
    company: 'Bluevector',
    avatar: 'assets/images/ted.png',
  },
];

export default function Testimonials() {
  const [ref, inView] = useInView();

  return (
    <section id="testimonials-section" className="py-24 border-t border-border-subtle">
      <div className="section-container">
        <div
          ref={ref}
          className={`transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">
            Testimonials
          </p>
          <h2 className="section-heading mb-2">
            What <span className="gradient-text">Clients Say</span>
          </h2>
          <p className="section-subheading">
            From CEOs to engineering managers — real feedback from real collaborations.
          </p>

          {/* Featured testimonial */}
          <div
            className={`mb-8 card border-accent/30 relative overflow-hidden transition-all duration-700 delay-100 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-accent rounded-l-xl" />
            <QuoteIcon className="text-accent/20 w-14 h-14 mb-4" />
            <blockquote className="text-text-primary text-xl md:text-2xl font-medium leading-relaxed mb-6">
              &ldquo;{testimonials[0].quote}&rdquo;
            </blockquote>
            <div className="flex items-center gap-4">
              <img
                src={testimonials[0].avatar}
                alt={testimonials[0].name}
                className="w-12 h-12 rounded-full object-cover border-2 border-accent/30"
              />
              <div>
                <p className="text-text-primary font-semibold">{testimonials[0].name}</p>
                <p className="text-text-muted text-sm">
                  {testimonials[0].role} · {testimonials[0].company}
                </p>
              </div>
            </div>
          </div>

          {/* Grid of remaining */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {testimonials.slice(1).map((t, i) => (
              <div
                key={t.id}
                className={`card group hover:border-accent/30 transition-all duration-700 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${(i + 2) * 100}ms` }}
              >
                <QuoteIcon className="text-accent/15 w-8 h-8 mb-3" />
                <blockquote className="text-text-muted text-sm leading-relaxed mb-5">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-border-subtle"
                  />
                  <div>
                    <p className="text-text-primary text-sm font-semibold">{t.name}</p>
                    <p className="text-text-muted text-xs">
                      {t.role} · {t.company}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function QuoteIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
    </svg>
  );
}
