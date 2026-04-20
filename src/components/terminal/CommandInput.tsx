import React from "react";

interface Props {
  onSubmit: (value: string) => void;
  onTabComplete: (current: string) => string | undefined;
  onHistoryUp: () => string | undefined;
  onHistoryDown: () => string | undefined;
  disabled?: boolean;
  prompt: string;
}

const CommandInput: React.FC<Props> = ({ onSubmit, onTabComplete, onHistoryUp, onHistoryDown, disabled, prompt }) => {
  const ref = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (!disabled) ref.current?.focus();
  }, [disabled]);

  return (
    <div className="input-row">
      <span className="prompt">{prompt}</span>
      <input
        ref={ref}
        id="commandInput"
        autoFocus
        autoComplete="off"
        spellCheck={false}
        disabled={disabled}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === "Enter") {
            const v = ref.current?.value ?? "";
            onSubmit(v);
            if (ref.current) ref.current.value = "";
            e.preventDefault();
          } else if (e.key === "Tab") {
            e.preventDefault();
            const completed = onTabComplete(ref.current?.value ?? "");
            if (completed !== undefined && ref.current) {
              ref.current.value = completed;
            }
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            const v = onHistoryUp();
            if (v !== undefined && ref.current) ref.current.value = v;
          } else if (e.key === "ArrowDown") {
            e.preventDefault();
            const v = onHistoryDown();
            if (ref.current) ref.current.value = v ?? "";
          }
        }}
      />
    </div>
  );
};

export default CommandInput;
