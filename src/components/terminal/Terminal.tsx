import React, { useEffect, useRef, useState, useCallback } from "react";
import Banner from "./Banner";
import TerminalLines, { Line } from "./TerminalLines";
import CommandInput from "./CommandInput";

const DISPLAY_NAME = "wizli";

const commandsMap: Record<string, string> = {
  help: `Available commands:
  about        - Who I am
  skills       - My core skills
  technologies - Tools and platforms I use
  projects     - Some of my projects
  contact      - How to reach me
  clear        - Clear the terminal
  ls           - List files in the current directory
  pwd          - Print working directory
  whoami       - Show current user name
  cd           - Change directory (simple simulation)
  tree         - Show a small tree of files
  start        - Open the Windows canvas experience
`,
  about: `I'm abdessalam ouazri — an IT professional passionate about automation, efficient systems, and technology that makes sense.\nI enjoy building things that are both elegant and functional.`,
  skills: `Core skills:\n  CI/CD\n  DevOps\n  Linux\n  Windows Server\n  Virtualization\n  Bare metal servers\n  Basic networking\n  Basic scripting\n  Agile`,
  technologies: `Key technologies:\n  Docker\n  Jenkins\n  GitLab\n  Bitbucket\n  Ubuntu\n  Windows Server\n  VMware\n  Kubernetes`,
  projects: `Highlighted projects:\n  1. CI/CD and DevOps automation pipelines\n  2. Jenkins automation\n  3. Personal terminal portfolio site (this one!)\n  4. Tremolo guitar pedal with TL072 and JFET\n  5. Virtualization & server management projects`,
  contact: `You can reach me at:\n  email@example.com\n  https://yourdomain.com\n  https://linkedin.com/in/yourprofile\n  https://github.com/abdessalamouazri`,
  clear: "CLEAR",
};

const playSound = (src: string) => {
  try {
    const s = new Audio(src);
    s.volume = 0.5;
    s.play().catch(() => {});
  } catch {}
};

