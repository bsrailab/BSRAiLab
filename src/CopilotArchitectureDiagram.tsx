import React from 'react';

type EdgeTone = 'dark' | 'blue' | 'violet';

type LabelConfig = {
  x: number;
  y: number;
  lines: string[];
  align?: 'start' | 'middle';
};

type EdgeConfig = {
  id: string;
  d: string;
  tone?: EdgeTone;
  startMarker?: boolean;
  endMarker?: boolean;
  label?: LabelConfig;
};

type CardProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  title: string | string[];
  subtitle?: string | string[];
  icon?: string;
  variant?: 'plain' | 'blue';
  innerPill?: string;
  center?: boolean;
  compact?: boolean;
};

const edges: EdgeConfig[] = [
  {
    id: 'user-to-agent',
    d: 'M 138 225 L 288 225',
    tone: 'dark',
    endMarker: true,
  },
  {
    id: 'agent-to-studio',
    d: 'M 514 220 L 654 220',
    tone: 'dark',
    endMarker: true,
    label: { x: 530, y: 248, lines: ['3. Chunking', '& answers'], align: 'start' },
  },
  {
    id: 'studio-to-agent',
    d: 'M 654 188 L 514 188',
    tone: 'violet',
    endMarker: true,
    label: { x: 520, y: 154, lines: ['6. Câu trả lời', 'được tổng hợp'], align: 'start' },
  },
  {
    id: 'studio-to-foundry',
    d: 'M 726 258 L 726 312',
    tone: 'blue',
    endMarker: true,
    label: { x: 744, y: 316, lines: ['3. Xử lý RAG'], align: 'start' },
  },
  {
    id: 'foundry-to-search',
    d: 'M 588 400 L 588 470',
    tone: 'blue',
    endMarker: true,
  },
  {
    id: 'search-up',
    d: 'M 664 500 L 748 500 L 748 252 L 726 252',
    tone: 'dark',
    endMarker: true,
  },
  {
    id: 'pipeline-to-search',
    d: 'M 480 500 L 518 500',
    tone: 'dark',
    endMarker: true,
  },
  {
    id: 'doc-to-search',
    d: 'M 480 568 L 518 568',
    tone: 'dark',
    endMarker: true,
  },
  {
    id: 'blob-to-search',
    d: 'M 480 636 L 518 636 L 518 532',
    tone: 'dark',
    endMarker: true,
  },
  {
    id: 'studio-to-logic',
    d: 'M 898 220 L 1034 220 L 1034 258',
    tone: 'dark',
    endMarker: true,
    label: { x: 906, y: 194, lines: ['4. Gọi API/Flow'], align: 'start' },
  },
  {
    id: 'logic-to-gateway',
    d: 'M 1034 334 L 1034 426',
    tone: 'dark',
    endMarker: true,
    label: { x: 1066, y: 398, lines: ['5. Kết nối bảo mật'], align: 'start' },
  },
  {
    id: 'gateway-to-db',
    d: 'M 1070 480 L 1070 572',
    tone: 'dark',
    startMarker: true,
    endMarker: true,
  },
];

function lines(value: string | string[] | undefined) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function multilineText(
  x: number,
  y: number,
  value: string | string[],
  className: string,
  anchor: 'start' | 'middle' = 'middle',
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
  return Math.max(...value.map((line) => line.length), 0) * 7.3 + 26;
}

function Card({
  x,
  y,
  width,
  height,
  title,
  subtitle,
  icon,
  variant = 'plain',
  innerPill,
  center = true,
  compact = false,
}: CardProps) {
  const titleLines = lines(title);
  const subtitleLines = lines(subtitle);
  const titleAnchor = center && !icon ? 'middle' : 'start';
  const titleX = center && !icon ? x + width / 2 : x + 58;
  const titleY = compact ? y + 30 : subtitle || innerPill ? y + 35 : y + 40;

  return (
    <g filter="url(#enterpriseShadow)">
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx="12"
        className={
          variant === 'blue'
            ? 'enterprise-diagram__card enterprise-diagram__card--blue'
            : 'enterprise-diagram__card'
        }
      />
      {icon ? (
        <>
          <rect x={x + 16} y={y + 18} width="30" height="20" rx="10" className="enterprise-diagram__icon-chip" />
          <text x={x + 31} y={y + 32} textAnchor="middle" className="enterprise-diagram__icon-chip-text">
            {icon}
          </text>
        </>
      ) : null}
      {multilineText(
        titleX,
        titleY,
        titleLines,
        compact ? 'enterprise-diagram__card-title enterprise-diagram__card-title--compact' : 'enterprise-diagram__card-title',
        titleAnchor,
        compact ? 16 : 19,
      )}
      {subtitleLines.length
        ? multilineText(
            titleAnchor === 'middle' ? x + width / 2 : x + 58,
            titleY + (compact ? 20 : 26),
            subtitleLines,
            'enterprise-diagram__card-subtitle',
            titleAnchor,
            15,
          )
        : null}
      {innerPill ? (
        <>
          <rect
            x={x + 30}
            y={y + height - 54}
            width={width - 60}
            height="34"
            rx="9"
            className="enterprise-diagram__inner-pill"
          />
          <text
            x={x + width / 2}
            y={y + height - 31}
            textAnchor="middle"
            className="enterprise-diagram__inner-pill-text"
          >
            {innerPill}
          </text>
        </>
      ) : null}
    </g>
  );
}

