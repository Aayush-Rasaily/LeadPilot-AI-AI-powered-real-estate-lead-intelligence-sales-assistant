# LeadPilot AI

### AI-Powered Real Estate Lead Intelligence & Sales Assistant

LeadPilot AI is an AI-powered web application designed to help real-estate salespeople prioritize inbound leads, understand customer intent, and decide what action to take next.

Instead of manually reading every lead, the salesperson can add a lead and receive an AI-generated analysis containing a lead score, priority, requirements, objections, recommended action, and suggested customer response.

---

## 🚀 Live Demo

**Frontend:**  
https://leadpilotai-ai-powered-real-estate-lead.onrender.com

**Backend API:**  
https://leadpilotai-backend.onrender.com

**API Documentation:**  
https://leadpilotai-backend.onrender.com/docs

---

## ✨ Features

### 1. Lead Intake

Salespeople can capture:

- Customer name
- Phone number
- Location
- Property requirement
- Budget
- Buying timeline
- Customer message

### 2. AI Lead Analysis

Each lead can be analyzed using Google Gemini AI.

The system generates:

- Lead score from 0–100
- HOT / WARM / COLD priority
- Buying urgency
- Customer intent
- Key requirements
- Objections and concerns
- Recommended next action
- Suggested customer response

### 3. Lead Prioritization

Leads are categorized based on their AI-generated score:

| Score | Priority |
|---|---|
| 80–100 | HOT |
| 60–79 | WARM |
| 0–59 | COLD |

The scoring considers:

- Buying urgency
- Budget clarity
- Requirement clarity
- Purchase intent
- Engagement/readiness

### 4. Lead Dashboard

The dashboard provides a quick overview of:

- Total leads
- Hot leads
- Warm leads
- Cold leads
- Pending analysis
- Average lead score
- Next best action

Salespeople can also search and filter leads.

### 5. AI Sales Assistant

Each lead has a dedicated conversational AI assistant.

The salesperson can ask questions about the selected lead, such as:

- What should I do next?
- What are this customer's main concerns?
- How should I approach this lead?
- What should I discuss with the customer?

The assistant is grounded in the selected lead's information and avoids inventing customer actions or conversations.

### 6. One-Click Customer Calling

The application provides a **Call Customer** action directly from the lead details page.

This uses the device's native `tel:` functionality to initiate a phone call.

### 7. Next Best Action

LeadPilot AI highlights the most useful next action for the salesperson based on the lead's AI analysis.

This helps turn AI insights into an actionable sales workflow.

---

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      Salesperson      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    React + Vite      │
                    │      Frontend        │
                    └──────────┬───────────┘
                               │ REST API
                               ▼
                    ┌──────────────────────┐
                    │   FastAPI Backend    │
                    │       Python         │
                    └─────────┬────┬───────┘
                              │    │
                 ┌────────────┘    └──────────────┐
                 ▼                                ▼
        ┌─────────────────┐              ┌─────────────────┐
        │ SQLite Database │              │   Gemini API    │
        │  + SQLAlchemy   │              │  AI Analysis    │
        └─────────────────┘              └─────────────────┘

```
🔄 Application Workflow
```
Add Lead
   ↓
Store Lead
   ↓
AI Analysis
   ↓
Lead Score + Priority
   ↓
Intent + Requirements + Objections
   ↓
Recommended Next Action
   ↓
Suggested Customer Response
   ↓
Salesperson Takes Action
   ↓
AI Sales Assistant for Lead-Specific Questions
```

🤖 AI Scoring Logic
LeadPilot AI uses a 100-point scoring framework:
- Buying urgency — 30 points
- Budget clarity — 20 points
- Requirement clarity — 20 points
- Purchase intent — 20 points
- Engagement/readiness — 10 points
The AI is instructed to avoid automatically assigning maximum scores.
A score of 90–100 is reserved for exceptionally strong leads with very high intent, clear requirements, realistic budget, immediate timeline, and strong readiness to engage.

🛠️ Tech Stack
```
Frontend
- React
- Vite
- JavaScript
- React Router
- CSS
Backend
- Python
- FastAPI
- Pydantic
- SQLAlchemy
- SQLite
AI
- Google Gemini API
- Gemini 2.5 Flash
- Structured JSON AI responses
Deployment
- Render

```
📁 Project Structure
```
LeadPilot-AI/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── routes/
│   │   └── services/
│   │
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── App.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

⚙️ Run Locally
1. Clone the repository
```
git clone https://github.com/Aayush-Rasaily/LeadPilot-AI-AI-powered-real-estate-lead-intelligence-sales-assistant.git
cd LeadPilot-AI-AI-powered-real-estate-lead-intelligence-sales-assistant
```

3. Start the backend
```
cd backend
python -m venv venv
```

Windows:
venv\Scripts\activate

Install dependencies:
```
pip install -r requirements.txt
```
Create a .env file inside backend/:
GEMINI_API_KEY=your_gemini_api_key

Start FastAPI:
```
uvicorn app.main:app --reload
```
Backend:
http://127.0.0.1:8000

API documentation:
http://127.0.0.1:8000/docs

3. Start the frontend
Open another terminal:
```
cd frontend
npm install
npm run dev

Frontend:
http://localhost:5173
```

🔐 Environment Variables
The application requires:
```
GEMINI_API_KEY=your_gemini_api_key
```

The API key is stored as an environment variable and is not committed to the repository.
🤖 AI Usage Disclosure
Google Gemini AI is used as a core part of LeadPilot AI.
The model is used dynamically for:
- Lead scoring
- Lead prioritization
- Customer intent analysis
- Requirement extraction
- Objection identification
- Recommended next actions
- Suggested customer responses
- Lead-specific conversational assistance
- 
The AI output is generated from the information provided for each lead rather than using predefined or canned responses.
The application uses structured AI responses for the lead analysis so that the generated information can be displayed consistently in the user interface.
🔒 AI Grounding
The lead-specific AI assistant is instructed to use only information available for the selected lead.
It is specifically instructed not to assume that:
- A salesperson has already contacted the customer
- Property options have already been shared
- A meeting or call has already happened
- A conversation occurred outside the provided lead information
When information is unavailable, the assistant is instructed to say so rather than inventing details.

🌐 Deployment
The application is deployed using Render.
Frontend:
https://leadpilotai-ai-powered-real-estate-lead.onrender.com
Backend:
https://leadpilotai-backend.onrender.com
The frontend communicates with the FastAPI backend through REST APIs.
📌 Key API Endpoints
Method	Endpoint	Purpose
GET	/api/leads/	Get all leads
POST	/api/leads/	Create a lead
GET	/api/leads/{id}	Get a specific lead
POST	/api/leads/{id}/analyze	Analyze a lead using AI
POST	/api/leads/{id}/chat	Ask the AI assistant about a lead


🎯 Problem Solved
Real-estate salespeople often receive many inbound leads but do not have enough time to manually evaluate each one.
LeadPilot AI reduces this effort by converting raw customer information into:
Lead → AI Understanding → Priority → Next Best Action → Salesperson Action
This allows salespeople to focus their time on the leads most likely to convert.


👨‍💻 Author
Aayush Rasaily


GitHub:
https://github.com/Aayush-Rasaily
