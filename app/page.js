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

  const handleUpgrade = async (newPlan) => {
    if (!user?.id) return;
    
    setAppState('alerting'); 
    setActiveTrigger('plan_upgrade');

    try {
      console.log(`Sending API request to secure upgrade endpoint for user ${user.id}...`);
      
      const response = await fetch('/api/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          newPlan: newPlan,
          name: user.name,
          platform: user.platform,
          location: user.location,
          shiftTiming: user.shiftTiming
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error("API Upgrade Error:", data.error);
        throw new Error(data.error || "Failed to upgrade via API");
      }

      console.log("Upgrade successful via secure API:", data.profile);

      // Update local state
      const updatedUser = { ...user, plan: newPlan };
      setUser(updatedUser);
      
      setTimeout(() => {
        setAppState('success');
        setTimeout(() => {
          setAppState('idle');
          setActiveTab('home'); // Go back home after upgrade
        }, 3000);
      }, 2000);

    } catch (err) {
      console.error("Upgrade Try/Catch Error:", err);
      setAppState('idle');
      alert(`Failed to upgrade plan: ${err.message}. Please check your connection.`);
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
          {appState === 'idle' && activeTab === 'plans' && <PlansTab user={user} onUpgrade={handleUpgrade} />}
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
   const [activeSubTab, setActiveSubTab] = useState('overview');
   const [stats, setStats] = useState({ activeUsers: 0, totalPaid: 0, avgRisk: 1.04 });
   const [recentClaims, setRecentClaims] = useState([]);
   const [allProfiles, setAllProfiles] = useState([]);
   const [loading, setLoading] = useState(true);

   const fetchAdminData = async () => {
      try {
         setLoading(true);
         const res = await fetch('/api/admin/stats');
         const data = await res.json();
         
         if (data.success) {
            setStats(data.stats);
            setRecentClaims(data.recentClaims);
            setAllProfiles(data.allProfiles);
         }
      } catch (err) {
         console.error("Admin Fetch Error:", err);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchAdminData();
      const channel = supabase
         .channel('admin_realtime')
         .on('postgres_changes', { event: '*', table: 'claims' }, () => fetchAdminData())
         .on('postgres_changes', { event: '*', table: 'profiles' }, () => fetchAdminData())
         .subscribe();
      return () => supabase.removeChannel(channel);
   }, []);

   return (
      <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row text-[#0A2540] font-sans">
        <aside className="hidden md:flex flex-col w-64 bg-red-950 text-white fixed h-full z-20">
          <div className="p-6 flex items-center mb-8 border-b border-red-900">
             <Shield size={28} className="text-red-400 mr-3" />
             <h2 className="text-2xl font-bold tracking-tight">Admin</h2>
          </div>
          <nav className="flex-1 px-4 space-y-2">
             <SidebarItem icon={<Activity size={20} />} label="Overview" active={activeSubTab === 'overview'} onClick={() => setActiveSubTab('overview')} />
             <SidebarItem icon={<Users size={20} />} label="User Profiles" active={activeSubTab === 'users'} onClick={() => setActiveSubTab('users')} />
             <SidebarItem icon={<Settings size={20} />} label="Risk Settings" active={activeSubTab === 'settings'} onClick={() => setActiveSubTab('settings')} />
          </nav>
          <div className="p-4 border-t border-red-900">
             <button onClick={onLogout} className="w-full py-3 bg-red-500/10 text-white rounded-lg hover:bg-red-500/20 font-semibold transition-colors">Sign Out</button>
          </div>
        </aside>

        <main className="flex-1 md:ml-64 flex flex-col p-6 md:p-12 w-full max-w-6xl mx-auto">
          {activeSubTab === 'overview' && (
            <>
              <header className="mb-10 flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 font-sans tracking-tight">Platform Analytics</h1>
                  <p className="text-slate-500">Overview of DropSure automated risk platform.</p>
                </div>
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-bold flex items-center">
                   <span className="w-2 h-2 bg-green-500 rounded-full animate-ping mr-2"></span>
                   Live from Supabase
                </div>
              </header>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                 <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                   <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Total Active Cover</p>
                   <h3 className="text-4xl font-extrabold text-[#0A2540] mt-2">{loading ? '...' : stats.activeUsers}</h3>
                   <p className="text-xs text-green-600 font-bold mt-2 flex items-center">↑ 12% growth</p>
                 </div>
                 <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                   <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Claims Payouts</p>
                   <h3 className="text-4xl font-extrabold text-[#0A2540] mt-2">₹{loading ? '...' : stats.totalPaid}</h3>
                   <p className="text-xs text-slate-400 font-medium mt-2">Automated settlements</p>
                 </div>
                 <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow border-l-4 border-l-orange-400">
                   <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Avg Risk Factor</p>
                   <h3 className="text-4xl font-extrabold text-orange-500 mt-2">x {stats.avgRisk}</h3>
                   <p className="text-xs text-slate-400 font-medium mt-2">Dynamic pricing</p>
                 </div>
              </div>
              
              <h2 className="text-2xl font-bold text-[#0A2540] mb-6">Recent Zero-Touch Operations</h2>
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                 <table className="w-full text-left">
                   <thead className="bg-slate-50/50 border-b border-slate-100">
                     <tr>
                       <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Worker</th>
                       <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Trigger</th>
                       <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                       <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {recentClaims.map((claim) => (
                        <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-5 text-sm font-semibold">{claim.profiles?.name || 'Worker'}</td>
                          <td className="p-5 text-sm text-slate-600">{claim.reason}</td>
                          <td className="p-5 text-sm font-bold text-[#0A2540]">₹{claim.amount}</td>
                          <td className="p-5"><span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{claim.status}</span></td>
                        </tr>
                     ))}
                     {recentClaims.length === 0 && <tr><td colSpan="4" className="p-10 text-center text-slate-400 italic">No real-time claims found. Ensure RLS policies are active.</td></tr>}
                   </tbody>
                 </table>
              </div>
            </>
          )}

          {activeSubTab === 'users' && (
            <div className="animate-in fade-in duration-300">
              <h1 className="text-3xl font-bold text-slate-800 mb-8">Registered Partners</h1>
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                 <table className="w-full text-left">
                   <thead className="bg-slate-50/50 border-b border-slate-100">
                     <tr>
                       <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
                       <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Platform</th>
                       <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Location</th>
                       <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Active Plan</th>
                       <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Role</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                     {allProfiles.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-5 text-sm font-semibold">{p.name}</td>
                          <td className="p-5 text-sm text-slate-600">{p.platform}</td>
                          <td className="p-5 text-sm text-slate-600">{p.location}</td>
                          <td className="p-5 text-sm"><span className={`px-2 py-1 rounded font-bold text-[10px] ${p.active_plan === 'None' ? 'bg-slate-100 text-slate-400' : 'bg-blue-100 text-blue-700'}`}>{p.active_plan}</span></td>
                          <td className="p-5 text-sm uppercase font-bold text-[10px] tracking-widest">{p.role}</td>
                        </tr>
                     ))}
                   </tbody>
                 </table>
              </div>
            </div>
          )}

          {activeSubTab === 'settings' && (
            <div className="animate-in fade-in duration-300 bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
              <Settings size={48} className="text-slate-300 mb-4" />
              <h2 className="text-xl font-bold text-slate-600">Risk Threshold Settings</h2>
              <p className="text-slate-500 max-w-sm mt-2">Adjust AI payout triggers and premium multipliers for the entire platform.</p>
              <div className="mt-8 space-y-4 w-full max-w-md">
                 <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                    <span className="font-bold text-sm">Rain Trigger ({'>'} mm/hr)</span>
                    <input type="number" defaultValue="15" className="w-16 bg-white border border-slate-200 rounded p-1 text-center font-bold" />
                 </div>
                 <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                    <span className="font-bold text-sm">AQI Hazard Level</span>
                    <input type="number" defaultValue="180" className="w-16 bg-white border border-slate-200 rounded p-1 text-center font-bold" />
                 </div>
                 <button className="w-full bg-[#0A2540] text-white font-bold py-3 rounded-xl mt-4 opacity-50 cursor-not-allowed">Save Global Policy</button>
              </div>
            </div>
          )}
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
