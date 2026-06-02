interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export default function Card({ children, className = "", onClick, hover }: CardProps) {
  return (
    <div
      className={`bg-[var(--bg-surface-1)] rounded-2xl border border-[var(--border-subtle)] shadow-sm shadow-black/20 ${
        hover ? "card-hover cursor-pointer hover:border-[var(--border-default)] hover:bg-[var(--bg-surface-2)]" : ""
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
