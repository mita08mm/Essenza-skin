import type { ElementType, ReactNode } from 'react';

interface BaseProps {
  children: ReactNode;
  className?: string;
}

// Page title — el H1 de cada pantalla
export function Title({
  children,
  className = '',
  as: As = 'h1',
}: BaseProps & { as?: ElementType }) {
  return <As className={`title-page ${className}`}>{children}</As>;
}

// Section title — encabezados de bloque dentro de página
export function SectionTitle({
  children,
  className = '',
  as: As = 'h2',
}: BaseProps & { as?: ElementType }) {
  return <As className={`title-section ${className}`}>{children}</As>;
}

// Card title — encabezado dentro de un Card/Surface
export function CardTitle({
  children,
  className = '',
  as: As = 'h3',
}: BaseProps & { as?: ElementType }) {
  return <As className={`title-card ${className}`}>{children}</As>;
}

// Subtitle — texto descriptivo bajo un título (gris medio)
export function Subtitle({ children, className = '' }: BaseProps) {
  return <p className={`subtitle ${className}`}>{children}</p>;
}

// Body — texto principal de párrafos
export function Body({ children, className = '' }: BaseProps) {
  return <p className={`body ${className}`}>{children}</p>;
}

// Body strong — texto principal con énfasis (nombres, valores)
export function BodyStrong({
  children,
  className = '',
  as: As = 'span',
}: BaseProps & { as?: ElementType }) {
  return <As className={`body-strong ${className}`}>{children}</As>;
}

// Muted — texto pequeño secundario (metadata, hints)
export function Muted({
  children,
  className = '',
  as: As = 'p',
}: BaseProps & { as?: ElementType }) {
  return <As className={`muted ${className}`}>{children}</As>;
}

// Caption — texto microscópico (timestamps, footnotes)
export function Caption({
  children,
  className = '',
  as: As = 'span',
}: BaseProps & { as?: ElementType }) {
  return <As className={`caption ${className}`}>{children}</As>;
}

// Overline — etiqueta uppercase pequeña ("Stock", "Finanzas", etc.)
export function Overline({
  children,
  className = '',
  as: As = 'p',
}: BaseProps & { as?: ElementType }) {
  return <As className={`overline ${className}`}>{children}</As>;
}
