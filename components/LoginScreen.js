"use client";

import { useState } from 'react';
import { Mail, Key, ShieldCheck, User, MapPin, Clock, Zap, ShoppingBag, ArrowLeft, Briefcase, Lock, IndianRupee, Check, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function LoginScreen({ onLogin }) {
  const [authMode, setAuthMode] = useState('login'); // 'login', 'signup', 'admin'
  const [step, setStep] = useState('email'); // 'email', 'work', 'plans', 'payment'
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [platform, setPlatform] = useState('Blinkit');
  const [shiftTiming, setShiftTiming] = useState('Day (8 AM - 6 PM)');
  const [location, setLocation] = useState('Fetching Location...');
  const [selectedPlan, setSelectedPlan] = useState('Rakshak');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('processing');

  const fetchGeolocation = async () => {
    const fallbackToIP = async () => {
      try {
        const ipRes = await fetch("https://ipapi.co/json/");
        const ipData = await ipRes.json();
        if (ipData.city) setLocation(ipData.city + ", " + ipData.region);
        else setLocation("Location Secured");
      } catch (e) {
        setLocation("Unknown Region");
      }
    };

    if ("geolocation" in navigator && window.isSecureContext) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyCD7HlbfWrvkXJJYON88iR4TzazFW6Sv3M`);
            const data = await res.json();
            if (data.results && data.results.length > 0) {
              let foundCity = "Unknown Region";
              for (let comp of data.results[0].address_components) {
                if (comp.types.includes("sublocality_level_1") || comp.types.includes("locality")) {
                   foundCity = comp.long_name;
                   break;
                }
              }
              setLocation(foundCity);
            } else {
              fallbackToIP();
            }
          } catch (e) {
            fallbackToIP();
          }
        },
        (error) => {
          console.log("GPS unavailable (" + error.message + ") - Safely falling back to IP routing.");
          fallbackToIP(); 
        },
        { timeout: 2000 }
      );
    } else {
      console.warn("Geolocation not supported or not HTTPS. Falling back to IP tracking.");
      fallbackToIP();
    }
  };

  const nextStep = (next) => {
    setError('');
    if (next === 'work') fetchGeolocation();
    setStep(next);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Please enter email and password.");
    
    setIsLoading(true);
    setError('');

    // HARDCODED ADMIN CHECK
    if (authMode === 'admin') {
      if (email === 'admin@dropsure.com' && password === 'Admin123!') {
        setIsLoading(false);
        onLogin({ id: 'admin-id', role: 'admin', name: 'System Admin', email: 'admin@dropsure.com' });
        return;
      } else {
        setIsLoading(false);
        setError('Invalid admin credentials.');
        return;
      }
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      
      if (authError) {
        throw authError;
      }

      if (data?.user) {
        let profile = { name: email.split('@')[0], platform: 'Blinkit', location: 'Unknown', shiftTiming: 'Day', plan: 'Rakshak', role: 'worker', phone: '' };
        try {
           const { data: dbData } = await supabase.from('profiles').select('*').eq('id', data.user.id).single();
           if (dbData) {
              profile = {
                 ...profile,
                 name: dbData.name || profile.name,
                 phone: dbData.phone || profile.phone,
                 platform: dbData.platform || profile.platform,
                 location: dbData.location || profile.location,
                 shiftTiming: dbData.shift_timing || profile.shiftTiming,
                 plan: dbData.active_plan || profile.plan,
                 role: dbData.role || 'worker'
              };
           }
        } catch(e) {}
        
        onLogin({ ...profile, id: data.user.id });
      }
    } catch (err) {
      console.error("Supabase Auth Error:", err);
      setError(err.message || 'Invalid login credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const processPaymentAndSignup = async () => {
    setStep('payment');
    setPaymentStatus('processing');
    
    setTimeout(async () => {
      setPaymentStatus('success');
      
      try {
        const { data, error: signupError } = await supabase.auth.signUp({ email, password });
        if (signupError) throw signupError;
        
        if (data?.user) {
          const { error: dbError } = await supabase.from('profiles').insert([{
             id: data.user.id,
             name,
             phone,
             platform,
             work_type: platform,
             location,
             shift_timing: shiftTiming,
             active_plan: selectedPlan
          }]);

          if (dbError) throw dbError;
          
          setTimeout(() => {
            onLogin({ id: data.user.id, role: 'worker', name, email, phone, platform, location, shiftTiming, plan: selectedPlan });
          }, 1500);
        }
      } catch (err) {
        console.warn("Supabase Signup Error:", err);
        setPaymentStatus('error');
        setError(err.message || 'Error occurred during signup.');
        setTimeout(() => setStep('email'), 2000);
      }
    }, 2500);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#0A2540] md:bg-slate-100 text-white md:text-slate-900 justify-center items-center p-6 w-full animate-in fade-in duration-500 relative overflow-y-auto">
      
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-[#0A2540] rounded-[32px] overflow-hidden shadow-2xl border border-slate-700/50 min-h-[600px]">
        
        <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-[#0A2540] to-[#1E3A5F] border-r border-[#00D4FF]/20 relative overflow-hidden text-white">
          <div className="absolute top-[-20%] left-[-20%] w-96 h-96 bg-[#00D4FF] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
          <div>
            <div className="flex items-center mb-6">
              <ShieldCheck size={48} className="text-[#00D4FF] mr-4" />
              <h1 className="text-5xl font-bold tracking-tight">DropSure</h1>
            </div>
            <p className="text-slate-300 text-xl font-light leading-relaxed">
              Automated income protection for India's 10-minute economy.<br/><br/>
              <span className="font-semibold text-white">Zero Forms. Zero Waiting. Weekly Premiums.</span>
            </p>
          </div>
          <div>
            <div className="flex items-center space-x-4">
               <div className="w-12 h-12 bg-white/10 rounded-full flex justify-center items-center border border-white/20"><Briefcase size={20} className="text-[#00D4FF]" /></div>
               <div><p className="font-bold text-lg">Partner Dashboard</p><p className="text-sm text-slate-400">Join 10,000+ protected riders</p></div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 w-full flex flex-col justify-center bg-[#0A2540] md:bg-white text-white md:text-[#0A2540] relative z-10">
          
          {step === 'email' && (
             <>
               <div className="md:hidden flex items-center justify-center mb-8">
                 <ShieldCheck size={36} className="text-[#00D4FF] mr-3" />
                 <h1 className="text-3xl font-bold text-white">DropSure</h1>
               </div>

               <div className="flex bg-[#1E3A5F] md:bg-slate-100 rounded-xl p-1 mb-8 text-sm font-medium mx-auto max-w-sm w-full shadow-inner">
                 <button onClick={() => setAuthMode('login')} className={`flex-1 py-3 rounded-lg transition-colors ${authMode === 'login' ? 'bg-[#00D4FF] text-[#0A2540] shadow' : 'text-slate-400 md:text-slate-500 hover:text-white md:hover:text-[#0A2540]'}`}>Worker Login</button>
                 <button onClick={() => setAuthMode('signup')} className={`flex-1 py-3 rounded-lg transition-colors ${authMode === 'signup' ? 'bg-[#00D4FF] text-[#0A2540] shadow' : 'text-slate-400 md:text-slate-500 hover:text-white md:hover:text-[#0A2540]'}`}>Sign Up</button>
                 <button onClick={() => setAuthMode('admin')} className={`flex-1 py-3 rounded-lg transition-colors ${authMode === 'admin' ? 'bg-red-500 text-white shadow' : 'text-slate-400 md:text-slate-500 hover:text-white md:hover:text-red-500'}`}>Admin</button>
               </div>

               {(authMode === 'login' || authMode === 'admin') && (
                 <form onSubmit={handleLogin} className="max-w-sm mx-auto w-full animate-in fade-in slide-in-from-right-8 duration-300">
                   <h2 className="text-2xl font-bold mb-2">{authMode === 'admin' ? 'Admin Gateway' : 'Welcome Back'}</h2>
                   <p className="text-sm text-slate-400 md:text-slate-500 mb-8">{authMode === 'admin' ? 'Access risk monitoring & claim analytics.' : 'Enter your email and password to access your cover.'}</p>
                   
                   {authMode === 'admin' && (
                      <div className="bg-red-50 md:bg-red-50 border border-red-200 text-red-800 p-3 rounded-xl mb-6 text-xs shadow-sm">
                        Use Email: <b>admin@dropsure.com</b> | Pass: <b>Admin123!</b>
                      </div>
                   )}

                   <div className="space-y-4">
                     <div className="flex items-center bg-[#1E3A5F] md:bg-slate-50 border border-slate-600 md:border-slate-200 rounded-2xl p-4 focus-within:border-[#00D4FF] md:focus-within:border-[#00A3FF] transition-colors shadow-sm">
                       <Mail size={18} className="text-slate-400 md:text-slate-400 mr-3" />
                       <input type="email" placeholder="Email Address" className="bg-transparent border-none outline-none text-white md:text-[#0A2540] w-full text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
                     </div>
                     <div className="flex items-center bg-[#1E3A5F] md:bg-slate-50 border border-slate-600 md:border-slate-200 rounded-2xl p-4 focus-within:border-[#00D4FF] md:focus-within:border-[#00A3FF] transition-colors shadow-sm">
                       <Key size={18} className="text-slate-400 md:text-slate-400 mr-3" />
                       <input type="password" placeholder="Password" className="bg-transparent border-none outline-none text-white md:text-[#0A2540] w-full text-sm" value={password} onChange={(e) => setPassword(e.target.value)} />
                     </div>
                   </div>

                   {error && <p className="text-red-400 md:text-red-500 text-sm mt-4 flex items-center justify-center"><AlertTriangle size={14} className="mr-1"/>{error}</p>}
                   
                   <button type="submit" disabled={isLoading} className={`w-full font-bold text-lg py-4 rounded-2xl shadow-lg mt-8 flex justify-center items-center transition-transform active:scale-95 ${authMode === 'admin' ? 'bg-red-500 text-white hover:bg-red-600 shadow-red-500/20' : 'bg-gradient-to-r from-[#00D4FF] to-[#00A3FF] text-[#0A2540] shadow-[#00D4FF]/20 hover:shadow-[#00D4FF]/40'}`}>
                     {isLoading ? <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : 'Secure Log In'}
                   </button>
                 </form>
               )}

               {authMode === 'signup' && (
                 <div className="max-w-sm mx-auto w-full animate-in fade-in slide-in-from-right-8 duration-300">
                   <h2 className="text-xl md:text-2xl font-bold mb-2">Create Account</h2>
                   <p className="text-sm text-slate-400 md:text-slate-500 mb-6">Register to protect your weekly earnings.</p>
                   <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 opacity-80 md:text-slate-600">Full Name</label>
                      <input type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#1E3A5F] md:bg-white border border-[#00D4FF]/30 md:border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#00D4FF] focus:border-transparent text-white md:text-slate-900 transition-all placeholder:opacity-40 shadow-inner" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 opacity-80 md:text-slate-600">Email Address</label>
                      <input type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-[#1E3A5F] md:bg-white border border-[#00D4FF]/30 md:border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#00D4FF] focus:border-transparent text-white md:text-slate-900 transition-all placeholder:opacity-40 shadow-inner" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 opacity-80 md:text-slate-600">Phone Number</label>
                      <input type="tel" placeholder="+91 9999999999" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-[#1E3A5F] md:bg-white border border-[#00D4FF]/30 md:border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#00D4FF] focus:border-transparent text-white md:text-slate-900 transition-all placeholder:opacity-40 shadow-inner" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 opacity-80 md:text-slate-600">Password</label>
                      <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[#1E3A5F] md:bg-white border border-[#00D4FF]/30 md:border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[#00D4FF] focus:border-transparent text-white md:text-slate-900 transition-all placeholder:opacity-40 shadow-inner" />
                    </div>
                  </div>
                  <button onClick={() => nextStep('work')} disabled={!email || !password || !name || !phone} className="w-full bg-[#00D4FF] hover:bg-[#00B4DF] text-[#0A2540] font-bold py-3 px-4 rounded-xl transition-colors disabled:opacity-50 mt-6 shadow-lg shadow-[#00D4FF]/20">
                    Next Step
                  </button>
                 </div>
               )}
             </>
          )}

          {step === 'work' && (
            <div className="animate-in slide-in-from-right-8 duration-500 max-w-sm mx-auto w-full text-white md:text-[#0A2540]">
              <h2 className="text-2xl font-bold mb-1">Work Details</h2>
              <p className="text-sm text-slate-400 md:text-slate-500 mb-6">Confirm your work profile.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 opacity-80 md:text-slate-600">Auto-Detected Location</label>
                  <div className="w-full bg-[#1E3A5F]/50 md:bg-slate-100 border border-transparent md:border-slate-200 rounded-xl px-4 py-3 text-white md:text-slate-500 font-semibold flex items-center">
                      📍 {location}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2 opacity-80 md:text-slate-600">Delivery Platform:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setPlatform('Blinkit')} className={`py-3 rounded-xl border flex items-center justify-center transition-all ${platform === 'Blinkit' ? 'bg-[#00D4FF] text-[#0A2540] border-[#00D4FF] font-bold' : 'bg-[#1E3A5F] md:bg-slate-50 border-slate-600 md:border-slate-200'}`}><ShoppingBag size={16} className="mr-2" /> Blinkit</button>
                    <button type="button" onClick={() => setPlatform('Zepto')} className={`py-3 rounded-xl border flex items-center justify-center transition-all ${platform === 'Zepto' ? 'bg-[#00D4FF] text-[#0A2540] border-[#00D4FF] font-bold' : 'bg-[#1E3A5F] md:bg-slate-50 border-slate-600 md:border-slate-200'}`}><Zap size={16} className="mr-2" /> Zepto</button>
                  </div>
                </div>
              </div>

              <button onClick={() => nextStep('plans')} className="w-full bg-[#00D4FF] hover:bg-[#00B4DF] text-[#0A2540] font-bold py-3 px-4 rounded-xl transition-colors mt-8 shadow-lg shadow-[#00D4FF]/20">
                Continue to Plans
              </button>
            </div>
          )}

          {step === 'plans' && (
            <div className="animate-in slide-in-from-bottom-8 duration-500 max-w-sm mx-auto w-full text-white md:text-[#0A2540]">
              <h2 className="text-2xl font-bold mb-1">Select Protection</h2>
              <p className="text-sm text-slate-400 md:text-slate-500 mb-4">Choose a weekly plan to protect your earnings.</p>
              <div className="space-y-4 mb-6">
                {[
                  { name: 'Aarambh', price: 20, desc: 'Start / basic coverage. Covers Heavy Rain only.', col: 'bg-green-500' },
                  { name: 'Rakshak', price: 30, desc: 'Protector. Covers Rain & Pollution.', col: 'bg-yellow-400' },
                  { name: 'Mahakavach', price: 45, desc: 'Ultimate protection. Covers Rain, AQI, Traffic, Strikes.', col: 'bg-red-600' }
                ].map((plan) => {
                  const selected = selectedPlan === plan.name;
                  return (
                    <div key={plan.name} onClick={() => setSelectedPlan(plan.name)} className={`relative p-5 rounded-2xl cursor-pointer border-2 transition-all ${selected ? 'bg-[#0A192F] md:bg-[#0A192F] border-[#00D4FF] shadow-lg text-white' : 'bg-[#1E293B] md:bg-[#1E293B] border-transparent text-slate-300 hover:bg-[#28354A]'}`}>
                      
                      {plan.name === 'Rakshak' && selected && (
                        <div className="absolute top-0 right-0 bg-[#00D4FF] text-[#0A2540] text-[10px] sm:text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl tracking-wider">
                          RECOMMENDED
                        </div>
                      )}

                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg md:text-xl flex items-center text-white">
                          <span className={`w-4 h-4 rounded-full mr-3 shadow-md ${plan.col}`}></span>
                          {plan.name}
                        </h3>
                        <p className={`font-bold text-lg ${selected ? 'text-[#00D4FF]' : 'text-[#00D4FF]'}`}>₹{plan.price} <span className="text-xs font-normal opacity-70">/week</span></p>
                      </div>
                      <p className={`text-sm pr-10 ${selected ? 'text-slate-300' : 'text-slate-400'}`}>
                        {plan.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
              <button onClick={processPaymentAndSignup} className="w-full bg-gradient-to-r from-[#00D4FF] to-[#00A3FF] text-[#0A2540] font-bold text-lg py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all">
                Pay via UPI
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="flex flex-col items-center justify-center py-10 animate-in zoom-in-95 duration-300 max-w-sm mx-auto w-full">
              {paymentStatus === 'processing' ? (
                <>
                  <div className="relative w-24 h-24 flex items-center justify-center mb-6">
                    <div className="absolute inset-0 border-4 border-[#0A2540] md:border-slate-200 border-t-[#00D4FF] md:border-t-[#00D4FF] rounded-full animate-spin"></div>
                    <IndianRupee size={32} className="text-[#00D4FF] animate-pulse" />
                  </div>
                  <h2 className="text-xl font-bold mb-2 text-white md:text-[#0A2540]">Creating Account</h2>
                  <p className="text-center text-sm text-slate-400 md:text-slate-500">Processing transaction and saving profile to Supabase...</p>
                </>
              ) : (
                <>
                  <div className="w-24 h-24 bg-[#22C55E]/20 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
                    <div className="w-16 h-16 bg-[#22C55E] rounded-full flex items-center justify-center shadow-lg">
                      <Check size={40} className="text-white" />
                    </div>
                  </div>
                  <h2 className="text-xl font-bold mb-2 text-white md:text-[#0A2540]">Registration Complete!</h2>
                </>
              )}
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
