import { useInView } from '../hooks/useInView';

const experience = [
  {
    id: 1,
    role: 'AI Developer',
    company: 'Myavana',
    location: 'USA (Remote)',
    start: '2020',
    end: null,
    current: true,
    description:
      'Leading AI development for a beauty-tech platform serving thousands of users. Built and deployed ML algorithms that power personalized hair care recommendations, and developed the AI chatbot feature for the mobile app. Working across cross-functional teams to ship AI-powered features end-to-end.',
    tags: ['AI/ML', 'Node.js', 'React', 'Chatbots', 'Python'],
  },
  {
    id: 2,
    role: 'Dialogflow Developer',
    company: 'BlueVector AI',
    location: 'USA (Remote, Part-Time)',
    start: '2021',
    end: '2022',
    current: false,
    description:
      'Led development of the Medtronic Fitbit app and designed Dialogflow agents for U.S. government departments. Navigated complex regulatory and compliance environments while delivering production-grade conversational AI systems integrated with Cisco telephony infrastructure.',
    tags: ['Dialogflow', 'Fitbit SDK', 'Node.js', 'NLP', 'Cisco'],
  },
  {
    id: 3,
    role: 'Team Manager & Developer',
    company: 'Propzi',
    location: 'Canada (Remote)',
    start: '2017',
    end: '2020',
    current: false,
    description:
      'Managed the Zambia engineering team while serving as lead developer. Built the Propzi mobile app (Swift & React Native), a Dialogflow chatbot for real estate interactions, and a proprietary home evaluation algorithm. Mentored junior engineers and oversaw on-time delivery across multiple sprints.',
    tags: ['Swift', 'React Native', 'Dialogflow', 'Node.js', 'Team Lead'],
  },
];

const education = [
  {
    id: 1,
    degree: 'BSc in Computer Science with Applied Artificial Intelligence',
    institution: 'IU International University of Applied Sciences',
    period: '2024 — Present',
    description: `The Artificial Intelligence specialisation builds on my core Computer Science knowledge and provides a strong foundation in data-driven and intelligent systems through:
statistical foundations of machine learning with a focus on supervised learning techniques.
unsupervised learning methods and advanced feature engineering approaches.
neural networks and deep learning models for complex pattern recognition tasks.
practical, project-based experience in Edge AI, applying AI models directly on resource-constrained devices.`,
  },
  {
    id: 2,
    degree: 'Bachelor of Medicine and Surgery',
    institution: 'University of Zimbabwe',
    period: '2014 — 2017',
    description: 'Completed 3 years of a 6-year program before pursuing Software Engineering full-time.',
  },
  {
    id: 3,
    degree: 'Data Science: R Basics',
    institution: 'HarvardX (edX)',
    period: '2018',
    description: 'Data wrangling, analysis, and visualization with R.',
  },
];

export default function Experience() {
  const [ref, inView] = useInView();

  return (
    <section id="resume-section" className="py-24 border-t border-border-subtle">
      <div className="section-container">
        <div
          ref={ref}
          className={`transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">
            Resume
          </p>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14">
            <h2 className="section-heading mb-0">
              Experience &amp; <span className="gradient-text">Education</span>
            </h2>
            <a
              href="/assets/docs/Winston-CV.pdf"
              download
              className="btn-outline text-sm mt-4 sm:mt-0 self-start sm:self-auto"
            >
              Download Full CV
              <DownloadIcon />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Experience — left 3 cols */}
            <div className="lg:col-span-3">
              <h3 className="text-text-primary font-semibold text-lg mb-8 flex items-center gap-3">
                <span className="w-6 h-px bg-accent" />
                Work Experience
              </h3>
              <div className="space-y-8">
                {experience.map((job, i) => (
                  <ExperienceCard key={job.id} job={job} delay={i * 100} inView={inView} />
                ))}
              </div>
            </div>

            {/* Education — right 2 cols */}
            <div className="lg:col-span-2">
              <h3 className="text-text-primary font-semibold text-lg mb-8 flex items-center gap-3">
                <span className="w-6 h-px bg-accent-purple" />
                Education
              </h3>
              <div className="space-y-5">
                {education.map((edu, i) => (
                  <EducationCard key={edu.id} edu={edu} delay={i * 100 + 200} inView={inView} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceCard({ job, delay, inView }) {
  return (
    <div
      className={`relative pl-6 transition-all duration-700 ${
        inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Timeline line */}
      <div className="absolute left-0 top-2 bottom-0 w-px bg-border-subtle" />

      {/* Timeline dot */}
      <div
        className={`absolute left-0 top-2 w-2 h-2 -translate-x-0.5 rounded-full ${
          job.current ? 'bg-accent shadow-lg shadow-indigo-500/50' : 'bg-border-subtle'
        }`}
      />

      <div className={`card ${job.current ? 'border-accent/40' : ''}`}>
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <div>
            <h4 className="text-text-primary font-semibold text-base">{job.role}</h4>
            <p className="text-accent text-sm font-medium">{job.company}</p>
            <p className="text-text-muted text-xs">{job.location}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              job.current
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-surface text-text-muted border border-border-subtle'
            }`}>
              {job.start} — {job.current ? 'Present' : job.end}
            </span>
          </div>
        </div>

        <p className="text-text-muted text-sm leading-relaxed mb-4">{job.description}</p>

        <div className="flex flex-wrap gap-2">
          {job.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function EducationCard({ edu, delay, inView }) {
  return (
    <div
      className={`card transition-all duration-700 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className="text-xs text-text-muted font-medium">{edu.period}</span>
      <h4 className="text-text-primary font-semibold text-sm mt-1">{edu.degree}</h4>
      <p className="text-accent-purple text-xs font-medium mt-0.5">{edu.institution}</p>
      <p className="text-text-muted text-xs mt-2">{edu.description}</p>
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}