const Terminal: React.FC = () => {
  const [lines, setLines] = useState<Line[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [cwd, setCwd] = useState<string>("~/");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  const nextIdRef = useRef(1);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const typingRef = useRef<number | null>(null);

  const getId = () => nextIdRef.current++;

  useEffect(() => {
    let mounted = true;
    const duration = 2800;
    const tick = 60;
    const steps = Math.ceil(duration / tick);
    const inc = Math.ceil(100 / steps);

    playSound("/Sounds/ComputerBoot.mp3");

    const interval = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + inc);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (!mounted) return;
            playSound("/Sounds/ComputerBeep.mp3");
            setLoading(false);
          }, 300);
        }
        return next;
      });
    }, tick);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    });
  }, []);

  function escapeHtml(s: string) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  const typeLine = (text: string, speed = 8) => {
    setIsTyping(true);
    const outId = getId();
    setLines((s) => [...s, { id: outId, html: "" }]);
    let i = 0;
    let lastSoundTime = 0;
    const step = () => {
      i += 1;
      setLines((current) => current.map((l) => (l.id === outId ? { ...l, html: escapeHtml(text.slice(0, i)) } : l)));
      scrollToBottom();
      if (i < text.length) {
        const now = Date.now();
        if (now - lastSoundTime > 80) {
          playSound("/Sounds/KeyboardPressed.mp3");
          lastSoundTime = now;
        }
        typingRef.current = window.setTimeout(step, speed);
      } else {
        setIsTyping(false);
      }
    };
    step();
  };

  const getPrompt = () => `${DISPLAY_NAME}@archlinux:${cwd}$`;

  const printOutput = (cmd: string, output?: string) => {
    setLines((s) => [...s, { id: getId(), html: `<span class="prompt">${escapeHtml(getPrompt())}</span> ${escapeHtml(cmd)}` }]);
    if (output === "CLEAR") {
      nextIdRef.current = 1;
      setLines([]);
      return;
    }
    if (output === undefined) {
      setLines((s) => [...s, { id: getId(), html: `<span style="color:#ff6b6b">command not found:</span> ${escapeHtml(cmd)}` }]);
      scrollToBottom();
      return;
    }
    if (output === "") {
      scrollToBottom();
      return;
    }
    if (/<\/?[a-z][\s\S]*>/i.test(output)) {
      setLines((s) => [...s, { id: getId(), html: output }]);
      scrollToBottom();
      return;
    }
    typeLine(output);
  };

  const handleSubmit = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    setHistory((h) => [...h, cmd]);
    setHistoryIndex(-1);

    if (cmd === "clear") {
      printOutput(cmd, "CLEAR");
      playSound("/Sounds/ComputerBeep.mp3");
      return;
    }

    if (cmd === "whoami") {
      printOutput(cmd, DISPLAY_NAME);
      playSound("/Sounds/ComputerBeep.mp3");
      return;
    }

    if (cmd === "pwd") {
      printOutput(cmd, cwd);
      playSound("/Sounds/ComputerBeep.mp3");
      return;
    }

    if (cmd === "ls") {
      printOutput(cmd, "README.md\npublic\nsrc\npackage.json");
      playSound("/Sounds/ComputerBeep.mp3");
      return;
    }

    if (cmd.startsWith("cd ")) {
      const target = cmd.slice(3).trim();
      if (target === ".." || target === "/" || target === "~" || target === "~/") {
        setCwd("~/");
      } else {
        setCwd((prev) => {
          const base = prev.endsWith("/") ? prev : prev + "/";
          return base + target;
        });
      }
      printOutput(cmd, "");
      playSound("/Sounds/ComputerBeep.mp3");
      return;
    }

    if (cmd === "tree") {
      printOutput(cmd, `./\n├── src/\n├── public/\n└── package.json`);
      playSound("/Sounds/ComputerBeep.mp3");
      return;
    }

    if (cmd === "start") {
      printOutput(cmd, "Starting Windows canvas... (opening /windows)");
      playSound("/Sounds/ComputerBeep.mp3");
      setTimeout(() => { window.location.href = "/windows"; }, 250);
      return;
    }

    const val = commandsMap[cmd];
    if (!val) {
      printOutput(cmd, undefined);
      playSound("/Sounds/ComputerBeep.mp3");
      return;
    }
    printOutput(cmd, val);
    playSound("/Sounds/ComputerBeep.mp3");
  };

  const handleTab = (current: string) => {
    const trimmed = current.trim();
    if (!trimmed) return;
    const matches = Object.keys(commandsMap).filter((c) => c.startsWith(trimmed));
    if (matches.length === 1) {
      return matches[0];
    } else if (matches.length > 1) {
      printOutput(current, `Possible commands:\n  ${matches.join("\n  ")}`);
    }
    return undefined;
  };

  const historyUp = () => {
    if (history.length === 0) return undefined;
    const idx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
    setHistoryIndex(idx);
    return history[idx];
  };

  const historyDown = () => {
    if (history.length === 0) return undefined;
    if (historyIndex === -1) return undefined;
    if (historyIndex >= history.length - 1) {
      setHistoryIndex(-1);
      return "";
    }
    const idx = historyIndex + 1;
    setHistoryIndex(idx);
    return history[idx];
  };

  useEffect(() => {
    return () => {
      if (typingRef.current) clearTimeout(typingRef.current);
    };
  }, []);

  return (
    <div className="terminal-wrapper">
      <div className="terminal-centered">
        <div className="terminal-card">
          <div className="terminal-topbar" aria-hidden>
            <div className="terminal-dots">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
            </div>
            <div className="terminal-topbar-title">wizli@archlinux: {cwd}</div>
          </div>
          <div className="terminal-body" ref={bodyRef}>
            {loading ? (
              <div className="loader-overlay">
                <div className="loader-box">
                  <div className="loader-lines">{`██╗    ██╗██╗███████╗██╗     ██╗\n██║    ██║██║╚══███╔╝██║     ██║\n██║ █╗ ██║██║  ███╔╝ ██║     ██║\n██║███╗██║██║ ███╔╝  ██║     ██║\n╚███╔███╔╝██║███████╗███████╗██║\n ╚══╝╚══╝ ╚═╝╚══════╝╚══════╝╚═╝`}</div>
                  <div className="loader-progress">Booting — {progress}%</div>
                  <div className="loader-bar">
                    <div className="loader-bar-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Banner />
                <TerminalLines lines={lines} />
                <CommandInput
                  onSubmit={handleSubmit}
                  onTabComplete={handleTab}
                  onHistoryUp={historyUp}
                  onHistoryDown={historyDown}
                  disabled={isTyping}
                  prompt={getPrompt()}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terminal;
