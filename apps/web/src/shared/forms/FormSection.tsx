import { ReactNode } from 'react';
import { SectionTitle, Subtitle } from '@/shared/ui';

interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <section className="surface p-6 sm:p-8">
      <div className="mb-6 border-b border-neutral-100 pb-4">
        <SectionTitle>{title}</SectionTitle>
        {description && <Subtitle className="mt-1">{description}</Subtitle>}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export function FormField({ label, htmlFor, required, hint, error, children }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-medium text-neutral-700">
        {label}
        {required && <span className="text-danger ml-0.5">*</span>}
      </label>
      {children}
      {error ? (
        <p className="text-danger mt-1 text-xs">{error}</p>
      ) : hint ? (
        <p className="muted mt-1">{hint}</p>
      ) : null}
    </div>
  );
}
