import React, { useEffect, useMemo, useState } from 'react';

type Anchor = 'start' | 'middle' | 'end';
type EdgeTone = 'dark' | 'blue';

type LabelConfig = {
  x: number;
  y: number;
  lines: string[];
  anchor?: Anchor;
};

type EdgeConfig = {
  id: string;
  d: string;
  tone: EdgeTone;
  endMarker?: boolean;
  label?: LabelConfig;
};

type NodeConfig = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string;
  subtitle?: string;
  variant?: 'plain' | 'blue' | 'green';
  chip?: string;
};

type Step = {
  id: number;
  title: string;
  nodes: string[];
  edges: string[];
};

function lines(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function multilineText(
  x: number,
  y: number,
  value: string | string[],
  className: string,
  anchor: Anchor = 'middle',
  lineHeight = 16,
) {
  const content = lines(value);
  return (
    <text x={x} y={y} textAnchor={anchor} className={className}>
      {content.map((line, index) => (
        <tspan key={`${line}-${index}`} x={x} dy={index === 0 ? 0 : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

function chipWidth(value: string[]) {
  return Math.max(...value.map((line) => line.length), 0) * 8.4 + 54;
}

function labelRectX(x: number, width: number, anchor: Anchor) {
  if (anchor === 'middle') return x - width / 2;
  if (anchor === 'end') return x - width;
  return x - 10;
}

function DiagramNode({ node, active }: { node: NodeConfig; active: boolean }) {
  const variantClass =
    node.variant === 'blue'
      ? 'copilot-diagram__card copilot-diagram__card--blue'
      : node.variant === 'green'
        ? 'copilot-diagram__card copilot-diagram__card--green'
        : 'copilot-diagram__card';

  const titleX = node.chip ? node.x + 56 : node.x + node.width / 2;
  const titleAnchor: Anchor = node.chip ? 'start' : 'middle';

  return (
    <g className={active ? 'copilot-diagram__node is-active' : 'copilot-diagram__node'}>
      <rect x={node.x} y={node.y} width={node.width} height={node.height} rx="10" className={variantClass} />
      {node.chip ? (
        <>
          <rect x={node.x + 14} y={node.y + 16} width="30" height="22" rx="10" className="copilot-diagram__chip" />
          <text x={node.x + 29} y={node.y + 32} textAnchor="middle" className="copilot-diagram__chip-text">
            {node.chip}
          </text>
        </>
      ) : null}
      {multilineText(titleX, node.y + 34, node.title, 'copilot-diagram__card-title', titleAnchor, 16)}
      {node.subtitle ? multilineText(titleX, node.y + 56, node.subtitle, 'copilot-diagram__card-subtitle', titleAnchor, 14) : null}
    </g>
  );
}

function EdgePath({ edge, active }: { edge: EdgeConfig; active: boolean }) {
  const toneClass =
    edge.tone === 'blue' ? 'copilot-diagram__edge copilot-diagram__edge--blue' : 'copilot-diagram__edge copilot-diagram__edge--dark';
  return (
    <g className={active ? 'copilot-diagram__edgewrap is-active' : 'copilot-diagram__edgewrap'}>
      <path id={`n8n-edge-${edge.id}`} d={edge.d} className={toneClass} markerEnd={edge.endMarker ? 'url(#copilotArrow)' : undefined} />
      {active ? <path d={edge.d} className="copilot-diagram__edge-glow" /> : null}
    </g>
  );
}

function EdgeOverlay({ edge, active, showPulse }: { edge: EdgeConfig; active: boolean; showPulse: boolean }) {
  return (
    <g className="copilot-diagram__overlays">
      {edge.label && active ? (
        <g className="copilot-diagram__label">
          {(() => {
            const width = chipWidth(edge.label.lines) + 18;
            const anchor = edge.label.anchor ?? 'start';
            const x = labelRectX(edge.label.x, width, anchor);
            const y = edge.label.y - 18;
            return (
              <rect
                x={x}
                y={y}
                width={width}
                height={edge.label.lines.length * 15 + 16}
                rx="10"
                className="copilot-diagram__label-chip"
              />
            );
          })()}
          {multilineText(edge.label.x, edge.label.y, edge.label.lines, 'copilot-diagram__label-text', edge.label.anchor ?? 'start', 15)}
        </g>
      ) : null}
      {showPulse && active ? (
        <circle r="5.6" className="copilot-diagram__pulse">
          <animateMotion dur="2.2s" repeatCount="indefinite">
            <mpath href={`#n8n-edge-${edge.id}`} />
          </animateMotion>
        </circle>
      ) : null}
    </g>
  );
}

const N8nArchitectureDiagram: React.FC = () => {
  const steps: Step[] = useMemo(
    () => [
      { id: 1, title: 'Trigger → n8n Runtime (kéo-thả, orchestration)', nodes: ['trigger', 'n8n'], edges: ['trigger-to-n8n'] },
      { id: 2, title: 'n8n Runtime → AI Agent (log/trace + state)', nodes: ['n8n', 'agent', 'ops'], edges: ['n8n-to-agent', 'n8n-to-ops'] },
      { id: 3, title: 'AI Agent → MCP (tools registry) → Tools', nodes: ['agent', 'mcp', 'tools'], edges: ['agent-to-mcp', 'mcp-to-tools'] },
      { id: 4, title: 'RAG Ingest: sources → chunking → embeddings → vector index', nodes: ['docsrc', 'chunk', 'embed', 'vector'], edges: ['docsrc-to-chunk', 'chunk-to-embed', 'embed-to-vector'] },
      { id: 5, title: 'RAG Retrieval: agent → retrieve → context → LLM', nodes: ['agent', 'retriever', 'vector', 'llm'], edges: ['agent-to-retriever', 'retriever-to-vector', 'vector-to-agent', 'agent-to-llm'] },
      { id: 6, title: 'AI Agent → Tools (HTTP/DB) → Final Output', nodes: ['agent', 'http', 'db', 'notify'], edges: ['agent-to-http', 'agent-to-db', 'agent-to-notify'] },
    ],
    [],
  );

  const [isPlaying, setIsPlaying] = useState(true);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setActiveStep((prev) => (prev >= steps.length ? 1 : prev + 1));
    }, 1900);
    return () => window.clearInterval(timer);
  }, [isPlaying, steps.length]);

  const step = steps.find((s) => s.id === activeStep) ?? steps[0];
  const activeNodes = new Set(step.nodes);
  const activeEdges = new Set(step.edges);

  const nodes: NodeConfig[] = [
    // Column 1: data / events
    { id: 'trigger', x: 60, y: 120, width: 240, height: 72, title: 'Trigger', subtitle: 'Webhook / Cron / Event', variant: 'green', chip: 'IN' },

    // Column 2: orchestration (n8n)
    { id: 'n8n', x: 330, y: 120, width: 260, height: 92, title: 'n8n Runtime', subtitle: 'Kéo-thả + Executions', variant: 'blue', chip: 'n8n' },
    { id: 'logic', x: 330, y: 240, width: 260, height: 86, title: 'Workflow Nodes', subtitle: 'IF/Switch/Merge/Code', chip: 'FX' },
    { id: 'ops', x: 330, y: 342, width: 260, height: 86, title: 'Logs/Ops', subtitle: 'Retry/Logs/Queue/Alert', chip: 'LOG' },

    // Column 3: agent hub (center)
    { id: 'agent', x: 620, y: 150, width: 320, height: 96, title: 'AI Agent (Orchestrator)', subtitle: 'Plan → Tool call → Observe → Answer', variant: 'blue', chip: 'AG' },
    { id: 'llm', x: 620, y: 260, width: 320, height: 70, title: 'LLM', subtitle: 'GPT / Azure OpenAI', chip: 'LLM' },
    { id: 'retriever', x: 620, y: 340, width: 320, height: 70, title: 'Retriever', subtitle: 'Top-k + filters', chip: 'RET' },
    { id: 'http', x: 620, y: 430, width: 150, height: 66, title: 'HTTP', subtitle: 'REST', chip: 'API' },
    { id: 'db', x: 790, y: 430, width: 150, height: 66, title: 'DB', subtitle: 'SQL', chip: 'DB' },
    { id: 'notify', x: 330, y: 520, width: 610, height: 78, title: 'Final Output', subtitle: 'Email/Teams/Slack/Webhook', variant: 'green', chip: 'OUT' },

    // Column 4: MCP + RAG (right)
    { id: 'mcp', x: 980, y: 120, width: 260, height: 70, title: 'MCP Servers', subtitle: 'Tools registry + auth', chip: 'MCP' },
    { id: 'tools', x: 980, y: 200, width: 260, height: 70, title: 'Tools', subtitle: 'Search/DB/HTTP/Apps', variant: 'green', chip: 'TOOL' },
    { id: 'docsrc', x: 980, y: 280, width: 260, height: 70, title: 'Knowledge Sources', subtitle: 'PDF / Web / DB / SharePoint', variant: 'green', chip: 'DOC' },
    { id: 'chunk', x: 980, y: 360, width: 260, height: 70, title: 'Chunking', subtitle: 'Split + metadata', chip: 'CH' },
    { id: 'embed', x: 980, y: 440, width: 260, height: 70, title: 'Embeddings', subtitle: 'Text → vectors', chip: 'EMB' },
    { id: 'vector', x: 980, y: 520, width: 260, height: 70, title: 'Vector Index', subtitle: 'AI Search / pgvector', chip: 'VEC' },
  ];

  const edges: EdgeConfig[] = [
    // Basic runtime
    { id: 'trigger-to-n8n', d: 'M 300 156 L 315 156 L 315 166 L 330 166', tone: 'dark', endMarker: true, label: { x: 315, y: 136, lines: ['Trigger'], anchor: 'middle' } },
    { id: 'n8n-to-logic', d: 'M 460 212 L 460 240', tone: 'dark', endMarker: true },
    { id: 'n8n-to-agent', d: 'M 590 166 L 605 166 L 605 198 L 620 198', tone: 'dark', endMarker: true, label: { x: 605, y: 148, lines: ['Start'], anchor: 'middle' } },
    { id: 'n8n-to-ops', d: 'M 460 326 L 460 342', tone: 'dark', endMarker: true, label: { x: 490, y: 336, lines: ['Log'], anchor: 'start' } },

    // RAG ingest
    { id: 'docsrc-to-chunk', d: 'M 980 315 L 940 315 L 940 395 L 980 395', tone: 'dark', endMarker: true, label: { x: 940, y: 340, lines: ['Ingest'], anchor: 'middle' } },
    { id: 'chunk-to-embed', d: 'M 1110 430 L 1110 440', tone: 'blue', endMarker: true },
    { id: 'embed-to-vector', d: 'M 1110 510 L 1110 520', tone: 'blue', endMarker: true, label: { x: 1138, y: 508, lines: ['Index'], anchor: 'start' } },

    // RAG retrieval path (agent-centric)
    { id: 'agent-to-retriever', d: 'M 780 246 L 780 340', tone: 'blue', endMarker: true, label: { x: 804, y: 306, lines: ['Decide'], anchor: 'start' } },
    { id: 'retriever-to-vector', d: 'M 940 375 L 960 375 L 960 555 L 980 555', tone: 'dark', endMarker: true, label: { x: 964, y: 470, lines: ['Retrieve'], anchor: 'start' } },

    { id: 'vector-to-agent', d: 'M 980 555 L 960 555 L 960 198 L 940 198', tone: 'blue', endMarker: true, label: { x: 964, y: 226, lines: ['Context'], anchor: 'start' } },
    { id: 'agent-to-llm', d: 'M 780 246 L 780 260', tone: 'blue', endMarker: true, label: { x: 804, y: 256, lines: ['Generate'], anchor: 'start' } },

    // Tool calling via MCP + tools
    { id: 'agent-to-mcp', d: 'M 940 198 L 960 198 L 960 155 L 980 155', tone: 'dark', endMarker: true, label: { x: 960, y: 168, lines: ['Tool call'], anchor: 'middle' } },
    { id: 'mcp-to-tools', d: 'M 1110 190 L 1110 200', tone: 'dark', endMarker: true },

    { id: 'agent-to-http', d: 'M 700 246 L 695 430', tone: 'dark', endMarker: true, label: { x: 705, y: 356, lines: ['HTTP'], anchor: 'start' } },
    { id: 'agent-to-db', d: 'M 860 246 L 865 430', tone: 'dark', endMarker: true, label: { x: 875, y: 356, lines: ['DB'], anchor: 'start' } },

    // Output + ops
    { id: 'agent-to-notify', d: 'M 780 410 L 780 520', tone: 'dark', endMarker: true, label: { x: 804, y: 476, lines: ['Answer'], anchor: 'start' } },
  ];

  return (
    <div className="copilot-diagram-shell">
      <div className="workflow-controls" role="group" aria-label="n8n workflow controls">
        <button type="button" className="workflow-button" onClick={() => setIsPlaying((v) => !v)}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button type="button" className="workflow-button" onClick={() => setActiveStep((p) => (p <= 1 ? steps.length : p - 1))}>
          Prev
        </button>
        <button type="button" className="workflow-button" onClick={() => setActiveStep((p) => (p >= steps.length ? 1 : p + 1))}>
          Next
        </button>
        <div className="workflow-pill" aria-live="polite">
          <strong>Step {activeStep}</strong>: {step.title}
        </div>
      </div>

      <div className={isPlaying ? 'n8n-canvas is-playing' : 'n8n-canvas is-paused'}>
        <svg className="n8n-canvas__svg" viewBox="0 0 1260 820" preserveAspectRatio="xMidYMid meet" role="img" aria-label="n8n workflow diagram">
          <defs>
            <pattern id="n8nGrid" width="26" height="26" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1.05" fill="var(--n8n-grid-dot-strong)" />
              <circle cx="14" cy="14" r="1" fill="var(--n8n-grid-dot-soft)" />
            </pattern>
            <marker id="copilotArrow" viewBox="0 0 10 10" refX="7.2" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#1f2a33" />
            </marker>
            <marker id="n8nArrow" viewBox="0 0 10 10" refX="7.5" refY="5" markerWidth="7.2" markerHeight="7.2" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--n8n-arrow)" />
            </marker>
          </defs>

          <rect x="20" y="70" width="1220" height="720" rx="18" className="n8n-canvas__frame" />
          <rect x="20" y="70" width="1220" height="720" rx="18" fill="url(#n8nGrid)" />
          {multilineText(630, 46, 'N8N WORKFLOW CANVAS: MCP + RAG + AGENT', 'n8n-canvas__title', 'middle', 20)}

          {/* Main flow nodes (editor-style) */}
          <g className="n8n-canvas__main">
            {/* Trigger */}
            <rect x="70" y="220" width="230" height="86" rx="16" className="n8n-node n8n-node--trigger" />
            {multilineText(95, 252, 'Trigger', 'n8n-node__title', 'start')}
            {multilineText(95, 276, 'Webhook / Cron / Event', 'n8n-node__subtitle', 'start')}
            <circle cx="300" cy="263" r="6" className="n8n-handle" />

            {/* n8n runtime */}
            <rect x="340" y="210" width="250" height="106" rx="16" className="n8n-node n8n-node--runtime" />
            {multilineText(365, 250, 'n8n Runtime', 'n8n-node__title', 'start')}
            {multilineText(365, 274, 'Drag & drop + executions', 'n8n-node__subtitle', 'start')}
            <circle cx="340" cy="263" r="6" className="n8n-handle" />
            <circle cx="590" cy="263" r="6" className="n8n-handle" />

            {/* Agent */}
            <rect x="635" y="215" width="300" height="96" rx="16" className="n8n-node n8n-node--agent" />
            {multilineText(660, 252, 'AI Agent', 'n8n-node__title', 'start')}
            {multilineText(660, 276, 'Orchestrator + logs', 'n8n-node__subtitle', 'start')}
            <circle cx="635" cy="263" r="6" className="n8n-handle" />
            <circle cx="935" cy="263" r="6" className="n8n-handle" />

            {/* Router (MCP / RAG / Tools) */}
            <rect x="980" y="228" width="190" height="70" rx="16" className="n8n-node n8n-node--router" />
            {multilineText(1005, 264, 'Route', 'n8n-node__title', 'start')}
            {multilineText(1005, 286, 'MCP / RAG / Tools', 'n8n-node__subtitle', 'start')}
            <circle cx="980" cy="263" r="6" className="n8n-handle" />
            <circle cx="1170" cy="263" r="6" className="n8n-handle" />

            {/* Final output */}
            <rect x="980" y="338" width="230" height="78" rx="16" className="n8n-node n8n-node--output" />
            {multilineText(1005, 372, 'Final Output', 'n8n-node__title', 'start')}
            {multilineText(1005, 394, 'Email/Teams/Slack/Webhook', 'n8n-node__subtitle', 'start')}
            <circle cx="980" cy="377" r="6" className="n8n-handle" />
            <circle cx="1210" cy="377" r="6" className="n8n-handle" />
          </g>

          {/* Solid main edges (curved) */}
          <g className="n8n-canvas__edges">
            <path d="M 300 263 C 315 263 320 263 340 263" className="n8n-edge" markerEnd="url(#n8nArrow)" />
            <path d="M 300 263 C 315 263 320 263 340 263" className="n8n-edge n8n-edge--anim" />

            <path d="M 590 263 C 610 263 615 263 635 263" className="n8n-edge" markerEnd="url(#n8nArrow)" />
            <path d="M 590 263 C 610 263 615 263 635 263" className="n8n-edge n8n-edge--anim" />

            <path d="M 935 263 C 950 263 960 263 980 263" className="n8n-edge" markerEnd="url(#n8nArrow)" />
            <path d="M 935 263 C 950 263 960 263 980 263" className="n8n-edge n8n-edge--anim" />

            <path d="M 1075 298 C 1075 314 1075 322 1095 338" className="n8n-edge" markerEnd="url(#n8nArrow)" />
            <path d="M 1075 298 C 1075 314 1075 322 1095 338" className="n8n-edge n8n-edge--anim" />
          </g>

          {/* Subnodes (dashed) connected to Agent */}
          <g className="n8n-canvas__sub">
            {/* Model / Memory / MCP Tools / RAG / HTTP/DB */}
            <circle cx="560" cy="520" r="44" className="n8n-orb" />
            {multilineText(560, 520, ['Chat', 'Model'], 'n8n-orb__title', 'middle', 16)}
            {multilineText(560, 585, ['(GPT/Claude)'], 'n8n-orb__sub', 'middle', 14)}

            <circle cx="680" cy="520" r="44" className="n8n-orb" />
            {multilineText(680, 520, ['Memory'], 'n8n-orb__title', 'middle', 16)}
            {multilineText(680, 585, ['(Postgres)'], 'n8n-orb__sub', 'middle', 14)}

            <circle cx="820" cy="520" r="44" className="n8n-orb" />
            {multilineText(820, 520, ['MCP'], 'n8n-orb__title', 'middle', 16)}
            {multilineText(820, 585, ['Servers/Tools'], 'n8n-orb__sub', 'middle', 14)}

            <circle cx="950" cy="520" r="44" className="n8n-orb" />
            {multilineText(950, 520, ['RAG'], 'n8n-orb__title', 'middle', 16)}
            {multilineText(950, 585, ['Index/Retrieve'], 'n8n-orb__sub', 'middle', 14)}

            <circle cx="1080" cy="520" r="44" className="n8n-orb" />
            {multilineText(1080, 520, ['HTTP'], 'n8n-orb__title', 'middle', 16)}
            {multilineText(1080, 585, ['APIs'], 'n8n-orb__sub', 'middle', 14)}

            <circle cx="1180" cy="520" r="44" className="n8n-orb" />
            {multilineText(1180, 520, ['DB'], 'n8n-orb__title', 'middle', 16)}
            {multilineText(1180, 585, ['SQL'], 'n8n-orb__sub', 'middle', 14)}
          </g>

          <g className="n8n-canvas__dashed">
            <path d="M 785 311 C 750 360 700 420 560 476" className="n8n-edge n8n-edge--dashed" markerEnd="url(#n8nArrow)" />
            <path d="M 800 311 C 780 360 760 420 680 476" className="n8n-edge n8n-edge--dashed" markerEnd="url(#n8nArrow)" />
            <path d="M 830 311 C 850 360 860 420 820 476" className="n8n-edge n8n-edge--dashed" markerEnd="url(#n8nArrow)" />
            <path d="M 860 311 C 920 360 940 420 950 476" className="n8n-edge n8n-edge--dashed" markerEnd="url(#n8nArrow)" />
            <path d="M 890 311 C 1010 360 1040 420 1080 476" className="n8n-edge n8n-edge--dashed" markerEnd="url(#n8nArrow)" />
            <path d="M 905 311 C 1070 360 1120 420 1180 476" className="n8n-edge n8n-edge--dashed" markerEnd="url(#n8nArrow)" />

            <path d="M 785 311 C 750 360 700 420 560 476" className="n8n-edge n8n-edge--dashed n8n-edge--anim" />
            <path d="M 800 311 C 780 360 760 420 680 476" className="n8n-edge n8n-edge--dashed n8n-edge--anim" />
            <path d="M 830 311 C 850 360 860 420 820 476" className="n8n-edge n8n-edge--dashed n8n-edge--anim" />
            <path d="M 860 311 C 920 360 940 420 950 476" className="n8n-edge n8n-edge--dashed n8n-edge--anim" />
            <path d="M 890 311 C 1010 360 1040 420 1080 476" className="n8n-edge n8n-edge--dashed n8n-edge--anim" />
            <path d="M 905 311 C 1070 360 1120 420 1180 476" className="n8n-edge n8n-edge--dashed n8n-edge--anim" />
          </g>

          {/* Strengths / Weaknesses as docked cards */}
          <g className="n8n-canvas__notes">
            <rect x="70" y="650" width="530" height="120" rx="14" className="n8n-note" />
            {multilineText(92, 680, 'Điểm mạnh (n8n)', 'n8n-note__title', 'start', 16)}
            {multilineText(
              92,
              704,
              ['• Kéo-thả nhanh, debug theo node', '• Integrations phong phú, HTTP linh hoạt', '• Self-host/on-prem, kiểm soát dữ liệu'],
              'n8n-note__text',
              'start',
              18,
            )}

            <rect x="630" y="650" width="580" height="120" rx="14" className="n8n-note" />
            {multilineText(652, 680, 'Điểm yếu / Rủi ro', 'n8n-note__title', 'start', 16)}
            {multilineText(
              652,
              704,
              ['• Scale lớn: queue/DB/monitoring phức tạp', '• Governance: secrets/RBAC/audit/versioning', '• Workflow rối nếu thiếu chuẩn hoá & review'],
              'n8n-note__text',
              'start',
              18,
            )}
          </g>

        </svg>
      </div>
    </div>
  );
};

export default N8nArchitectureDiagram;

