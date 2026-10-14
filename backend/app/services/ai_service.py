import os
from typing import List, Literal

from dotenv import load_dotenv
from google import genai
from pydantic import BaseModel, Field


load_dotenv()


# -----------------------------
# Structured AI Response
# -----------------------------

class LeadAnalysis(BaseModel):
    score: int = Field(
        description="Lead quality score from 0 to 100."
    )

    priority: Literal["HOT", "WARM", "COLD"] = Field(
        description="Overall lead priority."
    )

    urgency: Literal["HIGH", "MEDIUM", "LOW"] = Field(
        description="How urgently the salesperson should follow up."
    )

    intent: str = Field(
        description="The customer's buying intent."
    )

    summary: str = Field(
        description="A concise summary of the customer's situation and needs."
    )

    requirements: List[str] = Field(
        description="Important property requirements mentioned by the customer."
    )

    objections: List[str] = Field(
        description="Potential objections, concerns, constraints, or risks."
    )

    next_action: str = Field(
        description="The single most useful next action for the salesperson."
    )

    suggested_response: str = Field(
        description="A natural salesperson response to the customer."
    )


# -----------------------------
# Gemini Client
# -----------------------------

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError(
        "GEMINI_API_KEY is missing. Add it to the backend .env file."
    )

client = genai.Client(api_key=api_key)


# -----------------------------
# Analyze Lead
# -----------------------------

def analyze_lead(
    name: str,
    location: str,
    property_requirement: str,
    budget: str,
    buying_timeline: str,
    customer_message: str,
) -> LeadAnalysis:

    prompt = f"""
You are an expert real-estate sales intelligence assistant.

Your job is to analyze an inbound real-estate lead and help a salesperson
decide which lead deserves attention and what they should do next.

Analyze ONLY the information provided below.

LEAD INFORMATION

Name:
{name}

Location:
{location}

Property Requirement:
{property_requirement}

Budget:
{budget}

Buying Timeline:
{buying_timeline}

Customer Message:
{customer_message}


SCORING GUIDELINES

Give the lead a realistic score from 0 to 100.

Consider these factors:

- Buying urgency: 30 points
- Budget clarity: 20 points
- Requirement clarity: 20 points
- Purchase intent: 20 points
- Engagement/readiness: 10 points

IMPORTANT SCORING RULES:

Do NOT automatically give 100.

A score of 90-100 should be reserved for exceptionally strong
leads with very high buying intent, clear requirements, clear
budget, immediate timeline, and strong readiness to engage.

A lead with clear requirements, a realistic budget and an urgent
timeline will usually fall around 80-90.

A lead with moderate intent or an unclear timeline should generally
fall between 60-79.

A lead with weak intent, unclear requirements, or a long/unknown
timeline should generally fall below 60.

The score must reflect the actual evidence in the customer message.
Do not invent information that the customer did not provide.

Priority:

80-100 = HOT
60-79 = WARM
0-59 = COLD

Be realistic. Do not automatically give a high score.

The analysis must help a real-estate salesperson act immediately.

For requirements, list concrete things such as:
- property type
- location
- number of bedrooms
- budget
- possession requirement
- amenities
- other explicit preferences

For objections, identify actual concerns or constraints from the
customer information. Do not invent serious objections if none are present.

The suggested response should sound natural, professional and human.
It should directly address the customer's request rather than sounding
like an AI-generated sales pitch.

The next action should be specific and actionable.
"""


    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": LeadAnalysis,
        },
    )

    return LeadAnalysis.model_validate_json(response.text)