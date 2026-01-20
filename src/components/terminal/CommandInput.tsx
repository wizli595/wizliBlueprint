import React from "react";

interface Props {
  onSubmit: (value: string) => void;
  onTabComplete: (current: string) => void;
  onHistoryUp: () => string | undefined;
  onHistoryDown: () => string | undefined;
  disabled?: boolean;
}

const CommandInput: React.FC<Props> = ({ onSubmit, onTabComplete, onHistoryUp, onHistoryDown, disabled }) => {
  const ref = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <div className="input-row">
      <span className="prompt">wizli@archlinux:~$</span>
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
            onTabComplete(ref.current?.value ?? "");
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
