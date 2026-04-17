import React, { useEffect, useState } from 'react';
import './App.css';
import CopilotArchitectureDiagram from './CopilotArchitectureDiagram';
import N8nArchitectureDiagram from './N8nArchitectureDiagram';
import MermaidDiagram from './MermaidDiagram';

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
  const azureFlow = `
  graph TD
    A[User Input] --> B[Azure AI Foundry]
    B --> C[OpenAI Models]
    C --> D[Process & Enhance]
    D --> E[Response]
  `;

  const customFlow = `
  graph TD
    A[Input] --> B[Custom Logic]
    B --> C[AI Processing]
    C --> D[Output]
  `;

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
      </header>
      <main>
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

        <section id="azure-ai-foundry">
          <h2>Azure AI Foundry (Azure OpenAI) Architecture</h2>
          <div className="architecture-content">
            <div className="image-placeholder">
              <p>Placeholder for Azure AI Foundry Architecture Image</p>
            </div>
            <div className="description">
              <h3>Mô tả</h3>
              <p>Azure AI Foundry cung cấp nền tảng để xây dựng, triển khai và quản lý các mô hình AI, đặc biệt là OpenAI models.</p>
              <h3>Điểm mạnh</h3>
              <ul>
                <li>Truy cập vào các mô hình tiên tiến</li>
                <li>Tích hợp mạnh mẽ với Azure services</li>
                <li>Khả năng scale cao</li>
              </ul>
              <h3>Điểm yếu</h3>
              <ul>
                <li>Yêu cầu kiến thức kỹ thuật</li>
                <li>Chi phí phức tạp</li>
                <li>Phụ thuộc vào Azure</li>
              </ul>
            </div>
            <div className="flow-animation">
              <MermaidDiagram chart={azureFlow} />
            </div>
          </div>
        </section>
        <section id="custom-project">
          <h2>Custom Project Architecture</h2>
          <div className="architecture-content">
            <div className="image-placeholder">
              <p>Placeholder for Custom Project Architecture Image</p>
            </div>
            <div className="description">
              <h3>Mô tả</h3>
              <p>Kiến trúc tùy chỉnh được thiết kế riêng cho dự án cụ thể, cho phép tối ưu hóa theo nhu cầu.</p>
              <h3>Điểm mạnh</h3>
              <ul>
                <li>Tùy chỉnh hoàn toàn</li>
                <li>Tối ưu hiệu suất</li>
                <li>Không phụ thuộc vendor</li>
              </ul>
              <h3>Điểm yếu</h3>
              <ul>
                <li>Yêu cầu đội ngũ chuyên môn</li>
                <li>Thời gian phát triển lâu</li>
                <li>Chi phí ban đầu cao</li>
              </ul>
            </div>
            <div className="flow-animation">
              <MermaidDiagram chart={customFlow} />
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
                <th>Azure AI Foundry</th>
                <th>Custom Project</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Độ dễ sử dụng</td>
                <td>Cao</td>
                <td>Trung bình</td>
                <td>Thấp</td>
              </tr>
              <tr>
                <td>Khả năng tùy chỉnh</td>
                <td>Thấp</td>
                <td>Cao</td>
                <td>Cao</td>
              </tr>
              <tr>
                <td>Chi phí triển khai</td>
                <td>Trung bình</td>
                <td>Cao</td>
                <td>Cao</td>
              </tr>
              <tr>
                <td>Thời gian phát triển</td>
                <td>Nhanh</td>
                <td>Trung bình</td>
                <td>Lâu</td>
              </tr>
              <tr>
                <td>Khả năng mở rộng</td>
                <td>Trung bình</td>
                <td>Cao</td>
                <td>Cao</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default App;
