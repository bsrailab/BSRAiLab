import React, { useEffect, useState } from 'react';
import './App.css';
import CopilotArchitectureDiagram from './CopilotArchitectureDiagram';
import N8nArchitectureDiagram from './N8nArchitectureDiagram';
import BSRAgentArchitectureDiagram from './BSRAgentArchitectureDiagram';
import OrganizationChart from './OrganizationChart';
import UnifiedArchitectureDiagram from './UnifiedArchitectureDiagram';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light';

    const savedTheme = window.localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const logoUrl = `${import.meta.env.BASE_URL}logoBSR.png`;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-toolbar">
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? 'Dark mode' : 'Light mode'}
          </button>
        </div>
        <div className="hero-brand">
          <img src={logoUrl} alt="BSR AI Lab logo" className="hero-logo" />
          <div className="hero-copy">
            <span className="hero-kicker">BSR AI Lab</span>
            <h1>Trung tâm thúc đẩy các dự án AI, ML và DL cho IDT</h1>
            <p>
              BSR AI Lab phục vụ phát triển các dự án liên quan đến AI, Machine Learning
              và Deep Learning của Ban Công nghệ thông tin và Chuyển đổi số (IDT) thuộc
              Tổng Công ty Lọc hóa dầu Việt Nam.
            </p>
          </div>
        </div>
        <div className="hero-intro">
          <div className="hero-card">
            <h2>Thông tin đơn vị</h2>
            <p>
              Ban Công nghệ thông tin và Chuyển đổi số hiện có 34 nhân sự, tập trung vào
              xây dựng năng lực số, nền tảng dữ liệu và các sáng kiến ứng dụng AI phục vụ
              sản xuất kinh doanh.
            </p>
          </div>
          <div className="hero-card">
            <h2>Ban lãnh đạo</h2>
            <ul>
              <li>Trưởng ban: Ông Đặng Minh Tuấn</li>
              <li>Phó ban: Ông Trần Thanh Lâm</li>
              <li>Phó ban: Ông Nguyễn Đức Huy Bảo</li>
            </ul>
          </div>
        </div>

        <OrganizationChart />
      </header>
      <main>
        <section id="agent-workflow">
          <h2>Kiến trúc chuẩn AI Agent & Workflow Automation — Tổng hợp 3 kiến trúc</h2>
          <div className="architecture-content">
            <UnifiedArchitectureDiagram />
            <div className="description">
              <h3>Tổng quan</h3>
              <p>
                Blueprint chuẩn tổng hợp từ 3 kiến trúc tham chiếu: <strong>Microsoft Copilot Studio + Azure AI Foundry</strong>
                (cloud stack), <strong>Enterprise Orchestration Master Agent</strong> (generic pattern), và
                <strong> Botgent Architecture</strong> (BSR platform). Sơ đồ thể hiện rõ nền tảng xây dựng Agent,
                vị trí AI Model, tầng điều phối và toàn bộ luồng xử lý từ đầu vào đến hệ thống nghiệp vụ.
              </p>
              <h3>6 tầng kiến trúc</h3>
              <ol className="flow-steps">
                <li>
                  <strong>T1 — Kênh tiếp nhận:</strong> MS Teams (Rich Chat), HTTP API/Webhook,
                  Admin Dashboard, Mobile/Web App, Scheduler/Cron. Mọi trigger đều đi qua một điểm
                  vào duy nhất là BSR Agent ở tầng tiếp theo.
                </li>
                <li>
                  <strong>T2 — Tiếp nhận & Định tuyến (Ability Routing & Policy):</strong>{' '}
                  <em>BSR Agent</em> là entry-point, xác thực và bọc lệnh; <em>Ability Routing</em>{' '}
                  phân tích yêu cầu, chọn Agent phù hợp theo chính sách; <em>Governance & Audit</em>{' '}
                  kiểm soát bảo mật, compliance và ghi log mọi tương tác.
                </li>
                <li>
                  <strong>T3 — Điều phối trung tâm (Microsoft Copilot Studio / Azure AI Foundry):</strong>{' '}
                  Tầng quan trọng nhất. Các module <em>Intent Parser → Task Planner → Agent Router → Response Builder</em>{' '}
                  hoạt động trong Microsoft Copilot Studio. AI Core nằm trong Azure AI Foundry gồm:{' '}
                  <em>Azure OpenAI GPT-4o</em> (LLM), <em>Memory & Vector Store</em> (lịch sử + embedding),
                  và <em>RAG / Azure AI Search</em> (Knowledge Base Augmentation).
                </li>
                <li>
                  <strong>T4 — Hệ sinh thái Agent (Azure AI Foundry Agent SDK + Botgent Framework):</strong>{' '}
                  Các Agent chuyên biệt được xây dựng trên <em>Azure AI Foundry Agent SDK</em> và đóng gói
                  theo <em>Botgent Plugin Architecture</em>: SAP Agent, DOffice Agent, Analytics Agent,
                  HR Agent, Notification Agent, và các Custom Agent mở rộng.
                </li>
                <li>
                  <strong>T5 — Tích hợp hệ thống:</strong> Kết nối 2 chiều (query + data) với SAP S/4HANA,
                  SharePoint/Microsoft 365, Data Warehouse/Azure Synapse, HRMS/HCM, Email & Calendar
                  (Exchange Online), và External APIs bên ngoài.
                </li>
                <li>
                  <strong>T6 — Lưu trữ & Kiểm toán:</strong> SQL/NoSQL Database, Data Lake/Blob Storage,
                  Vector Database (embeddings), Audit Logs (compliance), Activity History (analytics).
                </li>
              </ol>
              <h3>Nền tảng công nghệ theo tầng</h3>
              <table>
                <thead><tr><th>Tầng</th><th>Nền tảng / Công nghệ</th><th>Vai trò</th></tr></thead>
                <tbody>
                  <tr><td>T3 — Orchestration</td><td>Microsoft Copilot Studio</td><td>Điều phối luồng, routing, response</td></tr>
                  <tr><td>T3 — AI Model</td><td>Azure OpenAI GPT-4o (Azure AI Foundry)</td><td>Lý luận, sinh ngôn ngữ tự nhiên</td></tr>
                  <tr><td>T3 — Knowledge</td><td>Azure AI Search + RAG</td><td>Tìm kiếm tri thức, augmentation</td></tr>
                  <tr><td>T4 — Agent SDK</td><td>Azure AI Foundry Agent SDK</td><td>Phát triển & deploy sub-agent</td></tr>
                  <tr><td>T4 — Framework</td><td>Botgent + Plugin Architecture</td><td>Đóng gói agent, quản lý plugin</td></tr>
                  <tr><td>T2 — Entry</td><td>BSR Agent (custom)</td><td>Entry point, auth, rate limiting</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
        <section id="copilot-studio">
          <h2>Copilot Studio Enterprise Agent Architecture</h2>
          <div className="architecture-content">
            <CopilotArchitectureDiagram />
            <div className="description">
              <h3>Mô tả</h3>
              <p>
                Kiến trúc này triển khai AI Agent/AI Chatbot doanh nghiệp trên nền
                Microsoft 365, trong đó Copilot Studio đóng vai trò orchestration layer,
                Azure AI Foundry xử lý RAG và sinh câu trả lời, còn Logic App cùng
                On-premises Data Gateway mở đường truy vấn an toàn tới hệ thống nội bộ.
              </p>
              <h3>Luồng chạy chính</h3>
              <ol className="flow-steps">
                <li>Người dùng gửi câu hỏi từ Teams hoặc M365 Copilot.</li>
                <li>Custom Engine Agent chuyển tiếp yêu cầu vào Copilot Studio để điều phối.</li>
                <li>Copilot Studio chọn nhánh RAG hoặc nhánh truy vấn dữ liệu on-prem.</li>
                <li>Azure AI Search và Azure OpenAI tạo câu trả lời có ngữ cảnh từ kho tri thức.</li>
                <li>Logic App và Data Gateway truy cập database nội bộ khi cần dữ liệu nghiệp vụ.</li>
                <li>Copilot Studio hợp nhất kết quả và trả phản hồi cuối cùng về cho người dùng.</li>
              </ol>
              <h3>Điểm mạnh</h3>
              <ul>
                <li>Tận dụng trực tiếp hệ sinh thái Microsoft 365 và Copilot Studio.</li>
                <li>Kết hợp được cả RAG tài liệu kỹ thuật và dữ liệu doanh nghiệp on-prem.</li>
                <li>Tách bạch orchestration, AI inference và integration nên dễ mở rộng.</li>
              </ul>
              <h3>Điểm yếu</h3>
              <ul>
                <li>Phụ thuộc tương đối lớn vào hạ tầng Azure và Microsoft stack.</li>
                <li>Thiết kế security, indexing và governance cần làm kỹ ngay từ đầu.</li>
                <li>Chi phí tăng nhanh nếu truy vấn lớn hoặc tài liệu cần xử lý thường xuyên.</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="n8n">
          <h2>n8n Workflow Automation Architecture</h2>
          <div className="architecture-content">
            <N8nArchitectureDiagram />
            <div className="description">
              <h3>Mô tả</h3>
              <p>
                n8n là nền tảng tự động hoá workflow (low-code). Kiến trúc điển hình gồm trigger (webhook/schedule),
                runtime thực thi workflow, các node tích hợp (API/DB/AI), và lớp vận hành (retry, logs, queue mode).
              </p>
              <h3>Điểm mạnh</h3>
              <ul>
                <li>Dễ tích hợp: nhiều connector + HTTP node linh hoạt.</li>
                <li>Tự host được: kiểm soát dữ liệu, mạng nội bộ, tuỳ biến.</li>
                <li>Trực quan: kéo-thả, debug theo từng node, xem input/output.</li>
                <li>Mở rộng: có queue mode, tách worker, scale theo tải.</li>
              </ul>
              <h3>Điểm yếu</h3>
              <ul>
                <li>Vận hành phức tạp hơn khi scale lớn (queue, DB, redis, monitoring).</li>
                <li>Quản trị secret/credential và phân quyền cần thiết kế kỹ.</li>
                <li>Workflow phức tạp dễ khó maintain nếu không chuẩn hoá naming/versioning.</li>
                <li>Hiệu năng phụ thuộc mạnh vào node tự viết/cách xử lý dữ liệu trong workflow.</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="bsragent">
          <h2>BSRAgent Architecture</h2>
          <div className="architecture-content">
            <BSRAgentArchitectureDiagram />
            <div className="description">
              <h3>Mô tả</h3>
              <p>
                BSRAgent là framework agent ưu tiên terminal (CLI-first) với session persistence (SQLite),
                tool calling theo schema, routing theo capability, quan sát có cấu trúc (JSONL/metrics/tracing),
                và có thể mở HTTP API (FastAPI) cho automation nội bộ.
              </p>
              <h3>Điểm mạnh</h3>
              <ul>
                <li>CLI-first + Rich UX: triển khai nhanh, dễ dùng nội bộ.</li>
                <li>Tool calling rõ ràng (schema) + guard rails (risk_level/confirmation).</li>
                <li>Multi-agent supervisor + routing theo capability.</li>
                <li>Observability tốt: session events, tool calls, metrics, tracing.</li>
                <li>Tích hợp RAG qua LightRAG tools; tích hợp hệ thống (SAP/internal tools).</li>
              </ul>
              <h3>Điểm yếu</h3>
              <ul>
                <li>UI web không phải trọng tâm (thiên về CLI); cần thêm lớp UI nếu muốn end-user scale lớn.</li>
                <li>Vận hành API/Auth (Azure AD/API key) cần cấu hình và quản trị.</li>
                <li>Phụ thuộc chất lượng tool/plugin và kỷ luật chuẩn hoá capability/policy để tránh “agent sprawl”.</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="comparison">
          <h2>So sánh các kiến trúc</h2>
          <table>
            <thead>
              <tr>
                <th>Tiêu chí</th>
                <th>Copilot Studio</th>
                <th>n8n</th>
                <th>BSRAgent</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Độ dễ sử dụng</td>
                <td>Cao</td>
                <td>Cao</td>
                <td>Trung bình</td>
              </tr>
              <tr>
                <td>Khả năng tùy chỉnh</td>
                <td>Thấp</td>
                <td>Trung bình</td>
                <td>Cao</td>
              </tr>
              <tr>
                <td>Chi phí triển khai</td>
                <td>Trung bình</td>
                <td>Thấp–Trung bình (self-host)</td>
                <td>Thấp–Trung bình (self-host)</td>
              </tr>
              <tr>
                <td>Thời gian phát triển</td>
                <td>Nhanh</td>
                <td>Nhanh</td>
                <td>Nhanh–Trung bình</td>
              </tr>
              <tr>
                <td>Khả năng mở rộng</td>
                <td>Trung bình</td>
                <td>Trung bình–Cao (queue/worker)</td>
                <td>Trung bình–Cao (multi-agent + API)</td>
              </tr>
              <tr>
                <td>Điểm mạnh nổi bật</td>
                <td>Tích hợp sâu M365 + governance enterprise</td>
                <td>Kéo-thả automation + connectors phong phú</td>
                <td>Tool calling + observability + capability routing</td>
              </tr>
              <tr>
                <td>Phù hợp nhất</td>
                <td>Doanh nghiệp M365 muốn triển khai nhanh chatbot/agent</td>
                <td>Tự động hoá quy trình + tích hợp hệ thống nhanh</td>
                <td>Đội kỹ thuật cần agent framework CLI/API + kiểm soát tool/routing</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default App;
