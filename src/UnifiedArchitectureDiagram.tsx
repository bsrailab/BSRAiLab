import React from 'react';

/* ──────────────────────────────────────────────────────────────────
   UNIFIED AI AGENT & WORKFLOW AUTOMATION ARCHITECTURE
   Kết hợp 3 kiến trúc:
   • Image 1 – Microsoft Copilot Studio + Azure AI Foundry (cloud stack)
   • Image 2 – Enterprise Orchestration (Master Agent pattern)
   • Image 3 – Botgent Architecture (5-layer BSR standard)
   Canvas: 1680 × 1010
────────────────────────────────────────────────────────────────── */

type EdgeTone = 'dark' | 'blue' | 'violet' | 'teal' | 'amber' | 'green' | 'gray';

type LabelConfig = {
  x: number; y: number;
  lines: string[];
  align?: 'start' | 'middle';
};

type EdgeConfig = {
  id: string; d: string;
  tone?: EdgeTone;
  startMarker?: boolean;
  endMarker?: boolean;
  label?: LabelConfig;
};

type CardVariant =
  | 'plain' | 'blue' | 'teal' | 'amber' | 'indigo'
  | 'ai' | 'tool' | 'dashed' | 'gov' | 'bsr' | 'inner';

type CardProps = {
  x: number; y: number; width: number; height: number;
  title: string | string[];
  subtitle?: string | string[];
  icon?: string;
  variant?: CardVariant;
  center?: boolean;
  compact?: boolean;
};

// ── Geometry constants ──────────────────────────────────────────
const CX = 100;   // content left
const CW = 1498;  // content width → right edge = 1598

// T1 Input  y=45–165
const T1Y = 45, T1H = 120;
const T1W = 262;
const t1X = [CX, 386, 672, 958, 1244]; // 5 channels, step≈286

// T2 Entry+Routing  y=215–365
const T2Y = 215, T2H = 150;
const BSR_X = CX,   BSR_W = 290;
const RTG_X = 412,  RTG_W = 762;
const GOV_X = 1196, GOV_W = 402; // right = 1598 ✓

// T3 Orchestration+AI frame  y=420–690 (h=270)
const T3Y = 420, T3H = 270;  // bottom = 690
// T3A orchestration modules (4 cards y=470, h=100) — Copilot Studio side
const T3AY = 470, T3AH = 100;
// 4 × w=238, gap=8 → start=108, end=1084; n8n at x=1148, w=440, end=1588 ≤ 1598
const t3aX = [108, 354, 600, 846]; const T3AW = 238;
const N8N_X = 1148, N8N_W = 440; // n8n — MCP peer to Copilot Studio
// Divider y=585
const T3DIV = 585;
// T3B AI core pills (3 pills y=597, h=82) — bottom=679, frame bottom=690
const T3BY = 597, T3BH = 82;
// 3 × w=480, gap=14 → start=108, end=1576 ≤ 1598
const t3bX = [108, 602, 1096]; const T3BW = 480;

// T4 Agent frame  y=750–940 (h=190)
const T4Y = 750, T4H = 190;  // bottom = 940
// 6 agents y=800, h=128 → bottom=928 ≤ 940
const T4AY = 800, T4AH = 128;
// 6 × w=228, gap=14 → start=108, end=108+6×228+5×14=108+1368+70=1546 ≤ 1598
const t4X = [108, 350, 592, 834, 1076, 1318]; const T4W = 228;

// T5 Backend systems  y=980–1100 (h=120)
const T5Y = 980, T5H = 120;  // bottom = 1100

// T6 Persistence  y=1140–1200 (h=60)
const T6Y = 1140, T6H = 60;
// 5 × w=280, gap=14 → start=100, end=100+5×280+4×14=100+1400+56=1556 ≤ 1598
const t6X = [CX, 394, 688, 982, 1276]; const T6W = 280;

// ── Agent column centers (for arrows) ──
const agCX = t4X.map(x => x + T4W / 2);
// = [222, 464, 706, 948, 1190, 1432]

