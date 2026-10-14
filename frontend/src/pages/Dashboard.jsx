import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLeads } from "../services/api";

function PriorityBadge({ priority }) {
  if (!priority) {
    return (
      <span className="priority-badge pending">
        PENDING
      </span>
    );
  }

  return (
    <span className={`priority-badge ${priority.toLowerCase()}`}>
      {priority}
    </span>
  );
}

function PriorityOverviewItem({ type, count, label }) {
  return (
    <div className="priority-overview-item">
      <span className={`priority-dot ${type}`} />

      <div>
        <strong>{count}</strong>
        <small>{label}</small>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadLeads() {
    try {
      setLoading(true);

      const data = await getLeads();

      setLeads(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  /* ================================
     COUNTS
  ================================= */

  const hotCount = leads.filter(
    (lead) => lead.priority === "HOT"
  ).length;

  const warmCount = leads.filter(
    (lead) => lead.priority === "WARM"
  ).length;

  const coldCount = leads.filter(
    (lead) => lead.priority === "COLD"
  ).length;

  const pendingCount = leads.filter(
    (lead) => !lead.priority
  ).length;

  const analyzedLeads = leads.filter(
    (lead) => lead.lead_score !== null && lead.lead_score !== undefined
  );

  const averageScore =
    analyzedLeads.length > 0
      ? Math.round(
          analyzedLeads.reduce(
            (sum, lead) => sum + Number(lead.lead_score),
            0
          ) / analyzedLeads.length
        )
      : 0;

  /* ================================
     TOP LEAD / NEXT BEST ACTION
  ================================= */

  const topLead = useMemo(() => {
    const analyzed = leads.filter(
      (lead) =>
        lead.lead_score !== null &&
        lead.lead_score !== undefined
    );

    if (analyzed.length === 0) {
      return null;
    }

    return [...analyzed].sort(
      (a, b) =>
        Number(b.lead_score) - Number(a.lead_score)
    )[0];
  }, [leads]);

  /* ================================
     SEARCH + FILTER
  ================================= */

  const filteredLeads = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return leads.filter((lead) => {
      const matchesSearch =
        !searchValue ||
        lead.name?.toLowerCase().includes(searchValue) ||
        lead.location?.toLowerCase().includes(searchValue) ||
        lead.property_requirement
          ?.toLowerCase()
          .includes(searchValue);

      const matchesFilter =
        filter === "ALL" ||
        lead.priority === filter;

      return matchesSearch && matchesFilter;
    });
  }, [leads, search, filter]);

  return (
    <div className="dashboard">

      {/* ================================
          HEADER
      ================================= */}

      <div className="page-header">

        <div>
          <p className="eyebrow">
            SALES INTELLIGENCE
          </p>

          <h1>
            Good afternoon 👋
          </h1>

          <p className="subtitle">
            Here's what needs your attention today.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => navigate("/add-lead")}
        >
          + Add Lead
        </button>

      </div>


      {/* ================================
          STAT CARDS
      ================================= */}

      <div className="stats-grid">

        <div className="stat-card">
          <span>Total Leads</span>

          <strong>
            {leads.length}
          </strong>

          <small>
            All incoming leads
          </small>
        </div>


        <div className="stat-card hot-stat">
          <span>Hot Leads</span>

          <strong>
            {hotCount}
          </strong>

          <small>
            Highest priority
          </small>
        </div>


        <div className="stat-card">
          <span>Warm Leads</span>

          <strong>
            {warmCount}
          </strong>

          <small>
            Need attention
          </small>
        </div>


        <div className="stat-card">
          <span>Average Score</span>

          <strong>
            {averageScore}
          </strong>

          <small>
            {pendingCount} pending analysis
          </small>
        </div>

      </div>


      {/* ================================
          PRIORITY OVERVIEW
      ================================= */}

      <div className="priority-overview">

        <PriorityOverviewItem
          type="hot"
          count={hotCount}
          label="Hot leads"
        />

        <PriorityOverviewItem
          type="warm"
          count={warmCount}
          label="Warm leads"
        />

        <PriorityOverviewItem
          type="cold"
          count={coldCount}
          label="Cold leads"
        />

        <PriorityOverviewItem
          type="pending"
          count={pendingCount}
          label="Pending analysis"
        />

      </div>


      {/* ================================
          NEXT BEST ACTION
      ================================= */}

      {topLead && (
        <div
          className="top-lead-card"
          onClick={() =>
            navigate(`/leads/${topLead.id}`)
          }
        >

          <div className="top-lead-label">
            ⭐ NEXT BEST ACTION
          </div>

          <div className="top-lead-content">

            <div className="top-lead-main">

              <h2>
                {topLead.name}
              </h2>

              <p>
                {topLead.recommended_action ||
                  "Review this lead and determine the next sales action."}
              </p>

            </div>


            <div className="top-lead-meta">

              <PriorityBadge
                priority={topLead.priority}
              />

              <strong>
                {Math.round(topLead.lead_score)}
                <span className="score-small">
                  /100
                </span>
              </strong>

              <span className="view-lead">
                View lead →
              </span>

            </div>

          </div>

        </div>
      )}


      {/* ================================
          PIPELINE HEADER
      ================================= */}

      <div className="section-header">

        <div>
          <h2>
            Lead Pipeline
          </h2>

          <p>
            Prioritize your next sales conversation.
          </p>
        </div>

      </div>


      {/* ================================
          SEARCH / FILTER
      ================================= */}

      <div className="toolbar">

        <input
          type="text"
          placeholder="Search leads, locations or properties..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value)
          }
        >
          <option value="ALL">
            All priorities
          </option>

          <option value="HOT">
            Hot
          </option>

          <option value="WARM">
            Warm
          </option>

          <option value="COLD">
            Cold
          </option>
        </select>

      </div>


      {/* ================================
          LOADING
      ================================= */}

      {loading && (
        <div className="empty-state">
          Loading leads...
        </div>
      )}


      {/* ================================
          ERROR
      ================================= */}

      {error && (
        <div className="error-state">
          {error}
        </div>
      )}


      {/* ================================
          LEAD TABLE
      ================================= */}

      {!loading && !error && (
        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>LEAD</th>
                <th>PROPERTY</th>
                <th>BUDGET</th>
                <th>TIMELINE</th>
                <th>SCORE</th>
                <th>PRIORITY</th>
              </tr>

            </thead>


            <tbody>

              {filteredLeads.map((lead) => (

                <tr
                  key={lead.id}
                  className="lead-row"
                  onClick={() =>
                    navigate(`/leads/${lead.id}`)
                  }
                >

                  <td>

                    <div className="lead-name">
                      {lead.name}
                    </div>

                    <div className="lead-location">
                      {lead.location}
                    </div>

                  </td>


                  <td>
                    {lead.property_requirement}
                  </td>


                  <td>
                    {lead.budget}
                  </td>


                  <td>
                    {lead.buying_timeline}
                  </td>


                  <td>

                    {lead.lead_score !== null &&
                    lead.lead_score !== undefined
                      ? (
                        <span className="table-score">
                          {Math.round(lead.lead_score)}
                          <span>/100</span>
                        </span>
                      )
                      : "—"}

                  </td>


                  <td>
                    <PriorityBadge
                      priority={lead.priority}
                    />
                  </td>

                </tr>

              ))}

            </tbody>

          </table>


          {filteredLeads.length === 0 && (
            <div className="empty-state">
              No leads found.
            </div>
          )}

        </div>
      )}

    </div>
  );
}