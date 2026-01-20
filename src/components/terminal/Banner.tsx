import React from "react";

const ascii = `
██╗    ██╗██╗███████╗██╗     ██╗
██║    ██║██║╚══███╔╝██║     ██║
██║ █╗ ██║██║  ███╔╝ ██║     ██║
██║███╗██║██║ ███╔╝  ██║     ██║
╚███╔███╔╝██║███████╗███████╗██║
 ╚══╝╚══╝ ╚═╝╚══════╝╚══════╝╚═╝
`;

const Banner: React.FC = () => {
  return (
    <div className="banner-container">
      <pre className="banner-ascii">{ascii}</pre>
      <div className="banner-sub">wizli — terminal portfolio</div>
      <div className="banner-info">
        <div className="banner-line"><strong>abdessalam ouazri</strong> — Systems Engineer & DevOps</div>
        <div className="banner-line">Location: Remote • Based on Linux</div>
        <div className="banner-line">Email: hello@wizli.dev • GitHub: github.com/abdessalamouazri</div>
        <div className="banner-line">Type 'help' to list available commands</div>
      </div>
    </div>
  );
};

export default Banner;
