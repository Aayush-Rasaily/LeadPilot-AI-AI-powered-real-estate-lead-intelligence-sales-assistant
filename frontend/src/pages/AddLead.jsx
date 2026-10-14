import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { createLead } from "../services/api";

const initialForm = {
  name: "",
  phone: "",
  location: "",
  property_requirement: "",
  budget: "",
  buying_timeline: "",
  customer_message: "",
};

export default function AddLead() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));

    setError("");
  }

  function validateForm() {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Customer name is required.";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (form.phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "Please enter a valid phone number.";
    }

    if (!form.location.trim()) {
      newErrors.location = "Location is required.";
    }

    if (!form.property_requirement.trim()) {
      newErrors.property_requirement =
        "Property requirement is required.";
    }

    if (!form.budget.trim()) {
      newErrors.budget = "Budget is required.";
    }

    if (!form.buying_timeline.trim()) {
      newErrors.buying_timeline =
        "Buying timeline is required.";
    }

    if (!form.customer_message.trim()) {
      newErrors.customer_message =
        "Customer message is required.";
    } else if (form.customer_message.trim().length < 10) {
      newErrors.customer_message =
        "Please provide a little more detail about the inquiry.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const createdLead = await createLead({
        name: form.name.trim(),
        phone: form.phone.trim(),
        location: form.location.trim(),
        property_requirement:
          form.property_requirement.trim(),
        budget: form.budget.trim(),
        buying_timeline:
          form.buying_timeline.trim(),
        customer_message:
          form.customer_message.trim(),
      });

      navigate(`/leads/${createdLead.id}`);
    } catch (err) {
      setError(
        err.message ||
          "Could not save the lead. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="page-container">

      {/* Back */}
      <button
        type="button"
        className="back-button"
        onClick={() => navigate("/")}
      >
        ← Back to Dashboard
      </button>

      {/* Header */}
      <div className="add-lead-header">
        <div>
          <p className="eyebrow">NEW LEAD</p>

          <h1>Add a customer lead</h1>

          <p className="add-lead-subtitle">
            Capture the customer's inquiry. LeadPilot will
            analyze it and recommend what to do next.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Form */}
      <form
        className="lead-form-card"
        onSubmit={handleSubmit}
      >

        <div className="form-section-header">
          <div>
            <p className="eyebrow">
              CUSTOMER INFORMATION
            </p>

            <h2>Lead details</h2>

            <p>
              Enter the information available from the
              customer's inquiry.
            </p>
          </div>
        </div>

        {/* Basic information */}
        <div className="form-grid">

          {/* Name */}
          <div className="form-field">
            <label htmlFor="name">
              Customer Name <span>*</span>
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Rahul Sharma"
              autoComplete="name"
              className={
                errors.name ? "input-error" : ""
              }
            />

            {errors.name && (
              <small className="field-error">
                {errors.name}
              </small>
            )}
          </div>

          {/* Phone */}
          <div className="form-field">
            <label htmlFor="phone">
              Phone Number <span>*</span>
            </label>

            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="e.g. +91 98765 43210"
              autoComplete="tel"
              className={
                errors.phone ? "input-error" : ""
              }
            />

            {errors.phone && (
              <small className="field-error">
                {errors.phone}
              </small>
            )}
          </div>

          {/* Location */}
          <div className="form-field">
            <label htmlFor="location">
              Location <span>*</span>
            </label>

            <input
              id="location"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Whitefield, Bangalore"
              className={
                errors.location ? "input-error" : ""
              }
            />

            {errors.location && (
              <small className="field-error">
                {errors.location}
              </small>
            )}
          </div>

          {/* Property */}
          <div className="form-field">
            <label htmlFor="property_requirement">
              Property Requirement <span>*</span>
            </label>

            <input
              id="property_requirement"
              name="property_requirement"
              type="text"
              value={form.property_requirement}
              onChange={handleChange}
              placeholder="e.g. 2BHK apartment"
              className={
                errors.property_requirement
                  ? "input-error"
                  : ""
              }
            />

            {errors.property_requirement && (
              <small className="field-error">
                {errors.property_requirement}
              </small>
            )}
          </div>

          {/* Budget */}
          <div className="form-field">
            <label htmlFor="budget">
              Budget <span>*</span>
            </label>

            <input
              id="budget"
              name="budget"
              type="text"
              value={form.budget}
              onChange={handleChange}
              placeholder="e.g. ₹80 Lakhs"
              className={
                errors.budget ? "input-error" : ""
              }
            />

            {errors.budget && (
              <small className="field-error">
                {errors.budget}
              </small>
            )}
          </div>

          {/* Timeline */}
          <div className="form-field">
            <label htmlFor="buying_timeline">
              Buying Timeline <span>*</span>
            </label>

            <select
              id="buying_timeline"
              name="buying_timeline"
              value={form.buying_timeline}
              onChange={handleChange}
              className={
                errors.buying_timeline
                  ? "input-error"
                  : ""
              }
            >
              <option value="">
                Select timeline
              </option>

              <option value="Immediately">
                Immediately
              </option>

              <option value="Within 1 month">
                Within 1 month
              </option>

              <option value="1-3 months">
                1–3 months
              </option>

              <option value="3-6 months">
                3–6 months
              </option>

              <option value="6+ months">
                6+ months
              </option>

              <option value="Not decided">
                Not decided
              </option>
            </select>

            {errors.buying_timeline && (
              <small className="field-error">
                {errors.buying_timeline}
              </small>
            )}
          </div>
        </div>

        {/* Customer message */}
        <div className="form-field form-field-full">

          <div className="message-label-row">
            <label htmlFor="customer_message">
              Customer Message <span>*</span>
            </label>

            <small>
              {form.customer_message.length} characters
            </small>
          </div>

          <textarea
            id="customer_message"
            name="customer_message"
            value={form.customer_message}
            onChange={handleChange}
            placeholder="Paste the customer's inquiry or chat message here..."
            rows={7}
            className={
              errors.customer_message
                ? "input-error"
                : ""
            }
          />

          <p className="field-hint">
            Include details such as what they are looking
            for, their budget, timeline, concerns, or what
            they asked for.
          </p>

          {errors.customer_message && (
            <small className="field-error">
              {errors.customer_message}
            </small>
          )}
        </div>

        {/* AI note */}
        <div className="ai-form-note">

          <div className="ai-form-note-icon">
            ✨
          </div>

          <div>
            <strong>
              AI analysis happens after saving
            </strong>

            <p>
              LeadPilot will analyze this lead using Gemini
              and generate the score, intent, requirements,
              objections, next action, and suggested response.
            </p>
          </div>

        </div>

        {/* Actions */}
        <div className="form-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={() => navigate("/")}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
            disabled={saving}
          >
            {saving
              ? "Saving Lead..."
              : "Save Lead →"}
          </button>

        </div>

      </form>
    </div>
  );
}