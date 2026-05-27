"use client";

import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-xl border border-navy-200 bg-white px-4 py-3 text-[15px] text-navy-950 placeholder:text-navy-300 transition-colors focus:border-azure-500 focus:outline-none focus:ring-4 focus:ring-azure-500/10 disabled:bg-navy-50";

export function Label({
  children,
  htmlFor,
  hint,
  optional,
}: {
  children: ReactNode;
  htmlFor?: string;
  hint?: string;
  optional?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 flex items-center gap-2 text-sm font-medium text-navy-800">
      {children}
      {optional && <span className="text-xs font-normal text-navy-400">{hint}</span>}
    </label>
  );
}

export function FieldShell({
  label,
  htmlFor,
  error,
  hint,
  optional,
  children,
  className,
}: {
  label?: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={htmlFor} optional={optional} hint={optional ? hint : undefined}>
          {label}
        </Label>
      )}
      {children}
      {hint && !optional && !error && <p className="mt-1.5 text-xs text-navy-400">{hint}</p>}
      {error && <p className="mt-1.5 text-xs font-medium text-rose-soft">{error}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  optional?: boolean;
}

export const TextField = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, optional, className, id, ...props }, ref) => (
    <FieldShell label={label} htmlFor={id} error={error} hint={hint} optional={optional} className={className}>
      <input
        id={id}
        ref={ref}
        className={cn(fieldBase, error && "border-rose-soft focus:border-rose-soft focus:ring-rose-soft/10")}
        {...props}
      />
    </FieldShell>
  ),
);
TextField.displayName = "TextField";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, optional, className, id, children, ...props }, ref) => (
    <FieldShell label={label} htmlFor={id} error={error} hint={hint} optional={optional} className={className}>
      <div className="relative">
        <select
          id={id}
          ref={ref}
          className={cn(
            fieldBase,
            "appearance-none pe-10",
            error && "border-rose-soft focus:border-rose-soft focus:ring-rose-soft/10",
          )}
          {...props}
        >
          {children}
        </select>
        <svg
          className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-navy-400"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </FieldShell>
  ),
);
SelectField.displayName = "SelectField";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string; hint?: string }
>(({ label, error, hint, className, id, ...props }, ref) => (
  <FieldShell label={label} htmlFor={id} error={error} hint={hint} className={className}>
    <textarea
      id={id}
      ref={ref}
      className={cn(fieldBase, "min-h-28 resize-y", error && "border-rose-soft")}
      {...props}
    />
  </FieldShell>
));
Textarea.displayName = "Textarea";
