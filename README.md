# 🎓 Agentic Ai-Based Student Risk Prediction and Academic Support System

## 📌 Overview
This project is an intelligent student performance management system that uses Artificial Intelligence, Machine Learning, and automation to analyze student data, predict risk levels, and assist both students and teachers with proactive insights.

---

## 🚀 Features
- AI-based natural language interaction (LLM)
- Student risk prediction using Machine Learning (Random Forest)
- Smart calendar for managing academic events
- Automated reminders and notifications using n8n
- Personalized learning support

---

## 🧠 System Architecture
- Backend: Flask (Python)
- Frontend: React (Vite + Tailwind CSS)
- Database: MySQL
- Machine Learning: Random Forest (Scikit-learn)
- Automation: n8n

---

## 📊 Machine Learning
- Model: Random Forest Classifier  
- Purpose: Classify students into:
  - Low Risk
  - Medium Risk
  - High Risk  
- Features used:
  - Attendance
  - Marks
  - Assessments
  - Behavior  

---

## 🤖 AI Functionality
- Uses LLM for:
  - Understanding user queries
  - Extracting intent and data
- Supports actions like:
  - Adding events
  - Getting reminders
  - Suggesting learning resources

---

## 📁 Project Structure

backend/                      → Flask backend  
database/                     → Database schema  
llm/                          → AI-related modules  
student-performance-frontend/ → React frontend  

---

## ⚙️ Installation & Setup

### Clone the repository
git clone <your-repo-link>  
cd student-performance-analytics-system  

### Backend Setup
cd backend  
pip install -r requirements.txt  
python app.py  

### Frontend Setup
cd student-performance-frontend  
npm install  
npm run dev  

---

## 🔄 Workflow

### Student Flow
User Input → AI (LLM) → Action → Calendar / Reminder  

### Teacher Flow
Student Data → ML Model → Risk Prediction → Insights  

---

## 📊 Dataset
- Synthetic dataset created for training  
- Balanced data (~10,000 samples)  
- Based on real-world academic patterns  

---

## 📌 Conclusion
This system enhances traditional learning platforms by introducing intelligent automation, predictive analytics, and personalized support for better academic outcomes.
