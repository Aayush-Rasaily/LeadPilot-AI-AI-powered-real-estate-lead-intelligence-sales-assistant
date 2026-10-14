import { useEffect, useMemo, useState } from "react";
import { getLeads } from "../services/api";
import { useNavigate } from "react-router-dom";
function PriorityBadge({ priority }) {
  if (!priority) {
    return <span className="priority-badge pending">PENDING</span>;
  }

  return (
    <span className={`priority-badge ${priority.toLowerCase()}`}>
      {priority}
    </span>
  );
}

export default function Dashboard() {
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
      setError("Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeads();
  }, []);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        lead.location.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "ALL" || lead.priority === filter;

      return matchesSearch && matchesFilter;
    });
  }, [leads, search, filter]);

  const hotCount = leads.filter(
    (lead) => lead.priority === "HOT"
  ).length;

  const warmCount = leads.filter(
    (lead) => lead.priority === "WARM"
  ).length;

  const pendingCount = leads.filter(
    (lead) => !lead.priority
  ).length;

  const averageScore =
    leads.filter((lead) => lead.lead_score !== null).length > 0
      ? Math.round(
          leads
            .filter((lead) => lead.lead_score !== null)
            .reduce((sum, lead) => sum + lead.lead_score, 0) /
            leads.filter((lead) => lead.lead_score !== null).length
        )
      : 0;
  
  const navigate = useNavigate();
  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <p className="eyebrow">SALES INTELLIGENCE</p>
          <h1>Good afternoon 👋</h1>
          <p className="subtitle">
            Here's what needs your attention today.
          </p>
        </div>

        <a href="/add-lead" className="primary-button">
          + Add Lead
        </a>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Total Leads</span>
          <strong>{leads.length}</strong>
          <small>All incoming leads</small>
        </div>

        <div className="stat-card hot-stat">
          <span>Hot Leads</span>
          <strong>{hotCount}</strong>
          <small>High priority</small>
        </div>

        <div className="stat-card">
          <span>Warm Leads</span>
          <strong>{warmCount}</strong>
          <small>Need attention</small>
        </div>

        <div className="stat-card">
          <span>Average Score</span>
          <strong>{averageScore}</strong>
          <small>{pendingCount} pending analysis</small>
        </div>
      </div>

      <div className="section-header">
        <div>
          <h2>Lead Pipeline</h2>
          <p>Prioritize your next sales conversation.</p>
        </div>
      </div>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search leads or locations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">All priorities</option>
          <option value="HOT">Hot</option>
          <option value="WARM">Warm</option>
          <option value="COLD">Cold</option>
        </select>
      </div>

      {loading && (
        <div className="empty-state">
          Loading leads...
        </div>
      )}

      {error && (
        <div className="error-state">
          {error}
        </div>
      )}

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
                onClick={() => navigate(`/leads/${lead.id}`)}
                className="lead-row"
                >
                  <td>
                    <div className="lead-name">
                      {lead.name}
                    </div>
                    <div className="lead-location">
                      {lead.location}
                    </div>
                  </td>

                  <td>{lead.property_requirement}</td>

                  <td>{lead.budget}</td>

                  <td>{lead.buying_timeline}</td>

                  <td>
                    {lead.lead_score !== null
                      ? `${lead.lead_score}/100`
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