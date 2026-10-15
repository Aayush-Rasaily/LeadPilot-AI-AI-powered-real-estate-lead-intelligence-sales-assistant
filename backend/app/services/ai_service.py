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
        model="gemini-3.8-flash",
        contents=prompt,
        config={
            "response_mime_type": "application/json",
            "response_schema": LeadAnalysis,
        },
    )

    return LeadAnalysis.model_validate_json(response.text)

def chat_with_lead(
    name: str,
    location: str,
    property_requirement: str,
    budget: str,
    buying_timeline: str,
    customer_message: str,
    ai_summary: str | None,
    customer_intent: str | None,
    key_requirements: str | None,
    objections: str | None,
    recommended_action: str | None,
    user_question: str,
) -> str:

    prompt = f"""
You are LeadPilot AI, a sales assistant helping a real-estate salesperson.

Your task is to answer the salesperson's question about ONE selected
real-estate lead.

STRICT GROUNDING RULES:
1. Use ONLY the information explicitly provided below.
2. Do NOT invent facts, events, conversations, actions, property options,
   calls, meetings, messages, or customer preferences.
3. Do NOT assume that the salesperson has already contacted the customer.
4. Do NOT assume that property options have already been sent or shared.
5. Do NOT say that something "was sent", "was discussed", "was shared",
   or "already happened" unless it is explicitly present in the lead data.
6. If information is unavailable, clearly say that it is not available
   from the lead information.
7. You may recommend what the salesperson SHOULD do next, but clearly
   phrase it as a recommendation.
8. Keep the answer practical and useful for a salesperson.
9. Do not use Markdown formatting. Use plain text with numbered points
   or bullet points when useful.

SELECTED LEAD

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

Original Customer Message:
{customer_message}


AI ANALYSIS

Summary:
{ai_summary or "Not analyzed yet"}

Customer Intent:
{customer_intent or "Not available"}

Key Requirements:
{key_requirements or "Not available"}

Objections:
{objections or "None identified"}

Recommended Action:
{recommended_action or "Not available"}


SALESPERSON QUESTION:
{user_question}


Answer the salesperson clearly and concisely.

Remember:
Only describe facts that are actually present in the lead information.
If recommending an action, clearly describe it as something the salesperson
should do next.
"""

    response = client.models.generate_content(
        model="gemini-3.8-flash",
        contents=prompt,
    )

    return response.text.strip()