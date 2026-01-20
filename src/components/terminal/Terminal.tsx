import React, { useEffect, useRef, useState } from "react";
import Banner from "./Banner";
import TerminalLines, { Line } from "./TerminalLines";
import CommandInput from "./CommandInput";
// default display name (replace with actual name when provided)
const DISPLAY_NAME = "WIZLI";

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
  soundcheck   - Run a quick audio playback test
`,
  about: `I'm abdessalam ouazri — an IT professional passionate about automation, efficient systems, and technology that makes sense.\nI enjoy building things that are both elegant and functional.`,
  skills: `Core skills:\n  CI/CD\n  DevOps\n  Linux\n  Windows Server\n  Virtualization\n  Bare metal servers\n  Basic networking\n  Basic scripting\n  Agile`,
  technologies: `Key technologies:\n  Docker\n  Jenkins\n  GitLab\n  Bitbucket\n  Ubuntu\n  Windows Server\n  VMware\n  Kubernetes`,
  projects: `Highlighted projects:\n  1. CI/CD and DevOps automation pipelines\n  2. Jenkins automation\n  3. Personal terminal portfolio site (this one!)\n  4. Tremolo guitar pedal with TL072 and JFET\n  5. Virtualization & server management projects`,
  contact: `You can reach me at:\n  email@example.com\n  https://yourdomain.com\n  https://linkedin.com/in/yourprofile\n  https://github.com/abdessalamouazri`,
  clear: "CLEAR",
};

let nextId = 1;

