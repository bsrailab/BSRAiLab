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
  startMarker?: boolean;
  endMarker?: boolean;
  label?: LabelConfig;
  step?: number;
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
  // Character-count approximation. With Vietnamese diacritics + bold fonts,
  // the previous factor could under-estimate and cause label text to overflow.
  return Math.max(...value.map((line) => line.length), 0) * 8.4 + 44;
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
        ? multilineText(
            titleX,
            titleY + (compact ? 18 : 24),
            subtitleLines,
            'copilot-diagram__card-subtitle',
            titleAnchor,
            15,
          )
        : null}
    </g>
  );
}

function EdgePath({ edge, active }: { edge: EdgeConfig; active: boolean }) {
  const toneClass =
    edge.tone === 'blue' ? 'copilot-diagram__edge copilot-diagram__edge--blue' : 'copilot-diagram__edge copilot-diagram__edge--dark';

  const markerStart = edge.startMarker ? 'url(#copilotArrow)' : undefined;
  const markerEnd = edge.endMarker ? 'url(#copilotArrow)' : undefined;

  return (
    <g data-edge-id={edge.id} className={active ? 'copilot-diagram__edgewrap is-active' : 'copilot-diagram__edgewrap'}>
      <path id={`edge-${edge.id}`} d={edge.d} className={toneClass} markerStart={markerStart} markerEnd={markerEnd} />
      {active ? <path d={edge.d} className="copilot-diagram__edge-glow" /> : null}
    </g>
  );
}

function EdgeOverlay({ edge, active, showPulse }: { edge: EdgeConfig; active: boolean; showPulse: boolean }) {
  return (
    <g data-edge-overlay-id={edge.id}>
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
          <animateMotion dur="2.2s" repeatCount="indefinite" keySplines="0.2 0.8 0.2 1" keyTimes="0;1" calcMode="spline">
            <mpath href={`#edge-${edge.id}`} />
          </animateMotion>
        </circle>
      ) : null}
    </g>
  );
}

