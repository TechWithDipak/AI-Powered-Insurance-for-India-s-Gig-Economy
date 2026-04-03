import weatherData from '../data/weather.json';

/**
 * AI Premium Calculator using simulated Tabular ML (Gradient Boosting / LightGBM logic)
 * Suitable for structured feature predictive risk scoring instead of probabilistic LLMs.
 */
export function calculatePremium(basePrice, shiftTiming = 'Day', zoneHistory = 'safe') {
  const rain_probability = weatherData.rain_probability;
  const aqi_normalized = Math.min(weatherData.aqi / 500, 1.0);
  
  // Feature Engineering Mapping
  let shift_weight = 0.5; // day
  if (shiftTiming.toLowerCase().includes('night')) shift_weight = 0.8;
  if (shiftTiming.toLowerCase().includes('morning')) shift_weight = 0.3;

  // Simulated LightGBM Decision Tree Matrix (Feature Weights)
  const features = {
     rain_importance: 0.45,
     aqi_importance: 0.25,
     shift_importance: 0.30
  };

  // Tabular Regression Scoring 
  const risk_score = 
     (rain_probability * features.rain_importance) + 
     (aqi_normalized * features.aqi_importance) + 
     (shift_weight * features.shift_importance);
  
  // Apply Base Margin
  let dynamic_premium = Math.round(basePrice + (risk_score * 10));

  // Hyper-local history discount (Feature constraint)
  let history_discount = 0;
  if (zoneHistory === 'safe') {
    dynamic_premium -= 2; 
    history_discount = 2;
  }
  
  return {
    dynamic_premium,
    risk_score: risk_score.toFixed(2),
    rain_probability,
    aqi_normalized: aqi_normalized.toFixed(2),
    shift_risk: shift_weight,
    history_discount
  };
}

/**
 * Tabular ML Model function for calculating Payout Multipliers.
 * Riskier shifts structurally guarantee higher payouts on parametric claims.
 */
export function calculatePayoutFactor(shiftTiming) {
   if (!shiftTiming) return 1.0;
   const s = shiftTiming.toLowerCase();
   if (s.includes('night')) return 1.5;   // Night riders get 50% more on claims
   if (s.includes('morning')) return 1.1; // Morning riders get 10% more
   return 1.0; // Day riders standard
}

