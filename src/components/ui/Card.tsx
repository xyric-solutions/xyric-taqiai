import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({ children, className = "", style, onClick, hover }: CardProps) {
  return (
    <div
      className={`bg-[var(--bg-surface-1)] rounded-2xl border border-[var(--border-subtle)] shadow-sm shadow-black/20 ${
        hover ? "card-hover cursor-pointer hover:border-[var(--border-default)] hover:bg-[var(--bg-surface-2)]" : ""
      } ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
