'use client';

import DOMPurify from 'dompurify';

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: [] as string[],
};

const HTML_TAG_PATTERN = /<\/?(p|strong|em|ul|ol|li|br)\b/i;

interface RichTextViewProps {
  value: string;
  className?: string;
}

export function RichTextView({ value, className }: RichTextViewProps) {
  if (HTML_TAG_PATTERN.test(value)) {
    const clean = DOMPurify.sanitize(value, SANITIZE_CONFIG);
    return (
      <div
        className={`richtext-view ${className ?? ''}`}
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    );
  }

  return <p className={`whitespace-pre-wrap ${className ?? ''}`}>{value}</p>;
}