const Terminal: React.FC = () => {
  const [lines, setLines] = useState<Line[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const [cwd, setCwd] = useState<string>("~/");

  const terminalRef = useRef<HTMLDivElement | null>(null);
  const bootSound = useRef(new Audio("/Sounds/ComputerBoot.mp3")).current;
  const beepSound = useRef(new Audio("/Sounds/ComputerBeep.mp3")).current;
  const keypressSound = useRef(new Audio("/Sounds/KeyboardPressed.mp3")).current;

  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // run loader, play boot sound and animate progress
    let mounted = true;
    const duration = 2200; // ms
    const tick = 50;
    const steps = Math.ceil(duration / tick);
    const inc = Math.ceil(100 / steps);

    try { bootSound.play().catch(() => {}); } catch {}

    const interval = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + inc);
        if (next >= 100) {
          clearInterval(interval);
          // small delay to show complete
          setTimeout(() => {
            if (!mounted) return;
            setLoading(false);
            // now initialize terminal content
            resetTerminal();
          }, 220);
        }
        return next;
      });
    }, tick);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const resetTerminal = () => {
    nextId = 1;
    setLines([]);
    setTimeout(() => scrollToBottom(), 50);
  };

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    });
  };

  const getAsciiBannerHtml = () => {
    const ascii = `\n ______  ______   ______   __    __   __   __   __   ______   __           \n/\\__  _\\/\\  ___\\ /\\  == \\ /\\ \"-./  \\ \\ /\\ \\ \"-.\\ \\ /\\  __ \\ \\ /\\ \\          \n\\/_/\\ \\ /\\ \\  __\\ \\ \\  __< \\ \\ \\-./\\ \\\\ \\ \\-.  \\\\ \\  __ \\\\ \\ \\____     \n   \\ \\_\\ \\ \\_____\\\\ \\_\\ \\_\\\\ \\_\\ \\ \\"\\_\\\\ \\_\\ \\_\\ \\\\_____\\    \n    \/_/  \/_____/ \/_/ /_/ \/_/  \/_/ \/_/ \/_/ \/_/ \/_/\\/_/ \/_____/    \n ______  ______   ______  ______  ______  ______   __       __   ______    \n/\\  == \\\/\\  __ \\ /\\  == \\\/\\__  _\\/\\  ___\\/\\  __ \\\\ /\\ \\     /\\ \\ /\\  __ \\   \n\\ \\  _-/\\ \\ \/\\ \\\\ \\  __<\\/_/\\ \\ \\\/\\ \\  __\\\\ \\ \\ \\____\\ \\ \\\\ \\ \/\\ \\  \n \\ \\_\\   \\ \\_____\\\\ \\_\\ \\_\\ \\ \\_\\ \\ \\_____\\\\ \\_____\\\\ \\_\\\\ \\_____\\ \n  \/_/    \/_____/ \/_/ /_/  \/_/  \/_/    \/_____/ \/_____/ \/_/ \/_____/ \n                                                                            \n    Welcome to my terminal portfolio!\n    Type 'help' to begin.`;
    return `<pre class=\"banner-ascii\">${ascii}</pre>`;
  };

  const typeLine = (text: string, speed = 8) => {
    setIsTyping(true);
    const outId = nextId++;
    setLines((s) => [...s, { id: outId, html: "" }]);
    let i = 0;
    const step = () => {
      setLines((current) => current.map((l) => (l.id === outId ? { ...l, html: escapeHtml(text.slice(0, i)) } : l)));
      scrollToBottom();
      if (i < text.length) {
        i += 1;
        try { keypressSound.play().catch(() => {}); } catch {}
        setTimeout(step, speed);
      } else {
        setIsTyping(false);
      }
    };
    step();
  };

  function escapeHtml(s: string) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  const ZSH_PROMPT = `${DISPLAY_NAME}@archlinux:~$`;

  const printOutput = (cmd: string, output?: string) => {
    // command echo (zsh-style)
    setLines((s) => [...s, { id: nextId++, html: `<span class=\"prompt\">${ZSH_PROMPT}</span> ${escapeHtml(cmd)}` }]);
    if (output === "CLEAR") {
      resetTerminal();
      return;
    }
    if (!output) {
      setLines((s) => [...s, { id: nextId++, html: `Command not found: ${escapeHtml(cmd)}` }]);
      scrollToBottom();
      return;
    }
    if (/<\/?[a-z][\s\S]*>/i.test(output)) {
      setLines((s) => [...s, { id: nextId++, html: output }]);
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
    // simple command parsing & handlers
    if (cmd === "clear") {
      printOutput(cmd, "CLEAR");
      try { beepSound.play().catch(() => {}); } catch {}
      return;
    }

    if (cmd === "whoami") {
      printOutput(cmd, DISPLAY_NAME);
      try { beepSound.play().catch(() => {}); } catch {}
      return;
    }

    if (cmd === "pwd") {
      printOutput(cmd, cwd);
      try { beepSound.play().catch(() => {}); } catch {}
      return;
    }

    if (cmd === "ls") {
      // static demo listing
      printOutput(cmd, "README.md\npublic\nsrc\npackage.json");
      try { beepSound.play().catch(() => {}); } catch {}
      return;
    }

    if (cmd.startsWith("cd ")) {
      const target = cmd.slice(3).trim();
      // very small simulated filesystem behaviour
      if (target === "..") {
        setCwd("~/");
        printOutput(cmd, "");
      } else if (target === "/" || target === "~/") {
        setCwd("~/");
        printOutput(cmd, "");
      } else {
        setCwd((prev) => (prev === "~/" ? `~/${target}` : `~/${target}`));
        printOutput(cmd, "");
      }
      try { beepSound.play().catch(() => {}); } catch {}
      return;
    }

    if (cmd === "tree") {
      printOutput(cmd, `./\n├─ src/\n├─ public/\n└─ package.json`);
      try { beepSound.play().catch(() => {}); } catch {}
      return;
    }

    if (cmd === "start") {
      printOutput(cmd, "Starting Windows canvas... (opening /windows)");
      try { beepSound.play().catch(() => {}); } catch {}
      // navigate user to windows page
      setTimeout(() => { window.location.href = "/windows"; }, 250);
      return;
    }

    if (cmd === "soundcheck") {
      printOutput(cmd, "Attempting to play keypress sound...");
      try {
        keypressSound.play().then(() => {
          setTimeout(() => {
            setLines((s) => [...s, { id: nextId++, html: `Keypress sound played successfully.` }]);
            scrollToBottom();
          }, 200);
        }).catch(() => {
          setLines((s) => [...s, { id: nextId++, html: `Playback blocked — user interaction required.` }]);
          scrollToBottom();
        });
      } catch {
        setLines((s) => [...s, { id: nextId++, html: `Playback failed.` }]);
        scrollToBottom();
      }
      return;
    }

    // fallback to commands map for static outputs
    const val = commandsMap[cmd];
    if (!val) {
      printOutput(cmd, undefined);
      try { beepSound.play().catch(() => {}); } catch {}
      return;
    }
    // handle help multiline mapping
    printOutput(cmd, val);
    try { beepSound.play().catch(() => {}); } catch {}
  };

  const handleTab = (current: string) => {
    const matches = Object.keys(commandsMap).filter((c) => c.startsWith(current.trim()));
    if (matches.length === 1) {
      // instruct the input to replace value via a small custom event
      const evt = new CustomEvent("terminal-tab", { detail: matches[0] });
      window.dispatchEvent(evt);
    } else if (matches.length > 1) {
      printOutput(current, `Possible commands:\n  ${matches.join("\n  ")}`);
    }
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
    const idx = Math.min(history.length - 1, historyIndex + 1);
    setHistoryIndex(idx === history.length - 1 ? -1 : idx);
    return idx === -1 ? undefined : history[idx];
  };

  return (
    <div className="terminal-wrapper">
      <div className="terminal-centered">
        <div className="terminal-card" ref={terminalRef}>
          <div className="terminal-topbar" aria-hidden>
            <div className="terminal-dots">
              <span className="dot dot-red" />
              <span className="dot dot-yellow" />
              <span className="dot dot-green" />
            </div>
          </div>
          <Banner />
          {loading && (
            <div className="loader-overlay">
              <div className="loader-box">
                <div className="loader-lines">{`██╗    ██╗██╗███████╗██╗     ██╗\n██║    ██║██║╚══███╔╝██║     ██║\n██║ █╗ ██║██║  ███╔╝ ██║     ██║\n██║███╗██║██║ ███╔╝  ██║     ██║\n╚███╔███╔╝██║███████╗███████╗██║\n ╚══╝╚══╝ ╚═╝╚══════╝╚══════╝╚═╝`}</div>
                <div className="loader-progress">Loading — {progress}%</div>
              </div>
            </div>
          )}

          <TerminalLines lines={lines} />
          <CommandInput onSubmit={handleSubmit} onTabComplete={handleTab} onHistoryUp={historyUp} onHistoryDown={historyDown} disabled={isTyping || loading} />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
