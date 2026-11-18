import React from 'react';
import { Heart, Activity, Droplets, Sparkles, CheckCircle, AlertTriangle, AlertOctagon, Bookmark, Check, Award } from 'lucide-react';

export function RiskOverview({
  patient,
  overallIndex,
  overallUrgency,
  clinicalSummary,
  risks,
  onSaveReport,
  isSaved,
  isSaving,
  t
}) {
  const urgencyConfig = {
    optimal: {
      label: t.riskLevels.optimal,
      color: 'emerald',
      bgBadge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      ringColor: '#10b981',
      icon: CheckCircle
    },
    low: {
      label: t.riskLevels.low,
      color: 'blue',
      bgBadge: 'bg-sky-100 text-sky-800 border-sky-300',
      ringColor: '#0284c7',
      icon: CheckCircle
    },
    moderate: {
      label: t.riskLevels.moderate,
      color: 'amber',
      bgBadge: 'bg-amber-100 text-amber-800 border-amber-300',
      ringColor: '#f59e0b',
      icon: AlertTriangle
    },
    high: {
      label: t.riskLevels.high,
      color: 'orange',
      bgBadge: 'bg-orange-100 text-orange-800 border-orange-300',
      ringColor: '#f97316',
      icon: AlertTriangle
    },
    critical: {
      label: t.riskLevels.critical,
      color: 'rose',
      bgBadge: 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse',
      ringColor: '#e11d48',
      icon: AlertOctagon
    }
  };

  const currentUrgency = urgencyConfig[overallUrgency] || urgencyConfig.moderate;
  const UrgencyIcon = currentUrgency.icon;

  const wellnessScore = risks.wellness?.score ?? overallIndex;
  const domainCards = [
    {
      id: 'cardio',
      name: t.riskCategories.cardio,
      score: risks.cardio?.score || 10,
      factors: risks.cardio?.factors || [],
      icon: Heart,
      isRiskCard: true
    },
    {
      id: 'metabolic',
      name: t.riskCategories.metabolic,
      score: risks.metabolic?.score || 10,
      factors: risks.metabolic?.factors || [],
      icon: Activity,
      isRiskCard: true
    },
    {
      id: 'anemia',
      name: t.riskCategories.anemia,
      score: risks.anemia?.score || 10,
      factors: risks.anemia?.factors || [],
      icon: Droplets,
      isRiskCard: true
    },
    {
      id: 'wellness',
      name: t.riskCategories.wellness,
      score: wellnessScore,
      factors: [],
      icon: Award,
      isRiskCard: false // wellness = higher is better
    }
  ];

  return (
    <div className="space-y-6 mb-8">
      
      {/* Top Banner: Health Score & AI Clinical Synthesis */}
      <div className="bg-gradient-to-r from-slate-900 via-clinical-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-clinical-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-clinical-300 uppercase tracking-widest mb-1.5">
              <span>Health Score & AI Stratification</span>
              <span>•</span>
              <span>ISO 15189 Aligned</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {patient.name}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs sm:text-sm text-slate-300">
              <span className="px-2.5 py-1 rounded-md bg-white/10 font-medium">{patient.age}</span>
              <span className="px-2.5 py-1 rounded-md bg-white/10 font-medium">{patient.gender}</span>
              <span className="px-2.5 py-1 rounded-md bg-clinical-500/30 text-clinical-200 border border-clinical-400/30 font-medium truncate max-w-xs">
                {patient.testPanel}
              </span>
            </div>
          </div>

          {/* Right Action: Overall Score + Save Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
            
            <div className="flex items-center space-x-5 bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 w-full sm:w-auto justify-between sm:justify-start">
              <div className="relative flex items-center justify-center">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke="currentColor"
                    strokeWidth="6"
                    className="text-white/20"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="32"
                    stroke={currentUrgency.ringColor}
                    strokeWidth="6"
                    strokeDasharray={201}
                    strokeDashoffset={201 - (201 * overallIndex) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xl font-extrabold tracking-tight">{overallIndex}</span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-300 font-semibold">/100</span>
                </div>
              </div>

              <div>
                <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  {t.overallScore}
                </div>
                <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${currentUrgency.bgBadge}`}>
                  <UrgencyIcon className="w-3.5 h-3.5" />
                  <span>{currentUrgency.label}</span>
                </div>
              </div>
            </div>

            {/* Save to History Button */}
            {onSaveReport && (
              <button
                onClick={onSaveReport}
                disabled={isSaved || isSaving}
                className={`no-print flex items-center justify-center space-x-1.5 px-4 py-3 rounded-2xl text-xs font-bold transition-all w-full sm:w-auto cursor-pointer ${
                  isSaved || isSaving
                    ? 'bg-emerald-500 text-white shadow-md'
                    : 'bg-white/15 hover:bg-white/25 text-white border border-white/20'
                }`}
              >
                {isSaved ? (
                  <>
                    <Check className="w-4 h-4 text-white" />
                    <span>{t.savedSuccess}</span>
                  </>
                ) : isSaving ? (
                  <span>Saving report...</span>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 text-slate-300" />
                    <span>{t.saveThisReport}</span>
                  </>
                )}
              </button>
            )}

          </div>

        </div>

        {/* AI Clinical Health Synthesis Box */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center space-x-2 text-xs font-bold text-clinical-300 uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-clinical-400" />
            <span>{t.overallHealthSummary}</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-200">
            {clinicalSummary}
          </p>
        </div>

      </div>

      {/* Health Analysis Cards (4 Categories) */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
            <span>{t.riskStratification}</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">
            Based on your biomarker values
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {domainCards.map((card) => {
            const Icon = card.icon;

            // For wellness card: high score = good (green). For risk cards: high score = bad (red).
            const displayScore = card.isRiskCard ? card.score : card.score;
            const progressColor =
              card.isRiskCard
                ? (card.score >= 60 ? 'bg-rose-500' : card.score >= 35 ? 'bg-amber-500' : 'bg-emerald-500')
                : (card.score >= 75 ? 'bg-emerald-500' : card.score >= 50 ? 'bg-amber-500' : 'bg-rose-500');

            const scoreBg =
              card.isRiskCard
                ? (card.score >= 60 ? 'bg-rose-50 text-rose-700 border-rose-200' : card.score >= 35 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200')
                : (card.score >= 75 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : card.score >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200');

            const statusLabel = card.isRiskCard
              ? (card.score >= 60 ? 'Needs Attention' : card.score >= 35 ? 'Monitor' : 'Good')
              : (card.score >= 75 ? 'Excellent' : card.score >= 50 ? 'Fair' : 'Needs Attention');

            return (
              <div
                key={card.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${scoreBg}`}>
                      {statusLabel} ({displayScore}%)
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mb-2 leading-tight">
                    {card.name}
                  </h4>

                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-2 mb-3 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-700 ${progressColor}`}
                      style={{ width: `${displayScore}%` }}
                    />
                  </div>

                  {/* Key Factors */}
                  {card.factors.length > 0 && (
                    <ul className="space-y-1 mb-2">
                      {card.factors.slice(0, 2).map((factor, idx) => (
                        <li key={idx} className="text-[11px] text-slate-600 flex items-start space-x-1">
                          <span className="text-slate-400 mt-0.5">•</span>
                          <span className="leading-tight">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {card.id === 'wellness' && (
                    <p className="text-[11px] text-slate-500 leading-tight">
                      Computed from all your biomarker results
                    </p>
                  )}
                </div>

                <div className="text-[10px] text-slate-400 border-t border-slate-100 pt-2 mt-2">
                  {card.isRiskCard ? 'Lower is better' : 'Higher is better'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
