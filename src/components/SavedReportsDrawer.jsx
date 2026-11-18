import React from 'react';
import { Database, Trash2, ArrowRight, Download, Calendar, User, Activity, X } from 'lucide-react';

export function SavedReportsDrawer({
  isOpen,
  onClose,
  reports,
  onSelectReport,
  onDeleteReport,
  onExport,
  t
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-clinical-50 text-clinical-600 flex items-center justify-center border border-clinical-200">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {t.savedReportsTitle}
              </h3>
              <p className="text-[11px] text-slate-500">
                {reports.length} report(s) saved to your account
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Reports List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {reports.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Database className="w-10 h-10 mx-auto mb-2 text-slate-300 stroke-1" />
              <p>No reports saved yet.</p>
              <p className="mt-1 text-slate-500">Upload and click "Save to My Reports" to build your history.</p>
            </div>
          ) : (
            reports.map((r) => (
              <div
                key={r.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-clinical-400 bg-slate-50/50 hover:bg-white transition-all shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {r.savedAt}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      r.overallIndex >= 75 ? 'bg-emerald-100 text-emerald-800' :
                      r.overallIndex >= 50 ? 'bg-amber-100 text-amber-800' :
                      'bg-rose-100 text-rose-800'
                    }`}>
                      Health: {r.overallIndex}/100
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                    <User className="w-3.5 h-3.5 text-clinical-600" />
                    <span>{r.patient?.name || 'Patient'}</span>
                  </h4>

                  <div className="text-[11px] text-slate-500 mt-1 space-y-0.5">
                    <div>{r.patient?.testPanel || 'Biomarker Screening'}</div>
                    <div className="text-slate-400">{r.patient?.labName}</div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                  <button
                    onClick={() => {
                      onSelectReport(r.rawText);
                      onClose();
                    }}
                    className="text-xs font-semibold text-clinical-600 hover:text-clinical-700 flex items-center space-x-1"
                  >
                    <span>Open & Analyze</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onDeleteReport(r.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                    title="Delete report"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onExport}
            disabled={reports.length === 0}
            className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON Backup</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-200 text-slate-700 hover:bg-slate-300"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
