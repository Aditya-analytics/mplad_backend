import { RISK_LEVELS, RISK_COLOR_MAP } from '../constants/riskLevels';

export function getRiskLevelFromScore(score) {
  if (score >= 80) return RISK_LEVELS.CRITICAL;
  if (score >= 65) return RISK_LEVELS.HIGH;
  if (score >= 40) return RISK_LEVELS.MODERATE;
  return RISK_LEVELS.LOW;
}

export function getRiskColor(scoreOrLevel) {
  let level = scoreOrLevel;
  if (typeof scoreOrLevel === 'number') {
    level = getRiskLevelFromScore(scoreOrLevel);
  }
  return RISK_COLOR_MAP[level] || RISK_COLOR_MAP.LOW;
}
