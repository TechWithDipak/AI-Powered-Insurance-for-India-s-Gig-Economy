import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request) {
  try {
    const { userId, newPlan, name, platform, location, shiftTiming } = await request.json();

    if (!supabaseServiceKey) {
      return NextResponse.json({ success: false, error: 'Server configuration error: Service Key missing' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // Perform atomic upsert to ensure profile exist and plan is updated
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: userId,
        active_plan: newPlan,
        name: name || 'Worker',
        platform: platform || 'Zomato',
        location: location || 'Bangalore',
        shift_timing: shiftTiming || 'Day'
      }, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('Supabase Upgrade Error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, profile });
  } catch (err) {
    console.error('Upgrade API Catch:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
