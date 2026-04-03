import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Initialize Supabase Admin with Service Role Key to bypass RLS for Admin Dashboard
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  try {
    // 1. Fetch Total Active Users (count profiles with an active plan)
    const { count: activeUsers, error: usersErr } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .not('active_plan', 'eq', 'None');

    if (usersErr) throw usersErr;

    // 2. Fetch Total Payouts from Claims
    const { data: claimsData, error: claimsErr } = await supabaseAdmin
      .from('claims')
      .select('amount');

    if (claimsErr) throw claimsErr;

    const totalPaid = claimsData?.reduce((acc, c) => acc + Number(c.amount), 0) || 0;

    // 3. Fetch Recent Operations joined with profile names
    const { data: recent, error: recentErr } = await supabaseAdmin
      .from('claims')
      .select('*, profiles(name)')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (recentErr) throw recentErr;

    // 4. Fetch All Profiles for the User Profiles tab
    const { data: allProfiles, error: allErr } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (allErr) throw allErr;

    return NextResponse.json({
      success: true,
      stats: {
        activeUsers: activeUsers || 0,
        totalPaid,
        avgRisk: 1.04
      },
      recentClaims: recent || [],
      allProfiles: allProfiles || []
    });
  } catch (error) {
    console.error("Admin API Error:", error);
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      // Provide fallback mock data if the Service Role Key is missing
      stats: { activeUsers: 0, totalPaid: 0, avgRisk: 1.04 },
      recentClaims: [],
      allProfiles: []
    }, { status: 200 }); // Return 200 to avoid breaking FE, but with error flag
  }
}
