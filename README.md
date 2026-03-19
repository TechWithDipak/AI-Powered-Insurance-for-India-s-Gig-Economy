# 🚀 DropSure: AI-Powered Parametric Income Protection

DropSure is an **AI-driven parametric micro-insurance platform** designed for India’s gig economy — specifically **Q-Commerce delivery partners (Zepto, Blinkit, Instamart)**.

It provides **zero-touch income protection** against real-world disruptions like weather, pollution, and traffic — ensuring riders don’t lose income due to factors beyond their control.

---

## ⚠️ Problem Statement

Gig delivery partners operate under strict time & zone constraints.

### Key Disruptions:
- 🌧️ Sudden cloudbursts
- 🏭 Severe pollution (AQI > 450)
- 🚧 Traffic congestion / roadblocks / strikes

### Impact:
- ❌ 20–30% income loss
- ❌ No financial safety net
- ❌ Traditional insurance does NOT cover income loss

👉 Riders currently bear **100% of the risk**

---

## 💡 Solution: DropSure

DropSure introduces **Parametric Insurance for Income Protection**

### 🔥 Core Idea:
- No claims
- No paperwork
- No delays

👉 **Payouts are automatically triggered by real-world data**

---

## 🔄 End-to-End Workflow

1. 📱 Rider signs up via mobile number + GPS access  
2. 💰 Chooses weekly plan (₹20–₹45)  
3. 🌐 System continuously monitors:
   - Weather APIs
   - Traffic APIs
   - Municipal alerts  
4. ⚡ Disruption detected via threshold logic  
5. 📍 Rider location verified (GPS validation)  
6. 💸 Instant payout triggered via UPI  
7. 🔔 Rider notified instantly  

---

## ⚡ Parametric Trigger Definitions

| Event Type        | Condition                              | Payout |
|------------------|----------------------------------------|--------|
| 🌧️ Heavy Rain    | Rainfall > 15mm/hr (30 mins)           | ₹150   |
| 🌊 Flood Alert    | Govt API = TRUE                        | ₹200   |
| 🚧 Traffic Jam    | Speed < 5 km/h (60 mins)               | ₹120   |
| 🏭 Pollution     | AQI > 450                              | ₹100   |

---

## 💰 Weekly Premium Model (AI-Based)

Premiums are dynamically calculated using AI:

### 📊 Factors:
- 📍 Location risk (flood/traffic zones)
- 🌦️ 7-day weather forecast
- 📈 Historical disruption data
- 🚴 Rider activity patterns

### 💡 Pricing Example:
- Low Risk → ₹20/week  
- Medium Risk → ₹30/week  
- High Risk → ₹45/week  

### 🤖 AI Logic:

Premium = Base Price + (Risk Score × Multiplier)


- Model: **XGBoost / Regression**
- Output: Weekly risk probability

---

## 👤 Persona Scenario

**Ravi — Blinkit Delivery Partner (Bangalore)**

- Works in Koramangala (2km zone)
- Earns ₹800/day

### Situation:
Heavy rainfall → deliveries paused for 2 hours

### Without DropSure:
❌ Loses ₹200 income  

### With DropSure:
✅ Rainfall detected via API  
✅ GPS confirms Ravi in zone  
✅ ₹150 credited instantly  

👉 No claim, no stress

---

## 🧠 AI & ML Architecture

### 1. 📊 Risk Prediction Model
- Model: XGBoost / Random Forest  
- Inputs:
  - Weather forecast
  - Historical data
  - Zone risk patterns  
- Output: Risk Score (0–1)

---

### 2. 🔐 Fraud Detection System
- Detects:
  - GPS spoofing
  - Fake inactivity
- Techniques:
  - Isolation Forest (anomaly detection)
  - Multi-API validation
  - Movement consistency checks

---

### 3. ⚡ Smart Trigger Engine
- Uses:
  - Weather + Traffic + Govt APIs
- Ensures:
  - Accurate payouts
  - Zero false triggers

---

## 📱 Platform

### Progressive Web App (PWA)

- 📦 Lightweight
- 📶 Low data usage
- ⚡ Fast & installable
- 📱 Works on all devices

---

## 📊 Dashboard (Planned)

### Rider Dashboard:
- Earnings protected
- Weekly coverage status
- Payout history

### Admin Dashboard:
- Risk heatmaps
- Disruption analytics
- Loss ratio insights

---

## 🛠️ Tech Stack

### 🚀 Frontend
![React](https://skillicons.dev/icons?i=react)
![Flutter](https://skillicons.dev/icons?i=flutter)

---

### ⚙️ Backend
![NodeJS](https://skillicons.dev/icons?i=nodejs)
![Express](https://skillicons.dev/icons?i=express)

---

### 🗄️ Database
![PostgreSQL](https://skillicons.dev/icons?i=postgres)
![MongoDB](https://skillicons.dev/icons?i=mongodb)

---

### 🤖 AI / ML
![Python](https://skillicons.dev/icons?i=python)
![Scikit-Learn](https://skillicons.dev/icons?i=sklearn)

---

### 🌐 APIs & Payments
![Firebase](https://skillicons.dev/icons?i=firebase)
![Stripe](https://skillicons.dev/icons?i=stripe)

---

## 🚀 Feasibility & Scalability

### ✅ Feasibility
- API-driven → fast implementation  
- No manual claims → low cost  
- Buildable in **6 weeks**

### 📈 Scalability
- Expand to:
  - Ride-hailing drivers
  - Logistics workers
  - Pan-India rollout

---

## 🗺️ Implementation Roadmap

### Phase 2 (Weeks 3–4)
- Backend engine
- API integrations
- ML model
- Basic UI

### Phase 3 (Weeks 5–6)
- Trigger automation
- Fraud detection
- Payment simulation
- Admin dashboard

---

## 🛑 Compliance

- ✅ Income loss only  
- ❌ No health/vehicle insurance  
- ✅ Weekly pricing  
- ✅ AI-based system  

---

## 🏆 Why DropSure Wins

- ⚡ Zero-touch insurance  
- 📍 Hyper-local accuracy  
- 💸 Instant payouts  
- 🤖 AI-driven fairness  
- 🎯 Built for gig workers  

---

## 🔗 Links

- 🎥 Pitch Video: [Add Link]
- 💻 GitHub Repo: [Add Link]

---

## 👥 Team

Guidewire DEVTrails 2026  
Team: *[Your Team Name]*

---
