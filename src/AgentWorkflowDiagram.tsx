import React from 'react';

type EdgeTone = 'dark' | 'blue' | 'violet' | 'teal' | 'amber';

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

type CardVariant = 'plain' | 'blue' | 'teal' | 'amber' | 'indigo' | 'ai' | 'tool' | 'dashed';

type CardProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  title: string | string[];
  subtitle?: string | string[];
  icon?: string;
  variant?: CardVariant;
  center?: boolean;
  compact?: boolean;
};

const edges: EdgeConfig[] = [
  // Triggers ↔ Orchestrator (bidirectional: command down, response up)
  {
    id: 'teams-orch',
    d: 'M 170 140 L 170 215',
    tone: 'teal',
    startMarker: true,
    endMarker: true,
    label: { x: 180, y: 175, lines: ['Chat / Lệnh'], align: 'start' },
  },
  {
    id: 'http-orch',
    d: 'M 640 140 L 640 215',
    tone: 'amber',
    startMarker: true,
    endMarker: true,
    label: { x: 650, y: 175, lines: ['REST / Webhook'], align: 'start' },
  },
  {
    id: 'sched-orch',
    d: 'M 1120 140 L 1120 215',
    tone: 'violet',
    endMarker: true,
    label: { x: 1130, y: 175, lines: ['Cron trigger'], align: 'start' },
  },
  // Orchestrator → LLM Engine
  {
    id: 'orch-to-llm',
    d: 'M 1230 268 L 1255 268',
    tone: 'blue',
    endMarker: true,
    label: { x: 1232, y: 260, lines: ['Lý luận'], align: 'start' },
  },
  // LLM Engine → Orchestrator (AI response back)
  {
    id: 'llm-to-orch',
    d: 'M 1255 296 L 1230 296',
    tone: 'violet',
    endMarker: true,
    label: { x: 1232, y: 316, lines: ['AI Output'], align: 'start' },
  },
  // RAG/KB feeds context into Orchestrator
  {
    id: 'rag-to-orch',
    d: 'M 1255 393 L 1242 393 L 1242 330 L 1230 330',
    tone: 'blue',
    endMarker: true,
  },
  // Orchestrator ↔ Agents (dispatch + result return)
  {
    id: 'orch-sap',
    d: 'M 137 370 L 137 410',
    tone: 'dark',
    startMarker: true,
    endMarker: true,
  },
  {
    id: 'orch-doffice',
    d: 'M 322 370 L 322 410',
    tone: 'dark',
    startMarker: true,
    endMarker: true,
  },
  {
    id: 'orch-analytics',
    d: 'M 507 370 L 507 410',
    tone: 'dark',
    startMarker: true,
    endMarker: true,
    label: { x: 517, y: 393, lines: ['Điều phối', '/ Kết quả'], align: 'start' },
  },
  {
    id: 'orch-hr',
    d: 'M 692 370 L 692 410',
    tone: 'dark',
    startMarker: true,
    endMarker: true,
  },
  {
    id: 'orch-notif',
    d: 'M 877 370 L 877 410',
    tone: 'dark',
    startMarker: true,
    endMarker: true,
  },
  // Agents ↔ Backend Systems (query + data return)
  {
    id: 'sap-sys',
    d: 'M 137 530 L 137 575',
    tone: 'dark',
    startMarker: true,
    endMarker: true,
  },
  {
    id: 'doffice-sys',
    d: 'M 322 530 L 322 575',
    tone: 'dark',
    startMarker: true,
    endMarker: true,
  },
  {
    id: 'analytics-sys',
    d: 'M 507 530 L 507 575',
    tone: 'dark',
    startMarker: true,
    endMarker: true,
    label: { x: 517, y: 556, lines: ['Query / Data'], align: 'start' },
  },
  {
    id: 'hr-sys',
    d: 'M 692 530 L 692 575',
    tone: 'dark',
    startMarker: true,
    endMarker: true,
  },
  {
    id: 'notif-sys',
    d: 'M 877 530 L 877 575',
    tone: 'dark',
    startMarker: true,
    endMarker: true,
  },
];

