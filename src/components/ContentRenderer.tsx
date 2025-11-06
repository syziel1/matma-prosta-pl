import React, { useMemo } from 'react';
import { MathBlock } from './MathBlock';
import { InlineMath } from './InlineMath';

interface ContentRendererProps {
  content: string;
}

export function ContentRenderer({ content }: ContentRendererProps) {
  const parsed = useMemo(() => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const mathBlockRegex = /\$\$\n([\s\S]*?)\n\$\$/g;
    const inlineMathRegex = /\$([^\$\n]+?)\$/g;

    let match;
    const mathBlocks: Array<{ start: number; end: number; latex: string }> = [];

    while ((match = mathBlockRegex.exec(content)) !== null) {
      mathBlocks.push({
        start: match.index,
        end: match.index + match[0].length,
        latex: match[1],
      });
    }

    mathBlocks.forEach((block, blockIndex) => {
      const beforeBlock = content.substring(lastIndex, block.start);
      const lines = beforeBlock.split('\n');

      lines.forEach((line, lineIndex) => {
        if (line.startsWith('# ')) {
          parts.push(<h1 key={`h1-${parts.length}`} className="text-4xl font-bold mt-8 mb-4">{line.substring(2)}</h1>);
        } else if (line.startsWith('## ')) {
          parts.push(<h2 key={`h2-${parts.length}`} className="text-3xl font-bold mt-6 mb-3">{line.substring(3)}</h2>);
        } else if (line.startsWith('### ')) {
          parts.push(<h3 key={`h3-${parts.length}`} className="text-2xl font-bold mt-4 mb-2">{line.substring(4)}</h3>);
        } else if (line.trim()) {
          const renderedLine = renderInlineMath(line, `p-${parts.length}`);
          parts.push(<p key={`p-${parts.length}`} className="text-base leading-relaxed mb-4">{renderedLine}</p>);
        }
      });

      parts.push(
        <MathBlock key={`math-${blockIndex}`} latex={block.latex} />
      );
      lastIndex = block.end;
    });

    const remaining = content.substring(lastIndex);
    if (remaining.trim()) {
      const lines = remaining.split('\n');
      lines.forEach((line, lineIndex) => {
        if (line.startsWith('# ')) {
          parts.push(<h1 key={`h1-${parts.length}`} className="text-4xl font-bold mt-8 mb-4">{line.substring(2)}</h1>);
        } else if (line.startsWith('## ')) {
          parts.push(<h2 key={`h2-${parts.length}`} className="text-3xl font-bold mt-6 mb-3">{line.substring(3)}</h2>);
        } else if (line.startsWith('### ')) {
          parts.push(<h3 key={`h3-${parts.length}`} className="text-2xl font-bold mt-4 mb-2">{line.substring(4)}</h3>);
        } else if (line.trim()) {
          const renderedLine = renderInlineMath(line, `p-${parts.length}`);
          parts.push(<p key={`p-${parts.length}`} className="text-base leading-relaxed mb-4">{renderedLine}</p>);
        }
      });
    }

    return parts;
  }, [content]);

  return <div className="prose prose-sm max-w-none">{parsed}</div>;
}

function renderInlineMath(text: string, keyPrefix: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\$([^\$\n]+?)\$/g;
  let lastIndex = 0;
  let match;
  let partIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={`${keyPrefix}-text-${partIndex}`}>{text.substring(lastIndex, match.index)}</span>);
      partIndex++;
    }
    parts.push(<InlineMath key={`${keyPrefix}-math-${partIndex}`} latex={match[1]} />);
    lastIndex = match.index + match[0].length;
    partIndex++;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={`${keyPrefix}-text-${partIndex}`}>{text.substring(lastIndex)}</span>);
  }

  return parts;
}
