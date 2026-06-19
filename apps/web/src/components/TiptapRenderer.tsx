import React from 'react';

export function renderTiptapNode(node: any, index: number): React.ReactNode {
  if (!node) return null;
  const key = `node-${index}`;

  switch (node.type) {
    case 'doc':
      return (
        <div key={key} className="space-y-6">
          {node.content?.map((child: any, idx: number) => renderTiptapNode(child, idx))}
        </div>
      );
    case 'paragraph':
      return (
        <p key={key} className="text-gray-300 text-sm md:text-base font-light leading-relaxed font-sans">
          {node.content?.map((child: any, idx: number) => renderTiptapNode(child, idx)) || '\u00A0'}
        </p>
      );
    case 'heading': {
      const level = node.attrs?.level || 1;
      const HeadingTag = `h${level}` as any;
      const classMap: Record<number, string> = {
        1: 'text-2xl md:text-3xl font-heading font-black tracking-wide text-white mt-10 mb-4 border-b border-white/5 pb-2',
        2: 'text-xl md:text-2xl font-heading font-extrabold tracking-wide text-white mt-8 mb-3',
        3: 'text-lg md:text-xl font-heading font-bold tracking-wide text-white mt-6 mb-2',
      };
      const className = classMap[level] || classMap[3];
      return (
        <HeadingTag key={key} className={className}>
          {node.content?.map((child: any, idx: number) => renderTiptapNode(child, idx))}
        </HeadingTag>
      );
    }
    case 'text': {
      let textNode: React.ReactNode = node.text;
      if (node.marks) {
        for (const mark of node.marks) {
          if (mark.type === 'bold') {
            textNode = <strong key={key + '-bold'} className="font-bold text-white">{textNode}</strong>;
          } else if (mark.type === 'italic') {
            textNode = <em key={key + '-italic'}>{textNode}</em>;
          } else if (mark.type === 'underline') {
            textNode = <span key={key + '-underline'} className="underline">{textNode}</span>;
          } else if (mark.type === 'link') {
            textNode = (
              <a
                key={key + '-link'}
                href={mark.attrs?.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary underline hover:text-secondary-dark transition-colors"
              >
                {textNode}
              </a>
            );
          }
        }
      }
      return <span key={key}>{textNode}</span>;
    }
    case 'bulletList':
      return (
        <ul key={key} className="list-disc pl-6 space-y-2 text-gray-300 text-sm md:text-base font-light font-sans">
          {node.content?.map((child: any, idx: number) => renderTiptapNode(child, idx))}
        </ul>
      );
    case 'orderedList':
      return (
        <ol key={key} className="list-decimal pl-6 space-y-2 text-gray-300 text-sm md:text-base font-light font-sans">
          {node.content?.map((child: any, idx: number) => renderTiptapNode(child, idx))}
        </ol>
      );
    case 'listItem':
      return (
        <li key={key}>
          {node.content?.map((child: any, idx: number) => renderTiptapNode(child, idx))}
        </li>
      );
    case 'blockquote':
      return (
        <blockquote key={key} className="border-l-4 border-secondary/40 pl-4 py-2 my-6 italic text-gray-400 bg-white/[0.02] rounded-r-lg font-sans">
          {node.content?.map((child: any, idx: number) => renderTiptapNode(child, idx))}
        </blockquote>
      );
    case 'codeBlock':
      return (
        <pre key={key} className="bg-[#020C1B] border border-white/10 p-4 rounded-xl my-6 overflow-x-auto text-xs font-mono text-gray-300">
          <code>
            {node.content?.map((child: any, idx: number) => child.text).join('\n') || ''}
          </code>
        </pre>
      );
    case 'horizontalRule':
      return <hr key={key} className="border-white/10 my-10" />;
    case 'image':
      return (
        <div key={key} className="my-8 max-w-full rounded-2xl overflow-hidden border border-white/10 relative">
          <img
            src={node.attrs?.src}
            alt={node.attrs?.alt || 'Embedded Image'}
            className="w-full h-auto object-cover"
          />
        </div>
      );
    default:
      return null;
  }
}

export function TiptapRenderer({ content }: { content: Record<string, any> }) {
  if (!content) return null;
  return <>{renderTiptapNode(content, 0)}</>;
}
