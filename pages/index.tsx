import { useRouter } from 'next/router';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { FaWindows, FaLinux, FaFileAlt } from 'react-icons/fa';

const playSound = (src: string, vol = 0.4) => {
  try { const s = new Audio(src); s.volume = vol; s.play().catch(() => {}); } catch {}
};

const envs = [
  { id: 'windows', label: 'Windows', sub: '3D Canvas', path: '/windows', color: '#2d8cf0', Icon: FaWindows },
  { id: 'linux', label: 'Linux', sub: 'Terminal', path: '/terminal', color: '#8be04b', Icon: FaLinux },
  { id: 'resume', label: 'Resume', sub: 'Profile', path: '/resume', color: '#f59e0b', Icon: FaFileAlt },
];

const TERM_LINES = [
  '$ systemctl status wizli.service',
  '● wizli.service - Environment Selector',
  '   Loaded: loaded (/usr/lib/systemd/system/wizli.service)',
  '   Active: active (running)',
  '$ ps aux | grep wizli',
  'root  1247  0.0  0.1  choosing environment...',
];

const BOOT_ASCII = `██╗    ██╗██╗███████╗██╗     ██╗
██║    ██║██║╚══███╔╝██║     ██║
██║ █╗ ██║██║  ███╔╝ ██║     ██║
██║███╗██║██║ ███╔╝  ██║     ██║
╚███╔███╔╝██║███████╗███████╗██║
 ╚══╝╚══╝ ╚═╝╚══════╝╚══════╝╚═╝`;

// Particles with deterministic positions (no Math.random during render)
const PARTICLES = Array.from({ length: 30 }, (_, i) => ({
  left: `${(i * 3.3 + 7) % 100}%`,
  duration: `${14 + (i % 7) * 3}s`,
  delay: `${-(i * 1.3)}s`,
  opacity: 0.12 + (i % 5) * 0.06,
  size: `${1 + (i % 3)}px`,
}));

