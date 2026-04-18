import React from 'react';

const BW = 44;
const BH = 32;
const bw2 = BW / 2;
const bh2 = BH / 2;

const CX = {
  head: 690,
  cds: 240,
  gp: 690,
  cntt: 1140,
  cdsT1: 175,
  cdsT2: 305,
  gpT1: 565,
  gpT2: 690,
  gpT3: 815,
  bm: 940,
  ht: 1040,
  gs: 1140,
  nd: 1240,
} as const;

const CY = {
  L1: 52,
  L2: 128,
  L3: 208,
  L4: 308,
  L5: 408,
  L6: 508,
} as const;

/** Cạnh dưới / trên ô theo tâm cấp */
function bottomY(cy: number) {
  return cy + bh2;
}
function topY(cy: number) {
  return cy - bh2;
}

function boxRect(cx: number, cy: number) {
  return { x: cx - bw2, y: cy - bh2, width: BW, height: BH };
}

function NumberBox({ cx, cy, n, title }: { cx: number; cy: number; n: string | number; title: string }) {
  const r = boxRect(cx, cy);
  const labelX = r.x + BW + 10;
  const labelY = cy + 5;
  return (
    <g className="org-min__unit" role="group" aria-label={title}>
      <title>{title}</title>
      <rect {...r} rx="4" className="org-min__cell" />
      <text x={cx} y={cy + 6} textAnchor="middle" className="org-min__num">
        {n}
      </text>
      <text x={labelX} y={labelY} className="org-min__label">
        {title}
      </text>
    </g>
  );
}

/**
 * Biểu mẫu Phụ lục 2: ô chỉ số, nhãn bên phải; vạch ngang đứt nét phân 6 cấp; đường liền nét.
 * Kỹ sư: không ô dưới GS tuân thủ; KTV/CĐ chỉ HT Mạng & Hỗ trợ ND.
 */
