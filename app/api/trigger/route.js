import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import weatherData from '../../../data/weather.json';
import disruptionData from '../../../data/disruption.json';
import { calculatePayoutFactor } from '../../../lib/ai';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request) {
  const { userId, type: rawType } = await request.json();
  
  // Support aliases for legacy buttons or UI mismatches
  const typeMap = { 'strike': 'curfew', 'waterlogging': 'flood' };
  const type = typeMap[rawType] || rawType;

  if (!supabaseServiceKey) {
     return NextResponse.json({ success: false, error: 'Server config error: Service Key missing' }, { status: 500 });
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  let activePlan = 'None';
  let shiftTiming = 'Day';

  // Securely fetch user constraints from Supabase bypassing RLS
  if (userId && userId !== '00000000-0000-0000-0000-000000000000') {
     const { data: profile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('active_plan, shift_timing')
        .eq('id', userId)
        .single();
        
     if (profile) {
        activePlan = profile.active_plan;
        shiftTiming = profile.shift_timing || 'Day';
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
     console.warn(`[Trigger Error] User plan ${activePlan} does not cover ${type}.`);
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
  } else if (type === 'curfew' || type === 'strike' || disruptionData.curfew) {
    approved = true;
    baseAmount = 500;
    reason = "Curfew/Strike Auto-Claim";
  } else if (type === 'flood' || type === 'waterlogging' || disruptionData.flood) {
    approved = true;
    baseAmount = 300;
    reason = "Water-logging / Flood Auto-Claim";
  } else if (type === 'heat' || disruptionData.extreme_heat) {
    approved = true;
    baseAmount = 80;
    reason = "Extreme Heatwave Auto-Claim";
  }

  if (approved) {
    const shiftMultiplier = calculatePayoutFactor(shiftTiming);
    const amount = Math.round(baseAmount * shiftMultiplier);
    
    // Add context to the reason for the UI
    const finalReason = `[${activePlan}] ${reason} (${shiftTiming} Shift Multiplier x${shiftMultiplier})`;

    if (userId && userId !== '00000000-0000-0000-0000-000000000000') {
      const { error: insertError } = await supabaseAdmin.from('claims').insert([{
        user_id: userId,
        status: 'APPROVED',
        amount,
        reason: finalReason
      }]);
      
      if (insertError) {
         console.error('[Trigger API] Failed to insert claim:', insertError);
      }
    }

    return NextResponse.json({
      success: true,
      claim: {
        status: 'APPROVED',
        amount,
        reason: finalReason
      }
    });
  }

  return NextResponse.json({
    success: false,
    message: 'Conditions not met for auto claim.'
  }, { status: 400 });
}
