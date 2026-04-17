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

type CardVariant = 'plain' | 'blue' | 'green';

type CardProps = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  title: string | string[];
  subtitle?: string | string[];
  iconText?: string;
  variant?: CardVariant;
  compact?: boolean;
};

type StepConfig = {
  id: number;
  title: string;
  edges: string[];
  nodes: string[];
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
  lineHeight = 18,
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
  return Math.max(...value.map((line) => line.length), 0) * 8.2 + 46;
}

function labelRectX(x: number, width: number, anchor: Anchor) {
  if (anchor === 'middle') return x - width / 2;
  if (anchor === 'end') return x - width;
  return x - 10;
}

function Card({
  id,
  x,
  y,
  width,
  height,
  title,
  subtitle,
  iconText,
  variant = 'plain',
  compact = false,
  active = false,
}: CardProps & { active?: boolean }) {
  const titleLines = lines(title);
  const subtitleLines = lines(subtitle);
  const icon = iconText?.trim();
  const titleAnchor: Anchor = icon ? 'start' : 'middle';
  const titleX = icon ? x + 56 : x + width / 2;
  const titleY = compact ? y + 28 : subtitleLines.length ? y + 34 : y + 40;

  const variantClass =
    variant === 'blue'
      ? 'copilot-diagram__card copilot-diagram__card--blue'
      : variant === 'green'
        ? 'copilot-diagram__card copilot-diagram__card--green'
        : 'copilot-diagram__card';

  return (
    <g data-node-id={id} className={active ? 'copilot-diagram__node is-active' : 'copilot-diagram__node'}>
      <rect x={x} y={y} width={width} height={height} rx="10" className={variantClass} />
      {icon ? (
        <>
          <rect x={x + 14} y={y + 16} width="30" height="22" rx="10" className="copilot-diagram__chip" />
          <text x={x + 29} y={y + 32} textAnchor="middle" className="copilot-diagram__chip-text">
            {icon}
          </text>
        </>
      ) : null}
      {multilineText(
        titleX,
        titleY,
        titleLines,
        compact ? 'copilot-diagram__card-title copilot-diagram__card-title--compact' : 'copilot-diagram__card-title',
        titleAnchor,
        compact ? 16 : 18,
      )}
      {subtitleLines.length
        ? multilineText(titleX, titleY + (compact ? 18 : 24), subtitleLines, 'copilot-diagram__card-subtitle', titleAnchor, 15)
        : null}
    </g>
  );
}

function EdgePath({ edge, active }: { edge: EdgeConfig; active: boolean }) {
  const toneClass =
    edge.tone === 'blue' ? 'copilot-diagram__edge copilot-diagram__edge--blue' : 'copilot-diagram__edge copilot-diagram__edge--dark';

  return (
    <g data-edge-id={edge.id} className={active ? 'copilot-diagram__edgewrap is-active' : 'copilot-diagram__edgewrap'}>
      <path id={`bsragent-edge-${edge.id}`} d={edge.d} className={toneClass} markerEnd={edge.endMarker ? 'url(#copilotArrow)' : undefined} />
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
            <mpath href={`#bsragent-edge-${edge.id}`} />
          </animateMotion>
        </circle>
      ) : null}
    </g>
  );
}

