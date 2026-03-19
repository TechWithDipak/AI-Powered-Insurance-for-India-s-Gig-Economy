# ☔ DropSure: AI-Powered Parametric Income Protection 

> **An AI-enabled, fully automated parametric insurance platform designed specifically for the Indian Gig Economy.**

[![Tech Stack](https://skillicons.dev/icons?i=flutter,react,nodejs,express,postgres,mongodb,python)](https://skillicons.dev)

---

## ⚠️ The Problem Statement

India's Q-Commerce (10-minute delivery) partners operate on extreme time constraints to power the digital economy. While they are essential, they are completely at the mercy of unpredictable external variables. 

* **The Trigger:** Sudden localized cloudbursts, severe pollution spikes (AQI > 450), or unexpected route closures force platforms to temporarily "pause" delivery zones.
* **The Impact:** Riders instantly lose 20-30% of their daily/monthly wages.
* **The Gap:** Currently, workers bear 100% of this financial loss. Traditional insurance only covers health or accidents, leaving their daily livelihood completely exposed to environmental disruptions.

---

## 💡 Our Proposed Solution

**DropSure** is a micro-parametric insurance platform providing **Zero-Touch Income Protection**. We act as a financial safety net for delivery partners, protecting their income from uncontrollable external disruptions.

Instead of waiting for a rider to manually file a claim, DropSure actively monitors hyper-local weather, traffic APIs, and municipal data. When an external disruption in a specific geo-fence crosses a pre-defined parametric threshold (e.g., Rainfall > 15mm/hr causing zone closures), and the rider is logged into that zone, DropSure automatically triggers a micro-payout directly to their wallet to compensate for the lost earning hours.

### 🎯 Target Persona: Q-Commerce Delivery Partners
Designed for riders on platforms like Zepto, Blinkit, and Instamart. 
**Why?** Q-Commerce relies on hyper-local 2km radius zones. A single waterlogged street or localized political rally can entirely halt a dark store's operations. Unlike standard food delivery where riders can migrate to other zones, Q-commerce riders are left stranded with no income.

---

## 🚀 Innovation & Uniqueness

DropSure flips the traditional post-incident damage assessment model:

1. **Event-Driven, Not Claim-Driven:** We eliminate the claims process entirely. Payouts are triggered strictly by data (APIs), not by user submissions.
2. **Hyper-Local Risk Assessment:** We don't insure "Bangalore rain"; we insure "Koramangala Block 3 waterlogging" using highly granular API clusters.
3. **Weekly Gig-Aligned Micro-Premiums:** DropSure charges a dynamically calculated weekly premium (e.g., ₹25-45/week) synced perfectly with the gig worker's weekly platform payout cycle, unlike traditional annual insurance.

---

## ⚙️ Key Features & Workflow

### 🧠 AI-Powered Dynamic Weekly Premium Calculation
* **How it works:** An ML model analyzes the upcoming 7-day weather forecast, historical disruption data for the rider's home dark-store, and the rider's tier/rating.
* **The Weekly Model:** Premiums are recalculated every Sunday night. A sunny week yields a lower premium (e.g., ₹20/week), while a forecasted monsoon week adjusts slightly higher (e.g., ₹45/week) for fair, data-backed pricing.

### ⚡ Parametric Automation & Zero-Touch Claims
* **The Trigger:** OpenWeather API reporting extreme conditions OR TomTom Traffic API reporting average speeds < 5km/h (indicating severe waterlogging/strikes) in the active zone for > 60 minutes.
* **The Action:** A Smart Contract automatically verifies the active location and initiates a seamless UPI payout (e.g., ₹150 for 2 lost hours)—no questions asked, no forms filled.

### 🛡️ Intelligent Fraud Detection
* **Device-Level Telemetry Validation:** Cross-references GPS coordinates to ensure the rider was actually inside the disrupted "Red Zone" *before* the disruption started, preventing location spoofing.
* **Multi-API Consensus:** Requires correlation between Weather data and Traffic Congestion data to prevent false positives from a single faulty API station.

---

## 📱 Platform Architecture

We are building DropSure as a **Mobile Progressive Web App (PWA)**. 
* **Justification:** Gig workers spend 100% of their working hours on smartphones and rarely use desktop environments. A PWA is lightweight, requires no app-store updates, consumes minimal data, and seamlessly integrates with their existing ecosystem (UPI and Delivery apps).

### 🛠️ Proposed Tech Stack
* **Frontend:** Flutter (Native-like mobile) or React (PWA).
* **Backend:** Node.js / Express.js (High concurrency for real-time trigger monitoring).
* **Database:** PostgreSQL (Relational policy data) & MongoDB (Time-series data for rider location pings & weather logs).
* **AI/ML:** Python (Scikit-learn/XGBoost) for predictive risk modeling and dynamic premium pricing.
* **External Integrations:**
  * **Weather:** OpenWeatherMap API / Tomorrow.io.
  * **Disruptions:** TomTom Traffic API / Mapbox.
  * **Payments:** Razorpay Test Environment / Mock UPI Simulator.

---

## 📈 Feasibility & Scalability

* **Feasibility:** Relying strictly on objective parametric data (APIs) eliminates human claims adjusters. Mock APIs make the system entirely buildable within the 6-week timeframe.
* **Scalability:** The platform is intrinsically scalable. Expanding to a new city or persona (e.g., ride-hailing drivers) simply requires mapping new geo-fences and adjusting ML weights while the core parametric engine remains the same.

---

## 🗺️ High-Level Implementation Plan

* **Phase 2 (Weeks 3-4):** Develop the core backend engine, integrate OpenWeather API, build the ML dynamic weekly premium algorithm, and develop the basic mobile UI for onboarding and policy viewing.
* **Phase 3 (Weeks 5-6):** Build automated trigger execution, implement anti-GPS spoofing logic, connect the simulated Razorpay payout system, and develop the Admin Dashboard for insurers to view loss ratios.

---

## ✅ Alignment with Hackathon Constraints 

- [x] **LOSS OF INCOME ONLY:** Explicitly DOES NOT cover vehicle repairs, accidents, health, or life insurance. It strictly compensates for hourly wages lost due to external API-verified disruptions.
- [x] **WEEKLY PRICING MODEL:** Financial architecture is built on a 7-day rolling cycle matching weekly earnings payouts.
- [x] **PERSONA FOCUS:** Tailored explicitly to Q-Commerce delivery partners.
- [x] **AI INTEGRATION:** Utilized for dynamic pricing (risk assessment) and fraud detection (telemetry validation).

---

## 🔗 Submission Links

* **Phase 1 Pitch Video:** [Watch on YouTube/Drive](#)
* **Repository Link:** [github.com/TechWithDipak/DropSure](https://github.com/TechWithDipak/DropSure)

*Built for Guidewire DEVTrails 2026 by Dipak Kumar*
