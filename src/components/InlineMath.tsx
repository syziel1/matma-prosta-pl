import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface InlineMathProps {
  latex: string;
}

export function InlineMath({ latex }: InlineMathProps) {
  const ref = useRef<span>(null);

  useEffect(() => {
    if (!ref.current) return;

    try {
      katex.render(latex, ref.current, {
        displayMode: false,
        throwOnError: false,
      });
    } catch (err) {
      if (ref.current) {
        ref.current.textContent = latex;
      }
    }
  }, [latex]);

  return (
    <span
      ref={ref}
      className="inline-math"
      role="img"
      aria-label="Mathematical formula"
    />
  );
}
