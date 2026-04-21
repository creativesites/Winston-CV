import { useInView } from '../hooks/useInView';

const techStack = [
  {
    category: 'AI & Machine Learning',
    color: 'accent',
    tags: ['Dialogflow', 'LangChain', 'TensorFlow', 'OpenAI API', 'NLP', 'Chatbots'],
  },
  {
    category: 'Frontend',
    color: 'purple',
    tags: ['React', 'Next.js', 'Vue.js', 'React Native', 'TypeScript', 'Tailwind CSS'],
  },
  {
    category: 'Backend',
    color: 'emerald',
    tags: ['Node.js', 'Express.js', 'REST APIs', 'GraphQL'],
  },
  {
    category: 'Languages',
    color: 'accent',
    tags: ['JavaScript', 'Python', 'Swift'],
  },
  {
    category: 'Databases',
    color: 'purple',
    tags: ['MongoDB', 'PostgreSQL', 'MySQL', 'SQL'],
  },
  {
    category: 'Tools & Platforms',
    color: 'emerald',
    tags: ['Git', 'GitHub', 'Docker', 'Agile / Scrum', 'Fitbit SDK', 'WordPress', 'Webflow'],
  },
];

const tagStyles = {
  accent: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300',
  purple: 'bg-purple-500/10 border-purple-500/20 text-purple-300',
  emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
};

export default function About() {
  const [ref, inView] = useInView();

  return (
    <section id="about-section" className="py-24 border-t border-border-subtle">
      <div className="section-container">
        <div
          ref={ref}
          className={`transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Section label */}
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">
            About Me
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left — Bio */}
            <div className="space-y-6">
              <h2 className="section-heading">
                Building at the intersection of{' '}
                <span className="gradient-text">AI and the web</span>
              </h2>

              <div className="space-y-4 text-text-muted text-lg leading-relaxed">
                <p>
                  I&apos;m a full-stack engineer with 7+ years of experience, specializing
                  in AI systems and modern web applications. I&apos;ve built chatbots
                  for U.S. government departments, mobile apps for Fortune 500
                  healthcare platforms, and an e-learning system used by thousands
                  of high school students across Zimbabwe.
                </p>
                <p>
                  I work remotely from Lusaka, Zambia with international teams — primarily
                  in the US and Canada. I thrive in async-first environments where
                  outcomes matter more than optics.
                </p>
              </div>

              {/* Quick facts */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                {[
                  { label: 'Location', value: 'Lusaka, Zambia' },
                  { label: 'Work style', value: 'Remote' },
                  { label: 'Availability', value: 'Immediately' },
                  { label: 'MSc', value: 'Machine Learning & AI' },
                ].map((fact) => (
                  <div key={fact.label} className="bg-surface border border-border-subtle rounded-lg p-4">
                    <p className="text-text-muted text-xs mb-1">{fact.label}</p>
                    <p className="text-text-primary text-sm font-medium">{fact.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Tech Stack */}
            <div className="space-y-6">
              <h3 className="text-text-primary font-semibold text-xl">Tech Stack</h3>
              <div className="space-y-5">
                {techStack.map((group) => (
                  <div key={group.category}>
                    <p className="text-text-muted text-xs font-semibold uppercase tracking-wider mb-2">
                      {group.category}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-xs font-medium px-3 py-1 rounded-full border ${tagStyles[group.color]}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
