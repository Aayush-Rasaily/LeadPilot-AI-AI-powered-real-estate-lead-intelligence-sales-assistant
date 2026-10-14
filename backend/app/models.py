from sqlalchemy import Column, Integer, String, Text, Float, DateTime
from datetime import datetime

from .database import Base


class Lead(Base):
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)

    # Customer information
    name = Column(String(100), nullable=False)
    location = Column(String(200), nullable=False)
    property_requirement = Column(String(300), nullable=False)
    budget = Column(String(100), nullable=False)
    buying_timeline = Column(String(100), nullable=False)
    customer_message = Column(Text, nullable=False)

    # AI analysis
    ai_summary = Column(Text, nullable=True)
    customer_intent = Column(String(200), nullable=True)
    key_requirements = Column(Text, nullable=True)
    objections = Column(Text, nullable=True)
    recommended_action = Column(Text, nullable=True)
    suggested_response = Column(Text, nullable=True)

    # Prioritization
    lead_score = Column(Float, nullable=True)
    priority = Column(String(20), nullable=True)
    urgency = Column(String(20), nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )