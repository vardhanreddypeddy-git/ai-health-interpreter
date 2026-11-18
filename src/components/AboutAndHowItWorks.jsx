import React from 'react';
import { 
  Activity, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  HelpCircle, 
  Zap, 
  Award, 
  Layers, 
  FileText
} from 'lucide-react';

export function AboutAndHowItWorks({ t }) {
  const steps = [
    { num: '01', title: 'Upload Medical Report PDF', desc: 'Upload your lab report as a digital PDF or paste the report text directly.' },
    { num: '02', title: 'Extract Available Text', desc: 'Extract selectable text and table-like rows from digital PDFs. Scanned pages require OCR outside this prototype.' },
    { num: '03', title: 'Identify Biomarkers & Ranges', desc: 'Identify supported clinical biomarkers, observed numerical values, and reference intervals.' },
    { num: '04', title: 'Generate Impression & Questions', desc: 'Generate an overall impression, calm clinical synthesis, and questions to ask your doctor.' },
    { num: '05', title: 'Present Structured Results', desc: 'Present structured, plain-language insights in an intuitive patient-friendly interface.' }
  ];

  return (
    <section className="my-10 space-y-10 no-print">
      
      {/* 1. Hero Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-clinical-950 to-slate-900 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-80 h-80 bg-clinical-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold bg-clinical-500/20 text-clinical-300 border border-clinical-400/30 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-clinical-400" />
            <span>Educational Lab Report Interpreter</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 leading-tight text-white">
            {t?.heroTitle || 'Understand Your Lab Report'}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal mb-8">
            {t?.heroSubtitle || 'This prototype extracts supported results and compares them with configured reference ranges. Its rule-based scores are educational only, not diagnoses or validated disease probabilities.'}
          </p>

          {/* 4 Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-clinical-500/20 text-clinical-300 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                Instant Blood Work &amp; Lab Analysis
              </span>
            </div>

            <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                Calm Biomarker Evaluation (No Panic)
              </span>
            </div>

            <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                4-Pillar Health &amp; Risk Stratification
              </span>
            </div>

            <div className="flex items-center space-x-3 p-3.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                Multilingual Indian Audio Narration
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Medical Reports Are Rich in Data — and Hard to Read */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="mb-6">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
            Clinical Landscape &amp; Problem Statement
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Medical reports are rich in data — and hard to read
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Why patients experience uncertainty and why an intelligent bridge is needed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/10 text-clinical-300 flex items-center justify-center mb-3.5">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-2">
                Complex terminology
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Complex terminology and reference ranges slow down interpretation, leaving patients confused about what their numbers mean.
              </p>
            </div>
            <div className="text-[10px] font-semibold text-clinical-300 uppercase tracking-wider pt-4 border-t border-white/10 mt-4">
              Jargon Barrier
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/10 text-teal-300 flex items-center justify-center mb-3.5">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-2">
                Mixed formats
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Reports arrive as both digital PDFs and scanned documents across diverse lab software formats with varying table styles.
              </p>
            </div>
            <div className="text-[10px] font-semibold text-teal-300 uppercase tracking-wider pt-4 border-t border-white/10 mt-4">
              Heterogeneous Inputs
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col justify-between shadow-sm">
            <div>
              <div className="w-10 h-10 rounded-xl bg-white/10 text-amber-300 flex items-center justify-center mb-3.5">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white mb-2">
                The gap
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                The gap: extract the useful information accurately, then explain it in a form people can understand without fear or panic.
              </p>
            </div>
            <div className="text-[10px] font-semibold text-amber-300 uppercase tracking-wider pt-4 border-t border-white/10 mt-4">
              Patient Empowerment
            </div>
          </div>

        </div>
      </div>

      {/* 3. The Prototype Workflow (5 Steps) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-bold text-clinical-600 uppercase tracking-wider mb-1">
              End-to-End Workflow
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              The prototype turns a PDF into an understandable health summary
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Each step in the pipeline moves from raw uploaded document to structured, clinical insights.
            </p>
          </div>
          <span className="self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-clinical-50 text-clinical-700 border border-clinical-200">
            5-Stage Pipeline
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
          {steps.map((st) => (
            <div key={st.num} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-clinical-600 text-white mb-2">
                  {st.num}
                </span>
                <h4 className="text-xs font-bold text-slate-900 mb-1 leading-snug">
                  {st.title}
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. What Makes Us Different (4 Pillars) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              Core Capabilities
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {t?.whatMakesUsDiffTitle || 'What Makes Us Different'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Architected for clinical rigor, patient empowerment, and Indian linguistic diversity.
            </p>
          </div>
          <div className="inline-flex items-center space-x-1 text-xs font-bold text-clinical-700 bg-clinical-50 px-3 py-1 rounded-full border border-clinical-200 self-start sm:self-auto">
            <Award className="w-3.5 h-3.5" />
            <span>Clinical Grade Architecture</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(t?.diffPoints || [
            { title: 'Cardiovascular Health Analysis', desc: 'Checks your cholesterol, LDL, HDL, and triglyceride levels to give you a clear picture of your heart health today.' },
            { title: 'Diabetes Risk Assessment', desc: 'Analyzes HbA1c and fasting blood sugar to help you understand your blood sugar status and what it means.' },
            { title: 'Anemia Detection', desc: 'Evaluates hemoglobin, iron stores, and blood count to identify signs of anemia or nutritional deficiencies.' },
            { title: 'Overall Wellness Score', desc: 'Combines all biomarker findings into a single easy-to-understand health score, so you always know where you stand.' }
          ]).map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:bg-slate-50 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-clinical-600 text-white flex items-center justify-center text-xs font-bold mb-3 shadow-sm">
                0{idx + 1}
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1.5 leading-snug">
                {item.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
