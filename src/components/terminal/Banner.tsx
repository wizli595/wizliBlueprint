import React from "react";

const ascii = `██╗    ██╗██╗███████╗██╗     ██╗
██║    ██║██║╚══███╔╝██║     ██║
██║ █╗ ██║██║  ███╔╝ ██║     ██║
██║███╗██║██║ ███╔╝  ██║     ██║
╚███╔███╔╝██║███████╗███████╗██║
 ╚══╝╚══╝ ╚═╝╚══════╝╚══════╝╚═╝`;

const Banner: React.FC = () => {
  return (
    <div className="banner-container">
      <pre className="banner-ascii">{ascii}</pre>
      <div className="banner-sub">terminal portfolio</div>
      <div className="banner-info">
        <div className="banner-line"><strong>abdessalam ouazri</strong> — Systems Engineer &amp; DevOps</div>
        <div className="banner-line">Location: Remote &bull; Based on Linux</div>
        <div className="banner-line">Email: hello@wizli.dev &bull; GitHub: github.com/wizli595</div>
        <div className="banner-line" style={{ marginTop: 6, color: 'rgba(255,255,255,0.4)' }}>Type &apos;help&apos; to list available commands</div>
      </div>
    </div>
  );
};

export default Banner;