function Edge({ edge }: { edge: EdgeConfig }) {
  const toneClass =
    edge.tone === 'blue'
      ? 'enterprise-diagram__edge enterprise-diagram__edge--blue'
      : edge.tone === 'violet'
        ? 'enterprise-diagram__edge enterprise-diagram__edge--violet'
        : 'enterprise-diagram__edge enterprise-diagram__edge--dark';

  return (
    <g>
      <path
        d={edge.d}
        className={toneClass}
        markerStart={edge.startMarker ? 'url(#arrowDark)' : undefined}
        markerEnd={edge.endMarker ? 'url(#arrowDark)' : undefined}
      />
      {edge.label ? (
        <g>
          <rect
            x={edge.label.x - 10}
            y={edge.label.y - 18}
            width={chipWidth(edge.label.lines)}
            height={edge.label.lines.length * 15 + 16}
            rx="10"
            className="enterprise-diagram__label-chip"
          />
          {multilineText(
            edge.label.x,
            edge.label.y,
            edge.label.lines,
            'enterprise-diagram__edge-label',
            edge.label.align ?? 'start',
            15,
          )}
        </g>
      ) : null}
    </g>
  );
}

function DatabaseLegend() {
  return (
    <g>
      <circle cx="958" cy="646" r="13" fill="#5897dc" />
      <rect x="1046" y="633" width="24" height="24" rx="4" fill="#5f6672" />
      <path
        d="M1134 631
           C1126 631 1120 637 1120 646
           C1120 652 1124 658 1130 661
           L1127 671
           L1134 666
           L1141 671
           L1138 661
           C1144 658 1148 652 1148 646
           C1148 637 1142 631 1134 631 Z"
        fill="#a7b1ba"
      />
      {multilineText(958, 690, 'SQL Server', 'enterprise-diagram__db-label')}
      {multilineText(1058, 690, ['Oracle DB'], 'enterprise-diagram__db-label')}
      {multilineText(1134, 690, ['PostgreSQL'], 'enterprise-diagram__db-label')}
    </g>
  );
}

