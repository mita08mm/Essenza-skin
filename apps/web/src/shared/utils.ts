import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Convierte HTML (ej. del RichTextEditor) a texto plano de una sola línea. */
export function stripHtmlTags(html: string) {
  return html
    .replace(/<\/(p|li)>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