const BSRAgentArchitectureDiagram: React.FC = () => {
  const steps: StepConfig[] = useMemo(
    () => [
      { id: 1, title: 'User dùng CLI (Rich menu) hoặc HTTP API', nodes: ['cli', 'api', 'runtime'], edges: ['cli-to-runtime', 'api-to-runtime'] },
      { id: 2, title: 'Session Runner tạo session + restore history (SQLite)', nodes: ['runtime', 'sqlite', 'history'], edges: ['runtime-to-sqlite', 'sqlite-to-history'] },
      { id: 3, title: 'Agent runtime gọi LLM qua LiteLLM', nodes: ['agents', 'llm'], edges: ['runtime-to-agents', 'agents-to-llm'] },
      { id: 4, title: 'LLM quyết định tool calling / routing (capabilities)', nodes: ['routing', 'tools'], edges: ['agents-to-routing', 'routing-to-tools'] },
      { id: 5, title: 'Tool integrations (LightRAG/SAP/Internal) + guard rails', nodes: ['tools', 'lightrag', 'sap'], edges: ['tools-to-lightrag', 'tools-to-sap'] },
      { id: 6, title: 'Observability: JSONL logs + metrics + tracing', nodes: ['obs', 'runtime'], edges: ['runtime-to-obs'] },
    ],
    [],
  );

  const [isPlaying, setIsPlaying] = useState(true);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => setActiveStep((p) => (p >= steps.length ? 1 : p + 1)), 1900);
    return () => window.clearInterval(timer);
  }, [isPlaying, steps.length]);

  const step = steps.find((s) => s.id === activeStep) ?? steps[0];
  const activeNodes = new Set(step.nodes);
  const activeEdges = new Set(step.edges);

  const nodes: CardProps[] = [
    { id: 'cli', x: 70, y: 130, width: 250, height: 76, title: 'CLI / Rich UI', subtitle: 'bsrai launch / chat', iconText: 'CLI', variant: 'green' },
    { id: 'api', x: 70, y: 220, width: 250, height: 76, title: 'HTTP API (FastAPI)', subtitle: 'sessions/messages/stream', iconText: 'API', variant: 'green' },
    { id: 'runtime', x: 360, y: 160, width: 300, height: 86, title: 'Session Runner', subtitle: 'AgentSessionRunner', iconText: 'RUN', variant: 'blue' },
    { id: 'sqlite', x: 360, y: 270, width: 300, height: 76, title: 'SQLite Persistence', subtitle: 'sessions/messages/tool_calls', iconText: 'DB' },
    { id: 'history', x: 360, y: 360, width: 300, height: 70, title: 'History Service', subtitle: 'restore/list', iconText: 'HIS' },

    { id: 'agents', x: 700, y: 150, width: 280, height: 86, title: 'Agents', subtitle: 'single + multi/supervisor', iconText: 'AG', variant: 'blue' },
    { id: 'routing', x: 700, y: 250, width: 280, height: 76, title: 'Routing/Policy', subtitle: 'capability-based', iconText: 'RT' },
    { id: 'llm', x: 1020, y: 150, width: 220, height: 86, title: 'LiteLLM', subtitle: 'multi-model runtime', iconText: 'LLM', variant: 'blue' },
    { id: 'tools', x: 1020, y: 260, width: 220, height: 76, title: 'Tools', subtitle: 'BaseTool + plugins', iconText: 'TOOL', variant: 'green' },
    { id: 'lightrag', x: 1020, y: 350, width: 220, height: 70, title: 'LightRAG', subtitle: 'KG RAG server', iconText: 'RAG' },
    { id: 'sap', x: 1020, y: 430, width: 220, height: 70, title: 'SAP / Internal', subtitle: 'read/write tools', iconText: 'SAP' },
    { id: 'obs', x: 700, y: 360, width: 280, height: 86, title: 'Observability', subtitle: 'JSONL + metrics + tracing', iconText: 'OBS' },
  ];

  const edges: EdgeConfig[] = [
    { id: 'cli-to-runtime', d: 'M 320 168 L 360 198', tone: 'dark', endMarker: true, label: { x: 330, y: 170, lines: ['Input'], anchor: 'start' } },
    { id: 'api-to-runtime', d: 'M 320 258 L 360 218', tone: 'dark', endMarker: true },
    { id: 'runtime-to-sqlite', d: 'M 510 246 L 510 270', tone: 'blue', endMarker: true, label: { x: 530, y: 266, lines: ['Persist'], anchor: 'start' } },
    { id: 'sqlite-to-history', d: 'M 510 346 L 510 360', tone: 'dark', endMarker: true },
    { id: 'runtime-to-agents', d: 'M 660 198 L 700 198', tone: 'dark', endMarker: true, label: { x: 680, y: 176, lines: ['run_turn'], anchor: 'middle' } },
    { id: 'agents-to-llm', d: 'M 980 188 L 1020 188', tone: 'blue', endMarker: true, label: { x: 1000, y: 166, lines: ['LLM'], anchor: 'middle' } },
    { id: 'agents-to-routing', d: 'M 840 236 L 840 250', tone: 'dark', endMarker: true },
    { id: 'routing-to-tools', d: 'M 980 288 L 1020 288', tone: 'dark', endMarker: true, label: { x: 1000, y: 268, lines: ['tool_call'], anchor: 'middle' } },
    { id: 'tools-to-lightrag', d: 'M 1130 336 L 1130 350', tone: 'dark', endMarker: true },
    { id: 'tools-to-sap', d: 'M 1130 420 L 1130 430', tone: 'dark', endMarker: true },
    { id: 'runtime-to-obs', d: 'M 660 230 L 700 380', tone: 'blue', endMarker: true, label: { x: 690, y: 312, lines: ['events'], anchor: 'start' } },
  ];

  return (
    <div className="copilot-diagram-shell">
      <div className="workflow-controls" role="group" aria-label="BSRAgent workflow controls">
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

      <div className="enterprise-diagram">
        <svg className="enterprise-diagram__svg" viewBox="0 0 1260 560" preserveAspectRatio="xMidYMid meet" role="img" aria-label="BSRAgent architecture diagram">
          <defs>
            <linearGradient id="bsragentCloud" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--enterprise-cloud-a)" />
              <stop offset="100%" stopColor="var(--enterprise-cloud-b)" />
            </linearGradient>
            <marker id="copilotArrow" viewBox="0 0 10 10" refX="7.2" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--arrow-dark)" />
            </marker>
          </defs>

          <rect x="20" y="80" width="1220" height="450" rx="14" fill="url(#bsragentCloud)" className="copilot-diagram__cloud-frame" />
          {multilineText(630, 48, 'BSRAGENT (CLI-FIRST AGENT FRAMEWORK)', 'copilot-diagram__title', 'middle', 22)}

          <g className="copilot-diagram__edges">
            {edges.map((edge) => (
              <EdgePath key={edge.id} edge={edge} active={activeEdges.has(edge.id)} />
            ))}
          </g>
          <g className="copilot-diagram__nodes">
            {nodes.map((node) => (
              <Card key={node.id} {...node} active={activeNodes.has(node.id)} />
            ))}
          </g>
          <g className="copilot-diagram__overlays">
            {edges.map((edge) => (
              <EdgeOverlay key={edge.id} edge={edge} active={activeEdges.has(edge.id)} showPulse={isPlaying} />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default BSRAgentArchitectureDiagram;

