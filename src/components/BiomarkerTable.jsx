import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Info, ArrowUpRight, ArrowDownRight, Filter, Search, X } from 'lucide-react';

export function BiomarkerTable({ biomarkers, t }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'abnormal' | 'normal'
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const abnormalCount = biomarkers.filter(b => b.status !== 'NORMAL').length;
  const normalCount = biomarkers.filter(b => b.status === 'NORMAL').length;

  const filteredBiomarkers = biomarkers.filter(b => {
    // 1. Status Filter
    if (filter === 'abnormal' && b.status === 'NORMAL') return false;
    if (filter === 'normal' && b.status !== 'NORMAL') return false;

    // 2. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = b.name.toLowerCase().includes(q);
      const matchCategory = b.category.toLowerCase().includes(q);
      const matchDesc = (b.description || '').toLowerCase().includes(q);
      if (!matchName && !matchCategory && !matchDesc) return false;
    }

    return true;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CRITICAL_HIGH':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{t.statusText.critical_high}</span>
          </span>
        );
      case 'CRITICAL_LOW':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>{t.statusText.critical_low}</span>
          </span>
        );
      case 'HIGH':
      case 'BORDERLINE_HIGH':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>{t.statusText.high}</span>
          </span>
        );
      case 'LOW':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>{t.statusText.low}</span>
          </span>
        );
      case 'NORMAL':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t.statusText.normal}</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
      
      {/* Header & Filter Controls */}
      <div className="p-5 border-b border-slate-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <span>{t.biomarkersFound}</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-200 text-slate-700">
              {biomarkers.length} Total Tests
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Full biomarker breakdown showing observed values, lab reference intervals, and clinical meaning.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tests (e.g. Creatinine)..."
              className="w-full pl-8 pr-7 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-clinical-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({biomarkers.length})
            </button>
            <button
              onClick={() => setFilter('abnormal')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${
                filter === 'abnormal'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-amber-700 hover:bg-amber-100'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{t.abnormalMarkers} ({abnormalCount})</span>
            </button>
            <button
              onClick={() => setFilter('normal')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1 ${
                filter === 'normal'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t.normalMarkers} ({normalCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Biomarkers Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <th className="py-3 px-4 sm:px-6">Biomarker / Test Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Observed Value</th>
              <th className="py-3 px-4">Standard Range</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
            {filteredBiomarkers.map((bio) => {
              const isExpanded = expandedId === bio.id;
              const [min, max] = bio.optimalRange;

              // Normalized bar representation
              const lowerBound = min * 0.7;
              const upperBound = max * 1.3;
              const span = upperBound - lowerBound || 1;
              const clampedVal = Math.min(Math.max(bio.value, lowerBound), upperBound);
              const markerPct = Math.round(((clampedVal - lowerBound) / span) * 100);
              const minPct = Math.round(((min - lowerBound) / span) * 100);
              const maxPct = Math.round(((max - lowerBound) / span) * 100);

              return (
                <React.Fragment key={bio.id}>
                  <tr
                    onClick={() => toggleExpand(bio.id)}
                    className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                      bio.status !== 'NORMAL' ? 'bg-amber-50/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900">
                      <div>{bio.name}</div>
                      <div className="text-[11px] text-slate-400 font-normal line-clamp-1">
                        {bio.description}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 font-medium">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-600">
                        {bio.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm">
                      {bio.value} <span className="text-xs font-normal text-slate-500">{bio.unit}</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 font-mono text-xs">
                      {min} - {max} {bio.unit}
                    </td>

                    <td className="py-3.5 px-4">
                      {getStatusBadge(bio.status)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(bio.id);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Information Card */}
                  {isExpanded && (
                    <tr className="bg-slate-50/90 border-b border-slate-200">
                      <td colSpan={6} className="p-4 sm:p-6">
                        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-4">
                          
                          {/* Visual Range Indicator Bar */}
                          <div>
                            <div className="flex justify-between text-[11px] font-semibold text-slate-500 mb-1">
                              <span>Low ({min} {bio.unit})</span>
                              <span className="text-emerald-700 font-bold">Optimal Normal Interval</span>
                              <span>High ({max} {bio.unit})</span>
                            </div>
                            <div className="relative w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                              {/* Optimal green zone */}
                              <div
                                className="absolute top-0 bottom-0 bg-emerald-200/80 border-x border-emerald-400"
                                style={{
                                  left: `${minPct}%`,
                                  width: `${Math.max(maxPct - minPct, 5)}%`
                                }}
                              />
                              {/* Current Value Marker */}
                              <div
                                className={`absolute top-0 bottom-0 w-3 rounded-full -ml-1.5 shadow-md ${
                                  bio.status === 'NORMAL' ? 'bg-emerald-600' : 'bg-rose-600 ring-2 ring-rose-300'
                                }`}
                                style={{ left: `${markerPct}%` }}
                              />
                            </div>
                            <div className="text-center mt-1 text-[11px] text-slate-600 font-medium">
                              Your Value: <strong className="text-slate-900">{bio.value} {bio.unit}</strong> ({bio.status.replace('_', ' ')})
                            </div>
                          </div>

                          {/* Plain English Explanation */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                              <div className="font-bold text-slate-800 mb-1 flex items-center space-x-1.5">
                                <Info className="w-3.5 h-3.5 text-clinical-600" />
                                <span>What This Biomarker Measures</span>
                              </div>
                              <p className="text-slate-600 leading-relaxed">
                                {bio.description}
                              </p>
                            </div>

                            <div className={`p-3 rounded-lg border ${
                              bio.status !== 'NORMAL' ? 'bg-amber-50/60 border-amber-200' : 'bg-emerald-50/60 border-emerald-200'
                            }`}>
                              <div className="font-bold text-slate-800 mb-1 flex items-center space-x-1.5">
                                <AlertCircle className={`w-3.5 h-3.5 ${bio.status !== 'NORMAL' ? 'text-amber-600' : 'text-emerald-600'}`} />
                                <span>Clinical Interpretation</span>
                              </div>
                              <p className="text-slate-700 leading-relaxed">
                                {bio.clinicalNote}
                              </p>
                            </div>
                          </div>

                          {/* Lifestyle Suggestion */}
                          {bio.lifestyleTip && (
                            <div className="text-xs text-slate-600 bg-clinical-50/50 p-3 rounded-lg border border-clinical-100 flex items-start space-x-2">
                              <span className="font-bold text-clinical-700 shrink-0">💡 Health Tip:</span>
                              <span>{bio.lifestyleTip}</span>
                            </div>
                          )}

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
}
