"use client";

import { Shield, CreditCard, Activity, ArrowRight, CheckCircle, Clock, MapPin, CloudRain, Wind, ShieldCheck, ShoppingBag, Bot, Zap, X } from 'lucide-react';
import { calculatePremium, calculatePayoutFactor } from '../lib/ai';
import weatherData from '../data/weather.json';

export function HomeTab({ user, claims, onTrigger }) {
  if (!user) return null;
  
  const planBaseRaw = user.plan === 'Aarambh' ? 20 : user.plan === 'Rakshak' ? 30 : 45;
  const premiumData = calculatePremium(planBaseRaw, user.shiftTiming);
  const factor = calculatePayoutFactor(user.shiftTiming);
  
  const isMahakavach = user?.plan === 'Mahakavach';
  const isRakshak = user?.plan === 'Rakshak';
  const isAarambh = user?.plan === 'Aarambh';

  return (
    <div className="p-6 pt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">Weekly Earnings Limit</p>
          <p className="text-3xl font-extrabold text-[#0A2540]">
            ₹{user.plan === 'Mahakavach' ? '12,500' : user.plan === 'Rakshak' ? '8,000' : '4,500'}
          </p>
        </div>
        <div className="relative bg-white p-2 rounded-full shadow-sm">
          <Bot size={20} className="text-[#0A2540]" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#0A2540] to-[#1E3A5F] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D4FF] rounded-full blur-[80px] opacity-20 -mr-10 -mt-10 pointer-events-none"></div>
        
        <div className="flex justify-between items-start mb-6 relative z-10">
          <div>
            <p className="text-[#00D4FF] text-sm font-semibold tracking-wider uppercase mb-1">Weekly Cover</p>
            <h2 className="text-3xl font-bold flex items-center">{user.plan}</h2>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center border border-white/20">
            <span className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse mr-2"></span>
            <span className="text-xs font-bold text-[#E2E8F0]">Active Engine</span>
          </div>
        </div>

        <div className="flex justify-between items-end relative z-10">
          <div>
            <p className="text-slate-400 text-sm mb-1 cursor-pointer underline flex items-center" onClick={() => onTrigger('ai_explain', premiumData)}>AI Calculated Premium ℹ️</p>
            <p className="text-xl font-semibold flex items-center">
              <span className="mr-1">₹</span> {premiumData.dynamic_premium} <span className="text-sm font-normal text-slate-400 ml-1">/ week</span>
            </p>
          </div>
          <ShieldCheck size={40} className="text-[#00D4FF] opacity-80" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-8">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer">
          <div className="flex items-center mb-3">
             <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mr-3"><Activity size={16} className="text-blue-500" /></div>
             <p className="text-sm font-bold text-slate-600">Earnings</p>
          </div>
          <h3 className="text-xl font-bold text-[#0A2540]">₹{claims?.reduce((acc, claim) => acc + parseFloat(claim.amount), 0) || 0}</h3>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow cursor-pointer" onClick={() => onTrigger('ai_explain', premiumData)}>
          <div className="flex items-center mb-3">
             <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center mr-3"><Bot size={16} className="text-orange-500" /></div>
             <p className="text-sm font-bold text-slate-600">AI Score</p>
          </div>
          <h3 className="text-xl font-bold text-[#F59E0B]">{premiumData.risk_score}</h3>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[#0A2540]">Test Automated Triggers</h3>
          <Zap size={16} className="text-slate-400" />
        </div>
        <p className="text-xs text-slate-500 mb-4 bg-slate-100 p-2 rounded">
          These simulate backend IoT/Webhooks that normally run automatically. Triggers are selectively filtered by your active plan constraint.
        </p>
        
        <div className="space-y-3 pb-8">
          {/* Always visible (Rain) */}
          <button onClick={() => onTrigger('rain', premiumData, { reason: 'Heavy Rainfall > 15mm/hr', amount: Math.round(200 * factor) })} className="w-full bg-[#E0F2FE] border border-[#BAE6FD] hover:border-[#38BDF8] p-4 rounded-xl flex items-center shadow-sm transition-all group">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform"><CloudRain className="text-blue-500" size={20}/></div>
            <div className="text-left flex-1">
              <h4 className="font-bold text-[#0A2540]">Simulate Heavy Rain</h4>
              <p className="text-xs text-[#0369A1]">Auto-generates ₹{Math.round(200 * factor)} payout</p>
            </div>
          </button>

          {/* Rakshak & Mahakavach only (AQI) */}
          {(isRakshak || isMahakavach) && (
            <button onClick={() => onTrigger('aqi', premiumData, { reason: 'Severe AQI Spike', amount: Math.round(150 * factor) })} className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 p-4 rounded-xl flex items-center shadow-sm transition-all group">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform"><Wind className="text-orange-500" size={20}/></div>
              <div className="text-left flex-1">
                <h4 className="font-bold text-slate-800">Simulate Severe AQI</h4>
                <p className="text-xs text-slate-500">Auto-generates ₹{Math.round(150 * factor)} payout</p>
              </div>
            </button>
          )}

          {/* Mahakavach only (Waterlogging, Strike) */}
          {isMahakavach && (
            <>
              <button onClick={() => onTrigger('waterlogging', premiumData, { reason: 'Water-Logging Alert', amount: Math.round(300 * factor) })} className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 p-4 rounded-xl flex items-center shadow-sm transition-all group">
                <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform"><CloudRain className="text-cyan-500" size={20}/></div>
                <div className="text-left flex-1">
                  <h4 className="font-bold text-slate-800">Simulate Water-logging</h4>
                  <p className="text-xs text-slate-500">Auto-generates ₹{Math.round(300 * factor)} payout</p>
                </div>
              </button>

              <button onClick={() => onTrigger('strike', premiumData, { reason: 'Area Curfew/Strike', amount: Math.round(500 * factor) })} className="w-full bg-red-50 border border-red-100 hover:border-red-300 p-4 rounded-xl flex items-center shadow-sm transition-all group">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform"><Shield className="text-red-600" size={20}/></div>
                <div className="text-left flex-1">
                  <h4 className="font-bold text-red-900">Simulate Strike/Curfew</h4>
                  <p className="text-xs text-red-700">Auto-generates ₹{Math.round(500 * factor)} payout</p>
                </div>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function ActivityTab({ weatherData, disruptionData, claims, onTrigger }) {
  return (
    <div className="p-6 pt-12 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold text-[#0A2540] mb-6">Live AI Monitoring</h2>
      
      <div className="bg-[#E0F2FE] rounded-xl p-3 flex items-center justify-center border border-[#BAE6FD] mb-6">
        <span className="w-2 h-2 bg-[#0284C7] rounded-full animate-pulse mr-2"></span>
        <span className="text-sm font-semibold text-[#0369A1]">Continuously polling APIs</span>
      </div>

      <div className="space-y-4 mb-8">
        <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mr-4 border border-slate-100"><CloudRain className="text-blue-500"/></div>
            <div><p className="text-xs text-slate-500">Weather.json (Rain Prob)</p><p className="text-sm font-bold text-[#0A2540]">{weatherData.rain_probability * 100}%</p></div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mr-4 border border-slate-100"><Wind className="text-green-500"/></div>
            <div><p className="text-xs text-slate-500">Weather.json (AQI Level)</p><p className="text-sm font-bold text-[#0A2540]">{weatherData.aqi}</p></div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center mr-4 border border-slate-100"><Activity className="text-orange-500"/></div>
            <div><p className="text-xs text-slate-500">Disruption.json (Curfew)</p><p className="text-sm font-bold text-[#0A2540]">{disruptionData.curfew ? 'Active' : 'Clear'}</p></div>
          </div>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-[#0A2540] mb-4 mt-8">Recent Payouts History</h3>
      {(!claims || claims.length === 0) ? (
        <div className="bg-slate-100 rounded-xl p-6 text-center text-slate-500">
           No claims history yet.
        </div>
      ) : (
        <div className="space-y-3">
          {claims.map((claim) => (
             <div key={claim.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center relative group">
               <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center mr-3 border border-green-100">
                    <CheckCircle size={18} className="text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0A2540] text-sm pr-6">{claim.reason}</h4>
                    <p className="text-xs text-slate-500">{new Date(claim.created_at).toLocaleDateString()}</p>
                  </div>
               </div>
               <div className="text-right flex items-center">
                 <div className="mr-3 text-right">
                   <p className="font-bold text-[#22C55E]">+ ₹{claim.amount}</p>
                   <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded uppercase">{claim.status}</span>
                 </div>
                 <button onClick={() => onTrigger && onTrigger('ai_explain', null, claim)} className="p-2 text-slate-400 hover:text-[#00D4FF] bg-slate-50 hover:bg-slate-100 rounded-full transition-colors" title="Ask AI about this claim">
                   ℹ️
                 </button>
               </div>
             </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function PlansTab({ user }) {
  return (
    <div className="p-6 pt-12 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold text-[#0A2540] mb-6">Your Coverage</h2>
      
      <div className="bg-gradient-to-br from-[#0A2540] to-[#1E3A5F] rounded-3xl p-6 mb-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00D4FF] rounded-full blur-[60px] opacity-20 pointer-events-none"></div>
        <p className="text-[#00D4FF] text-xs font-bold uppercase tracking-wider mb-2">Current Plan</p>
        <h3 className="text-2xl font-bold mb-4">{user.plan}</h3>
        
        <div className="space-y-3 relative z-10 text-sm">
          {user.plan === 'Mahakavach' && (
            <>
              <div className="flex items-center"><CheckCircle size={16} className="text-[#22C55E] mr-3" /> Heavy Rainfall</div>
              <div className="flex items-center"><CheckCircle size={16} className="text-[#22C55E] mr-3" /> Severe AQI spikes</div>
              <div className="flex items-center"><CheckCircle size={16} className="text-[#22C55E] mr-3" /> Water-logging / Floods</div>
              <div className="flex items-center"><CheckCircle size={16} className="text-[#22C55E] mr-3" /> Area Curfew / Strikes</div>
            </>
          )}
          {user.plan === 'Rakshak' && (
            <>
              <div className="flex items-center"><CheckCircle size={16} className="text-[#22C55E] mr-3" /> Heavy Rainfall</div>
              <div className="flex items-center"><CheckCircle size={16} className="text-[#22C55E] mr-3" /> Severe AQI spikes</div>
              <div className="flex items-center opacity-50"><X size={16} className="text-red-400 mr-3" /> Water-logging / Floods</div>
            </>
          )}
          {user.plan === 'Aarambh' && (
            <>
              <div className="flex items-center"><CheckCircle size={16} className="text-[#22C55E] mr-3" /> Heavy Rainfall</div>
              <div className="flex items-center opacity-50"><X size={16} className="text-red-400 mr-3" /> Severe AQI spikes</div>
              <div className="flex items-center opacity-50"><X size={16} className="text-red-400 mr-3" /> Water-logging / Floods</div>
            </>
          )}
        </div>
      </div>

      <h3 className="text-lg font-bold text-[#0A2540] mb-4">Upgrade Options</h3>
      <div className="space-y-4 pb-8">
        <div className="border border-slate-200 rounded-2xl p-5 shadow-sm bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#00D4FF] text-[#0A2540] text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase">Recommended</div>
          <h4 className="font-bold text-[#0A2540] text-lg mb-1 mt-2">Rakshak</h4>
          <p className="text-sm text-slate-500 mb-4">Perfect balance for daily riders. Covers rain and pollution.</p>
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">₹30 <span className="text-xs font-normal text-slate-500">/ week base</span></span>
            <button className="bg-slate-100 hover:bg-slate-200 text-[#0A2540] font-semibold px-4 py-2 rounded-lg text-sm transition-colors cursor-not-allowed opacity-50">Current</button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#0A2540] to-[#0d3460] rounded-2xl p-5 shadow-lg border border-[#00D4FF]/30 text-white relative overflow-hidden">
           <h4 className="font-bold text-white text-lg mb-1 flex items-center">Mahakavach <Shield className="ml-2 text-[#00D4FF]" size={16}/></h4>
           <p className="text-sm text-slate-300 mb-4">Peace of mind. Everything covered. All exclusions removed.</p>
           <div className="flex justify-between items-center">
             <span className="font-bold text-lg">₹45 <span className="text-xs font-normal text-[#00D4FF]">/ week base</span></span>
             <button className="bg-[#00D4FF] hover:bg-[#00B4DF] text-[#0A2540] font-bold px-4 py-2 rounded-lg text-sm transition-colors shadow-[0_0_15px_rgba(0,212,255,0.3)]">Upgrade Now</button>
           </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileTab({ user, onLogout }) {
  return (
    <div className="p-6 pt-12 animate-in fade-in duration-300">
      <h2 className="text-2xl font-bold text-[#0A2540] mb-6">Your Profile</h2>
      
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#00D4FF] to-blue-600 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-lg">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <h3 className="text-xl font-bold text-[#0A2540]">{user.name}</h3>
        <p className="text-sm text-slate-500 mb-4">{user.email}</p>
        <span className="bg-blue-50 text-blue-700 font-semibold px-3 py-1 rounded-full text-xs">
          {user.platform} Partner
        </span>
      </div>

      <div className="space-y-3 mb-8">
        <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
          <Clock className="text-slate-400 mr-4" size={20} />
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold">Shift Timing</p>
            <p className="text-[#0A2540] font-medium">{user.shiftTiming}</p>
          </div>
        </div>
        <div className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
          <MapPin className="text-slate-400 mr-4" size={20} />
          <div>
            <p className="text-xs text-slate-500 uppercase font-semibold">Primary Zone</p>
            <p className="text-[#0A2540] font-medium">{user.location}</p>
          </div>
        </div>
      </div>

      <button onClick={onLogout} className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-4 rounded-2xl transition-colors border border-red-100 flex items-center justify-center">
        Log Out
      </button>
    </div>
  );
}
