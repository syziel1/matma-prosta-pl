import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface MathBlockProps {
  latex: string;
}

export function MathBlock({ latex }: MathBlockProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    try {
      katex.render(latex, ref.current, {
        displayMode: true,
        throwOnError: false,
      });
    } catch (err) {
      if (ref.current) {
        ref.current.textContent = `Error rendering: ${latex}`;
      }
    }
  }, [latex]);

  return (
    <div
      ref={ref}
      className="my-6 p-4 bg-blue-50 rounded-lg border border-blue-200 overflow-x-auto flex justify-center"
      role="img"
      aria-label="Mathematical formula"
    />
  );
}
