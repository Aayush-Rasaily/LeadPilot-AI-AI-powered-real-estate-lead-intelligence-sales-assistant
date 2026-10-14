import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { analyzeLead, getLead } from "../services/api";

export default function LeadDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");

  async function loadLead() {
    try {
      setLoading(true);
      const data = await getLead(id);
      setLead(data);
    } catch (err) {
      setError(err.message);
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
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  }

  useEffect(() => {
    loadLead();
  }, [id]);

  if (loading) {
    return (
      <div className="page-container">
        <p>Loading lead...</p>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="page-container">
        <p>Lead not found.</p>
      </div>
    );
  }

  return (
    <div className="page-container">

      <button
        className="back-button"
        onClick={() => navigate("/")}
      >
        ← Back to Dashboard
      </button>

      <div className="lead-header">
        <div>
          <p className="eyebrow">LEAD INTELLIGENCE</p>

          <h1>{lead.name}</h1>

          <p className="lead-location">
            {lead.location}
          </p>
        </div>

        <button
          className="primary-button"
          onClick={handleAnalyze}
          disabled={analyzing}
        >
          {analyzing ? "Analyzing..." : "✨ Analyze Lead"}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="lead-info-grid">

        <div className="info-card">
          <span>Property</span>
          <strong>{lead.property_requirement}</strong>
        </div>

        <div className="info-card">
          <span>Budget</span>
          <strong>{lead.budget}</strong>
        </div>

        <div className="info-card">
          <span>Timeline</span>
          <strong>{lead.buying_timeline}</strong>
        </div>

        <div className="info-card">
          <span>Priority</span>

          <strong
            className={`priority-badge ${
              lead.priority
                ? lead.priority.toLowerCase()
                : "pending"
            }`}
          >
            {lead.priority || "PENDING"}
          </strong>
        </div>

      </div>


      <div className="customer-message-card">

        <h2>Customer Message</h2>

        <p>
          {lead.customer_message}
        </p>

      </div>


      {!lead.lead_score ? (

        <div className="analysis-empty">

          <div className="analysis-icon">
            ✨
          </div>

          <h2>AI analysis is ready to run</h2>

          <p>
            Analyze this lead to understand customer intent,
            requirements, concerns and the recommended next action.
          </p>

          <button
            className="primary-button"
            onClick={handleAnalyze}
            disabled={analyzing}
          >
            {analyzing
              ? "Analyzing..."
              : "Analyze with AI"}
          </button>

        </div>

      ) : (

        <>

          <div className="analysis-header">

            <div>
              <p className="eyebrow">
                AI ANALYSIS
              </p>

              <h2>
                What should the salesperson do?
              </h2>
            </div>

            <div className="score-card">

              <div className="score-number">
                {Math.round(lead.lead_score)}
              </div>

              <div className="score-label">
                / 100
              </div>

              <span
                className={`priority-badge ${
                  lead.priority.toLowerCase()
                }`}
              >
                {lead.priority}
              </span>

            </div>

          </div>


          <div className="analysis-grid">

            <div className="analysis-card summary-card">

              <h3>Customer Summary</h3>

              <p>
                {lead.ai_summary}
              </p>

            </div>


            <div className="analysis-card">

              <h3>Customer Intent</h3>

              <p>
                {lead.customer_intent}
              </p>

            </div>


            <div className="analysis-card">

              <h3>Urgency</h3>

              <span
                className={`urgency ${
                  lead.urgency?.toLowerCase()
                }`}
              >
                {lead.urgency}
              </span>

            </div>


            <div className="analysis-card">

              <h3>Key Requirements</h3>

              <div className="bullet-list">
                {lead.key_requirements
                  ?.split("\n")
                  .filter(Boolean)
                  .map((item, index) => (
                    <div key={index}>
                      {item}
                    </div>
                  ))}
              </div>

            </div>


            <div className="analysis-card">

              <h3>Objections / Concerns</h3>

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


            <div className="analysis-card next-action-card">

              <div className="action-label">
                ⭐ NEXT BEST ACTION
              </div>

              <h3>
                Recommended Action
              </h3>

              <p>
                {lead.recommended_action}
              </p>

            </div>


            <div className="analysis-card response-card">

              <h3>
                Suggested Customer Response
              </h3>

              <div className="response-box">
                {lead.suggested_response}
              </div>

              <button
                className="secondary-button"
                onClick={() =>
                  navigator.clipboard.writeText(
                    lead.suggested_response
                  )
                }
              >
                Copy Response
              </button>

            </div>

          </div>

        </>

      )}

    </div>
  );
}