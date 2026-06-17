"use client";

import { useEffect, useRef, TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  /** Minimum visible rows before the box starts growing */
  minRows?: number;
};

/**
 * A textarea that grows to fit its content automatically.
 * No manual resize handle, no inner scrollbar — height tracks the text.
 */
export default function AutoGrowTextarea({
  value,
  minRows = 4,
  className = "",
  ...props
}: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  // Re-fit whenever the value changes (typing, voice input, programmatic fill)
  useEffect(resize, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      rows={minRows}
      onInput={resize}
      className={`${className} resize-none overflow-hidden`}
      {...props}
    />
  );
}
