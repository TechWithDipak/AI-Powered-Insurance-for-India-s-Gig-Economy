import { NextResponse } from 'next/server';
import { calculatePremium } from '../../../lib/ai';
import weatherData from '../../../data/weather.json';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const basePrice = parseInt(searchParams.get('basePrice') || '30', 10);
  const shiftTiming = searchParams.get('shiftTiming') || 'Day';

  const premiumData = calculatePremium(basePrice, shiftTiming);

  return NextResponse.json({
    success: true,
    data: {
      ...premiumData,
      weather_context: weatherData
    }
  });
}
