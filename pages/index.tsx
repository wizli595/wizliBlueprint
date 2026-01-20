import { Router, useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

export default function Home() {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [terminalLines, setTerminalLines] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const router = useRouter();

  useEffect(() => {
    const lines = [
      '$ systemctl status wizli.service',
      '● wizli.service - Environment Selector',
      '   Loaded: loaded (/usr/lib/systemd/system/wizli.service)',
      '   Active: active (running)',
      '$ ps aux | grep wizli',
      'root  1247  0.0  0.1  choosing environment...',
    ];
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < lines.length) {
        setTerminalLines(prev => [...prev, lines[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleNavigation = (path: string) => {
    console.log(`Navigating to ${path}`);
    router.push(path);
  };

  return (
    <div style={styles.container}>
      <div 
        style={{
          ...styles.gradient,
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(45, 140, 240, 0.05), transparent 80%)`
        }}
      />
      
      <div style={styles.scanlines} />
      
      <div style={styles.terminal}>
        {terminalLines.map((line, i) => (
          <div key={i} style={styles.terminalLine}>
            <span style={styles.prompt}>{(typeof line === 'string' && line.startsWith('$')) ? '' : ''}</span>
            {line}
          </div>
        ))}
        <div style={styles.cursor}>_</div>
      </div>

      <div style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoText}>wizli</span>
          <span style={styles.version}>v2.1.4</span>
        </div>
        <div style={styles.subtitle}>// SELECT ENVIRONMENT</div>
      </div>

      <main style={styles.main}>
        <div style={styles.buttonContainer}>
          <button
            aria-label="Windows"
            onClick={() => handleNavigation('/windows')}
            onMouseEnter={() => setHoveredButton('windows')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              ...bubbleStyle('#2d8cf0', hoveredButton === 'windows'),
              animation: 'float 6s ease-in-out infinite'
            }}
          >
            <div style={styles.icon}>⊞</div>
            <div style={styles.buttonText}>Windows</div>
            <div style={styles.subtitle2}>NT Kernel</div>
            {hoveredButton === 'windows' && (
              <div style={glowEffect('#2d8cf0')} />
            )}
          </button>

          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <div style={styles.dividerText}>OR</div>
            <div style={styles.dividerLine} />
          </div>

          <button
            aria-label="Linux"
            onClick={() => handleNavigation('/terminal')}
            onMouseEnter={() => setHoveredButton('linux')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              ...bubbleStyle('#8be04b', hoveredButton === 'linux'),
              animation: 'float 6s ease-in-out infinite 3s'
            }}
          >
            <div style={styles.icon}>$</div>
            <div style={styles.buttonText}>Linux</div>
            <div style={styles.subtitle2}>GNU/Linux</div>
            {hoveredButton === 'linux' && (
              <div style={glowEffect('#8be04b')} />
            )}
          </button>

          <div style={styles.divider}>
            <div style={styles.dividerLine} />
            <div style={styles.dividerText}>OR</div>
            <div style={styles.dividerLine} />
          </div>

          <button
            aria-label="Resume"
            onClick={() => handleNavigation('/resume')}
            onMouseEnter={() => setHoveredButton('resume')}
            onMouseLeave={() => setHoveredButton(null)}
            style={{
              ...bubbleStyle('#f59e0b', hoveredButton === 'resume'),
              animation: 'float 6s ease-in-out infinite 6s'
            }}
          >
            <div style={styles.icon}>📄</div>
            <div style={styles.buttonText}>Resume</div>
            <div style={styles.subtitle2}>Profile</div>
            {hoveredButton === 'resume' && (
              <div style={glowEffect('#f59e0b')} />
            )}
          </button>
        </div>

        <div style={styles.systemInfo}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>ARCH:</span> x86_64
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>UPTIME:</span> 99.9%
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>STATUS:</span> <span style={styles.statusOnline}>● ONLINE</span>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        @keyframes glowPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

const bubbleStyle = (bg: string, isHovered: boolean): React.CSSProperties => ({
  position: 'relative' as const,
  width: 260,
  height: 260,
  borderRadius: 999,
  border: '2px solid rgba(255,255,255,0.08)',
  display: 'flex' as const,
  flexDirection: 'column' as const,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  gap: 8,
  background: `radial-gradient(circle at 30% 20%, rgba(255,255,255,0.12), transparent 70%), ${bg}`,
  color: '#071018',
  cursor: 'pointer',
  boxShadow: isHovered
    ? `0 12px 40px rgba(0,0,0,0.7), inset 0 -6px 20px rgba(0,0,0,0.3), 0 0 40px ${bg}40`
    : '0 8px 30px rgba(0,0,0,0.6), inset 0 -6px 20px rgba(0,0,0,0.2)',
  transform: isHovered ? 'scale(1.05)' : 'scale(1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden' as const,
});

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'relative',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(180deg, #07070a 0%, #0f1724 50%, #0a1420 100%)',
    fontFamily: '"JetBrains Mono", "Fira Code", "Courier New", monospace',
    overflow: 'hidden',
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    transition: 'background 0.1s',
  },
  scanlines: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px)',
    pointerEvents: 'none',
    opacity: 0.3,
  },
  terminal: {
    position: 'absolute',
    top: 20,
    left: 20,
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#4ade80',
    lineHeight: 1.6,
    opacity: 0.4,
    maxWidth: 400,
  },
  terminalLine: {
    marginBottom: 2,
  },
  prompt: {
    color: '#2d8cf0',
    marginRight: 8,
  },
  cursor: {
    display: 'inline-block',
    animation: 'blink 1s infinite',
    color: '#4ade80',
  },
  header: {
    position: 'absolute',
    top: '15%',
    textAlign: 'center',
  },
  logo: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 12,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 48,
    fontWeight: 700,
    background: 'linear-gradient(135deg, #2d8cf0 0%, #8be04b 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: -2,
  },
  version: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: 400,
  },
  subtitle: {
    fontSize: 13,
    color: '#6b7280',
    letterSpacing: 3,
    fontWeight: 500,
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 40,
    zIndex: 1,
  },
  buttonContainer: {
    display: 'flex',
    gap: 60,
    alignItems: 'center',
  },
  icon: {
    fontSize: 48,
    marginBottom: 8,
    opacity: 0.9,
  },
  buttonText: {
    fontSize: 26,
    fontWeight: 700,
    letterSpacing: -0.5,
  },
  subtitle2: {
    fontSize: 11,
    opacity: 0.7,
    fontWeight: 400,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    color: '#374151',
  },
  dividerLine: {
    width: 40,
    height: 1,
    background: 'linear-gradient(90deg, transparent, #374151, transparent)',
  },
  dividerText: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 2,
  },
  systemInfo: {
    display: 'flex',
    gap: 32,
    fontSize: 11,
    color: '#6b7280',
    fontFamily: 'monospace',
  },
  infoItem: {
    display: 'flex',
    gap: 6,
  },
  infoLabel: {
    color: '#4ade80',
    fontWeight: 600,
  },
  statusOnline: {
    color: '#4ade80',
  },
};

// helper to render a pulsing glow for hovered bubbles
const glowEffect = (color: string): React.CSSProperties => ({
  position: 'absolute',
  inset: 0,
  borderRadius: '50%',
  boxShadow: `0 0 80px ${color}`,
  opacity: 0.28,
  animation: 'glowPulse 2.5s ease-in-out infinite',
  pointerEvents: 'none',
});