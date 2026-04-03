import { useState, useEffect } from 'react';
import { Bot, X, CheckCircle, ShieldCheck, ChevronRight, RotateCcw } from 'lucide-react';

export default function Chatbot({ visible, onClose, claimInfo, premiumInfo, activePlan, claims }) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [activeClaim, setActiveClaim] = useState(claimInfo);
  const [localPremium, setLocalPremium] = useState(premiumInfo);

  // Sync prop changes
  useEffect(() => {
    setActiveClaim(claimInfo);
    setLocalPremium(premiumInfo);
    setSelectedTopic(null);
  }, [claimInfo, premiumInfo, visible]);

  if (!visible) return null;

  const handleMenuClick = (topic) => {
    setSelectedTopic(topic);
    if (topic === 'latest_payout') {
      if (claims && claims.length > 0) {
        setActiveClaim(claims[0]);
      }
    }
  };

  const resetMenu = () => {
    setActiveClaim(null);
    setLocalPremium(null);
    setSelectedTopic(null);
  };

  const renderMenu = () => {
    if (activeClaim || localPremium || selectedTopic) return null;
    return (
      <div className="flex flex-col gap-2 mt-4 animate-in fade-in slide-in-from-bottom-4">
        <p className="text-xs text-slate-400 font-bold ml-1 mb-1">Quick Questions</p>
        <button onClick={() => handleMenuClick('latest_payout')} className="bg-white border border-[#00D4FF]/30 hover:border-[#00D4FF] text-[#0A2540] text-sm text-left p-3 rounded-xl flex justify-between items-center shadow-sm transition-colors">
          <span>Explain my latest payout 💰</span>
          <ChevronRight size={16} className="text-[#00D4FF]"/>
        </button>
        <button onClick={() => handleMenuClick('calculation_rules')} className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm text-left p-3 rounded-xl flex justify-between items-center shadow-sm transition-colors">
          <span>How are payouts calculated? 🧮</span>
          <ChevronRight size={16} className="text-slate-400"/>
        </button>
        <button onClick={() => handleMenuClick('plan_coverage')} className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm text-left p-3 rounded-xl flex justify-between items-center shadow-sm transition-colors">
          <span>What does my plan cover? 🛡️</span>
          <ChevronRight size={16} className="text-slate-400"/>
        </button>
      </div>
    );
  };

  return (
    <div className="absolute inset-0 bg-[#0A2540]/60 backdrop-blur-sm z-50 flex flex-col justify-end p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full rounded-[32px] p-6 shadow-2xl flex flex-col h-[80%] border-t-4 border-[#00D4FF]">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center">
            <div className="bg-[#E0F2FE] p-2 rounded-full mr-3"><Bot size={24} className="text-[#00D4FF]" /></div>
            <div>
              <h3 className="font-bold text-[#0A2540] text-lg leading-tight">DropSure AI</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Automated Support</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar space-y-4 pb-10">
          {/* Welcome Message */}
          {(!activeClaim && !localPremium && !selectedTopic) && (
            <div className="bg-slate-100 text-slate-800 p-4 rounded-2xl rounded-tl-none text-sm max-w-[85%] shadow-sm">
              Hi! I am the DropSure AI. I oversee all risk scoring and parametric claims. What can I help you understand?
            </div>
          )}

          {renderMenu()}

          {/* User Selection Bubble */}
          {selectedTopic === 'calculation_rules' && (
            <>
              <div className="bg-[#0A2540] text-white p-3 rounded-2xl rounded-tr-none text-sm max-w-[80%] ml-auto shadow-sm">How do you calculate the exact payout amount?</div>
              <div className="bg-slate-100 text-slate-800 p-4 rounded-2xl rounded-tl-none text-sm max-w-[90%] shadow-sm animate-in fade-in slide-in-from-left-4">
                <p>We use a strict Matrix formula that combines your active plan's base limits multiplied by the risk profile of your shift.</p>
                <ul className="list-disc pl-4 mt-2 space-y-1 text-xs text-slate-600">
                  <li><b>Night Shifts</b> receive a <b>1.5x Premium Bonus</b> to total payout.</li>
                  <li><b>Morning Shifts</b> receive a <b>1.1x Risk Modifier</b>.</li>
                  <li><b>Day Shifts</b> receive the exact standard flat rate.</li>
                </ul>
              </div>
            </>
          )}

          {selectedTopic === 'plan_coverage' && (
            <>
              <div className="bg-[#0A2540] text-white p-3 rounded-2xl rounded-tr-none text-sm max-w-[80%] ml-auto shadow-sm">What disruptions does my {activePlan} plan cover?</div>
              <div className="bg-slate-100 text-slate-800 p-4 rounded-2xl rounded-tl-none text-sm max-w-[85%] shadow-sm animate-in fade-in slide-in-from-left-4">
                <p>You are currently subscribed to the <b>{activePlan}</b> Plan.</p>
                <div className="mt-2 text-xs text-slate-600 border-l-2 border-[#00D4FF] pl-3 py-1">
                  {activePlan === 'Aarambh' && "You are protected exclusively against Heavy Rainfall > 15mm/hr."}
                  {activePlan === 'Rakshak' && "You are protected against Heavy Rainfall and Severe AQI spikes."}
                  {activePlan === 'Mahakavach' && "You have total protection: Rainfall, AQI, Water-logging, Extreme Heat, and City-wide Strikes/Curfews."}
                </div>
              </div>
            </>
          )}

          {selectedTopic === 'latest_payout' && !activeClaim && (
             <div className="bg-slate-100 text-slate-800 p-4 rounded-2xl rounded-tl-none text-sm max-w-[85%] shadow-sm animate-in fade-in slide-in-from-left-4">
               I checked your database history but could not find any documented claims attached to your UUID.
             </div>
          )}

          {/* Premium Explanation View */}
          {localPremium && (
            <div className="bg-slate-100 text-slate-800 p-4 rounded-2xl rounded-tl-none text-sm max-w-[95%] shadow-sm">
              <p className="font-bold mb-2 flex items-center text-[#0A2540] border-b border-slate-200 pb-2"><ShieldCheck size={16} className="mr-2 text-blue-500"/> Risk Matrix Expansion</p>
              <ul className="pl-1 space-y-2 text-xs text-slate-600">
                <li className="flex justify-between items-center bg-white p-2 rounded"><span>Base Plan Cost</span> <span className="font-bold">₹{localPremium.base}</span></li>
                <li className="flex justify-between items-center bg-white p-2 rounded"><span>Rain Probability <span className="opacity-50">((val*0.45))</span></span> <span className="font-bold text-blue-500">{(localPremium.rain * 100).toFixed(0)}%</span></li>
                <li className="flex justify-between items-center bg-white p-2 rounded"><span>AQI Level <span className="opacity-50">((val/500)*0.25)</span></span> <span className="font-bold text-orange-500">{localPremium.aqiRaw}</span></li>
              </ul>
              <div className="mt-3 text-xs bg-white p-3 rounded-xl border border-slate-200">
                Algorithmic Risk Score: <span className="float-right font-bold">{localPremium.score}</span> <br/>
                <div className="h-px bg-slate-100 my-2"></div>
                Final Pricing <span className="float-right text-[#00D4FF] font-bold text-sm">₹{localPremium.final}</span>
              </div>
            </div>
          )}

          {/* Claim Explanation View */}
          {activeClaim && (
            <div className="bg-blue-50 text-blue-900 border border-blue-100 p-4 rounded-2xl rounded-tl-none text-sm max-w-[95%] shadow-sm animate-in fade-in slide-in-from-left-4">
              <p className="font-bold mb-2 flex items-center text-[#0A2540] border-b border-blue-200 pb-2"><CheckCircle size={16} className="mr-2 text-green-500"/> Zero-Touch Parametric Payout</p>
              <p className="text-xs mb-3">At {new Date(activeClaim.created_at || Date.now()).toLocaleString()}, the Engine verified a disruption matching your plan constraints.</p>
              <div className="text-xs bg-white p-3 rounded-xl border border-blue-100 space-y-2 shadow-inner">
                <p><b>Matrix Conditions Approved:</b></p>
                <ul className="text-slate-600 space-y-1">
                  <li className="flex">✅ <span className="ml-1 flex-1">Profile Authenticated</span></li>
                  <li className="flex">✅ <span className="ml-1 flex-1">Plan constraint check passed</span></li>
                  <li className="flex">✅ <span className="ml-1 flex-1"><b>Trigger:</b> {activeClaim.reason}</span></li>
                </ul>
              </div>
              <div className="mt-3 bg-green-100 border border-green-200 p-3 rounded-lg flex justify-between items-center">
                 <span className="text-xs font-bold text-green-800 uppercase tracking-widest">Released</span>
                 <span className="font-extrabold text-green-700 text-lg">₹{activeClaim.amount}</span>
              </div>
            </div>
          )}

          {(activeClaim || localPremium || selectedTopic) && (
            <div className="flex justify-start mt-6 animate-in fade-in duration-500">
              <button 
                onClick={resetMenu} 
                className="flex items-center text-xs font-bold text-slate-500 hover:text-[#0A2540] bg-slate-100 hover:bg-slate-200 py-2 px-4 rounded-full transition-colors"
              >
                <RotateCcw size={14} className="mr-2"/> Ask another question
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
