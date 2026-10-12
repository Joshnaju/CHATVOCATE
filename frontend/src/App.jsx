import ChatInterface from "./components/ChatInterface";
import "./App.css";

function App() {
  return (
    <div className="app-container">
      {/* Header */}
      <nav className="navbar navbar-dark app-header px-4 py-3">
        <div className="container-fluid">
          <div className="d-flex align-items-center gap-3">
            <i className="bi bi-bank fs-2"></i>

            <div>
              <h4 className="mb-0 fw-bold">ChatVocate</h4>
              <small className="text-light">IPC Legal Assistant</small>
            </div>
          </div>
        </div>
      </nav>

      {/* Chat area */}
      <main className="container-fluid app-main">
        <div className="chat-panel shadow-sm rounded-4">
          <ChatInterface />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-secondary small py-3">
        ChatVocate provides general legal information for educational purposes
        and is not a substitute for professional legal advice.
      </footer>
    </div>
  );
}

export default App;
