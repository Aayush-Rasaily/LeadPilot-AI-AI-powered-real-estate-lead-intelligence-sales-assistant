from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class LeadCreate(BaseModel):
    name: str
    phone: str
    location: str
    property_requirement: str
    budget: str
    buying_timeline: str
    customer_message: str


class LeadResponse(LeadCreate):
    model_config = ConfigDict(from_attributes=True)

    id: int

    ai_summary: Optional[str] = None
    customer_intent: Optional[str] = None
    key_requirements: Optional[str] = None
    objections: Optional[str] = None
    recommended_action: Optional[str] = None
    suggested_response: Optional[str] = None

    lead_score: Optional[float] = None
    priority: Optional[str] = None
    urgency: Optional[str] = None

    created_at: datetime
    updated_at: datetime

class LeadChatRequest(BaseModel):
    message: str


class LeadChatResponse(BaseModel):
    answer: str