const CopilotArchitectureDiagram: React.FC = () => {
  return (
    <div className="enterprise-diagram">
      <svg
        className="enterprise-diagram__svg"
        viewBox="0 0 1260 760"
        role="img"
        aria-label="Sơ đồ kiến trúc tổng thể chatbot agent doanh nghiệp trên M365"
      >
        <defs>
          <linearGradient id="enterpriseCloud" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#edf6ff" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
          <marker id="arrowDark" viewBox="0 0 10 10" refX="7.2" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#25282c" />
          </marker>
          <filter id="enterpriseShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.12" />
          </filter>
        </defs>

        <rect x="1" y="1" width="1258" height="758" rx="18" fill="#ffffff" />

        <rect x="20" y="86" width="144" height="168" rx="8" className="enterprise-diagram__side-panel" />
        {multilineText(92, 118, ['GIAO DIỆN', 'NGƯỜI DÙNG'], 'enterprise-diagram__section-title', 'middle', 24)}
        <circle cx="92" cy="184" r="18" fill="#2f74d0" />
        <path d="M70 226 C73 202 84 194 92 194 C100 194 111 202 114 226" fill="#2f74d0" />
        {multilineText(92, 250, '1. Người dùng', 'enterprise-diagram__side-title')}
        {multilineText(92, 275, '(Hỏi thông tin kỹ thuật)', 'enterprise-diagram__side-subtitle')}

        <rect x="20" y="462" width="154" height="222" rx="8" className="enterprise-diagram__side-panel" />
        {multilineText(
          97,
          506,
          ['ĐỂ MỞ RỘNG', 'TƯƠNG LAI:', 'DevOps &', 'Complex Data', 'Extraction'],
          'enterprise-diagram__section-title',
          'middle',
          34,
        )}
        {multilineText(97, 662, ['(Scale Indexing &', 'AI Model)'], 'enterprise-diagram__side-subtitle', 'middle', 18)}

        <rect x="210" y="86" width="1028" height="600" rx="10" fill="url(#enterpriseCloud)" className="enterprise-diagram__cloud-frame" />
        {multilineText(895, 110, 'VÙNG ĐÁM MÂY AZURE & MICROSOFT 365', 'enterprise-diagram__zone-title')}
        <line x1="210" y1="430" x2="1238" y2="430" className="enterprise-diagram__divider" />
        <line x1="798" y1="254" x2="798" y2="686" className="enterprise-diagram__divider" />

        <Card
          x={242}
          y={110}
          width={286}
          height={54}
          title="Microsoft Teams / M365 Copilot"
          icon="M365"
        />
        <Card
          x={274}
          y={180}
          width={240}
          height={78}
          title="Custom Engine Agent"
          subtitle="(Custom Copilot)"
          center
        />
        <Card
          x={654}
          y={180}
          width={244}
          height={78}
          title="Microsoft Copilot Studio"
          subtitle="(Orchestrator & Gateway)"
          center
        />
        <Card
          x={586}
          y={314}
          width={238}
          height={88}
          title="Azure AI Foundry"
          icon="AI"
          variant="blue"
          innerPill="Azure OpenAI Service"
        />
        <Card
          x={452}
          y={468}
          width={214}
          height={64}
          title="Azure AI Search"
          subtitle="(Hybrid/Vector Index)"
          center
        />
        <Card
          x={980}
          y={242}
          width={188}
          height={90}
          title="Azure Logic App"
          subtitle="(Custom Action)"
          center
        />
        <Card
          x={964}
          y={428}
          width={212}
          height={52}
          title="On-premises Data Gateway"
          center
        />
        <Card
          x={944}
          y={568}
          width={248}
          height={110}
          title="Hệ thống Database Nội bộ"
          center
        />

        <Card
          x={240}
          y={468}
          width={240}
          height={64}
          title="Hệ thống nạp dữ liệu"
          subtitle="(Indexing Pipeline)"
          icon="ETL"
          compact
        />
        <Card
          x={240}
          y={536}
          width={240}
          height={64}
          title="Azure AI Document Intelligence"
          subtitle="(Trích xuất bảng / bóc cục PDF)"
          icon="DOC"
          compact
        />
        <Card
          x={240}
          y={604}
          width={240}
          height={64}
          title="Azure Blob Storage / SharePoint"
          subtitle="(Kho PDF kỹ thuật lớn)"
          icon="PDF"
          compact
        />

        <circle cx="356" cy="356" r="18" className="enterprise-diagram__badge-circle" />
        <text x="356" y="362" textAnchor="middle" className="enterprise-diagram__badge-text">A</text>
        {multilineText(392, 350, ['TRA CỨU TÀI LIỆU', 'PHỨC TẠP (RAG)'], 'enterprise-diagram__lane-title', 'start', 22)}

        <circle cx="828" cy="356" r="18" className="enterprise-diagram__badge-circle" />
        <text x="828" y="362" textAnchor="middle" className="enterprise-diagram__badge-text">B</text>
        {multilineText(864, 350, ['TRUY VẤN DATABASE', 'ON-PREMISE'], 'enterprise-diagram__lane-title', 'start', 22)}

        {multilineText(900, 478, ['BỨC TƯỜNG LỬA', 'DOANH NGHIỆP'], 'enterprise-diagram__firewall', 'middle', 22)}
        {multilineText(1068, 712, 'VÙNG MẠNG NỘI BỘ DOANH NGHIỆP (ON-PREMISES)', 'enterprise-diagram__footer-title')}

        {edges.map((edge) => (
          <Edge key={edge.id} edge={edge} />
        ))}

        <DatabaseLegend />
      </svg>
    </div>
  );
};

export default CopilotArchitectureDiagram;