export default function Home() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [termLines, setTermLines] = useState<string[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [clock, setClock] = useState('');
  const [navigating, setNavigating] = useState<string | null>(null);
  const [booting, setBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const router = useRouter();
  const rafRef = useRef<number | null>(null);
  const bootPlayed = useRef(false);
  const reducedMotion = useReducedMotion();

  const springBouncy = { type: 'spring' as const, stiffness: 260, damping: 20 };
  const springGentle = { type: 'spring' as const, stiffness: 120, damping: 14 };

  // Boot sequence
  useEffect(() => {
    const play = () => {
      if (bootPlayed.current) return;
      bootPlayed.current = true;
      playSound('/Sounds/ComputerBoot.mp3', 0.4);
      window.removeEventListener('click', play);
      window.removeEventListener('keydown', play);
    };
    play();
    window.addEventListener('click', play);
    window.addEventListener('keydown', play);

    // Animate boot progress
    const duration = 2200;
    const tick = 40;
    const inc = Math.ceil(100 / (duration / tick));
    const iv = setInterval(() => {
      setBootProgress(p => {
        const next = Math.min(100, p + inc);
        if (next >= 100) {
          clearInterval(iv);
          setTimeout(() => {
            playSound('/Sounds/ComputerBeep.mp3', 0.3);
            setBooting(false);
          }, 400);
        }
        return next;
      });
    }, tick);

    return () => {
      clearInterval(iv);
      window.removeEventListener('click', play);
      window.removeEventListener('keydown', play);
    };
  }, []);

  // Terminal lines (after boot)
  useEffect(() => {
    if (booting) return;
    setTermLines([]);
    let i = 0;
    const iv = setInterval(() => {
      if (i >= TERM_LINES.length) { clearInterval(iv); return; }
      const l = TERM_LINES[i]; i++;
      setTermLines(prev => [...prev, l]);
    }, 400);
    return () => clearInterval(iv);
  }, [booting]);

  // Clock (client-only)
  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleTimeString('en-US', { hour12: false }));
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  // Mouse glow
  const onMouseMove = useCallback((e: MouseEvent) => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      setMousePos({ x: e.clientX, y: e.clientY });
      rafRef.current = null;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    return () => { window.removeEventListener('mousemove', onMouseMove); if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [onMouseMove]);

  const navigate = (path: string, id: string) => {
    playSound('/Sounds/ComputerBeep.mp3', 0.5);
    setNavigating(id);
    setTimeout(() => router.push(path), 600);
  };

  const onHover = (id: string | null) => {
    if (id && id !== hovered) playSound('/Sounds/KeyboardPressed.mp3', 0.15);
    setHovered(id);
  };

  return (
    <div className="root-container">
      {/* ── Boot overlay ── */}
      <AnimatePresence>
        {booting && (
          <motion.div
            className="boot-overlay"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          >
            <motion.div
              className="boot-inner"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={springGentle}
            >
              <div className="boot-ascii">{BOOT_ASCII}</div>
              <div className="boot-text">Booting wizli-os... {bootProgress}%</div>
              <div className="boot-bar">
                <motion.div
                  className="boot-bar-fill"
                  animate={{ width: `${bootProgress}%` }}
                  transition={{ duration: 0.04, ease: 'linear' }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Particles */}
      <div className="particles">
        {PARTICLES.map((p, i) => (
          <div key={i} className="particle" style={{
            left: p.left,
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: p.opacity,
            width: p.size, height: p.size,
          }} />
        ))}
      </div>

      {/* Mouse glow */}
      <div className="mouse-glow" style={{
        background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(45,140,240,0.07), transparent 80%)`
      }} />
      <div className="scanlines" />

      {/* Background terminal */}
      {!booting && (
        <motion.div
          className="bg-terminal"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 0.3, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
        >
          {termLines.map((line, i) => (
            <motion.div
              key={i}
              className="term-line"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              {line.startsWith('$')
                ? <><span className="term-prompt">$</span>{line.slice(1)}</>
                : line}
            </motion.div>
          ))}
          <span className="term-cursor">_</span>
        </motion.div>
      )}

      {/* Header */}
      {!booting && (
        <motion.div
          className="header"
          initial={{ opacity: 0, y: 30, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...springGentle, delay: 0.1 }}
        >
          <div className="logo-row">
            <motion.h1
              className="logo-text"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ ...springBouncy, delay: 0.15 }}
            >
              wizli
            </motion.h1>
            <motion.span
              className="version"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              v2.1.4
            </motion.span>
          </div>
          <motion.div
            className="subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            // SELECT ENVIRONMENT
          </motion.div>
        </motion.div>
      )}

      {/* Bubbles */}
      {!booting && (
        <main className="main-content">
          <div className="bubble-row">
            {envs.map((env, idx) => (
              <React.Fragment key={env.id}>
                {idx > 0 && (
                  <motion.div
                    className="divider"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
                  >
                    <div className="divider-line" />
                    <div className="divider-text">OR</div>
                    <div className="divider-line" />
                  </motion.div>
                )}
                <motion.button
                  className={`bubble ${navigating === env.id ? 'selected' : ''} ${navigating && navigating !== env.id ? 'dimmed' : ''}`}
                  aria-label={`${env.label} — ${env.sub}`}
                  onClick={() => navigate(env.path, env.id)}
                  onMouseEnter={() => onHover(env.id)}
                  onMouseLeave={() => onHover(null)}
                  onFocus={() => onHover(env.id)}
                  onBlur={() => onHover(null)}
                  style={{ '--bubble-color': env.color } as React.CSSProperties}
                  initial={{ opacity: 0, y: 80, scale: 0.5 }}
                  animate={
                    navigating === env.id
                      ? { opacity: 1, y: 0, scale: 1.25 }
                      : navigating && navigating !== env.id
                      ? { opacity: 0.12, y: 0, scale: 0.85 }
                      : { opacity: 1, y: 0, scale: 1 }
                  }
                  transition={
                    navigating
                      ? { ...springGentle, delay: 0 }
                      : { ...springBouncy, delay: 0.3 + idx * 0.15 }
                  }
                  whileHover={
                    reducedMotion || navigating
                      ? {}
                      : { scale: 1.12, y: -8, transition: springBouncy }
                  }
                  whileTap={navigating ? {} : { scale: 0.95, transition: { duration: 0.1 } }}
                >
                  <motion.div
                    className="bubble-icon-wrap"
                    animate={
                      hovered === env.id && !navigating
                        ? { scale: 1.15, y: -3 }
                        : { scale: 1, y: 0 }
                    }
                    transition={springBouncy}
                  >
                    <env.Icon className="bubble-icon" />
                  </motion.div>
                  <div className="bubble-label">{env.label}</div>
                  <div className="bubble-sub">{env.sub}</div>
                  <motion.div
                    className="bubble-ring"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    style={{ opacity: hovered === env.id ? 1 : 0 }}
                  />
                  <motion.div
                    className="bubble-glow"
                    animate={{
                      opacity: navigating === env.id ? 0.5 : hovered === env.id ? 0.25 : 0,
                      scale: navigating === env.id ? 1.5 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </React.Fragment>
            ))}
          </div>

          <motion.div
            className="sys-info"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: 'easeOut' }}
          >
            <span><span className="info-label">ARCH:</span> x86_64</span>
            <span><span className="info-label">UPTIME:</span> 99.9%</span>
            {clock && <span><span className="info-label">TIME:</span> {clock}</span>}
            <span><span className="info-label">STATUS:</span> <span className="status-on">● ONLINE</span></span>
          </motion.div>
        </main>
      )}
    </div>
  );
}
