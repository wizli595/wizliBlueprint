import Head from 'next/head'
import Link from 'next/link'
import { motion, useReducedMotion, useInView, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion'
import { FaMapMarkerAlt, FaEnvelope, FaGithub, FaLinkedin, FaPhone, FaBriefcase, FaGraduationCap, FaCode, FaUsers, FaClock, FaArrowUp, FaBars, FaTimes, FaDownload } from 'react-icons/fa'
import React, { useRef, useState, useEffect, useCallback } from 'react'

const spring = { type: 'spring' as const, stiffness: 120, damping: 14 };
const springBouncy = { type: 'spring' as const, stiffness: 260, damping: 20 };

const SECTIONS = [
  { id: 'hero', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills' },
  { id: 'tech', label: 'Tech' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
];

const ACCENTS = [
  { name: 'green', primary: '#4ade80', glow: 'rgba(74,222,128,0.4)' },
  { name: 'blue', primary: '#60a5fa', glow: 'rgba(96,165,250,0.4)' },
  { name: 'amber', primary: '#fbbf24', glow: 'rgba(251,191,36,0.4)' },
];

const stats = [
  { label: 'Repos', value: 57, suffix: '+', Icon: FaCode },
  { label: 'Followers', value: 19, suffix: '', Icon: FaUsers },
  { label: 'Years Coding', value: 3, suffix: '+', Icon: FaClock },
];

const skills = [
  { name: 'React / Next.js', level: 90 },
  { name: 'Node.js / Express', level: 88 },
  { name: 'TypeScript', level: 88 },
  { name: 'Laravel / PHP', level: 82 },
  { name: 'Docker / K8s', level: 85 },
  { name: 'MongoDB / Neo4j', level: 80 },
  { name: 'PostgreSQL / SQL', level: 78 },
  { name: 'Python', level: 80 },
  { name: 'Linux / DevOps', level: 88 },
  { name: 'CI/CD Pipelines', level: 85 },
  { name: 'Java / C', level: 75 },
  { name: 'Svelte', level: 70 },
];

const technologies = [
  'React', 'Next.js', 'TypeScript', 'Node.js', 'Express', 'Svelte',
  'Laravel', 'PHP', 'Python', 'Java', 'C', 'C#',
  'MongoDB', 'PostgreSQL', 'Neo4j', 'PLpgSQL',
  'Docker', 'Kubernetes', 'Nats Streaming', 'Jenkins', 'GitLab CI',
  'Linux', 'Bash', 'Nginx', 'Git',
  'LangChain', 'AI / ML', 'WebGL', 'Tailwind CSS',
];

const experience = [
  { date: 'Present', title: 'Freelance Full Stack Engineer', company: 'Self-employed', location: 'Remote', desc: 'Building full-stack web applications for clients using MERN stack and Laravel. Specializing in microservices architecture, containerization with Docker/Kubernetes, CI/CD automation, and AI-powered solutions.' },
  { date: 'Apr 2024 — Jun 2024', title: 'Full-Stack Developer (Internship)', company: 'Specialized Institute Of Applied Technology NTIC', location: 'Safi, Morocco — Remote', desc: 'Built a Ticketing System for Event Management using microservices architecture with Next.js frontend, Docker containerization, and Kubernetes orchestration.' },
];

const education = [
  { date: 'Aug 2024 — Present', school: 'Ecole Marocaine des Sciences de l\'Ingenieur', degree: 'Engineer\'s degree, Computer Software Engineering', skills: ['Java', 'C', 'Software Engineering'] },
  { date: '2022 — 2024', school: 'Specialized Institute Of Applied Technology NTIC', degree: 'Associate\'s degree', skills: ['Kubernetes', 'Nats Streaming', 'Full Stack Development'] },
];

const projects = [
  { name: 'Ticketing System', desc: 'Microservices with Next.js, Docker, and Kubernetes orchestration', tags: ['Next.js', 'Docker', 'K8s'], link: 'https://github.com/wizli595/ticketing_system' },
  { name: 'NeuraPDF', desc: 'Chat with PDFs using AI-powered natural language queries', tags: ['Svelte', 'AI', 'LangChain'], link: 'https://github.com/wizli595/NeuraPDF' },
  { name: 'Contact Backend', desc: 'Graph-based contacts backend with Neo4j and Clean Architecture', tags: ['Neo4j', 'TypeScript'], link: 'https://github.com/wizli595/contact-backend' },
  { name: 'Terminal Portfolio', desc: 'Interactive terminal portfolio with 3D WebGL canvas', tags: ['React', 'WebGL'], link: '/' },
  { name: 'Federated Learning', desc: 'Distributed model training implementation', tags: ['TypeScript', 'ML'], link: 'https://github.com/wizli595/Federated-learning-' },
  { name: 'TrackerTech', desc: 'Tracking app with PostgreSQL backend', tags: ['PLpgSQL'], link: 'https://github.com/wizli595/TrackerTech' },
  { name: 'Storage System', desc: 'File storage system', tags: ['TypeScript'], link: 'https://github.com/wizli595/Storage_SyStem' },
  { name: 'ElegantVogue', desc: 'Application built with C# and .NET', tags: ['C#', '.NET'], link: 'https://github.com/wizli595/ElegantVogue' },
];

const languages = [
  { name: 'Arabic', level: 'Native' },
  { name: 'French', level: 'Professional' },
  { name: 'English', level: 'Professional' },
];

// ── Components ──

function SectionHeader({ label }: { label: string }) {
  return (
    <div className="resume-section-header">
      <span className="resume-section-label">{label}</span>
      <div className="resume-section-line" />
    </div>
  );
}

function AnimatedSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const reduced = useReducedMotion();
  return (
    <motion.div ref={ref} initial={reduced ? { opacity: 1 } : { opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ ...spring, delay }}>
      {children}
    </motion.div>
  );
}

function CountUp({ value, suffix = '' }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let frame: number;
    const duration = 1200;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [isInView, value]);
  return <span ref={ref}>{count}{suffix}</span>;
}

const HEATMAP = Array.from({ length: 52 * 7 }, (_, i) => {
  const seed = (i * 2654435761) >>> 0;
  const r = (seed % 100) / 100;
  if (r < 0.3) return 0;
  if (r < 0.55) return 1;
  if (r < 0.75) return 2;
  if (r < 0.9) return 3;
  return 4;
});

function GitHubHeatmap() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  return (
    <div ref={ref} className="heatmap-container">
      <div className="heatmap-scroll-hint">Scroll to see full year &rarr;</div>
      <div className="heatmap-grid">
        {HEATMAP.map((level, i) => (
          <motion.div key={i} className={`heatmap-cell heatmap-${level}`} initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.3, delay: Math.min(i * 0.001, 0.5) }} />
        ))}
      </div>
      <div className="heatmap-legend">
        <span className="heatmap-legend-label">Less</span>
        {[0, 1, 2, 3, 4].map(l => <div key={l} className={`heatmap-cell heatmap-${l}`} />)}
        <span className="heatmap-legend-label">More</span>
      </div>
    </div>
  );
}

