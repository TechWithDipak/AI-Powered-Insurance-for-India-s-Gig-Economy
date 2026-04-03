import { NextResponse } from 'next/server';
import weatherData from '../../../data/weather.json';
import disruptionData from '../../../data/disruption.json';
import { supabase } from '../../../lib/supabase';
import { calculatePayoutFactor } from '../../../lib/ai';

export async function POST(request) {
  const { userId, type } = await request.json();

  let activePlan = 'Rakshak';
  let shiftTiming = 'Day';

  // Securely fetch user constraints from Supabase
  if (userId && userId !== '00000000-0000-0000-0000-000000000000') {
     const { data: profile } = await supabase.from('profiles').select('active_plan, shift_timing').eq('id', userId).single();
     if (profile) {
        activePlan = profile.active_plan;
        shiftTiming = profile.shift_timing;
     }
  }

  // Plan Constraints Enforcement
  const planLimits = {
     'Aarambh': ['rain'],
     'Rakshak': ['rain', 'aqi'],
     'Mahakavach': ['rain', 'aqi', 'curfew', 'flood', 'heat']
  };

  const allowedTriggers = planLimits[activePlan] || ['rain'];
  if (!allowedTriggers.includes(type)) {
     return NextResponse.json({
       success: false,
       claim: {
         status: 'REJECTED',
         amount: 0,
         reason: `Claim Denied: Your ${activePlan} plan does not cover ${type} disruptions. Upgrade plan.`
       }
     });
  }

  // Evaluate Automation Rules
  let approved = false;
  let baseAmount = 0;
  let reason = '';

  if (type === 'rain' && weatherData.rain_probability > 0.7) {
    approved = true;
    baseAmount = 120;
    reason = "Heavy Rain Auto-Claim";
  } else if (type === 'aqi' && weatherData.aqi > 150) {
    approved = true;
    baseAmount = 100;
    reason = "Severe AQI Auto-Claim";
  } else if (type === 'curfew' || disruptionData.curfew) {
    approved = true;
    baseAmount = 200;
    reason = "Curfew/Strike Auto-Claim";
  } else if (type === 'flood' || disruptionData.flood) {
    approved = true;
    baseAmount = 300;
    reason = "Water-logging / Flood Auto-Claim";
  } else if (type === 'heat' || disruptionData.extreme_heat) {
    approved = true;
    baseAmount = 80;
    reason = "Extreme Heatwave Auto-Claim";
  }

  if (approved) {
    // Dynamic Pricing ML Payout Modification based on Shift Risk
    const shiftMultiplier = calculatePayoutFactor(shiftTiming);
    const amount = Math.round(baseAmount * shiftMultiplier);
    
    // Add context to the reason for the UI
    reason = `${reason} (${shiftTiming.split(' ')[0]} Shift Multiplier x${shiftMultiplier})`;

    if (userId && userId !== '00000000-0000-0000-0000-000000000000') {
      const { error: insertError } = await supabase.from('claims').insert([{
        user_id: userId,
        status: 'APPROVED',
        amount,
        reason
      }]);
      
      if (insertError) {
         console.error('Failed to insert claim', insertError);
      }
    }

    return NextResponse.json({
      success: true,
      claim: {
        status: 'APPROVED',
        amount,
        reason
      }
    });
  }

  return NextResponse.json({
    success: false,
    message: 'Conditions not met for auto claim.'
  }, { status: 400 });
}
