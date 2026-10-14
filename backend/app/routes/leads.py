
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Lead
from ..schemas import (
    LeadCreate,
    LeadResponse,
    LeadChatRequest,
    LeadChatResponse,
)

from ..services.ai_service import (
    analyze_lead,
    chat_with_lead,
)

router = APIRouter(
    prefix="/api/leads",
    tags=["Leads"]
)


@router.post("/", response_model=LeadResponse)
def create_lead(
    lead_data: LeadCreate,
    db: Session = Depends(get_db)
):
    lead = Lead(
        name=lead_data.name,
        location=lead_data.location,
        property_requirement=lead_data.property_requirement,
        budget=lead_data.budget,
        buying_timeline=lead_data.buying_timeline,
        customer_message=lead_data.customer_message
    )

    db.add(lead)
    db.commit()
    db.refresh(lead)

    return lead


@router.get("/", response_model=list[LeadResponse])
def get_leads(
    db: Session = Depends(get_db)
):
    return (
        db.query(Lead)
        .order_by(Lead.created_at.desc())
        .all()
    )


@router.get("/{lead_id}", response_model=LeadResponse)
def get_lead(lead_id: int, db: Session = Depends(get_db)):

    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead not found"
        )

    return lead

@router.post("/{lead_id}/analyze", response_model=LeadResponse)
def analyze_lead_endpoint(
    lead_id: int,
    db: Session = Depends(get_db)
):

    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead not found"
        )

    try:

        analysis = analyze_lead(
            name=lead.name,
            location=lead.location,
            property_requirement=lead.property_requirement,
            budget=lead.budget,
            buying_timeline=lead.buying_timeline,
            customer_message=lead.customer_message,
        )

        lead.lead_score = analysis.score
        lead.priority = analysis.priority
        lead.urgency = analysis.urgency

        lead.customer_intent = analysis.intent
        lead.ai_summary = analysis.summary

        # Store lists as readable text for now
        lead.key_requirements = "\n".join(
            f"• {item}" for item in analysis.requirements
        )

        lead.objections = "\n".join(
            f"• {item}" for item in analysis.objections
        )

        lead.recommended_action = analysis.next_action
        lead.suggested_response = analysis.suggested_response

        db.commit()
        db.refresh(lead)

        return lead

    except Exception as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"AI analysis failed: {str(e)}"
        )    
@router.post(
    "/{lead_id}/chat",
    response_model=LeadChatResponse
)
def chat_endpoint(
    lead_id: int,
    chat_data: LeadChatRequest,
    db: Session = Depends(get_db)
):
    lead = db.query(Lead).filter(Lead.id == lead_id).first()

    if not lead:
        raise HTTPException(
            status_code=404,
            detail="Lead not found"
        )

    try:
        answer = chat_with_lead(
            name=lead.name,
            location=lead.location,
            property_requirement=lead.property_requirement,
            budget=lead.budget,
            buying_timeline=lead.buying_timeline,
            customer_message=lead.customer_message,
            ai_summary=lead.ai_summary,
            customer_intent=lead.customer_intent,
            key_requirements=lead.key_requirements,
            objections=lead.objections,
            recommended_action=lead.recommended_action,
            user_question=chat_data.message,
        )

        return {
            "answer": answer
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"AI chat failed: {str(e)}"
        )