const CopilotArchitectureDiagram: React.FC = () => {
  const steps: StepConfig[] = useMemo(
    () => [
      {
        id: 1,
        title: 'Người dùng hỏi từ Teams/M365 Copilot',
        edges: ['user-to-teams'],
        nodes: ['user', 'teams'],
      },
      {
        id: 2,
        title: 'Custom Engine Agent nhận & chuyển tiếp',
        edges: ['teams-to-agent'],
        nodes: ['teams', 'agent'],
      },
      {
        id: 3,
        title: 'Copilot Studio chunking + xử lý RAG (Foundry/Search)',
        edges: ['agent-to-studio', 'studio-to-foundry', 'foundry-to-search'],
        nodes: ['agent', 'studio', 'foundry', 'search'],
      },
      {
        id: 4,
        title: 'Copilot Studio gọi Logic App/Flow',
        edges: ['studio-to-logic'],
        nodes: ['studio', 'logic'],
      },
      {
        id: 5,
        title: 'Logic App kết nối on-prem qua Data Gateway tới DB',
        edges: ['logic-to-gateway', 'gateway-to-db'],
        nodes: ['logic', 'gateway', 'db'],
      },
      {
        id: 6,
        title: 'Tổng hợp câu trả lời và trả về người dùng',
        edges: ['studio-to-agent', 'agent-to-teams'],
        nodes: ['studio', 'agent', 'teams', 'user'],
      },
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
  const activeEdges = new Set(step.edges);
  const activeNodes = new Set(step.nodes);

  const nodes: CardProps[] = [
    // Top row
    { id: 'teams', x: 260, y: 118, width: 300, height: 56, title: 'Microsoft Teams / M365 Copilot', iconText: 'M365' },
    { id: 'agent', x: 280, y: 196, width: 260, height: 78, title: 'Custom Engine Agent', subtitle: '(Custom Copilot)' },
    { id: 'studio', x: 630, y: 190, width: 320, height: 82, title: 'Microsoft Copilot Studio', subtitle: '(Orchestrator & Gateway)' },
    { id: 'logic', x: 990, y: 238, width: 220, height: 86, title: 'Azure Logic App', subtitle: '(Custom Action)' },

    // RAG path
    { id: 'foundry', x: 560, y: 318, width: 280, height: 88, title: 'Azure AI Foundry', subtitle: 'Azure OpenAI Service', iconText: 'AI', variant: 'blue' },
    { id: 'search', x: 560, y: 450, width: 280, height: 66, title: 'Azure AI Search', subtitle: '(Hybrid/Vector Index)' },
    // Make the ingestion nodes narrower so they don't overlap Search (Search starts at x=560)
    { id: 'etl', x: 270, y: 430, width: 270, height: 58, title: 'Hệ thống nạp dữ liệu', subtitle: '(Indexing Pipeline)', iconText: 'ETL', compact: true, variant: 'green' },
    { id: 'doc', x: 270, y: 505, width: 270, height: 58, title: 'Azure AI Document Intelligence', subtitle: '(Trích xuất bảng/Bố cục PDF)', iconText: 'DOC', compact: true, variant: 'green' },
    { id: 'blob', x: 270, y: 580, width: 270, height: 58, title: 'Azure Blob Storage / SharePoint', subtitle: '(Kho PDF kỹ thuật lớn)', iconText: 'PDF', compact: true, variant: 'green' },

    // On-prem path
    { id: 'gateway', x: 980, y: 410, width: 240, height: 64, title: 'On-premises Data Gateway' },
    { id: 'db', x: 960, y: 520, width: 300, height: 124, title: 'Hệ thống Database Nội bộ', subtitle: ['SQL Server   Oracle DB   PostgreSQL'] },
  ];

  const edges: EdgeConfig[] = [
    // Step 1: user -> Teams (route to header row, not through cards)
    // Keep the whole arrow inside the cloud frame (cloud starts at x=240).
    { id: 'user-to-teams', d: 'M 240 150 L 260 150', tone: 'dark', endMarker: true, step: 1 },
    { id: 'teams-to-agent', d: 'M 410 174 L 410 196', tone: 'dark', endMarker: true, step: 2 },
    { id: 'agent-to-studio', d: 'M 540 235 L 630 235', tone: 'dark', endMarker: true, label: { x: 585, y: 275, lines: ['3. Chunking', '& answers'], anchor: 'middle' }, step: 3 },
    { id: 'studio-to-foundry', d: 'M 790 272 L 790 318', tone: 'blue', endMarker: true, label: { x: 810, y: 314, lines: ['3. Xử lý RAG'], anchor: 'start' }, step: 3 },
    { id: 'foundry-to-search', d: 'M 700 406 L 700 450', tone: 'blue', endMarker: true, step: 3 },
    // Ingestion sources -> Search (merge into a junction, then connect to Search)
    { id: 'etl-to-search', d: 'M 540 461 L 520 461 L 520 483 L 560 483', tone: 'dark', endMarker: true },
    { id: 'doc-to-search', d: 'M 540 536 L 520 536 L 520 483', tone: 'dark', endMarker: true },
    { id: 'blob-to-search', d: 'M 540 611 L 520 611 L 520 483', tone: 'dark', endMarker: true },
    { id: 'studio-to-logic', d: 'M 950 230 L 1050 230 L 1050 238', tone: 'dark', endMarker: true, label: { x: 1010, y: 206, lines: ['4. Gọi API/Flow'], anchor: 'middle' }, step: 4 },
    { id: 'logic-to-gateway', d: 'M 1100 324 L 1100 410', tone: 'dark', endMarker: true, label: { x: 1126, y: 392, lines: ['5. Kết nối bảo mật'], anchor: 'start' }, step: 5 },
    { id: 'gateway-to-db', d: 'M 1100 474 L 1100 520', tone: 'dark', startMarker: true, endMarker: true, step: 5 },
    // Step 6: keep the return arrow straight
    { id: 'studio-to-agent', d: 'M 630 206 L 540 206', tone: 'dark', endMarker: true, label: { x: 585, y: 182, lines: ['6. Trả lời'], anchor: 'middle' }, step: 6 },
    { id: 'agent-to-teams', d: 'M 410 196 L 410 174', tone: 'dark', endMarker: true, step: 6 },
  ];

  return (
    <div className="copilot-diagram-shell">
      <div className="workflow-controls" role="group" aria-label="Workflow controls">
        <button type="button" className="workflow-button" onClick={() => setIsPlaying((v) => !v)}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          type="button"
          className="workflow-button"
          onClick={() => setActiveStep((prev) => (prev <= 1 ? steps.length : prev - 1))}
          aria-label="Previous step"
        >
          Prev
        </button>
        <button
          type="button"
          className="workflow-button"
          onClick={() => setActiveStep((prev) => (prev >= steps.length ? 1 : prev + 1))}
          aria-label="Next step"
        >
          Next
        </button>
        <div className="workflow-pill" aria-live="polite">
          <strong>Step {activeStep}</strong>: {step.title}
        </div>
      </div>

      <div className="enterprise-diagram">
        <svg
          className="enterprise-diagram__svg"
          viewBox="0 0 1260 720"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Sơ đồ kiến trúc tổng thể: chatbot agent doanh nghiệp trên M365 (RAG & on-prem data)"
        >
          <defs>
            <linearGradient id="copilotCloud" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#eef7ff" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <marker id="copilotArrow" viewBox="0 0 10 10" refX="7.2" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#1f2a33" />
            </marker>
          </defs>

          {multilineText(630, 44, 'SƠ ĐỒ KIẾN TRÚC TỔNG THỂ: CHATBOT AGENT DOANH NGHIỆP TRÊN M365 (RAG & ON-PREM DATA)', 'copilot-diagram__title', 'middle', 22)}

          <rect x="20" y="78" width="200" height="250" rx="10" className="copilot-diagram__side-panel" />
          {multilineText(120, 115, ['GIAO DIỆN', 'NGƯỜI DÙNG'], 'copilot-diagram__panel-title', 'middle', 24)}
          <circle cx="120" cy="185" r="22" className="copilot-diagram__user-dot" />
          <path d="M92 240 C96 212 110 202 120 202 C130 202 144 212 148 240" className="copilot-diagram__user-dot" />
          {multilineText(120, 268, ['1. Người dùng', '(Hỏi thông tin kỹ thuật)'], 'copilot-diagram__panel-sub', 'middle', 18)}

          <rect x="20" y="360" width="200" height="310" rx="10" className="copilot-diagram__side-panel" />
          {multilineText(120, 412, ['ĐỂ MỞ RỘNG', 'TƯƠNG LAI:', 'DevOps &', 'Complex Data', 'Extraction'], 'copilot-diagram__panel-title', 'middle', 30)}
          {multilineText(120, 628, ['(Scale Indexing &', 'AI Model)'], 'copilot-diagram__panel-sub', 'middle', 18)}

          <rect x="240" y="78" width="1020" height="586" rx="12" fill="url(#copilotCloud)" className="copilot-diagram__cloud-frame" />
          {multilineText(1020, 112, 'AZURE & MICROSOFT 365 / ON-PREM', 'copilot-diagram__zone-title', 'middle')}

          <line x1="240" y1="380" x2="1260" y2="380" className="copilot-diagram__divider" />

          <g className="copilot-diagram__edges">
            {edges.map((edge) => (
              <EdgePath
                key={edge.id}
                edge={edge}
                active={activeEdges.has(edge.id)}
              />
            ))}
          </g>

          <g className="copilot-diagram__nodes">
            {nodes.map((node) => (
              <Card
                key={node.id}
                {...node}
                active={activeNodes.has(node.id)}
              />
            ))}
          </g>

          <g className="copilot-diagram__overlays">
            {edges.map((edge) => (
              <EdgeOverlay key={edge.id} edge={edge} active={activeEdges.has(edge.id)} showPulse={isPlaying} />
            ))}
          </g>

          <g className="copilot-diagram__db-legend">
            {/* Keep legend inside DB card (db: x=960..1260, y=520..644) */}
            <circle cx="1005" cy="606" r="11" fill="#2f74d0" />
            <rect x="1093" y="595" width="22" height="22" rx="4" fill="#5f6672" />
            <path
              d="M1185 592
                 C1178 592 1172 598 1172 606
                 C1172 612 1176 617 1181 620
                 L1179 629
                 L1185 625
                 L1191 629
                 L1189 620
                 C1194 617 1198 612 1198 606
                 C1198 598 1192 592 1185 592 Z"
              fill="#a7b1ba"
            />
            {multilineText(1005, 636, 'SQL Server', 'copilot-diagram__db-text', 'middle')}
            {multilineText(1104, 636, 'Oracle DB', 'copilot-diagram__db-text', 'middle')}
            {multilineText(1185, 636, 'PostgreSQL', 'copilot-diagram__db-text', 'middle')}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default CopilotArchitectureDiagram;