function toLines(value: string | string[] | undefined): string[] {
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
  const content = toLines(value);
  return (
    <text x={x} y={y} textAnchor={anchor} className={className}>
      {content.map((line, i) => (
        <tspan key={`${line}-${i}`} x={x} dy={i === 0 ? 0 : lineHeight}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

function chipWidth(lines: string[]) {
  return Math.max(...lines.map((l) => l.length), 0) * 7.3 + 26;
}

function Card({ x, y, width, height, title, subtitle, icon, variant = 'plain', center = true, compact = false }: CardProps) {
  const titleLines = toLines(title);
  const subtitleLines = toLines(subtitle);
  const anchor = center && !icon ? 'middle' : ('start' as const);
  const titleX = center && !icon ? x + width / 2 : x + 58;
  const titleY = compact
    ? y + 28
    : subtitleLines.length
    ? y + 35
    : y + height / 2 + 6;

  const rectClass =
    variant === 'plain'
      ? 'enterprise-diagram__card'
      : `enterprise-diagram__card enterprise-diagram__card--${variant}`;

  return (
    <g filter="url(#agentShadow)">
      <rect x={x} y={y} width={width} height={height} rx="12" className={rectClass} />
      {icon ? (
        <>
          <rect x={x + 14} y={y + 14} width="32" height="20" rx="10" className="enterprise-diagram__icon-chip" />
          <text x={x + 30} y={y + 28} textAnchor="middle" className="enterprise-diagram__icon-chip-text">
            {icon}
          </text>
        </>
      ) : null}
      {multilineText(
        titleX,
        titleY,
        titleLines,
        compact
          ? 'enterprise-diagram__card-title enterprise-diagram__card-title--compact'
          : 'enterprise-diagram__card-title',
        anchor,
        compact ? 15 : 19,
      )}
      {subtitleLines.length
        ? multilineText(
            anchor === 'middle' ? x + width / 2 : x + 58,
            titleY + (compact ? 17 : 24),
            subtitleLines,
            'enterprise-diagram__card-subtitle',
            anchor,
            15,
          )
        : null}
    </g>
  );
}

function Edge({ edge }: { edge: EdgeConfig }) {
  const toneClass = (() => {
    switch (edge.tone) {
      case 'blue':   return 'enterprise-diagram__edge enterprise-diagram__edge--blue';
      case 'violet': return 'enterprise-diagram__edge enterprise-diagram__edge--violet';
      case 'teal':   return 'enterprise-diagram__edge enterprise-diagram__edge--teal';
      case 'amber':  return 'enterprise-diagram__edge enterprise-diagram__edge--amber';
      default:       return 'enterprise-diagram__edge enterprise-diagram__edge--dark';
    }
  })();

  const markerFor = (tone: EdgeTone | undefined) => {
    switch (tone) {
      case 'teal':   return 'url(#arrowTeal)';
      case 'amber':  return 'url(#arrowAmber)';
      case 'blue':   return 'url(#arrowBlue)';
      case 'violet': return 'url(#arrowViolet)';
      default:       return 'url(#arrowDark)';
    }
  };

  return (
    <g>
      <path
        d={edge.d}
        className={toneClass}
        markerStart={edge.startMarker ? markerFor(edge.tone) : undefined}
        markerEnd={edge.endMarker ? markerFor(edge.tone) : undefined}
      />
      {edge.label ? (
        <g>
          <rect
            x={edge.label.x - 8}
            y={edge.label.y - 15}
            width={chipWidth(edge.label.lines)}
            height={edge.label.lines.length * 15 + 12}
            rx="8"
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

const AgentWorkflowDiagram: React.FC = () => (
  <div className="enterprise-diagram">
    <svg
      className="enterprise-diagram__svg"
      viewBox="0 0 1480 800"
      role="img"
      aria-label="Sơ đồ kiến trúc AI Agent và Workflow Automation doanh nghiệp"
    >
      <defs>
        <linearGradient id="agentBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0f6ff" />
          <stop offset="100%" stopColor="#fafcff" />
        </linearGradient>
        {(['Dark', 'Teal', 'Amber', 'Blue', 'Violet'] as const).map((name) => {
          const fill = { Dark: '#25282c', Teal: '#0d9488', Amber: '#d97706', Blue: '#5c93e6', Violet: '#8a63d2' }[name];
          return (
            <marker
              key={name}
              id={`arrow${name}`}
              viewBox="0 0 10 10"
              refX="7.2"
              refY="5"
              markerWidth="6.5"
              markerHeight="6.5"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={fill} />
            </marker>
          );
        })}
        <filter id="agentShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.10" />
        </filter>
      </defs>

      {/* Canvas */}
      <rect x="1" y="1" width="1478" height="798" rx="18" fill="url(#agentBg)" />

      {/* ── Diagram title ── */}
      {multilineText(740, 22, 'KIẾN TRÚC AI AGENT & WORKFLOW AUTOMATION', 'enterprise-diagram__zone-title', 'middle')}

      {/* ══════════════════════════════════════════
          ROW 1 — INPUT CHANNELS
      ══════════════════════════════════════════ */}
      <Card x={55}   y={40} width={230} height={100} title="MS Teams"      subtitle="Chat Interface"   icon="MS"  variant="teal"   />
      <Card x={525}  y={40} width={230} height={100} title="HTTP Trigger"   subtitle="REST / Webhook"   icon="API" variant="amber"  />
      <Card x={1005} y={40} width={230} height={100} title="Scheduler"      subtitle="Cron / Time-based" icon="CLK" variant="indigo" />

      {/* Input channel labels */}
      {multilineText(170,  152, ['Teams Chat'], 'enterprise-diagram__card-subtitle', 'middle')}
      {multilineText(640,  152, ['HTTP POST/GET'], 'enterprise-diagram__card-subtitle', 'middle')}
      {multilineText(1120, 152, ['Định kỳ'], 'enterprise-diagram__card-subtitle', 'middle')}

      {/* ══════════════════════════════════════════
          ROW 2 — ORCHESTRATOR
      ══════════════════════════════════════════ */}
      <rect x={55} y={215} width={1175} height={155} rx="14" className="agent-diagram__orch-frame" />
      {multilineText(630, 234, 'AI ORCHESTRATOR AGENT  —  Master Agent điều phối trung tâm', 'enterprise-diagram__zone-title', 'middle')}

      {/* Orchestrator modules */}
      <Card x={75}  y={244} width={262} height={110} title="Intent Parser"    subtitle="Nhận diện ý định"    center compact variant="blue" />
      <Card x={357} y={244} width={262} height={110} title="Task Planner"     subtitle="Lập kế hoạch tác vụ" center compact variant="blue" />
      <Card x={639} y={244} width={262} height={110} title="Agent Router"     subtitle="Định tuyến Agent"    center compact variant="blue" />
      <Card x={921} y={244} width={262} height={110} title="Response Builder" subtitle="Tổng hợp phản hồi"   center compact variant="blue" />

      {/* ══════════════════════════════════════════
          AI CORE — right column
      ══════════════════════════════════════════ */}
      <rect x={1248} y={215} width={212} height={360} rx="12" className="agent-diagram__aicore-frame" />
      {multilineText(1354, 233, 'AI CORE', 'enterprise-diagram__zone-title', 'middle')}
      <Card x={1255} y={242} width={198} height={90}  title="LLM Engine"  subtitle={['Azure OpenAI', '/ Claude']} icon="AI"  variant="ai" compact center />
      <Card x={1255} y={348} width={198} height={90}  title="RAG / KB"    subtitle="Knowledge Base"               icon="KB"  variant="ai" compact center />
      <Card x={1255} y={454} width={198} height={100} title="Memory"      subtitle="Context & State"              icon="MEM" variant="ai" compact center />

      {/* ══════════════════════════════════════════
          ROW 3 — AGENT ECOSYSTEM
      ══════════════════════════════════════════ */}
      {multilineText(550, 400, 'HỆ SINH THÁI AGENT', 'enterprise-diagram__lane-title', 'middle')}

      <Card x={55}  y={410} width={165} height={120} title={['SAP', 'Agent']}       subtitle="ERP Operations"  icon="SAP" variant="blue" center compact />
      <Card x={240} y={410} width={165} height={120} title={['DOffice', 'Agent']}   subtitle="Document Mgmt"   icon="DOC" variant="blue" center compact />
      <Card x={425} y={410} width={165} height={120} title={['Analytics', 'Agent']} subtitle="Data Insights"   icon="ANA" variant="blue" center compact />
      <Card x={610} y={410} width={165} height={120} title={['HR', 'Agent']}        subtitle="Human Resources"  icon="HR"  variant="blue" center compact />
      <Card x={795} y={410} width={165} height={120} title={['Notif.', 'Agent']}    subtitle="Alert & Notify"   icon="MSG" variant="blue" center compact />
      <Card x={980} y={410} width={165} height={120} title={['+ Mở rộng']}          subtitle="Custom Agents"              variant="dashed" center compact />

      {/* ══════════════════════════════════════════
          ROW 4 — BACKEND SYSTEMS
      ══════════════════════════════════════════ */}
      {multilineText(550, 562, 'HỆ THỐNG TÍCH HỢP', 'enterprise-diagram__lane-title', 'middle')}

      <Card x={55}  y={575} width={165} height={90} title="SAP S/4HANA"             subtitle="ERP System"    icon="SAP"  variant="tool" center compact />
      <Card x={240} y={575} width={165} height={90} title={['SharePoint', '/ Teams']} subtitle="Microsoft 365" icon="M365" variant="tool" center compact />
      <Card x={425} y={575} width={165} height={90} title={['Data', 'Warehouse']}     subtitle="Analytics DB"  icon="DB"   variant="tool" center compact />
      <Card x={610} y={575} width={165} height={90} title="HRMS / HCM"               subtitle="HR System"     icon="HR"   variant="tool" center compact />
      <Card x={795} y={575} width={165} height={90} title={['Email &', 'Calendar']}   subtitle="Notifications" icon="MSG"  variant="tool" center compact />

      {/* ── Edges ── */}
      {edges.map((edge) => (
        <Edge key={edge.id} edge={edge} />
      ))}

      {/* ── Legend ── */}
      <line x1="60"  y1="706" x2="100" y2="706" className="enterprise-diagram__edge enterprise-diagram__edge--teal" markerStart="url(#arrowTeal)" markerEnd="url(#arrowTeal)" />
      {multilineText(108, 710, 'Chat / HTTP (2 chiều)', 'enterprise-diagram__edge-label', 'start')}
      <line x1="280" y1="706" x2="320" y2="706" className="enterprise-diagram__edge enterprise-diagram__edge--dark" markerStart="url(#arrowDark)" markerEnd="url(#arrowDark)" />
      {multilineText(328, 710, 'Điều phối / Dữ liệu (2 chiều)', 'enterprise-diagram__edge-label', 'start')}
      <line x1="560" y1="706" x2="600" y2="706" className="enterprise-diagram__edge enterprise-diagram__edge--violet" markerEnd="url(#arrowViolet)" />
      {multilineText(608, 710, 'Cron trigger (1 chiều)', 'enterprise-diagram__edge-label', 'start')}
      <line x1="800" y1="706" x2="840" y2="706" className="enterprise-diagram__edge enterprise-diagram__edge--blue" markerEnd="url(#arrowBlue)" />
      {multilineText(848, 710, 'AI Reasoning / RAG', 'enterprise-diagram__edge-label', 'start')}

      {/* Footer */}
      {multilineText(740, 782, 'BSR AI Lab — Tổng Công ty Lọc hóa dầu Việt Nam (BSR)  ·  Kiến trúc chuẩn AI Agent & Workflow Automation', 'enterprise-diagram__footer-title', 'middle')}
    </svg>
  </div>
);

export default AgentWorkflowDiagram;
