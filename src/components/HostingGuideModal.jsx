import React, { useState } from 'react';
import { Server, Cloud, Database, Globe, Check, Copy, X, ShieldCheck, Terminal, Cpu } from 'lucide-react';

export function HostingGuideModal({ isOpen, onClose }) {
  const [copiedKey, setCopiedKey] = useState(null);
  const [activeTab, setActiveTab] = useState('vercel'); // 'vercel' | 'netlify' | 'storage' | 'supabase'

  if (!isOpen) return null;

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-clinical-500/20 text-clinical-400 flex items-center justify-center border border-clinical-400/30">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight">
                Full Hosting & Cloud Storage Architecture Guide
              </h3>
              <p className="text-xs text-slate-400">
                How to deploy AI Health Interpreter online and configure secure cloud storage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 space-x-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('vercel')}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'vercel'
                ? 'bg-white text-clinical-700 border-clinical-600 shadow-sm'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>1. Deploy to Vercel (Recommended)</span>
          </button>

          <button
            onClick={() => setActiveTab('netlify')}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'netlify'
                ? 'bg-white text-clinical-700 border-clinical-600 shadow-sm'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>2. Deploy to Netlify</span>
          </button>

          <button
            onClick={() => setActiveTab('storage')}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'storage'
                ? 'bg-white text-clinical-700 border-clinical-600 shadow-sm'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>3. Database & Storage Architecture</span>
          </button>

          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'supabase'
                ? 'bg-white text-clinical-700 border-clinical-600 shadow-sm'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>4. Supabase / Cloud DB Setup</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700">
          
          {/* TAB 1: VERCEL */}
          {activeTab === 'vercel' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-clinical-600" />
                  <span>Option A: Deploy via Vercel CLI (30 Seconds)</span>
                </h4>
                <p className="text-xs text-slate-600 mb-3">
                  Run these commands in PowerShell or Command Prompt from the project directory:
                </p>
                <div className="bg-slate-900 text-slate-200 font-mono text-xs p-3.5 rounded-xl flex items-center justify-between">
                  <code>npx vercel</code>
                  <button
                    onClick={() => copyText('npx vercel', 'cmd-vercel')}
                    className="p-1 rounded text-slate-400 hover:text-white"
                  >
                    {copiedKey === 'cmd-vercel' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-clinical-600" />
                  <span>Option B: Deploy via GitHub (Continuous Deployment)</span>
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600">
                  <li>Push your project to GitHub (it already has a local git commit ready!).</li>
                  <li>Go to <strong>vercel.com</strong> and click <strong>"Add New" &gt; "Project"</strong>.</li>
                  <li>Import your GitHub repository <code>ai-health-interpreter</code>.</li>
                  <li>Framework Preset: Select <strong>Vite</strong>. Build command: <code>npm run build</code>. Output directory: <code>dist</code>.</li>
                  <li>Click <strong>Deploy</strong>. Vercel automatically assigns a live HTTPS URL (e.g., <code>https://ai-health-interpreter.vercel.app</code>).</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: NETLIFY */}
          {activeTab === 'netlify' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center space-x-2">
                  <Cloud className="w-4 h-4 text-teal-600" />
                  <span>Deploy to Netlify in 2 Minutes</span>
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600">
                  <li>Run <code>npm run build</code> in the terminal to generate the <code>dist</code> folder.</li>
                  <li>Go to <strong>app.netlify.com/drop</strong>.</li>
                  <li>Drag and drop the <code>dist</code> folder into Netlify Drop.</li>
                  <li>Your application is hosted immediately with a live URL and free SSL certificate!</li>
                </ol>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2">Netlify CLI Method</h4>
                <div className="bg-slate-900 text-slate-200 font-mono text-xs p-3.5 rounded-xl flex items-center justify-between">
                  <code>npx netlify-cli deploy --prod --dir=dist</code>
                  <button
                    onClick={() => copyText('npx netlify-cli deploy --prod --dir=dist', 'cmd-netlify')}
                    className="p-1 rounded text-slate-400 hover:text-white"
                  >
                    {copiedKey === 'cmd-netlify' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STORAGE */}
          {activeTab === 'storage' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
                <div className="flex items-center space-x-2 text-emerald-900 font-bold mb-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Account-scoped Firebase report storage</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Saved reports are sent to a Firebase HTTPS Function with a Clerk session token. The Function verifies the session and stores reports under that user's account. Configure and deploy the Function before enabling cloud saves; do not use real patient information until privacy and compliance requirements have been reviewed.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center space-x-2">
                  <Database className="w-4 h-4 text-clinical-600" />
                  <span>Other storage integrations</span>
                </h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li>• <strong>Supabase (PostgreSQL)</strong>: A possible alternative backend for structured reports.</li>
                  <li>• <strong>AWS S3 / Cloudflare R2</strong>: Possible object storage options for report files.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: SUPABASE */}
          {activeTab === 'supabase' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-2">Supabase PostgreSQL Schema for Medical Reports</h4>
                <p className="text-xs text-slate-600 mb-3">
                  Run this SQL in the Supabase SQL editor to create the cloud database table:
                </p>
                <pre className="bg-slate-900 text-slate-200 font-mono text-[11px] p-4 rounded-xl overflow-x-auto">
{`CREATE TABLE patient_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  age TEXT,
  gender TEXT,
  lab_name TEXT,
  report_date DATE,
  test_panel TEXT,
  overall_score INT,
  overall_urgency TEXT,
  biomarkers JSONB,
  risks JSONB,
  doctor_questions JSONB,
  raw_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);`}
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-clinical-50/50 border border-clinical-200 text-xs text-clinical-800">
                <strong>Connecting Supabase to your React App:</strong>
                <p className="mt-1">
                  Install <code>npm install @supabase/supabase-js</code> and initialize with your Supabase URL & Anon Key. You can sync reports on upload with one simple call: <code>supabase.from('patient_reports').insert(...)</code>.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Production Ready • Supports Node 18+ & Vite
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
          >
            Got it, Close Guide
          </button>
        </div>

      </div>
    </div>
  );
}
