import React from 'react';
import './App.css';
import MermaidDiagram from './MermaidDiagram';

function App() {
  const logoUrl = `${import.meta.env.BASE_URL}logoBSR.png`;
  const copilotFlow = `
  graph TD
    A[User Input] --> B[Copilot Studio]
    B --> C[Process Request]
    C --> D[Generate Response]
    D --> E[Output]
  `;

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

  return (
    <div className="App">
      <header className="App-header">
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
          <h2>Copilot Studio Architecture</h2>
          <div className="architecture-content">
            <div className="image-placeholder">
              <p>Placeholder for Copilot Studio Architecture Image</p>
            </div>
            <div className="description">
              <h3>Mô tả</h3>
              <p>Kiến trúc của Copilot Studio cho phép xây dựng chatbot và agents AI một cách dễ dàng với low-code approach.</p>
              <h3>Điểm mạnh</h3>
              <ul>
                <li>Dễ sử dụng cho người không chuyên</li>
                <li>Tích hợp sẵn với Microsoft ecosystem</li>
                <li>Nhanh chóng triển khai</li>
              </ul>
              <h3>Điểm yếu</h3>
              <ul>
                <li>Giới hạn tùy chỉnh</li>
                <li>Phụ thuộc vào Microsoft services</li>
                <li>Chi phí có thể cao</li>
              </ul>
            </div>
            <div className="flow-animation">
              <MermaidDiagram chart={copilotFlow} />
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
