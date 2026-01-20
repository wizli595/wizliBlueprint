export interface Project {
  id: string;
  title: string;
  short: string;
  tech: string[];
  link?: string;
}

export const projects: Project[] = [
  {
    id: "portfolio",
    title: "Portfolio Website",
    short: "Interactive terminal portfolio built with React, TypeScript and xterm.",
    tech: ["React", "TypeScript", "Vite", "xterm"],
    link: "/",
  },
  {
    id: "ai-chatbot",
    title: "AI Chatbot",
    short: "Conversational AI assistant with deployable architecture.",
    tech: ["Node.js", "Python", "NLP"],
  },
  {
    id: "face-recognition",
    title: "Face Recognition App",
    short: "Prototype face recognition with WebRTC and ML models.",
    tech: ["React", "TensorFlow.js"],
  },
];
