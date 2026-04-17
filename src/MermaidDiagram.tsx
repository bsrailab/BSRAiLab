import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const renderIdRef = useRef(`mermaid-diagram-${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    if (!elementRef.current) return;

    mermaid.initialize({ startOnLoad: false });
    mermaid
      .render(renderIdRef.current, chart)
      .then((result) => {
        if (elementRef.current) {
          elementRef.current.innerHTML = result.svg;
        }
      })
      .catch((error) => {
        console.error('Failed to render Mermaid diagram:', error);
        if (elementRef.current) {
          elementRef.current.innerHTML = '<p>Unable to render diagram.</p>';
        }
      });
  }, [chart]);

  return <div ref={elementRef} />;
};

export default MermaidDiagram;