function SkillCard({ name, level, index }: { name: string; level: number; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <div ref={ref} className="skill-card">
      <div className="skill-top">
        <span className="skill-name">{name}</span>
        <motion.span className="skill-pct" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.4, delay: 0.3 + index * 0.04 }}>
          {level}%
        </motion.span>
      </div>
      <div className="skill-bar-bg">
        <motion.div className="skill-bar-fill" initial={{ width: 0 }} animate={isInView ? { width: `${level}%` } : {}} transition={{ duration: 0.8, delay: 0.1 + index * 0.04, ease: 'easeOut' }} />
      </div>
    </div>
  );
}

// ── Main ──

export default function ResumePage() {
  const reduced = useReducedMotion();
  const heroRef = useRef(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [accent, setAccent] = useState(0);
  const [mobileNav, setMobileNav] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Page scroll progress
  const { scrollYProgress: pageProgress } = useScroll();
  const scaleX = useSpring(pageProgress, { stiffness: 200, damping: 30 });

  // Hero parallax
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const badgeY = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const nameScale = useTransform(scrollYProgress, [0, 0.6], [1, 0.95]);

  // Track active section + back-to-top visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting && e.target.id) setActiveSection(e.target.id); }); },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    SECTIONS.forEach(s => { const el = document.getElementById(s.id); if (el) observer.observe(el); });

    const onScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => { observer.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileNav(false);
  }, []);

  const accentColor = ACCENTS[accent];

  return (
    <>
      <Head>
        <title>wizli — Resume</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <style>{`.resume-page{--accent-primary:${accentColor.primary};--accent-glow:${accentColor.glow}}`}</style>

      <motion.div className="resume-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="resume-scanlines" />
        <motion.div className="scroll-progress" style={{ scaleX, transformOrigin: '0%' }} />

        {/* Nav */}
        <nav className="resume-nav">
          <Link href="/" className="resume-nav-logo">wizli</Link>
          {/* Desktop section nav */}
          <div className="resume-nav-sections desktop-only">
            {SECTIONS.map(s => (
              <button key={s.id} className={`nav-section-btn ${activeSection === s.id ? 'active' : ''}`} onClick={() => scrollTo(s.id)}>{s.label}</button>
            ))}
          </div>
          <div className="resume-nav-right">
            <div className="accent-toggle">
              {ACCENTS.map((a, i) => (
                <button key={a.name} className={`accent-dot ${accent === i ? 'active' : ''}`} style={{ background: a.primary }} onClick={() => setAccent(i)} aria-label={`${a.name} theme`} />
              ))}
            </div>
            <a href="https://github.com/wizli595" target="_blank" rel="noopener noreferrer" className="resume-dl-btn desktop-only">
              <FaGithub style={{ marginRight: 6, verticalAlign: -1 }} />GitHub
            </a>
            {/* Mobile hamburger */}
            <button className="mobile-menu-btn mobile-only" onClick={() => setMobileNav(!mobileNav)} aria-label="Menu">
              {mobileNav ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile nav drawer */}
        <AnimatePresence>
          {mobileNav && (
            <motion.div className="mobile-nav-drawer" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.2 }}>
              {SECTIONS.map(s => (
                <button key={s.id} className={`mobile-nav-item ${activeSection === s.id ? 'active' : ''}`} onClick={() => scrollTo(s.id)}>{s.label}</button>
              ))}
              <div className="mobile-nav-divider" />
              <a href="https://github.com/wizli595" target="_blank" rel="noopener noreferrer" className="mobile-nav-item">GitHub</a>
              <a href="https://www.linkedin.com/in/abdessalam-ouazri-ab4938250/" target="_blank" rel="noopener noreferrer" className="mobile-nav-item">LinkedIn</a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back to top */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button
              className="back-to-top"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={springBouncy}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Back to top"
            >
              <FaArrowUp size={14} />
            </motion.button>
          )}
        </AnimatePresence>

        <div className="resume-content">
          {/* Hero */}
          <div ref={heroRef} id="hero">
            <AnimatedSection delay={0.1}>
              <motion.section className="resume-hero" style={reduced ? {} : { y: heroY, opacity: heroOpacity }}>
                <motion.div className="resume-available-badge" style={reduced ? {} : { y: badgeY }}>
                  <span className="available-dot" /> Available for work — On-site / Hybrid / Remote
                </motion.div>
                <motion.h1 className="resume-name" style={reduced ? {} : { scale: nameScale }}>Abdessalam Ouazri</motion.h1>
                <p className="resume-title">Full Stack Engineer &middot; Freelancer</p>
                <p className="resume-bio">
                  Full-Stack Student Engineer specializing in Next.js, Node, and TypeScript.
                  Linux enthusiast with a focus on CI/CD, DevOps, automation, and building AI-powered systems.
                </p>
                <div className="resume-meta">
                  <span className="resume-meta-item"><FaMapMarkerAlt size={12} /> Casablanca, Morocco</span>
                  <span className="resume-meta-item"><FaEnvelope size={12} /> <a href="mailto:ouazri.abdessalam01@gmail.com">ouazri.abdessalam01@gmail.com</a></span>
                  <span className="resume-meta-item"><FaPhone size={12} /> +212-69461-0451</span>
                  <span className="resume-meta-item"><FaGithub size={12} /> <a href="https://github.com/wizli595" target="_blank" rel="noopener noreferrer">wizli595</a></span>
                  <span className="resume-meta-item"><FaLinkedin size={12} /> <a href="https://www.linkedin.com/in/abdessalam-ouazri-ab4938250/" target="_blank" rel="noopener noreferrer">abdessalam-ouazri</a></span>
                </div>
              </motion.section>
            </AnimatedSection>
          </div>

          {/* Stats */}
          <AnimatedSection delay={0.1}>
            <div className="stats-row">
              {stats.map(s => (
                <div key={s.label} className="stat-card">
                  <s.Icon className="stat-icon" size={16} />
                  <div className="stat-value"><CountUp value={s.value} suffix={s.suffix} /></div>
                  <div className="stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          {/* Heatmap */}
          <AnimatedSection delay={0.1}>
            <section className="resume-section">
              <SectionHeader label="Activity" />
              <GitHubHeatmap />
            </section>
          </AnimatedSection>

          {/* Experience */}
          <AnimatedSection delay={0.1}>
            <section className="resume-section" id="experience">
              <SectionHeader label="Experience" />
              {experience.map((exp, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-date">{exp.date}</div>
                  <div className="timeline-title"><FaBriefcase size={11} style={{ marginRight: 6, opacity: 0.5, verticalAlign: -1 }} />{exp.title}</div>
                  <div className="timeline-company">{exp.company}</div>
                  <div className="timeline-location">{exp.location}</div>
                  <div className="timeline-desc">{exp.desc}</div>
                </div>
              ))}
            </section>
          </AnimatedSection>

          {/* Education */}
          <AnimatedSection delay={0.1}>
            <section className="resume-section" id="education">
              <SectionHeader label="Education" />
              {education.map((edu, i) => (
                <div key={i} className="timeline-item">
                  <div className="timeline-dot timeline-dot-blue" />
                  <div className="timeline-date">{edu.date}</div>
                  <div className="timeline-title"><FaGraduationCap size={12} style={{ marginRight: 6, opacity: 0.5, verticalAlign: -1 }} />{edu.school}</div>
                  <div className="timeline-company">{edu.degree}</div>
                  <div className="timeline-skills-row">{edu.skills.map(s => <span key={s} className="timeline-skill-tag">{s}</span>)}</div>
                </div>
              ))}
            </section>
          </AnimatedSection>

          {/* Skills */}
          <AnimatedSection delay={0.1}>
            <section className="resume-section" id="skills">
              <SectionHeader label="Skills" />
              <div className="skills-grid">
                {skills.map((s, i) => <SkillCard key={s.name} name={s.name} level={s.level} index={i} />)}
              </div>
            </section>
          </AnimatedSection>

          {/* Technologies */}
          <AnimatedSection delay={0.1}>
            <section className="resume-section" id="tech">
              <SectionHeader label="Technologies" />
              <div className="tech-grid">
                {technologies.map((t, i) => (
                  <motion.span key={t} className="tech-pill" initial={reduced ? {} : { opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.1 }} transition={{ ...spring, delay: i * 0.02 }}>{t}</motion.span>
                ))}
              </div>
            </section>
          </AnimatedSection>

          {/* Projects */}
          <AnimatedSection delay={0.1}>
            <section className="resume-section" id="projects">
              <SectionHeader label="Projects" />
              <div className="projects-grid">
                {projects.map((p, i) => (
                  <motion.a key={p.name} className="project-card" href={p.link} target={p.link.startsWith('http') ? '_blank' : undefined} rel={p.link.startsWith('http') ? 'noopener noreferrer' : undefined} initial={reduced ? {} : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }} transition={{ ...spring, delay: i * 0.05 }} whileHover={reduced ? {} : { y: -4, transition: { duration: 0.2 } }}>
                    <div className="project-name">{p.name}</div>
                    <div className="project-desc">{p.desc}</div>
                    <div className="project-tags">{p.tags.map(t => <span key={t} className="project-tag">{t}</span>)}</div>
                  </motion.a>
                ))}
              </div>
            </section>
          </AnimatedSection>

          {/* Languages */}
          <AnimatedSection delay={0.1}>
            <section className="resume-section">
              <SectionHeader label="Languages" />
              <div className="languages-row">
                {languages.map(l => (<div key={l.name} className="language-card"><div className="language-name">{l.name}</div><div className="language-level">{l.level}</div></div>))}
              </div>
            </section>
          </AnimatedSection>

          {/* CTA */}
          <AnimatedSection delay={0.1}>
            <section className="resume-section resume-cta" id="contact">
              <SectionHeader label="Get In Touch" />
              <p className="cta-text">Interested in working together? I&apos;m available for freelance projects, internships, and full-time roles.</p>
              <div className="cta-buttons">
                <a href="mailto:ouazri.abdessalam01@gmail.com" className="cta-btn cta-btn-primary"><FaEnvelope size={13} style={{ marginRight: 8 }} /> Send Email</a>
                <a href="https://www.linkedin.com/in/abdessalam-ouazri-ab4938250/" target="_blank" rel="noopener noreferrer" className="cta-btn cta-btn-secondary"><FaLinkedin size={13} style={{ marginRight: 8 }} /> LinkedIn</a>
                <a href="https://github.com/wizli595" target="_blank" rel="noopener noreferrer" className="cta-btn cta-btn-secondary"><FaGithub size={13} style={{ marginRight: 8 }} /> GitHub</a>
              </div>
            </section>
          </AnimatedSection>
        </div>

        <footer className="resume-footer">wizli — built with Next.js, framer-motion, and too much coffee</footer>
      </motion.div>
    </>
  );
}
