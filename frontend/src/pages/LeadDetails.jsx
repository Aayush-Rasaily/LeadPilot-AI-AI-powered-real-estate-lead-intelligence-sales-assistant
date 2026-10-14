import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  analyzeLead,
  getLead,
  chatWithLead,
} from "../services/api";

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Copy state
  const [copied, setCopied] = useState(false);

  async function loadLead() {
    try {
      setLoading(true);
      setError("");

      const data = await getLead(id);
      setLead(data);
    } catch (err) {
      setError(err.message || "Failed to load lead.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAnalyze() {
    try {
      setAnalyzing(true);
      setError("");

      const updatedLead = await analyzeLead(id);
      setLead(updatedLead);
    } catch (err) {
      setError(err.message || "Failed to analyze lead.");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleChat() {
    const message = chatInput.trim();

    if (!message || chatLoading) {
      return;
    }

    try {
      setChatLoading(true);
      setError("");

      setChatMessages((messages) => [
        ...messages,
        {
          role: "user",
          content: message,
        },
      ]);

      setChatInput("");

      const response = await chatWithLead(id, message);

      setChatMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content: response.answer,
        },
      ]);
    } catch (err) {
      setError(err.message || "Failed to get AI response.");
    } finally {
      setChatLoading(false);
    }
  }

  function handleSuggestion(question) {
    setChatInput(question);
  }

  async function handleCopyResponse() {
    if (!lead?.suggested_response) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        lead.suggested_response
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setError("Could not copy the response.");
    }
  }

  function getPriorityClass(priority) {
    return priority
      ? priority.toLowerCase()
      : "pending";
  }

  function formatScore(score) {
    if (score === null || score === undefined) {
      return "--";
    }

    return Math.round(score);
  }

  useEffect(() => {
    loadLead();
  }, [id]);

  // Loading
  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading lead intelligence...</p>
        </div>
      </div>
    );
  }

  // Lead not found
  if (!lead) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <h2>Lead not found</h2>

          <p>
            The lead you're looking for could not be found.
          </p>

          <button
            className="primary-button"
            onClick={() => navigate("/")}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isAnalyzed =
    lead.lead_score !== null &&
    lead.lead_score !== undefined;

  return (
    <div className="page-container">

      {/* Back */}
      <button
        className="back-button"
        onClick={() => navigate("/")}
      >
        ← Back to Dashboard
      </button>

      {/* Lead Header */}
      <div className="lead-header">

        <div>
          <p className="eyebrow">
            LEAD INTELLIGENCE
          </p>

          <h1>{lead.name}</h1>

          <p className="lead-location">
            {lead.location}
          </p>
        </div>

        <div className="lead-header-actions">

          {/* Call Customer */}
          {lead.phone && (
            <a
              href={`tel:${lead.phone}`}
              className="call-button"
            >
              📞 Call Customer
            </a>
          )}

          {isAnalyzed && (
            <div className="lead-header-score">

              <span className="score-mini">
                {formatScore(lead.lead_score)}
              </span>

              <span className="score-mini-label">
                / 100
              </span>

              <span
                className={`priority-badge ${getPriorityClass(
                  lead.priority
                )}`}
              >
                {lead.priority}
              </span>

            </div>
          )}

          <button
            className="primary-button"
            onClick={handleAnalyze}
            disabled={analyzing}
          >
            {analyzing
              ? "Analyzing..."
              : isAnalyzed
              ? "↻ Re-analyze"
              : "✨ Analyze Lead"}
          </button>

        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Lead Information */}
      <div className="lead-info-grid">

        <div className="info-card">
          <span>Property</span>
          <strong>
            {lead.property_requirement}
          </strong>
        </div>

        <div className="info-card">
          <span>Budget</span>
          <strong>
            {lead.budget}
          </strong>
        </div>

        <div className="info-card">
          <span>Timeline</span>
          <strong>
            {lead.buying_timeline}
          </strong>
        </div>

        <div className="info-card">
          <span>Phone</span>
          <strong>
            {lead.phone || "Not provided"}
          </strong>
        </div>

        <div className="info-card">
          <span>Priority</span>

          <strong
            className={`priority-badge ${getPriorityClass(
              lead.priority
            )}`}
          >
            {lead.priority || "PENDING"}
          </strong>
        </div>

      </div>

      {/* Customer Message */}
      <div className="customer-message-card">

        <div className="card-heading-row">

          <div>
            <p className="eyebrow">
              CUSTOMER MESSAGE
            </p>

            <h2>What the customer said</h2>
          </div>

        </div>

        <p className="customer-message-text">
          {lead.customer_message}
        </p>

      </div>

      {/* AI Analysis */}
      {!isAnalyzed ? (

        <div className="analysis-empty">

          <div className="analysis-icon">
            ✨
          </div>

          <p className="eyebrow">
            AI LEAD INTELLIGENCE
          </p>

          <h2>
            Turn this lead into an action plan
          </h2>

          <p>
            Analyze the customer message to understand
            buying intent, requirements, concerns,
            urgency and the recommended next action.
          </p>

          <button
            className="primary-button"
            onClick={handleAnalyze}
            disabled={analyzing}
          >
            {analyzing
              ? "Analyzing with Gemini..."
              : "Analyze with AI"}
          </button>

        </div>

      ) : (

        <>

          {/* Analysis Header */}
          <div className="analysis-header">

            <div>
              <p className="eyebrow">
                AI ANALYSIS
              </p>

              <h2>
                What should the salesperson do?
              </h2>

              <p>
                LeadPilot analyzed the customer information
                and identified the strongest sales signal.
              </p>
            </div>

            {/* Score */}
            <div className="score-card">

              <div className="score-number">
                {formatScore(lead.lead_score)}
              </div>

              <div className="score-label">
                / 100
              </div>

              <span
                className={`priority-badge ${getPriorityClass(
                  lead.priority
                )}`}
              >
                {lead.priority}
              </span>

            </div>

          </div>

          {/* Analysis Cards */}
          <div className="analysis-grid">

            {/* Summary */}
            <div className="analysis-card summary-card">

              <h3>
                Customer Summary
              </h3>

              <p>
                {lead.ai_summary ||
                  "No summary available."}
              </p>

            </div>

            {/* Intent */}
            <div className="analysis-card">

              <h3>
                Customer Intent
              </h3>

              <p>
                {lead.customer_intent ||
                  "Not available"}
              </p>

            </div>

            {/* Urgency */}
            <div className="analysis-card">

              <h3>
                Urgency
              </h3>

              <span
                className={`urgency ${
                  lead.urgency
                    ? lead.urgency.toLowerCase()
                    : ""
                }`}
              >
                {lead.urgency || "Not available"}
              </span>

            </div>

            {/* Requirements */}
            <div className="analysis-card">

              <h3>
                Key Requirements
              </h3>

              <div className="bullet-list">

                {lead.key_requirements ? (
                  lead.key_requirements
                    .split("\n")
                    .filter(Boolean)
                    .map((item, index) => (
                      <div key={index}>
                        {item}
                      </div>
                    ))
                ) : (
                  <p className="muted">
                    No requirements identified.
                  </p>
                )}

              </div>

            </div>

            {/* Objections */}
            <div className="analysis-card">

              <h3>
                Objections / Concerns
              </h3>

              {lead.objections ? (

                <div className="bullet-list">

                  {lead.objections
                    .split("\n")
                    .filter(Boolean)
                    .map((item, index) => (
                      <div key={index}>
                        {item}
                      </div>
                    ))}

                </div>

              ) : (

                <p className="muted">
                  No major objections identified.
                </p>

              )}

            </div>

            {/* Next Action */}
            <div className="analysis-card next-action-card">

              <div className="action-label">
                ⭐ NEXT BEST ACTION
              </div>

              <h3>
                Recommended Action
              </h3>

              <p>
                {lead.recommended_action ||
                  "No recommended action available."}
              </p>

              {/* Direct Call Action */}
              {lead.phone && (
                <a
                  href={`tel:${lead.phone}`}
                  className="call-button action-call-button"
                >
                  📞 Call Customer
                </a>
              )}

            </div>

            {/* Suggested Response */}
            <div className="analysis-card response-card">

              <div className="response-header">

                <div>
                  <p className="eyebrow">
                    AI-GENERATED
                  </p>

                  <h3>
                    Suggested Customer Response
                  </h3>
                </div>

              </div>

              <div className="response-box">
                {lead.suggested_response ||
                  "No suggested response available."}
              </div>

              <button
                className="secondary-button"
                onClick={handleCopyResponse}
                disabled={!lead.suggested_response}
              >
                {copied
                  ? "✓ Copied"
                  : "Copy Response"}
              </button>

            </div>

          </div>

          {/* AI Sales Assistant */}
          <div className="lead-chat-card">

            <div className="chat-header">

              <div>

                <p className="eyebrow">
                  LEADPILOT AI
                </p>

                <h2>
                  Ask about this lead
                </h2>

                <p>
                  Get practical sales guidance grounded
                  in this customer's information.
                </p>

              </div>

              <div className="chat-ai-status">
                <span className="status-dot"></span>
                AI Ready
              </div>

            </div>

            {/* Chat Messages */}
            {chatMessages.length > 0 && (

              <div className="chat-messages">

                {chatMessages.map(
                  (message, index) => (

                    <div
                      key={index}
                      className={`chat-message ${message.role}`}
                    >

                      <div className="chat-message-label">
                        {message.role === "user"
                          ? "You"
                          : "LeadPilot AI"}
                      </div>

                      <div className="chat-message-content">
                        {message.content}
                      </div>

                    </div>

                  )
                )}

                {/* AI Thinking */}
                {chatLoading && (
                  <div className="chat-message assistant">

                    <div className="chat-message-label">
                      LeadPilot AI
                    </div>

                    <div className="chat-message-content">
                      Thinking...
                    </div>

                  </div>
                )}

              </div>

            )}

            {/* Suggestions */}
            <div className="chat-suggestions">

              <button
                onClick={() =>
                  handleSuggestion(
                    "Why is this lead considered high priority?"
                  )
                }
              >
                Why is this lead HOT?
              </button>

              <button
                onClick={() =>
                  handleSuggestion(
                    "What should I ask the customer on the call?"
                  )
                }
              >
                What should I ask?
              </button>

              <button
                onClick={() =>
                  handleSuggestion(
                    "What objections should I prepare for?"
                  )
                }
              >
                Possible objections
              </button>

              <button
                onClick={() =>
                  handleSuggestion(
                    "What should I do next to move this lead forward?"
                  )
                }
              >
                What should I do next?
              </button>

            </div>

            {/* Chat Input */}
            <div className="chat-input-row">

              <input
                type="text"
                value={chatInput}
                onChange={(e) =>
                  setChatInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey
                  ) {
                    e.preventDefault();
                    handleChat();
                  }
                }}
                placeholder="Ask something about this lead..."
                disabled={chatLoading}
              />

              <button
                className="primary-button"
                onClick={handleChat}
                disabled={
                  chatLoading ||
                  !chatInput.trim()
                }
              >
                {chatLoading
                  ? "Thinking..."
                  : "Send"}
              </button>

            </div>

          </div>

        </>

      )}

    </div>
  );
}