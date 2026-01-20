import React from "react";

export type Line = { id: number; html: string };

const TerminalLines: React.FC<{ lines: Line[] }> = ({ lines }) => {
  return (
    <div className="lines" aria-live="polite">
      {lines.map((l) => (
        <div key={l.id} className="typed-line" dangerouslySetInnerHTML={{ __html: l.html }} />
      ))}
    </div>
  );
};

export default TerminalLines;
