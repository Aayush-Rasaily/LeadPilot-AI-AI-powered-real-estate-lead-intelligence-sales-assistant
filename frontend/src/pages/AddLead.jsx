import { useState } from "react";
import { createLead } from "../services/api";

export default function AddLead() {
  const [form, setForm] = useState({
    name: "",
    location: "",
    property_requirement: "",
    budget: "",
    buying_timeline: "",
    customer_message: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      await createLead(form);

      setMessage("Lead successfully created.");

      setForm({
        name: "",
        location: "",
        property_requirement: "",
        budget: "",
        buying_timeline: "",
        customer_message: "",
      });
    } catch (error) {
      setMessage("Failed to create lead.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <p className="eyebrow">LEAD INTAKE</p>
          <h1>Add New Lead</h1>
          <p className="subtitle">
            Capture customer information for AI analysis.
          </p>
        </div>

        <a href="/" className="secondary-button">
          ← Back
        </a>
      </div>

      <form className="lead-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Customer Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
              required
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Whitefield, Bangalore"
              required
            />
          </div>

          <div className="form-group">
            <label>Property Requirement</label>
            <input
              name="property_requirement"
              value={form.property_requirement}
              onChange={handleChange}
              placeholder="e.g. 2BHK apartment"
              required
            />
          </div>

          <div className="form-group">
            <label>Budget</label>
            <input
              name="budget"
              value={form.budget}
              onChange={handleChange}
              placeholder="e.g. ₹80 Lakhs"
              required
            />
          </div>

          <div className="form-group">
            <label>Buying Timeline</label>
            <input
              name="buying_timeline"
              value={form.buying_timeline}
              onChange={handleChange}
              placeholder="e.g. Within 1 month"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Customer Message</label>
          <textarea
            name="customer_message"
            value={form.customer_message}
            onChange={handleChange}
            placeholder="Paste the customer's inquiry or chat transcript..."
            rows="7"
            required
          />
        </div>

        {message && (
          <div className="form-message">
            {message}
          </div>
        )}

        <button
          type="submit"
          className="primary-button"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Lead"}
        </button>
      </form>
    </div>
  );
}