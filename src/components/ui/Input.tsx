"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
            {label}
            {props.required && <span className="text-danger-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 border rounded-xl text-[var(--text-primary)] placeholder-[var(--text-tertiary)] bg-[var(--bg-surface-2)] focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 ${
            error ? "border-danger-500/60 focus:ring-danger-500/30" : "border-[var(--border-subtle)] hover:border-[var(--border-default)]"
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-danger-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
