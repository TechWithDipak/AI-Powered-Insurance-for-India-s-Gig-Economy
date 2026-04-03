# DropSure - Phase 2 Submission

This is the fully functional, production-ready version of **DropSure** built for Hackathon Phase 2.

## 🏗️ Architecture
- **Frontend**: Next.js 14 App Router, React, Tailwind CSS
- **Backend**: Next.js API Routes (`/api/premium` and `/api/trigger`)
- **Database / Auth**: Supabase (PostgreSQL), schema provided.
- **AI Module**: Custom JS rules-engine processing data from Mock Weather/Disruption APIs.

## 📂 Project Structure
- `/app` - Next.js App Router (Main UI, globals.css, API endpoints)
- `/components` - Modular React components (Chatbot, LoginScreen, Tabs)
- `/data` - Mock JSON data for simulating external variables (weather.json, disruption.json)
- `/lib` - AI Module config (`ai.js`) and Supabase client config (`supabase.js`)
- `/sql` - `schema.sql` file containing full table layouts and RLS policies

## 🛠️ Setup Instructions (Local Testing)

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Supabase (Optional for Front-End Demo)**
   *The UI is designed to degrade gracefully during the demo if Supabase keys are not present!*
   - Create a project on [Supabase](https://supabase.com).
   - Go to SQL Editor and run the script located at `sql/schema.sql`.
   - Create a `.env.local` file in the root of the project.
   - Add your keys:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
     ```

3. **Start the Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to view it in the browser. *We recommend using Mobile Developer View for the best experience.*

## 🚀 How to Run the Demo Flow
1. **User Registration**: Register a new worker via the Sign Up screen (Aadhaar mock). Enter the base details. OTP is `1234`.
2. **AI Premium Calculation**: Go to **Plans**, and tap the "i" info icon next to AI Calculated Premium to see the Chatbot explain the calculation from `weather.json`.
3. **Trigger Event (Zero-Touch Claim)**: Go to **Home** and click "Simulate Heavy Rain". 
4. **Claim Processing**: Wait 3 seconds, the "Zero-Touch Claim" process will approve an automated payment and then trigger the **AI Chatbot Explanation Layer** showing why the user received money. 

## ☁️ Deployment Guide (Vercel)
This app is optimized to deploy directly out-of-the-box on Vercel.
1. Push this code to a GitHub repo.
2. Sign in to Vercel and **Add New Project**.
3. Import the repository.
4. Set the Environment Variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
5. Click **Deploy**.
