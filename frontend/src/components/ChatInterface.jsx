import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { sendMessage } from "../services/chatService";
import "./ChatInterface.css";

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, loading]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    const userQuestion = question.trim();

    if (!userQuestion || loading) return;

    const chatHistory = messages.map(({ role, content }) => ({
      role,
      content,
    }));

    setMessages((prev) => [...prev, { role: "user", content: userQuestion }]);

    setQuestion("");
    setLoading(true);
    setError("");

    try {
      const data = await sendMessage(userQuestion, chatHistory);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer || "Sorry, I couldn't generate an answer.",
        },
      ]);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to ChatVocate. Please try again.");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleNewChat = () => {
    if (loading) return;

    setMessages([]);
    setQuestion("");
    setError("");
    inputRef.current?.focus();
  };

  const handleSuggestion = (text) => {
    setQuestion(text);
    inputRef.current?.focus();
  };

  return (
    <div className="chat-interface">
      {/* Messages area */}
      <div className="chat-messages p-3 p-md-4">
        {/* Welcome screen */}
        {messages.length === 0 && (
          <div className="text-center my-auto py-4">
            <div className="welcome-icon mx-auto mb-3">
              <i className="bi bi-scale fs-1"></i>
            </div>

            <h3 className="fw-bold text-primary-emphasis">
              Welcome to ChatVocate
            </h3>

            <p className="text-secondary">
              Ask questions about the Indian Penal Code.
            </p>

            <div className="card text-start mx-auto mt-4 suggestion-card">
              <div className="card-body">
                <h6 className="fw-bold mb-3">
                  <i className="bi bi-lightbulb me-2"></i>
                  Try asking
                </h6>

                <button
                  className="btn btn-outline-primary w-100 text-start mb-2"
                  onClick={() => handleSuggestion("What is Section 302 IPC?")}
                >
                  What is Section 302 IPC?
                </button>

                <button
                  className="btn btn-outline-primary w-100 text-start"
                  onClick={() =>
                    handleSuggestion(
                      "What is the punishment for theft under IPC?",
                    )
                  }
                >
                  What is the punishment for theft under IPC?
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`d-flex mb-3 ${
              message.role === "user"
                ? "justify-content-end"
                : "justify-content-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="message-avatar me-2">
                <i className="bi bi-robot"></i>
              </div>
            )}

            <div
              className={`message-bubble ${
                message.role === "user" ? "user-bubble" : "assistant-bubble"
              }`}
            >
              {message.role === "assistant" ? (
                <ReactMarkdown>{message.content}</ReactMarkdown>
              ) : (
                message.content
              )}
            </div>

            {message.role === "user" && (
              <div className="message-avatar user-avatar ms-2">
                <i className="bi bi-person"></i>
              </div>
            )}
          </div>
        ))}

        {/* Loading */}
        {loading && (
          <div className="d-flex align-items-center gap-2 mb-3">
            <div className="message-avatar">
              <i className="bi bi-robot"></i>
            </div>

            <div className="assistant-bubble message-bubble">
              <span className="spinner-border spinner-border-sm me-2"></span>
              Thinking...
            </div>
          </div>
        )}

        {error && <div className="alert alert-danger py-2">{error}</div>}

        <div ref={messagesEndRef}></div>
      </div>

      {/* Input area */}
      <div className="chat-input-area border-top p-3">
        {messages.length > 0 && (
          <div className="text-end mb-2">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={handleNewChat}
              disabled={loading}
            >
              <i className="bi bi-plus-circle me-1"></i>
              New Chat
            </button>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="d-flex gap-2">
          <input
            ref={inputRef}
            type="text"
            className="form-control"
            placeholder="Ask about an IPC section..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading}
          />

          <button
            className="btn btn-primary px-3"
            type="submit"
            disabled={loading || !question.trim()}
          >
            <i className="bi bi-send me-md-2"></i>
            <span className="d-none d-md-inline">Send</span>
          </button>
        </form>

        <p className="text-secondary text-center small mt-2 mb-0">
          <i className="bi bi-info-circle me-1"></i>
          For educational purposes only.
        </p>
      </div>
    </div>
  );
}

export default ChatInterface;