// ── Edges ─────────────────────────────────────────────────────
const edges: EdgeConfig[] = [
  // T1 → T2/T3
  // [0] HTTP Trigger → Custom Gateway (near-vertical: center 231 → gateway 245)
  { id: 't1-http', d: `M ${t1X[0]+T1W/2} ${T1Y+T1H} L ${BSR_X+BSR_W/2} ${T2Y}`, tone: 'amber', endMarker: true,
    label: { x: t1X[0]+T1W/2+8, y: T1Y+T1H+28, lines: ['REST / Webhook'], align: 'start' } },
  // [1] Admin Dashboard → Routing (straight vertical, 517 inside Routing zone)
  { id: 't1-admin', d: `M ${t1X[1]+T1W/2} ${T1Y+T1H} L ${t1X[1]+T1W/2} ${T2Y}`, tone: 'dark', endMarker: true },
  // [2] MS Teams → Routing center (near-vertical: 803 → 793, bypasses Custom Gateway)
  { id: 't1-teams', d: `M ${t1X[2]+T1W/2} ${T1Y+T1H} L ${RTG_X+RTG_W/2} ${T2Y}`, tone: 'teal', endMarker: true },
  // [3] Mobile/Web → Routing (straight vertical, 1089 inside Routing zone)
  { id: 't1-mob',   d: `M ${t1X[3]+T1W/2} ${T1Y+T1H} L ${t1X[3]+T1W/2} ${T2Y}`, tone: 'dark', endMarker: true },
  // [4] Scheduler → n8n directly (near-vertical: 1375 → 1368, bypasses T2)
  { id: 't1-sched', d: `M ${t1X[4]+T1W/2} ${T1Y+T1H} L ${N8N_X+N8N_W/2} ${T3Y}`, tone: 'violet', endMarker: true,
    label: { x: t1X[4]+T1W/2+8, y: T1Y+T1H+28, lines: ['→ n8n Cron'], align: 'start' } },

  // T2 → T3
  { id: 't2-bsr-orch', d: `M ${BSR_X+BSR_W/2} ${T2Y+T2H} L ${BSR_X+BSR_W/2} ${T3Y}`, tone: 'teal', endMarker: true },
  { id: 't2-rtg-orch', d: `M ${RTG_X+RTG_W/2} ${T2Y+T2H} L ${RTG_X+RTG_W/2} ${T3Y}`, tone: 'dark', endMarker: true,
    label: { x: RTG_X+RTG_W/2+8, y: T2Y+T2H+22, lines: ['Điều phối'], align: 'start' } },
  { id: 't2-gov-orch', d: `M ${GOV_X+GOV_W/2} ${T2Y+T2H} L ${GOV_X+GOV_W/2} ${T3Y}`, tone: 'gray', endMarker: true,
    label: { x: GOV_X+GOV_W/2+6, y: T2Y+T2H+22, lines: ['Policy'], align: 'start' } },

  // T3 → T4 (5 agents, bidirectional)
  { id: 'orch-sap',     d: `M ${agCX[0]} ${T3Y+T3H} L ${agCX[0]} ${T4Y}`, tone: 'dark', startMarker: true, endMarker: true },
  { id: 'orch-doffice', d: `M ${agCX[1]} ${T3Y+T3H} L ${agCX[1]} ${T4Y}`, tone: 'dark', startMarker: true, endMarker: true },
  { id: 'orch-analytics',d: `M ${agCX[2]} ${T3Y+T3H} L ${agCX[2]} ${T4Y}`, tone: 'dark', startMarker: true, endMarker: true,
    label: { x: agCX[2]+8, y: T3Y+T3H+24, lines: ['Dispatch', '+ Result'], align: 'start' } },
  { id: 'orch-hr',      d: `M ${agCX[3]} ${T3Y+T3H} L ${agCX[3]} ${T4Y}`, tone: 'dark', startMarker: true, endMarker: true },
  { id: 'orch-notif',   d: `M ${agCX[4]} ${T3Y+T3H} L ${agCX[4]} ${T4Y}`, tone: 'dark', startMarker: true, endMarker: true },

  // T4 → T5 (5 systems, bidirectional)
  { id: 'sap-sys',     d: `M ${agCX[0]} ${T4Y+T4H} L ${agCX[0]} ${T5Y}`, tone: 'green', startMarker: true, endMarker: true },
  { id: 'doff-sys',    d: `M ${agCX[1]} ${T4Y+T4H} L ${agCX[1]} ${T5Y}`, tone: 'green', startMarker: true, endMarker: true },
  { id: 'anal-sys',    d: `M ${agCX[2]} ${T4Y+T4H} L ${agCX[2]} ${T5Y}`, tone: 'green', startMarker: true, endMarker: true,
    label: { x: agCX[2]+8, y: T4Y+T4H+22, lines: ['Query / Data'], align: 'start' } },
  { id: 'hr-sys',      d: `M ${agCX[3]} ${T4Y+T4H} L ${agCX[3]} ${T5Y}`, tone: 'green', startMarker: true, endMarker: true },
  { id: 'notif-sys',   d: `M ${agCX[4]} ${T4Y+T4H} L ${agCX[4]} ${T5Y}`, tone: 'green', startMarker: true, endMarker: true },

  // T5 → T6 representative
  { id: 'sys-persist', d: `M 530 ${T5Y+T5H} L 530 ${T6Y}`, tone: 'dark', endMarker: true,
    label: { x: 538, y: T5Y+T5H+22, lines: ['Persist / Log'], align: 'start' } },
];

