"use client";

import React, { useState, useEffect } from 'react';
import { Home, Activity, Shield, User, CloudRain, Wind, Menu, X, Users, Settings, Bot } from 'lucide-react';
import LoginScreen from '../components/LoginScreen';
import Chatbot from '../components/Chatbot';
import { HomeTab, ActivityTab, PlansTab, ProfileTab } from '../components/Tabs';

import { supabase } from '../lib/supabase';
// Static Data
import weatherData from '../data/weather.json';
import disruptionData from '../data/disruption.json';

export default function DropSureApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  
  // App States
  const [appState, setAppState] = useState('idle');
  const [activeTrigger, setActiveTrigger] = useState(null);
  
  // Chatbot State
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [chatbotInfo, setChatbotInfo] = useState({ claimInfo: null, premiumInfo: null });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [claims, setClaims] = useState([]);

  useEffect(() => {
    if (user?.id && user.role !== 'admin') {
      supabase.from('claims')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .then(({ data }) => {
          if (data) setClaims(data);
        });
    }
  }, [user, appState]);

  const triggerDisruption = async (type, premiumData = null, claimData = null) => {
    if (type === 'ai_explain') {
      setChatbotInfo({ premiumInfo: premiumData, claimInfo: claimData });
      setChatbotVisible(true);
      return;
    }

    setActiveTrigger(type);
    setAppState('alerting');
    
    try {
      const response = await fetch('/api/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.id, type })
      });
      
      const data = await response.json();
      
      setTimeout(() => {
        setAppState('success');
        
        if (data && data.success && data.claim) {
           setChatbotInfo({
             premiumInfo: null,
             claimInfo: {
               status: data.claim.status,
               amount: data.claim.amount,
               reason: data.claim.reason
             }
           });
        } else {
           // Fallback for demo if API/Supabase fails
           const payoutMap = { rain: 120, aqi: 100, curfew: 200, flood: 300, heat: 80 };
           const reasonMap = { 
              rain: "Heavy Rain (Mock API > 0.7 prob)", 
              aqi: "Severe AQI (Mock API > 150)",
              curfew: "Curfew/Strike",
              flood: "Water-Logging",
              heat: "Extreme Heat"
           };
           setChatbotInfo({
             premiumInfo: null,
             claimInfo: { status: "APPROVED", amount: payoutMap[type], reason: reasonMap[type] }
           });
        }
        
        setTimeout(() => {
           setAppState('idle');
           setChatbotVisible(true);
        }, 4000);
      }, 3000);

    } catch (err) {
       console.error("API Error", err);
       setAppState('idle');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('home');
    setUser(null);
  };

  // Auth Guard
  if (!isAuthenticated) {
    return <LoginScreen onLogin={(userData) => { setUser(userData); setIsAuthenticated(true); setActiveTab(userData.role === 'admin' ? 'adminHome' : 'home'); }} />;
  }

  // Admin Dashboard Render
  if (user?.role === 'admin') {
     return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-[#0A2540] font-sans">
      
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0A2540] text-white fixed h-full z-20">
        <div className="p-6 flex items-center mb-8 border-b border-slate-700">
           <Shield size={28} className="text-[#00D4FF] mr-3" />
           <h2 className="text-2xl font-bold tracking-tight">DropSure</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
           <SidebarItem icon={<Home size={20} />} label="Dashboard" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
           <SidebarItem icon={<Activity size={20} />} label="Live AI Data" active={activeTab === 'activity'} onClick={() => setActiveTab('activity')} />
           <SidebarItem icon={<Shield size={20} />} label="Protection Plans" active={activeTab === 'plans'} onClick={() => setActiveTab('plans')} />
           <SidebarItem icon={<User size={20} />} label="My Profile" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
        </nav>
        <div className="p-4 border-t border-slate-700">
           <button onClick={handleLogout} className="w-full py-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 font-semibold transition-colors">Sign Out</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col relative w-full h-full min-h-screen">
        
        {/* Mobile Header */}
        <header className="md:hidden flex justify-between items-center p-4 bg-[#0A2540] text-white sticky top-0 z-30">
          <div className="flex items-center">
            <Shield size={24} className="text-[#00D4FF] mr-2" />
            <h1 className="font-bold text-lg">DropSure</h1>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-14 left-0 w-full bg-[#0A2540] text-white z-20 p-4 border-t border-slate-700 shadow-xl pb-6">
            <nav className="flex flex-col space-y-2">
              <SidebarItem icon={<Home size={20} />} label="Dashboard" active={activeTab === 'home'} onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }} />
              <SidebarItem icon={<Activity size={20} />} label="Live AI Data" active={activeTab === 'activity'} onClick={() => { setActiveTab('activity'); setMobileMenuOpen(false); }} />
              <SidebarItem icon={<Shield size={20} />} label="Protection Plans" active={activeTab === 'plans'} onClick={() => { setActiveTab('plans'); setMobileMenuOpen(false); }} />
              <SidebarItem icon={<User size={20} />} label="My Profile" active={activeTab === 'profile'} onClick={() => { setActiveTab('profile'); setMobileMenuOpen(false); }} />
              <button onClick={handleLogout} className="w-full mt-4 py-3 bg-red-500/10 text-red-400 rounded-lg font-semibold text-left px-4">Sign Out</button>
            </nav>
          </div>
        )}

        <div className="flex-1 overflow-y-auto pb-6 px-4 md:px-10 lg:px-20 max-w-5xl mx-auto w-full">
          {appState === 'idle' && activeTab === 'home' && <HomeTab user={user} claims={claims} onTrigger={triggerDisruption} />}
          {appState === 'idle' && activeTab === 'activity' && <ActivityTab weatherData={weatherData} disruptionData={disruptionData} claims={claims} onTrigger={triggerDisruption} />}
          {appState === 'idle' && activeTab === 'plans' && <PlansTab user={user} />}
          {appState === 'idle' && activeTab === 'profile' && <ProfileTab user={user} onLogout={handleLogout} />}
        </div>
        
        {/* Modals & Overlays */}
        {appState === 'alerting' && <AlertModal triggerType={activeTrigger} />}
        {appState === 'success' && <SuccessScreen triggerType={activeTrigger} />}
        {appState === 'idle' && chatbotVisible && <Chatbot visible={chatbotVisible} onClose={() => setChatbotVisible(false)} claimInfo={chatbotInfo.claimInfo} premiumInfo={chatbotInfo.premiumInfo} activePlan={user?.plan} claims={claims} />}
        
        {/* Floating Chatbot FAB */}
        {appState === 'idle' && !chatbotVisible && (
          <button 
            onClick={() => setChatbotVisible(true)}
            className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 bg-[#00D4FF] hover:bg-[#00B4DF] text-[#0A2540] p-4 rounded-full shadow-[0_4px_20px_rgba(0,212,255,0.4)] transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
            title="Open DropSure AI Support"
          >
            <Bot size={28} />
          </button>
        )}

      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center p-3 rounded-xl transition-all ${active ? 'bg-[#00D4FF] text-[#0A2540] font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800'}`}>
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// --- ADMIN DASHBOARD ---
function AdminDashboard({ user, onLogout }) {
   return (
      <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-[#0A2540] font-sans">
        <aside className="hidden md:flex flex-col w-64 bg-red-950 text-white fixed h-full z-20">
          <div className="p-6 flex items-center mb-8 border-b border-red-900">
             <Shield size={28} className="text-red-400 mr-3" />
             <h2 className="text-2xl font-bold tracking-tight">Admin</h2>
          </div>
          <nav className="flex-1 px-4 space-y-2">
             <SidebarItem icon={<Activity size={20} />} label="Overview" active={true} onClick={() => {}} />
             <SidebarItem icon={<Users size={20} />} label="User Profiles" active={false} onClick={() => {}} />
             <SidebarItem icon={<Settings size={20} />} label="Risk Settings" active={false} onClick={() => {}} />
          </nav>
          <div className="p-4 border-t border-red-900">
             <button onClick={onLogout} className="w-full py-3 bg-red-500/10 text-white rounded-lg hover:bg-red-500/20 font-semibold transition-colors">Sign Out</button>
          </div>
        </aside>

        <main className="flex-1 md:ml-64 flex flex-col p-6 md:p-12 w-full max-w-6xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-bold text-slate-800">Platform Analytics</h1>
            <p className="text-slate-500">Overview of DropSure automated risk platform.</p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <p className="text-sm text-slate-500 font-semibold">Total Active Cover</p>
               <h3 className="text-3xl font-bold text-[#0A2540] mt-2">1,240</h3>
               <p className="text-xs text-green-500 mt-2">↑ 12% this week</p>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <p className="text-sm text-slate-500 font-semibold">Automated Claims Paid</p>
               <h3 className="text-3xl font-bold text-[#0A2540] mt-2">₹124,500</h3>
               <p className="text-xs text-slate-400 mt-2">84 disrupted workers</p>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <p className="text-sm text-slate-500 font-semibold">AI Risk Multipiler (Avg)</p>
               <h3 className="text-3xl font-bold text-orange-500 mt-2">x 1.04</h3>
               <p className="text-xs text-slate-400 mt-2">Moderate Rain Risk</p>
             </div>
          </div>
          
          <h2 className="text-xl font-bold mb-4">Recent Zero-Touch Operations</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
             <table className="w-full text-left">
               <thead className="bg-slate-50 border-b border-slate-100">
                 <tr>
                   <th className="p-4 text-sm font-semibold text-slate-500">Worker</th>
                   <th className="p-4 text-sm font-semibold text-slate-500">Trigger Event</th>
                   <th className="p-4 text-sm font-semibold text-slate-500">Amount</th>
                   <th className="p-4 text-sm font-semibold text-slate-500">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 <tr><td className="p-4 text-sm">Ravi N.</td><td className="p-4 text-sm">Heavy Rain &gt; 15mm</td><td className="p-4 text-sm font-bold">₹120</td><td className="p-4"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Paid</span></td></tr>
                 <tr><td className="p-4 text-sm">Pranay G.</td><td className="p-4 text-sm">AQI Spike &gt; 180</td><td className="p-4 text-sm font-bold">₹100</td><td className="p-4"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Paid</span></td></tr>
                 <tr><td className="p-4 text-sm">Dipak K.</td><td className="p-4 text-sm">Water-Logging (Mock)</td><td className="p-4 text-sm font-bold">₹300</td><td className="p-4"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Paid</span></td></tr>
               </tbody>
             </table>
          </div>
        </main>
      </div>
   );
}


function AlertModal({ triggerType }) {
  const config = ['rain', 'flood'].includes(triggerType) 
    ? { title: "Heavy Rain / Flood Detected", icon: <CloudRain size={40} className="text-blue-500" />, bg: "bg-blue-100" }
    : { title: "Disruption Detected", icon: <Wind size={40} className="text-[#F59E0B]" />, bg: "bg-orange-100" };

  return (
    <div className="absolute inset-0 bg-[#0A2540]/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[32px] p-6 pb-10 shadow-2xl animate-in zoom-in-95 duration-500 border-t-4 border-[#00D4FF]">
        <div className="flex justify-center mb-4">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center animate-pulse ${config.bg}`}>{config.icon}</div>
        </div>
        <h2 className="text-2xl font-bold text-center text-[#0A2540] mb-2">{config.title}</h2>
        <p className="text-center text-slate-600 mb-8 text-sm px-4">Processing via Zero-Touch Claim System...</p>
      </div>
    </div>
  );
}

function SuccessScreen({ triggerType }) {
  return (
    <div className="absolute inset-0 bg-[#22C55E]/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
      <h2 className="text-3xl font-bold text-white mb-2 text-center">Claim Approved!</h2>
      <p className="text-white font-medium text-lg text-center mb-8">Amount credited to your UPI via automated smart contract.</p>
    </div>
  );
}
