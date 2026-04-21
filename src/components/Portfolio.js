import { useState } from 'react';
import { useInView } from '../hooks/useInView';

const projects = [
  {
    id: 1,
    name: 'Myavana',
    category: ['all', 'ai', 'web', 'mobile'],
    image: 'assets/images/myavana.png',
    description:
      'AI-powered beauty-tech platform. Built the mobile app chatbot using ML algorithms for personalized hair care recommendations, plus full-stack web development for the CVM Worldwide platform.',
    tags: ['React', 'Node.js', 'AI/ML', 'React Native'],
    link: 'https://www.myavana.com/',
    highlight: true,
  },
  {
    id: 2,
    name: 'ChatLearn',
    category: ['all', 'ai', 'backend'],
    image: null,
    videoId: 'ySbATgmd01E',
    description:
      "WhatsApp-based e-learning system for Zimbabwean high school students. Designed to work on affordable data bundles, delivering quizzes, content, and real-time assistance to thousands of students in low-connectivity regions.",
    tags: ['Dialogflow', 'Node.js', 'WhatsApp API', 'Education'],
    link: 'https://www.youtube.com/watch?v=ySbATgmd01E',
    highlight: false,
  },
  {
    id: 3,
    name: 'Propzi',
    category: ['all', 'mobile', 'backend', 'ai'],
    image: 'assets/images/propzi.png',
    description:
      'Real estate platform with a Dialogflow chatbot, a custom home evaluation algorithm, and a mobile app. Led the Zambia engineering team while serving as lead mobile developer.',
    tags: ['Swift', 'React Native', 'Dialogflow', 'Node.js'],
    link: 'https://www.propzi.com/',
    highlight: false,
  },
  {
    id: 4,
    name: 'BlueVector AI',
    category: ['all', 'ai', 'backend'],
    image: 'assets/images/bluevector.png',
    description:
      'Led development of the Medtronic Fitbit app and built Dialogflow agents for U.S. government departments, integrating with Cisco telephony infrastructure under strict compliance requirements.',
    tags: ['Dialogflow', 'Fitbit SDK', 'Cisco', 'Node.js'],
    link: null,
    highlight: false,
  },
  {
    id: 5,
    name: 'AutoService AI',
    category: ['all', 'ai', 'backend'],
    image: 'assets/images/auto.png',
    description:
      'Backend infrastructure to manage hundreds of Dialogflow agents. Built bulk update mechanisms for intents/entities, automated daily test suites via cron jobs, and a data scraping & analysis tool using Google Apps Script.',
    tags: ['Node.js', 'Express.js', 'Dialogflow', 'Automation'],
    link: 'https://www.autoservice.ai',
    highlight: false,
  },
  {
    id: 6,
    name: 'Michigan State DHHS',
    category: ['all', 'ai'],
    image: 'assets/images/mitch.png',
    description:
      'Dialogflow chatbots for Michigan State Health & Human Services Vital Records — handling complex queries on both web and telephone channels, integrated with Cisco for advanced call routing.',
    tags: ['Dialogflow', 'Cisco', 'Government', 'NLP'],
    link: 'https://www.michigan.gov/mdhhs/doing-business/vitalrecords',
    highlight: false,
  },
];

const filters = [
  { key: 'all', label: 'All' },
  { key: 'ai', label: 'AI & ML' },
  { key: 'web', label: 'Web' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'backend', label: 'Backend' },
];

export default function Portfolio() {
  const [active, setActive] = useState('all');
  const [ref, inView] = useInView();

  const visible = projects.filter((p) => p.category.includes(active));

  return (
    <section id="works-section" className="py-24 border-t border-border-subtle">
      <div className="section-container">
        <div
          ref={ref}
          className={`transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">
            Portfolio
          </p>
          <h2 className="section-heading mb-2">
            Selected <span className="gradient-text">Work</span>
          </h2>
          <p className="section-subheading">
            Projects shipped across AI, mobile, and web — for clients in the US, Canada and beyond.
          </p>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                className={`text-sm font-medium px-4 py-2 rounded-lg border transition-all duration-200 ${
                  active === f.key
                    ? 'bg-accent text-white border-accent'
                    : 'border-border-subtle text-text-muted hover:border-accent/50 hover:text-text-primary'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {visible.map((project, i) => (
              <ProjectCard key={project.id} project={project} delay={i * 80} inView={inView} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, delay, inView }) {
  return (
    <div
      className={`group card p-0 overflow-hidden transition-all duration-700 ${
        project.highlight ? 'border-accent/40' : ''
      } ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Image / Video */}
      <div className="relative h-48 bg-surface overflow-hidden">
        {project.videoId ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${project.videoId}`}
            title={project.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : project.image ? (
          <>
            <img
              src={project.image}
              alt={project.name}
              className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-text-muted text-5xl font-black opacity-10">
              {project.name[0]}
            </span>
          </div>
        )}

        {project.highlight && (
          <div className="absolute top-3 right-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent text-white">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
        <h3 className="text-text-primary font-bold text-xl mb-2">{project.name}</h3>
        <p className="text-text-muted text-sm leading-relaxed mb-5">{project.description}</p>

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-accent hover:text-white text-sm font-semibold group/link"
          >
            Visit Project
            <ExternalLinkIcon />
          </a>
        )}
      </div>
    </div>
  );
}

function ExternalLinkIcon() {
  return (
    <svg className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  );
}
