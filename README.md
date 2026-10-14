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
- Dashboard with search, filtering and lead pipeline
- Next Best Action for salespeople

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Backend:** FastAPI + Python
- **Database:** SQLite + SQLAlchemy
- **AI:** Google Gemini API

## 🔄 How It Works

```text
Add Lead
   ↓
Gemini AI Analysis
   ↓
Lead Score + Priority
   ↓
Requirements + Intent + Objections
   ↓
Next Best Action + Suggested Response
   ↓
AI Sales Assistant
```
⚙️ Run Locally
Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

Create backend/.env:
GEMINI_API_KEY=your_api_key

Run:
uvicorn app.main:app --reload

Backend: http://127.0.0.1:8000
Frontend
cd frontend
npm install
npm run dev

Frontend: http://localhost:5173
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