// ── Helpers ────────────────────────────────────────────────────
function toLines(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

function mlText(
  x: number, y: number, v: string | string[],
  cls: string, anchor: 'start' | 'middle' | 'end' = 'middle', lh = 18,
) {
  const ls = toLines(v);
  return (
    <text x={x} y={y} textAnchor={anchor} className={cls}>
      {ls.map((l, i) => <tspan key={`${l}-${i}`} x={x} dy={i === 0 ? 0 : lh}>{l}</tspan>)}
    </text>
  );
}

function chipW(lines: string[]) {
  return Math.max(...lines.map(l => l.length), 0) * 7.2 + 24;
}

function Card({ x, y, width, height, title, subtitle, icon, variant = 'plain', center = true, compact = false }: CardProps) {
  const tl = toLines(title);
  const sl = toLines(subtitle);
  const anchor = center && !icon ? 'middle' : ('start' as const);
  const tx = center && !icon ? x + width / 2 : x + 50;
  const ty = compact ? y + 26 : sl.length ? y + 32 : y + height / 2 + 5;
  const titleLH = compact ? 14 : 18;
  // subtitle Y accounts for all title lines to prevent overlap
  const subtitleY = ty + titleLH * tl.length + (compact ? 2 : 4);
  const cls = variant === 'plain' ? 'enterprise-diagram__card' : `enterprise-diagram__card enterprise-diagram__card--${variant}`;
  return (
    <g filter="url(#uniShadow)">
      <rect x={x} y={y} width={width} height={height} rx="11" className={cls} />
      {icon && (
        <g className={`icon-ph icon-ph--${icon}`}>
          <rect x={x+10} y={y+10} width="28" height="28" rx="7" className="enterprise-diagram__icon-chip" />
          <rect x={x+14} y={y+15} width="8" height="8" rx="2" fill="rgba(255,255,255,0.6)" />
          <rect x={x+24} y={y+15} width="8" height="8" rx="2" fill="rgba(255,255,255,0.38)" />
          <rect x={x+14} y={y+25} width="8" height="8" rx="2" fill="rgba(255,255,255,0.38)" />
          <rect x={x+24} y={y+25} width="8" height="8" rx="2" fill="rgba(255,255,255,0.6)" />
        </g>
      )}
      {mlText(tx, ty, tl,
        compact ? 'enterprise-diagram__card-title enterprise-diagram__card-title--compact' : 'enterprise-diagram__card-title',
        anchor, titleLH)}
      {sl.length ? mlText(anchor === 'middle' ? x+width/2 : x+50, subtitleY, sl, 'enterprise-diagram__card-subtitle', anchor, 14) : null}
    </g>
  );
}

function Edge({ edge }: { edge: EdgeConfig }) {
  const COLORS: Record<EdgeTone, string> = {
    dark: '#25282c', blue: '#5c93e6', violet: '#8a63d2',
    teal: '#0d9488', amber: '#d97706', green: '#16a34a', gray: '#6b7280',
  };
  const DASHES: Partial<Record<EdgeTone, string>> = { violet: '8 6', gray: '6 5' };
  const c = COLORS[edge.tone ?? 'dark'];
  const d = DASHES[edge.tone ?? 'dark'];
  const mk = (id: string) => `url(#arrow_${id})`;
  const tone = edge.tone ?? 'dark';
  return (
    <g>
      <path d={edge.d} fill="none" stroke={c} strokeWidth={2.3} strokeLinecap="round"
        strokeDasharray={d} strokeLinejoin="round"
        markerStart={edge.startMarker ? mk(tone) : undefined}
        markerEnd={edge.endMarker ? mk(tone) : undefined} />
      {edge.label && (
        <g>
          <rect x={edge.label.x-6} y={edge.label.y-14} width={chipW(edge.label.lines)}
            height={edge.label.lines.length*14+12} rx="7" className="enterprise-diagram__label-chip" />
          {mlText(edge.label.x, edge.label.y, edge.label.lines, 'enterprise-diagram__edge-label', edge.label.align ?? 'start', 14)}
        </g>
      )}
    </g>
  );
}

// ── Layer badge (left side) ──────────────────────────────────
function LayerBadge({ y, height, color, n, label }: { y: number; height: number; color: string; n: string; label: string }) {
  const cy = y + height / 2;
  return (
    <g>
      <rect x={5} y={y} width={88} height={height} rx="10" fill={color} opacity={0.88} />
      <text x={49} y={cy - 8} textAnchor="middle" fill="white" fontSize={13} fontWeight={800}>{n}</text>
      <text x={49} y={cy + 8} textAnchor="middle" fill="rgba(255,255,255,0.85)" fontSize={9} fontWeight={700}>{label}</text>
    </g>
  );
}

// ── Main Component ─────────────────────────────────────────────
const UnifiedArchitectureDiagram: React.FC = () => {
  // Generate color-matched SVG markers for each tone
  const markers: Array<[string, string]> = [
    ['dark', '#25282c'], ['blue', '#5c93e6'], ['violet', '#8a63d2'],
    ['teal', '#0d9488'], ['amber', '#d97706'], ['green', '#16a34a'], ['gray', '#6b7280'],
  ];

  return (
    <div className="enterprise-diagram">
      <svg className="enterprise-diagram__svg" viewBox="0 0 1680 1280"
        role="img" aria-label="Kiến trúc chuẩn AI Agent doanh nghiệp – kết hợp Copilot Studio, Azure AI Foundry, Botgent">
        <defs>
          <linearGradient id="uniBg" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#eef4ff" />
            <stop offset="100%" stopColor="#f8fbff" />
          </linearGradient>
          {markers.map(([id, fill]) => (
            <marker key={id} id={`arrow_${id}`} viewBox="0 0 10 10" refX="7.2" refY="5"
              markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={fill} />
            </marker>
          ))}
          <filter id="uniShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="2" stdDeviation="3.5" floodOpacity="0.10" />
          </filter>
        </defs>

        {/* Canvas */}
        <rect x="1" y="1" width="1678" height="1278" rx="18" fill="url(#uniBg)" />

        {/* ══ DIAGRAM TITLE ══ */}
        {mlText(840, 24, 'SƠ ĐỒ KIẾN TRÚC CHUẨN AI AGENT & WORKFLOW AUTOMATION DOANH NGHIỆP', 'enterprise-diagram__zone-title', 'middle')}
        {mlText(840, 38, 'Kết hợp: Microsoft Copilot Studio  ·  Azure AI Foundry  ·  Botgent Framework', 'enterprise-diagram__card-subtitle', 'middle')}

        {/* ══ LEFT LAYER BADGES ══ */}
        <LayerBadge y={T1Y}     height={T1H}     color="#0d9488" n="T1" label="TIẾP NHẬN" />
        <LayerBadge y={T2Y}     height={T2H}     color="#6366f1" n="T2" label="ĐỊNH TUYẾN" />
        <LayerBadge y={T3Y}     height={T3H}     color="#1d4ed8" n="T3" label="ĐIỀU PHỐI" />
        <LayerBadge y={T4Y}     height={T4H}     color="#7c3aed" n="T4" label="AGENT" />
        <LayerBadge y={T5Y}     height={T5H}     color="#16a34a" n="T5" label="TÍCH HỢP" />
        <LayerBadge y={T6Y}     height={T6H}     color="#64748b" n="T6" label="LƯU TRỮ" />

        {/* ══════════════════════════════════════════════════════
            TẦNG 1 — KÊNH TIẾP NHẬN LỆNH
        ══════════════════════════════════════════════════════ */}
        {mlText(840, 52, 'TẦNG 1  —  KÊNH TIẾP NHẬN LỆNH', 'enterprise-diagram__zone-title', 'middle')}
        <Card x={t1X[0]} y={T1Y+14} width={T1W} height={T1H-14} title="HTTP Trigger" subtitle={['REST API', '/ Webhook']} icon="API" variant="amber" compact center />
        <Card x={t1X[1]} y={T1Y+14} width={T1W} height={T1H-14} title="Admin Dashboard" subtitle={['Web Console', '/ Portal']} icon="ADM" compact center />
        <Card x={t1X[2]} y={T1Y+14} width={T1W} height={T1H-14} title="MS Teams" subtitle={['Rich Chat', '/ Chatbot']} icon="MS" variant="teal" compact center />
        <Card x={t1X[3]} y={T1Y+14} width={T1W} height={T1H-14} title="Mobile / Web App" subtitle={['User Interface']} icon="APP" compact center />
        <Card x={t1X[4]} y={T1Y+14} width={T1W} height={T1H-14} title="Scheduler" subtitle={['Cron / Time-based', 'Automation']} icon="CLK" variant="indigo" compact center />

        {/* ══════════════════════════════════════════════════════
            TẦNG 2 — TIẾP NHẬN & ĐỊNH TUYẾN (Ability Routing & Policy)
        ══════════════════════════════════════════════════════ */}
        {mlText(840, 223, 'TẦNG 2  —  TIẾP NHẬN, ĐỊNH TUYẾN & CHÍNH SÁCH', 'enterprise-diagram__zone-title', 'middle')}

        {/* BSR Agent */}
        <Card x={BSR_X} y={T2Y+14} width={BSR_W} height={T2H-14} variant="bsr"
          title={['Custom Gateway']} subtitle={['Auth · Rate Limit', 'HTTP / Non-Teams']} icon="GW" compact center />

        {/* Ability Routing & Policy (center, large) */}
        <g filter="url(#uniShadow)">
          <rect x={RTG_X} y={T2Y+14} width={RTG_W} height={T2H-14} rx="11" className="enterprise-diagram__card enterprise-diagram__card--blue" />
          {mlText(RTG_X + RTG_W/2, T2Y+38, 'ABILITY ROUTING & POLICY', 'enterprise-diagram__card-title', 'middle')}
          {mlText(RTG_X + RTG_W/2, T2Y+56, 'Enterprise Orchestrator  —  phân tích yêu cầu, chọn Agent và chính sách xử lý', 'enterprise-diagram__card-subtitle', 'middle')}
          {/* Inner pills: 3 mini boxes */}
          {(['Intent Detection', 'Policy Check', 'Agent Selection'] as const).map((label, i) => (
            <g key={label}>
              <rect x={RTG_X + 18 + i*248} y={T2Y+66} width={228} height={42} rx="8" className="enterprise-diagram__inner-pill" />
              {mlText(RTG_X + 18 + i*248 + 114, T2Y+91, label, 'enterprise-diagram__inner-pill-text', 'middle')}
            </g>
          ))}
        </g>

        {/* Governance & Audit */}
        <Card x={GOV_X} y={T2Y+14} width={GOV_W} height={T2H-14} variant="gov"
          title={['Governance & Audit']} subtitle={['Security · Compliance', 'Rate Limit · Log']} icon="GOV" compact center />

        {/* ══════════════════════════════════════════════════════
            TẦNG 3 — ĐIỀU PHỐI TRUNG TÂM + AI CORE
            Platform: Microsoft Copilot Studio + Azure AI Foundry
        ══════════════════════════════════════════════════════ */}

        {/* Outer platform frame */}
        <rect x={CX} y={T3Y} width={CW} height={T3H} rx="14" className="agent-diagram__orch-frame" />

        {/* Platform labels */}
        {mlText(CX + CW/2, T3Y+17, 'TẦNG 3  —  ĐIỀU PHỐI TRUNG TÂM (ORCHESTRATION)', 'enterprise-diagram__zone-title', 'middle')}
        {mlText(CX+12, T3Y+30, 'Platform: Microsoft Copilot Studio  +  n8n Workflow Engine (via MCP)', 'enterprise-diagram__card-subtitle', 'start')}
        {mlText(CX + CW - 12, T3Y+30, 'Infrastructure: Azure AI Foundry', 'enterprise-diagram__card-subtitle', 'end')}
        {/* T3A — Copilot Studio Orchestration Modules */}
        <Card x={t3aX[0]} y={T3AY} width={T3AW} height={T3AH} variant="blue" compact center
          title="Intent Parser" subtitle={['Phân tích ý định', '& ngữ cảnh (Context)']} />
        <Card x={t3aX[1]} y={T3AY} width={T3AW} height={T3AH} variant="blue" compact center
          title="Task Planner" subtitle={['Lập kế hoạch hành động', '(Chain-of-Thought)']} />
        <Card x={t3aX[2]} y={T3AY} width={T3AW} height={T3AH} variant="blue" compact center
          title="Agent Router" subtitle={['Định tuyến đến', 'Sub-Agent phù hợp']} />
        <Card x={t3aX[3]} y={T3AY} width={T3AW} height={T3AH} variant="blue" compact center
          title="Response Builder" subtitle={['Tổng hợp & format', 'phản hồi cuối']} />

        {/* MCP connector between Copilot Studio modules and n8n */}
        <line x1={t3aX[3]+T3AW+6} y1={T3AY+T3AH/2} x2={N8N_X-6} y2={T3AY+T3AH/2}
          stroke="#8a63d2" strokeWidth={2.2} strokeLinecap="round" strokeDasharray="6 4"
          markerEnd="url(#arrow_violet)" markerStart="url(#arrow_violet)" />
        <rect x={(t3aX[3]+T3AW+N8N_X)/2-22} y={T3AY+T3AH/2-10} width={44} height={20} rx="6"
          className="enterprise-diagram__label-chip" />
        {mlText((t3aX[3]+T3AW+N8N_X)/2, T3AY+T3AH/2+4, 'MCP', 'enterprise-diagram__inner-pill-text', 'middle')}

        {/* n8n Workflow Engine — MCP Server peer to Copilot Studio */}
        <Card x={N8N_X} y={T3AY} width={N8N_W} height={T3AH} variant="amber" compact center icon="n8n"
          title="n8n Workflow Engine" subtitle={['MCP Server · Visual Automation', 'Self-hosted / Cloud']} />

        {/* Divider */}
        <line x1={CX+12} y1={T3DIV} x2={CX+CW-12} y2={T3DIV} className="enterprise-diagram__divider" />
        {mlText(CX+12, T3DIV+10, '▼  AI CORE  —  nền tảng xử lý trí tuệ (Azure AI Foundry)', 'enterprise-diagram__card-subtitle', 'start')}

        {/* T3B — AI Core (Azure OpenAI + Memory + RAG) */}
        {/* Azure OpenAI */}
        <g filter="url(#uniShadow)">
          <rect x={t3bX[0]} y={T3BY+8} width={T3BW} height={T3BH-8} rx="10" className="enterprise-diagram__card enterprise-diagram__card--ai" />
          <rect x={t3bX[0]+10} y={T3BY+12} width="28" height="28" rx="7" className="enterprise-diagram__icon-chip" />
          <rect x={t3bX[0]+14} y={T3BY+17} width="8" height="8" rx="2" fill="rgba(255,255,255,0.6)" />
          <rect x={t3bX[0]+24} y={T3BY+17} width="8" height="8" rx="2" fill="rgba(255,255,255,0.38)" />
          <rect x={t3bX[0]+14} y={T3BY+27} width="8" height="8" rx="2" fill="rgba(255,255,255,0.38)" />
          <rect x={t3bX[0]+24} y={T3BY+27} width="8" height="8" rx="2" fill="rgba(255,255,255,0.6)" />
          {mlText(t3bX[0]+T3BW/2, T3BY+30, 'Azure OpenAI — AI Model', 'enterprise-diagram__card-title enterprise-diagram__card-title--compact', 'middle')}
          {mlText(t3bX[0]+T3BW/2, T3BY+46, ['GPT-4o · GPT-4o-mini · Ada-Embedding', '(hosted on Azure AI Foundry)'], 'enterprise-diagram__card-subtitle', 'middle')}
        </g>

        {/* Memory & Vector Store */}
        <g filter="url(#uniShadow)">
          <rect x={t3bX[1]} y={T3BY+8} width={T3BW} height={T3BH-8} rx="10" className="enterprise-diagram__card enterprise-diagram__card--ai" />
          <rect x={t3bX[1]+10} y={T3BY+12} width="28" height="28" rx="7" className="enterprise-diagram__icon-chip" />
          <rect x={t3bX[1]+14} y={T3BY+17} width="8" height="8" rx="2" fill="rgba(255,255,255,0.6)" />
          <rect x={t3bX[1]+24} y={T3BY+17} width="8" height="8" rx="2" fill="rgba(255,255,255,0.38)" />
          <rect x={t3bX[1]+14} y={T3BY+27} width="8" height="8" rx="2" fill="rgba(255,255,255,0.38)" />
          <rect x={t3bX[1]+24} y={T3BY+27} width="8" height="8" rx="2" fill="rgba(255,255,255,0.6)" />
          {mlText(t3bX[1]+T3BW/2, T3BY+30, 'Memory & Vector Store', 'enterprise-diagram__card-title enterprise-diagram__card-title--compact', 'middle')}
          {mlText(t3bX[1]+T3BW/2, T3BY+46, ['Conversation history · Embeddings', 'Session state (Redis / CosmosDB)'], 'enterprise-diagram__card-subtitle', 'middle')}
        </g>

        {/* RAG / Azure AI Search */}
        <g filter="url(#uniShadow)">
          <rect x={t3bX[2]} y={T3BY+8} width={T3BW} height={T3BH-8} rx="10" className="enterprise-diagram__card enterprise-diagram__card--ai" />
          <rect x={t3bX[2]+10} y={T3BY+12} width="28" height="28" rx="7" className="enterprise-diagram__icon-chip" />
          <rect x={t3bX[2]+14} y={T3BY+17} width="8" height="8" rx="2" fill="rgba(255,255,255,0.6)" />
          <rect x={t3bX[2]+24} y={T3BY+17} width="8" height="8" rx="2" fill="rgba(255,255,255,0.38)" />
          <rect x={t3bX[2]+14} y={T3BY+27} width="8" height="8" rx="2" fill="rgba(255,255,255,0.38)" />
          <rect x={t3bX[2]+24} y={T3BY+27} width="8" height="8" rx="2" fill="rgba(255,255,255,0.6)" />
          {mlText(t3bX[2]+T3BW/2, T3BY+30, 'RAG / Azure AI Search', 'enterprise-diagram__card-title enterprise-diagram__card-title--compact', 'middle')}
          {mlText(t3bX[2]+T3BW/2, T3BY+46, ['Knowledge Base Augmentation', 'Vector / Hybrid Index · Azure AI Search'], 'enterprise-diagram__card-subtitle', 'middle')}
        </g>

        {/* ══════════════════════════════════════════════════════
            TẦNG 4 — HỆ SINH THÁI AGENT
            Platform: Azure AI Foundry Agent SDK + Botgent Framework
        ══════════════════════════════════════════════════════ */}

        {/* Agent platform frame */}
        <rect x={CX} y={T4Y} width={CW} height={T4H} rx="14" className="agent-diagram__agent-frame" />
        {mlText(CX + CW/2, T4Y+16, 'TẦNG 4  —  HỆ SINH THÁI AGENT', 'enterprise-diagram__zone-title', 'middle')}
        {mlText(CX+12, T4Y+28, 'Built on: Azure AI Foundry Agent SDK', 'enterprise-diagram__card-subtitle', 'start')}
        {mlText(CX + CW-12, T4Y+28, 'Framework: Botgent + Plugin Architecture', 'enterprise-diagram__card-subtitle', 'end')}

        <Card x={t4X[0]} y={T4AY} width={T4W} height={T4AH} variant="blue" compact center icon="SAP"
          title="SAP Agent" subtitle={['ERP · S/4HANA', 'Procurement · MM']} />
        <Card x={t4X[1]} y={T4AY} width={T4W} height={T4AH} variant="blue" compact center icon="DOC"
          title="DOffice Agent" subtitle={['Document Mgmt', 'SharePoint · DMS']} />
        <Card x={t4X[2]} y={T4AY} width={T4W} height={T4AH} variant="blue" compact center icon="ANA"
          title="Analytics Agent" subtitle={['BI · Reports', 'Data Warehouse']} />
        <Card x={t4X[3]} y={T4AY} width={T4W} height={T4AH} variant="blue" compact center icon="HR"
          title="HR Agent" subtitle={['HRMS · Payroll', 'Leave · Training']} />
        <Card x={t4X[4]} y={T4AY} width={T4W} height={T4AH} variant="blue" compact center icon="MSG"
          title="Notif. Agent" subtitle={['Alert · Email', 'Teams · Calendar']} />
        <Card x={t4X[5]} y={T4AY} width={T4W} height={T4AH} variant="dashed" compact center
          title="+ Custom Agent" subtitle={['Botgent Plugin', '/ Extension']} />

        {/* ══════════════════════════════════════════════════════
            TẦNG 5 — HỆ THỐNG TÍCH HỢP NGHIỆP VỤ
        ══════════════════════════════════════════════════════ */}
        {mlText(840, T5Y+10, 'TẦNG 5  —  HỆ THỐNG TÍCH HỢP & HÀNH ĐỘNG', 'enterprise-diagram__zone-title', 'middle')}

        <Card x={t4X[0]} y={T5Y+20} width={T4W} height={T5H-20} variant="tool" compact center icon="SAP"
          title="SAP S/4HANA" subtitle={['ERP System', 'On-premise / Cloud']} />
        <Card x={t4X[1]} y={T5Y+20} width={T4W} height={T5H-20} variant="tool" compact center icon="M365"
          title={['SharePoint', '/ M365 Teams']} subtitle={['Microsoft 365', 'Graph API']} />
        <Card x={t4X[2]} y={T5Y+20} width={T4W} height={T5H-20} variant="tool" compact center icon="DB"
          title={['Data Warehouse', '/ Analytics']} subtitle={['Azure Synapse', '/ Power BI']} />
        <Card x={t4X[3]} y={T5Y+20} width={T4W} height={T5H-20} variant="tool" compact center icon="HR"
          title="HRMS / HCM" subtitle={['HR System', 'Payroll API']} />
        <Card x={t4X[4]} y={T5Y+20} width={T4W} height={T5H-20} variant="tool" compact center icon="MSG"
          title={['Email &', 'Calendar']} subtitle={['Exchange Online', '/ Outlook API']} />
        <Card x={t4X[5]} y={T5Y+20} width={T4W} height={T5H-20} variant="tool" compact center icon="EXT"
          title="External APIs" subtitle={['3rd Party', 'Services']} />

        {/* ══════════════════════════════════════════════════════
            TẦNG 6 — LƯU TRỮ & KIỂM TOÁN
        ══════════════════════════════════════════════════════ */}
        {mlText(840, T6Y+8, 'TẦNG 6  —  LƯU TRỮ DỮ LIỆU & KIỂM TOÁN (Data Persistence & History)', 'enterprise-diagram__zone-title', 'middle')}

        {(['SQL / NoSQL\nDatabase', 'Data Lake\n/ Blob Storage', 'Vector Database\n(Embeddings)', 'Audit Logs\n/ Compliance', 'Activity History\n& Analytics'] as const).map((label, i) => (
          <g key={label} filter="url(#uniShadow)">
            <rect x={t6X[i]} y={T6Y+14} width={T6W} height={T6H-14} rx="9" className="enterprise-diagram__card enterprise-diagram__card--tool" opacity={0.85} />
            {mlText(t6X[i]+T6W/2, T6Y+26, label.split('\n'), 'enterprise-diagram__card-subtitle', 'middle', 13)}
          </g>
        ))}

        {/* ══ EDGES ══ */}
        {edges.map(edge => <Edge key={edge.id} edge={edge} />)}

        {/* ══ LEGEND ══ */}
        <rect x={100} y={1210} width={1498} height={28} rx="6" fill="rgba(255,255,255,0.65)" />
        {([
          ['teal',  '#0d9488', 'Chat / Lệnh (2 chiều)'],
          ['amber', '#d97706', 'HTTP / Webhook (2 chiều)'],
          ['violet','#8a63d2', 'Cron (1 chiều)'],
          ['dark',  '#25282c', 'Điều phối / Data (2 chiều)'],
          ['green', '#16a34a', 'Agent ↔ System (2 chiều)'],
          ['gray',  '#6b7280', 'Policy / Audit (dashed)'],
        ] as const).map(([tone, color, label], i) => (
          <g key={tone}>
            <line x1={118+i*234} y1={1224} x2={148+i*234} y2={1224}
              stroke={color} strokeWidth={2.2} strokeLinecap="round"
              markerStart={['teal','amber','dark','green'].includes(tone) ? `url(#arrow_${tone})` : undefined}
              markerEnd={`url(#arrow_${tone})`}
              strokeDasharray={tone === 'gray' ? '5 4' : undefined} />
            {mlText(153+i*234, 1228, label, 'enterprise-diagram__edge-label', 'start')}
          </g>
        ))}

        {/* ══ FOOTER ══ */}
        {mlText(840, 1263,
          'BSR AI Lab · Tổng Công ty Lọc hóa dầu Việt Nam  ·  Kiến trúc chuẩn AI Agent & Workflow Automation  ·  Ref: Copilot Studio + Azure AI Foundry + Botgent',
          'enterprise-diagram__footer-title', 'middle')}
      </svg>
    </div>
  );
};

export default UnifiedArchitectureDiagram;
