"use client";

import {
  Bold, Italic, Underline,
  AlignLeft, AlignCenter, AlignRight,
  AArrowUp, AArrowDown,
  List, ListOrdered,
} from "lucide-react";

interface RichTextToolbarProps {
  editorRef: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

export default function RichTextToolbar({ editorRef, className = "" }: RichTextToolbarProps) {
  const exec = (cmd: string, val?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
  };

  const changeFontSize = (bigger: boolean) => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
    const range = sel.getRangeAt(0);
    const anchor = range.commonAncestorContainer;
    const elem = anchor instanceof Element ? anchor : anchor.parentElement;
    const current = elem ? parseFloat(window.getComputedStyle(elem).fontSize) || 14 : 14;
    const next = bigger ? Math.min(current + 2, 36) : Math.max(current - 2, 8);
    document.execCommand("fontSize", false, "7");
    el.querySelectorAll('font[size="7"]').forEach((f) => {
      (f as HTMLElement).removeAttribute("size");
      (f as HTMLElement).style.fontSize = `${next}px`;
    });
  };

  const Btn = ({
    onClick, title, children,
  }: { onClick: () => void; title: string; children: React.ReactNode }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => { e.preventDefault(); onClick(); }}
      className="p-1.5 rounded-md text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-default)] transition-all flex-shrink-0"
    >
      {children}
    </button>
  );

  const Sep = () => <div className="w-px h-4 bg-[var(--border-default)] mx-0.5 flex-shrink-0" />;

  return (
    <div className={`flex flex-wrap items-center gap-0.5 px-2.5 py-1.5 bg-[var(--bg-surface-2)] border border-[var(--border-default)] rounded-xl ${className}`}>
      {/* Style */}
      <Btn onClick={() => exec("bold")}      title="Bold (Ctrl+B)">      <Bold      className="h-3.5 w-3.5" /></Btn>
      <Btn onClick={() => exec("italic")}    title="Italic (Ctrl+I)">    <Italic    className="h-3.5 w-3.5" /></Btn>
      <Btn onClick={() => exec("underline")} title="Underline (Ctrl+U)"> <Underline className="h-3.5 w-3.5" /></Btn>

      <Sep />

      {/* Font size */}
      <Btn onClick={() => changeFontSize(true)}  title="Increase font size (select first)"><AArrowUp   className="h-3.5 w-3.5" /></Btn>
      <Btn onClick={() => changeFontSize(false)} title="Decrease font size (select first)"><AArrowDown className="h-3.5 w-3.5" /></Btn>

      <Sep />

      {/* Align */}
      <Btn onClick={() => exec("justifyLeft")}   title="Left align">  <AlignLeft   className="h-3.5 w-3.5" /></Btn>
      <Btn onClick={() => exec("justifyCenter")} title="Center">      <AlignCenter className="h-3.5 w-3.5" /></Btn>
      <Btn onClick={() => exec("justifyRight")}  title="Right align"> <AlignRight  className="h-3.5 w-3.5" /></Btn>

      <Sep />

      {/* Lists */}
      <Btn onClick={() => exec("insertUnorderedList")} title="Bullet list">   <List        className="h-3.5 w-3.5" /></Btn>
      <Btn onClick={() => exec("insertOrderedList")}   title="Numbered list"> <ListOrdered className="h-3.5 w-3.5" /></Btn>

      <span className="text-[10px] text-[var(--text-tertiary)] ml-2 hidden md:block">
        Select text then click a format button
      </span>
    </div>
  );
}