const OrganizationChart: React.FC = () => {
  const yForkHead = 78;
  const yFork34 = 236;

  return (
    <div className="org-chart org-chart--minimal" aria-labelledby="org-chart-title">
      <div className="org-chart__intro">
        <h2 id="org-chart-title" className="org-chart__title">
          Sơ đồ tổ chức — Ban Công nghệ thông tin &amp; Chuyển đổi số
        </h2>
        <p className="org-chart__subtitle">Theo biểu Phụ lục 2.</p>
      </div>

      <div className="org-chart__canvas-wrap">
        <svg
          className="org-chart__svg"
          viewBox="0 0 1380 575"
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label="Sơ đồ tổ chức 6 cấp bậc"
        >
          <g className="org-min__guides" aria-hidden="true">
            {[88, 168, 248, 348, 448].map((y) => (
              <line key={y} x1="148" y1={y} x2="1360" y2={y} className="org-min__guide-line" />
            ))}
          </g>

          <g className="org-min__rail" aria-hidden="true">
            <text x="12" y={CY.L1 + 5} className="org-min__rail-text">
              Trưởng ban
            </text>
            <text x="12" y={CY.L2 + 5} className="org-min__rail-text">
              <tspan x="12" dy="-8">
                Phó Trưởng ban /
              </tspan>
              <tspan x="12" dy="14">
                Trưởng phòng
              </tspan>
            </text>
            <text x="12" y={CY.L3 + 5} className="org-min__rail-text">
              <tspan x="12" dy="-8">
                Phó Trưởng phòng /
              </tspan>
              <tspan x="12" dy="14">
                Chuyên gia
              </tspan>
            </text>
            <text x="12" y={CY.L4 + 5} className="org-min__rail-text">
              Tổ trưởng
            </text>
            <text x="12" y={CY.L5 + 5} className="org-min__rail-text">
              Kỹ sư
            </text>
            <text x="12" y={CY.L6 + 5} className="org-min__rail-text">
              <tspan x="12" dy="-8">
                Kỹ thuật viên /
              </tspan>
              <tspan x="12" dy="14">
                Cao đẳng
              </tspan>
            </text>
          </g>

          <g className="org-min__edges" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* L1 → L2: xuống → ngang toàn nhánh → rơi 3 cột */}
            <path
              className="org-min__edge org-min__edge--tree org-min__edge--flow"
              d={`M ${CX.head} ${bottomY(CY.L1)} L ${CX.head} ${yForkHead} L ${CX.cds} ${yForkHead} L ${CX.cntt} ${yForkHead} M ${CX.cds} ${yForkHead} L ${CX.cds} ${topY(CY.L2)} M ${CX.gp} ${yForkHead} L ${CX.gp} ${topY(CY.L2)} M ${CX.cntt} ${yForkHead} L ${CX.cntt} ${topY(CY.L2)}`}
            />
            {/* L2 → L3 */}
            <path
              className="org-min__edge org-min__edge--tree"
              d={`M ${CX.cds} ${bottomY(CY.L2)} L ${CX.cds} ${topY(CY.L3)} M ${CX.gp} ${bottomY(CY.L2)} L ${CX.gp} ${topY(CY.L3)} M ${CX.cntt} ${bottomY(CY.L2)} L ${CX.cntt} ${topY(CY.L3)}`}
            />
            {/* L3 → L4 CĐS */}
            <path
              className="org-min__edge org-min__edge--tree org-min__edge--flow"
              d={`M ${CX.cds} ${bottomY(CY.L3)} L ${CX.cds} ${yFork34} L ${CX.cdsT1} ${yFork34} L ${CX.cdsT2} ${yFork34} M ${CX.cdsT1} ${yFork34} L ${CX.cdsT1} ${topY(CY.L4)} M ${CX.cdsT2} ${yFork34} L ${CX.cdsT2} ${topY(CY.L4)}`}
            />
            {/* L3 → L4 GP */}
            <path
              className="org-min__edge org-min__edge--tree org-min__edge--flow"
              d={`M ${CX.gp} ${bottomY(CY.L3)} L ${CX.gp} ${yFork34} L ${CX.gpT1} ${yFork34} L ${CX.gpT3} ${yFork34} M ${CX.gpT1} ${yFork34} L ${CX.gpT1} ${topY(CY.L4)} M ${CX.gpT2} ${yFork34} L ${CX.gpT2} ${topY(CY.L4)} M ${CX.gpT3} ${yFork34} L ${CX.gpT3} ${topY(CY.L4)}`}
            />
            {/* L3 → L4 CNTT */}
            <path
              className="org-min__edge org-min__edge--tree org-min__edge--flow"
              d={`M ${CX.cntt} ${bottomY(CY.L3)} L ${CX.cntt} ${yFork34} L ${CX.bm} ${yFork34} L ${CX.nd} ${yFork34} M ${CX.bm} ${yFork34} L ${CX.bm} ${topY(CY.L4)} M ${CX.ht} ${yFork34} L ${CX.ht} ${topY(CY.L4)} M ${CX.gs} ${yFork34} L ${CX.gs} ${topY(CY.L4)} M ${CX.nd} ${yFork34} L ${CX.nd} ${topY(CY.L4)}`}
            />
            {/* L4 → L5 */}
            <path
              className="org-min__edge org-min__edge--tree"
              d={`M ${CX.cdsT1} ${bottomY(CY.L4)} L ${CX.cdsT1} ${topY(CY.L5)} M ${CX.cdsT2} ${bottomY(CY.L4)} L ${CX.cdsT2} ${topY(CY.L5)} M ${CX.gpT1} ${bottomY(CY.L4)} L ${CX.gpT1} ${topY(CY.L5)} M ${CX.gpT2} ${bottomY(CY.L4)} L ${CX.gpT2} ${topY(CY.L5)} M ${CX.gpT3} ${bottomY(CY.L4)} L ${CX.gpT3} ${topY(CY.L5)} M ${CX.bm} ${bottomY(CY.L4)} L ${CX.bm} ${topY(CY.L5)} M ${CX.ht} ${bottomY(CY.L4)} L ${CX.ht} ${topY(CY.L5)} M ${CX.nd} ${bottomY(CY.L4)} L ${CX.nd} ${topY(CY.L5)}`}
            />
            {/* GS: không ô Kỹ sư — đường xuyên (nét đứt) */}
            <path className="org-min__edge org-min__edge--through" d={`M ${CX.gs} ${bottomY(CY.L4)} L ${CX.gs} ${bottomY(CY.L5)}`} />
            {/* L5 → L6 */}
            <path
              className="org-min__edge org-min__edge--tree org-min__edge--flow"
              d={`M ${CX.ht} ${bottomY(CY.L5)} L ${CX.ht} ${topY(CY.L6)} M ${CX.nd} ${bottomY(CY.L5)} L ${CX.nd} ${topY(CY.L6)}`}
            />
          </g>

          <NumberBox cx={CX.head} cy={CY.L1} n={1} title="Trưởng ban" />

          <NumberBox cx={CX.cds} cy={CY.L2} n={1} title="Phòng Chuyển đổi số (CĐS)" />
          <NumberBox cx={CX.gp} cy={CY.L2} n={1} title="Phòng Giải pháp (GP)" />
          <NumberBox cx={CX.cntt} cy={CY.L2} n={1} title="Phòng CNTT" />

          <NumberBox cx={CX.cds} cy={CY.L3} n={1} title="Phòng CĐS" />
          <NumberBox cx={CX.gp} cy={CY.L3} n={1} title="Phòng GP" />
          <NumberBox cx={CX.cntt} cy={CY.L3} n={1} title="Phòng CNTT" />

          <NumberBox cx={CX.cdsT1} cy={CY.L4} n={1} title="Nghiệp vụ số" />
          <NumberBox cx={CX.cdsT2} cy={CY.L4} n={1} title="Dữ liệu số" />
          <NumberBox cx={CX.gpT1} cy={CY.L4} n={1} title="GP VHSX" />
          <NumberBox cx={CX.gpT2} cy={CY.L4} n={1} title="GP Quản trị, DH" />
          <NumberBox cx={CX.gpT3} cy={CY.L4} n={1} title="GP BD, APM" />
          <NumberBox cx={CX.bm} cy={CY.L4} n={1} title="Bảo mật" />
          <NumberBox cx={CX.ht} cy={CY.L4} n={1} title="HT, Mạng" />
          <NumberBox cx={CX.gs} cy={CY.L4} n={1} title="GS tuân thủ" />
          <NumberBox cx={CX.nd} cy={CY.L4} n={1} title="Hỗ trợ người dùng" />

          <NumberBox cx={CX.cdsT1} cy={CY.L5} n={3} title="Nghiệp vụ số" />
          <NumberBox cx={CX.cdsT2} cy={CY.L5} n={3} title="Dữ liệu số" />
          <NumberBox cx={CX.gpT1} cy={CY.L5} n={4} title="GP VHSX" />
          <NumberBox cx={CX.gpT2} cy={CY.L5} n={3} title="GP Quản trị, DH" />
          <NumberBox cx={CX.gpT3} cy={CY.L5} n={4} title="GP BD, APM" />
          <NumberBox cx={CX.bm} cy={CY.L5} n={3} title="Bảo mật" />
          <NumberBox cx={CX.ht} cy={CY.L5} n={4} title="HT, Mạng" />
          <NumberBox cx={CX.nd} cy={CY.L5} n={4} title="Hỗ trợ người dùng" />

          <NumberBox cx={CX.ht} cy={CY.L6} n={2} title="HT, Mạng" />
          <NumberBox cx={CX.nd} cy={CY.L6} n={2} title="Hỗ trợ người dùng" />
        </svg>
      </div>
    </div>
  );
};

export default OrganizationChart;
