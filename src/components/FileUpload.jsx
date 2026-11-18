import React, { useState } from 'react';
import { UploadCloud, FileText, ClipboardList, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { extractTextFromPDF } from '../utils/pdfExtractor.js';

export function FileUpload({
  onAnalyze,
  isAnalyzing,
  t,
  currentRawText
}) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'paste'
  const [pastedText, setPastedText] = useState(currentRawText || '');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const [isExtractingPDF, setIsExtractingPDF] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    setUploadedFileName(file.name);
    
    // Check if the uploaded file is a PDF
    const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    
    if (isPDF) {
      setIsExtractingPDF(true);
      try {
        const text = await extractTextFromPDF(file);
        setIsExtractingPDF(false);
        setPastedText(text);
        onAnalyze(text);
      } catch (err) {
        console.error('PDF parsing error, falling back to text reader:', err);
        setIsExtractingPDF(false);
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target.result;
          setPastedText(content);
          onAnalyze(content);
        };
        reader.readAsText(file);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        setPastedText(content);
        onAnalyze(content);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmitText = () => {
    if (pastedText.trim()) {
      onAnalyze(pastedText);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8 no-print">
      
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-200 bg-slate-50/70 px-6 pt-4 space-x-3">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex items-center space-x-2 px-5 py-3 text-xs sm:text-sm font-bold rounded-t-2xl transition-all border-b-2 ${
            activeTab === 'upload'
              ? 'bg-white text-clinical-700 border-clinical-600 shadow-sm'
              : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          <UploadCloud className="w-4 h-4 text-clinical-600" />
          <span>{t.uploadTitle}</span>
        </button>

        <button
          onClick={() => setActiveTab('paste')}
          className={`flex items-center space-x-2 px-5 py-3 text-xs sm:text-sm font-bold rounded-t-2xl transition-all border-b-2 ${
            activeTab === 'paste'
              ? 'bg-white text-clinical-700 border-clinical-600 shadow-sm'
              : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100/50'
          }`}
        >
          <ClipboardList className="w-4 h-4 text-clinical-600" />
          <span>{t.orPasteText}</span>
        </button>
      </div>

      <div className="p-6 sm:p-8">
        
        {/* Tab 1: Upload File */}
        {activeTab === 'upload' && (
          <div>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
                dragActive
                  ? 'border-clinical-500 bg-clinical-50/50 scale-[0.99]'
                  : 'border-slate-300 hover:border-clinical-400 bg-slate-50/50 hover:bg-slate-50'
              }`}
              onClick={() => document.getElementById('report-file-input').click()}
            >
              <input
                id="report-file-input"
                type="file"
                accept=".txt,.csv,.pdf,.json"
                onChange={handleFileInput}
                className="hidden"
              />
              <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-clinical-50 flex items-center justify-center text-clinical-600 border border-clinical-200 shadow-inner">
                <UploadCloud className="w-10 h-10" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1">
                {t.dropFiles}
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mb-4">
                {t.uploadSubtitle}
              </p>

              {isExtractingPDF ? (
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-clinical-50 text-clinical-700 border border-clinical-200 text-xs font-semibold animate-pulse">
                  <Loader2 className="w-4 h-4 text-clinical-600 animate-spin" />
                  <span>Extracting medical report from PDF...</span>
                </div>
              ) : uploadedFileName ? (
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>File Selected: <strong>{uploadedFileName}</strong></span>
                </div>
              ) : (
                <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-semibold">
                  <span>Supports Blood Tests (CBC), Lipid, Glucose, Kidney, and Liver Reports (PDF, TXT, CSV)</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Paste Text */}
        {activeTab === 'paste' && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
              {t.orPasteText}
            </label>
            <textarea
              rows={8}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste your medical lab report text here, e.g.:&#10;PATIENT: Rajesh Kumar    AGE: 48    GENDER: MALE&#10;Total Cholesterol: 245 mg/dL&#10;Triglycerides: 230 mg/dL&#10;HDL: 34 mg/dL&#10;LDL: 168 mg/dL&#10;Fasting Glucose: 114 mg/dL&#10;HbA1c: 6.2%..."
              className="w-full text-xs sm:text-sm font-mono p-4 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-clinical-500 bg-slate-50/50 text-slate-800"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSubmitText}
                disabled={isAnalyzing || !pastedText.trim()}
                className="flex items-center space-x-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold bg-clinical-600 hover:bg-clinical-700 text-white shadow-md shadow-clinical-500/25 disabled:opacity-50 transition-all cursor-pointer"
              >
                <span>{isAnalyzing ? t.analyzing : t.analyzeButton}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
