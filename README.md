# LeadPilot AI

### AI-Powered Real Estate Lead Intelligence & Sales Assistant

LeadPilot AI helps real-estate salespeople prioritize inbound leads and decide what to do next using AI.

## 🚀 Features

- Add and manage real-estate leads
- AI-powered lead analysis using Google Gemini
- Lead score from 0–100
- HOT / WARM / COLD priority classification
- Customer intent and requirement extraction
- Objection and concern detection
- Recommended next action
- AI-generated customer response
- Lead-specific AI Sales Assistant
- Dashboard with search and filtering
- Next Best Action for salespeople

## 🏗️ Architecture

```text
                    ┌──────────────────┐
                    │    Salesperson   │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  React + Vite    │
                    │    Frontend      │
                    └────────┬─────────┘
                             │ REST API
                             ▼
                    ┌──────────────────┐
                    │ FastAPI Backend  │
                    └───────┬───┬──────┘
                            │   │
              ┌─────────────┘   └──────────────┐
              ▼                                ▼
     ┌─────────────────┐              ┌─────────────────┐
     │ SQLite Database │              │   Gemini API    │
     │  + SQLAlchemy   │              │  AI Analysis    │
     └─────────────────┘              └─────────────────┘
```

🔄 Workflow
```
Add Lead
   ↓
Gemini AI Analysis
   ↓
Score + Priority
   ↓
Intent + Requirements + Objections
   ↓
Next Best Action + Suggested Response
   ↓
AI Sales Assistant
```

🛠️ Tech Stack
- Frontend: React + Vite
- Backend: FastAPI + Python
- Database: SQLite + SQLAlchemy
- AI: Google Gemini API

  
⚙️ Run Locally
1. Clone the Repository
git clone https://github.com/Aayush-Rasaily/LeadPilot-AI-AI-powered-real-estate-lead-intelligence-sales-assistant.git
cd LeadPilot-AI-AI-powered-real-estate-lead-intelligence-sales-assistant

2. Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

Create backend/.env:
GEMINI_API_KEY=your_api_key

Run:
uvicorn app.main:app --reload

Backend:
http://127.0.0.1:8000

3. Frontend
Open another terminal:
cd frontend
npm install
npm run dev

Frontend:
http://localhost:5173

🤖 AI Usage
Google Gemini is used for:
- Lead scoring and prioritization
- Intent detection
- Requirement extraction
- Objection detection
- Recommended actions
- Suggested responses
- Lead-specific conversational assistance


AI responses are generated dynamically from the provided lead information.
🔗 Links
GitHub:
https://github.com/Aayush-Rasaily/LeadPilot-AI-AI-powered-real-estate-lead-intelligence-sales-assistant

Live Demo: Coming soon

👨‍💻 Author
Aayush Rasaily
