import React, { useEffect, useRef, useState } from "react";
import "./HtmlTerminal.css";

type Line = { id: number; html: string };

const commandsMap: Record<string, string> = {
  help: `Available commands:\n  about        - Who I am\n  skills       - My core skills\n  technologies - Tools and platforms I use\n  projects     - Some of my projects\n  contact      - How to reach me\n  clear        - Clear the terminal`,
  about: `I'm Lynx6six — an IT professional passionate about automation, efficient systems, and technology that makes sense.\nI enjoy building things that are both elegant and functional.`,
  skills: `Core skills:\n  CI/CD\n  DevOps\n  Linux\n  Windows Server\n  Virtualization\n  Bare metal servers\n  Basic networking\n  Basic scripting\n  Agile`,
  technologies: `Key technologies:\n  Docker\n  Jenkins\n  GitLab\n  Bitbucket\n  Ubuntu\n  Windows Server\n  VMware\n  Kubernetes`,
  projects: `Highlighted projects:\n  1. CI/CD and DevOps automation pipelines\n  2. Jenkins automation\n  3. Personal terminal portfolio site (this one!)\n  4. Tremolo guitar pedal with TL072 and JFET\n  5. Virtualization & server management projects`,
  contact: `You can reach me at:\n  email@example.com\n  https://yourdomain.com\n  https://linkedin.com/in/yourprofile\n  https://github.com/lynx6six`,
  clear: "CLEAR",
};

let nextId = 1;

const BannerAscii = () => (
  <div className="banner banner-ascii">
    {` ______  ______   ______   __    __   __   __   __   ______   __           \n/\__  _\\/\  ___\ /\  == \ /\ "-./  \\ /\ \ /\ "-.\ \ /\  __ \\ /\ \          \n\/_/\ \\ /\ \  __\ \ \  __< \ \ \-./\ \\ \ \\ \ \-.  \\ \  __ \\ \ \____     \n   \ \_\ \ \_____\\ \_\ \_\\ \_\ \ \_\\ \_\\ \_\"\_\\ \_\ \_\\ \_____\    \n    \/_/  \/_____/ \/_/ /_/ \/_/  \/_/ \/_/ \/_/ \/_/ \/_/\/_/ \/_____/    \n ______  ______   ______  ______  ______  ______   __       __   ______    \n/\  == \\/\  __ \ /\  == \/\__  _\\/\  ___\\/\  __ \\ /\ \     /\ \ /\  __ \   \n\ \  _-/\ \ \/_/\\ \  __<\/_/\ \\/\ \  __\\ \ \/\ \\ \ \____\ \ \\ \ \/\ \  \n \ \_\   \ \_____\\ \_\ \_\ \ \_\ \ \_\   \ \_____\\ \_____\\ \_\\ \_____\ \n  \/_/    \/_____/ \/_/ /_/  \/_/  \/_/    \/_____/ \/_____/ \/_/ \/_____/ \n                                                                            \n    Welcome to my terminal portfolio!\n    Type 'help' to begin.`}
  </div>
);

const HtmlTerminal: React.FC = () => {
  const [lines, setLines] = useState<Line[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const terminalRef = useRef<HTMLDivElement | null>(null);

  const bootSound = useRef(new Audio("/Sounds/ComputerBoot.mp3")).current;
  const beepSound = useRef(new Audio("/Sounds/ComputerBeep.mp3")).current;
  const keypressSound = useRef(new Audio("/Sounds/KeyboardPressed.mp3")).current;

  useEffect(() => {
    // initial banners
    resetTerminal();
    // try playing boot sound
    bootSound.play().catch(() => {});
    // focus input
    inputRef.current?.focus();
  }, []);

  const resetTerminal = () => {
    nextId = 1;
    setLines([
      { id: nextId++, html: "" },
    ]);
    // append banners after tiny delay to allow CSS fade
    setTimeout(() => {
      setLines([
        { id: nextId++, html: getAsciiBannerHtml() },
        { id: nextId++, html: "" },
      ]);
      scrollToBottom();
    }, 50);
  };

  const getAsciiBannerHtml = () => {
    return (`<pre class=\"banner-ascii\">${escapeHtmlLong(`
 ______  ______   ______   __    __   __   __   __   ______   __           
/\__  _\\/\  ___\ /\  == \ /\ "-./  \\ /\ \ /\ "-.\ \ /\  __ \\ /\ \          
\/_/\ \\ /\ \  __\ \ \  __< \ \ \-./\ \\ \ \\ \ \-.  \\ \  __ \\ \ \____     
   \ \_\ \ \_____\\ \_\ \_\\ \_\ \ \_\\ \_\\ \_\"\_\\ \_\ \_\\ \_____\    
    \/_/  \/_____/ \/_/ /_/ \/_/  \/_/ \/_/ \/_/ \/_/ \/_/\/_/ \/_____/    
 ______  ______   ______  ______  ______  ______   __       __   ______    
/\  == \\/\  __ \ /\  == \/\__  _\\/\  ___\\/\  __ \\ /\ \     /\ \ /\  __ \   
\ \  _-/\ \ \/\ \\ \  __<\/_/\ \\/\ \  __\\ \ \/\ \\ \ \____\ \ \\ \ \/\ \  
 \ \_\   \ \_____\\ \_\ \_\ \ \_\ \ \_\   \ \_____\\ \_____\\ \_\\ \_____\ 
  \/_/    \/_____/ \/_/ /_/  \/_/  \/_/    \/_____/ \/_____/ \/_/ \/_____/ 
                                                                            
    Welcome to my terminal portfolio!
    Type 'help' to begin.
`)}</pre>`);
  };

  function escapeHtmlLong(s: string) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      if (terminalRef.current) terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    });
  };

  const printOutput = (cmd: string, output?: string) => {
    // push command line
    setLines((s) => [...s, { id: nextId++, html: `<span class=\"prompt\">&gt;</span> ${escapeHtml(cmd)}` }]);
    if (output === "CLEAR") {
      resetTerminal();
      return;
    }

    if (!output) {
      setLines((s) => [...s, { id: nextId++, html: `Command not found: ${escapeHtml(cmd)}` }]);
      scrollToBottom();
      return;
    }

    // if output contains HTML-like tags, print raw
    if (/<\/?[a-z][\s\S]*>/i.test(output)) {
      setLines((s) => [...s, { id: nextId++, html: output }]);
      scrollToBottom();
      return;
    }

    // otherwise type the output
    typeLine(output);
  };

  function escapeHtml(s: string) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

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
        try {
          keypressSound.play().catch(() => {});
        } catch {}
        setTimeout(step, speed);
      } else {
        setIsTyping(false);
      }
    };
    step();
  };

  useEffect(() => {
    // focus input when not typing
    if (!isTyping) inputRef.current?.focus();
  }, [isTyping]);

  const handleEnter = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    setHistory((h) => [...h, cmd]);
    setHistoryIndex(-1);
    const val = commandsMap[cmd];
    if (val === "CLEAR") {
      printOutput(cmd, "CLEAR");
      try { beepSound.play().catch(() => {}); } catch {}
      return;
    }
    printOutput(cmd, val ?? undefined);
    try { beepSound.play().catch(() => {}); } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isTyping) return;
    if (e.key === "Enter") {
      const v = inputRef.current?.value ?? "";
      handleEnter(v);
      if (inputRef.current) inputRef.current.value = "";
      e.preventDefault();
    }
    if (e.key === "ArrowUp") {
      if (history.length === 0) return;
      const idx = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(idx);
      if (inputRef.current) inputRef.current.value = history[idx] ?? "";
      e.preventDefault();
    }
    if (e.key === "ArrowDown") {
      if (history.length === 0) return;
      if (historyIndex === -1) return;
      const idx = Math.min(history.length - 1, historyIndex + 1);
      setHistoryIndex(idx === history.length - 1 ? -1 : idx);
      if (inputRef.current) inputRef.current.value = idx === -1 ? "" : history[idx] ?? "";
      e.preventDefault();
    }
    if (e.key === "Tab") {
      e.preventDefault();
      const current = inputRef.current?.value.trim() ?? "";
      if (!current) return;
      const matches = Object.keys(commandsMap).filter((c) => c.startsWith(current));
      if (matches.length === 1) {
        if (inputRef.current) inputRef.current.value = matches[0];
      } else if (matches.length > 1) {
        printOutput(current, `Possible commands:\n  ${matches.join("\n  ")}`);
      }
    }
  };

  return (
    <div className="html-terminal" ref={terminalRef}>
      <div className="banner banner-ascii" dangerouslySetInnerHTML={{ __html: getAsciiBannerHtml() }} />

      <div className="lines">
        {lines.map((l) => (
          <div key={l.id} className="typed-line" dangerouslySetInnerHTML={{ __html: l.html }} />
        ))}
      </div>

      <div className="input-row">
        <span className="prompt">&gt;</span>
        <input
          id="commandInput"
          ref={inputRef}
          autoFocus
          autoComplete="off"
          spellCheck={false}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

export default HtmlTerminal;
