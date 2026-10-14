const API_BASE_URL = "http://127.0.0.1:8000";

export async function getLeads() {
    const response = await fetch(`${API_BASE_URL}/api/leads/`);

    if (!response.ok) {
        throw new Error("Failed to fetch leads");
    }

    return response.json();
}

export async function createLead(lead) {
    const response = await fetch(`${API_BASE_URL}/api/leads/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(lead),
    });

    if (!response.ok) {
        throw new Error("Failed to create lead");
    }

    return response.json();
}

export async function getLead(id) {
    const response = await fetch(`${API_BASE_URL}/api/leads/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch lead");
    }

    return response.json();
}


export async function analyzeLead(id) {
    const response = await fetch(
        `${API_BASE_URL}/api/leads/${id}/analyze`, {
            method: "POST",
            headers: {
                Accept: "application/json",
            },
        }
    );

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || "Failed to analyze lead");
    }

    return response.json();
}