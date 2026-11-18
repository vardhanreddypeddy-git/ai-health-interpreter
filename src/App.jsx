import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth, useClerk, useUser } from '@clerk/clerk-react';
import { Header } from './components/Header.jsx';
import { FileUpload } from './components/FileUpload.jsx';
import { PatientDetailsCard } from './components/PatientDetailsCard.jsx';
import { ExecutiveSummary } from './components/ExecutiveSummary.jsx';
import { RiskOverview } from './components/RiskOverview.jsx';
import { BiomarkerTable } from './components/BiomarkerTable.jsx';
import { DoctorQuestions } from './components/DoctorQuestions.jsx';
import { LifestyleAdvice } from './components/LifestyleAdvice.jsx';
import { AIAssistantChat } from './components/AIAssistantChat.jsx';
import { AboutAndHowItWorks } from './components/AboutAndHowItWorks.jsx';
import { MedicalDisclaimer } from './components/MedicalDisclaimer.jsx';
import { SavedReportsDrawer } from './components/SavedReportsDrawer.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';

import { TRANSLATIONS, SUPPORTED_LANGUAGES } from './data/translations.js';
import { parseMedicalReport } from './utils/reportParser.js';
import { calculateHealthRisks } from './utils/riskEngine.js';
import { speakReportSummary, stopSpeech } from './utils/speech.js';
import {
  getSavedReports,
  saveReportToStorage,
  deleteReportFromStorage,
  exportReportsBackup
} from './utils/storage.js';

export function App() {
  const { getToken, isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const { user } = useUser();
  const [currentLang, setCurrentLang] = useState('en');
  const [currentRawText, setCurrentRawText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [savedReports, setSavedReports] = useState([]);
  const [storageError, setStorageError] = useState('');
  const [isSavingReport, setIsSavingReport] = useState(false);
  const [isCurrentSaved, setIsCurrentSaved] = useState(false);
  const [customPatient, setCustomPatient] = useState(null);
  const currentUser = user
    ? { name: user.fullName || user.primaryEmailAddress?.emailAddress || 'Account' }
    : null;

  // Active translation dictionary
  const t = useMemo(() => {
    return TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  }, [currentLang]);

  const refreshSavedReports = useCallback(async () => {
    const reports = await getSavedReports(getToken);
    setSavedReports(reports);
    return reports;
  }, [getToken]);

  useEffect(() => {
    if (!isAuthLoaded || !isSignedIn) return;

    refreshSavedReports().catch((error) => {
      console.error('Failed to load saved reports:', error);
      setStorageError(error.message);
    });
  }, [isAuthLoaded, isSignedIn, refreshSavedReports]);

  // Parse report and calculate risks
  const { parsedData, riskData } = useMemo(() => {
    if (!currentRawText.trim()) {
      return { parsedData: { patient: null, biomarkers: [] }, riskData: null };
    }
    const parsed = parseMedicalReport(currentRawText);
    const effectivePatient = customPatient || parsed.patient;
    const risks = calculateHealthRisks(parsed.biomarkers, effectivePatient);
    return {
      parsedData: {
        ...parsed,
        patient: effectivePatient
      },
      riskData: risks
    };
  }, [currentRawText, customPatient]);

  // Handle report analysis
  const handleAnalyze = (newText) => {
    setIsAnalyzing(true);
    stopSpeech();
    setIsAudioPlaying(false);
    setCustomPatient(null);
    setIsCurrentSaved(false);

    setTimeout(() => {
      setCurrentRawText(newText);
      setIsAnalyzing(false);
      const parsed = parseMedicalReport(newText);
      if (parsed.biomarkers.length > 0) {
        window.scrollTo({ top: 380, behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 120, behavior: 'smooth' });
      }
    }, 450);
  };

  // Handle manual patient detail update
  const handleUpdatePatient = (updatedPatient) => {
    setCustomPatient(updatedPatient);
  };

  // Save report to the signed-in user's account
  const handleSaveReport = async () => {
    if (!riskData || !parsedData.patient) return;

    setIsSavingReport(true);
    setStorageError('');
    try {
      await saveReportToStorage({
        patient: parsedData.patient,
        overallIndex: riskData.overallIndex,
        overallUrgency: riskData.overallUrgency,
        rawText: currentRawText,
        biomarkers: parsedData.biomarkers
      }, getToken);
      setIsCurrentSaved(true);
      await refreshSavedReports();
    } catch (error) {
      console.error('Failed to save report:', error);
      setStorageError(error.message);
    } finally {
      setIsSavingReport(false);
    }
  };

  const handleDeleteReport = async (id) => {
    setStorageError('');
    try {
      await deleteReportFromStorage(id, getToken);
      await refreshSavedReports();
    } catch (error) {
      console.error('Failed to delete report:', error);
      setStorageError(error.message);
    }
  };

  const handleExportReports = async () => {
    setStorageError('');
    try {
      await exportReportsBackup(getToken);
    } catch (error) {
      console.error('Failed to export saved reports:', error);
      setStorageError(error.message);
    }
  };

  // Language Change
  const handleLanguageChange = (langCode) => {
    setCurrentLang(langCode);
    stopSpeech();
    setIsAudioPlaying(false);
  };

  // Text-To-Speech Toggle
  const handleToggleSpeech = () => {
    if (isAudioPlaying) {
      stopSpeech();
      setIsAudioPlaying(false);
    } else {
      const langConfig = SUPPORTED_LANGUAGES.find(l => l.code === currentLang) || { voiceLang: 'en-US' };
      const patientName = parsedData.patient?.name || 'Patient';
      const summaryText = riskData ? riskData.clinicalSummary : t.heroSubtitle;
      const spokenText = `${t.appTitle}. ${patientName}. ${riskData ? `${t.overallScore}: ${riskData.overallIndex} out of 100.` : ''} ${summaryText}`;
      
      speakReportSummary(
        spokenText,
        langConfig.voiceLang,
        () => setIsAudioPlaying(true),
        () => setIsAudioPlaying(false)
      );
    }
  };

  const handleLogout = () => signOut();

  // Print Patient Consultation Sheet
  const handlePrint = () => {
    window.print();
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => stopSpeech();
  }, []);

  const hasAnalysis = Boolean(riskData && parsedData.biomarkers.length > 0);
  const hasAttemptedAnalysis = Boolean(currentRawText && currentRawText.trim() && !hasAnalysis);

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col ${currentLang === 'ar' ? 'rtl' : 'ltr'}`}>
      
      {/* Top Sticky Header */}
      <Header
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        t={t}
        onPrint={handlePrint}
        onToggleSpeech={handleToggleSpeech}
        isAudioPlaying={isAudioPlaying}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        savedReportsCount={savedReports.length}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Account and cloud storage status */}
        <div className="bg-gradient-to-r from-clinical-50 via-teal-50/50 to-slate-50 border border-clinical-200/80 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm no-print">
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className="w-10 h-10 rounded-2xl bg-clinical-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-clinical-500/20">
              <span className="text-base font-bold">👤</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  Signed in with Clerk
                </h4>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {currentUser?.name}. Saved reports are private to this account.
              </p>
            </div>
          </div>
        </div>

        {storageError && (
          <div role="alert" className="mb-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
            <div className="flex items-start justify-between gap-4">
              <span>{storageError}</span>
              <button
                type="button"
                onClick={() => setStorageError('')}
                className="font-semibold underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Upload Zone (No default sample pre-loaded) */}
        <FileUpload
          onAnalyze={handleAnalyze}
          isAnalyzing={isAnalyzing}
          t={t}
          currentRawText={currentRawText}
        />

        {/* Feedback if file was uploaded but no clinical biomarkers were found */}
        {hasAttemptedAnalysis && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-sm mb-8 text-center max-w-2xl mx-auto animate-fadeIn">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center text-xl font-bold">
              ⚠️
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5">
              No Numerical Lab Biomarkers Recognized in this File
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-4 leading-relaxed">
              We could not find recognized clinical test names and numbers (e.g. Hemoglobin, Glucose, Creatinine) in the uploaded document. If this was a scanned image or photo, please copy the text and paste it into the <strong>"Or Paste Plain Report Text"</strong> tab above.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl text-left font-mono text-[11px] text-slate-600 max-h-28 overflow-y-auto mb-4 border border-slate-200">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Extracted Text Preview:</div>
              {currentRawText.slice(0, 300) || '(No readable text extracted)'}
            </div>
          </div>
        )}

        {/* When Report is Uploaded: Show Patient Details, Health Index, Biomarkers & Risk Predictions */}
        {hasAnalysis ? (
          <ErrorBoundary>
            <div>
              {/* 1. Patient Name and Extracted Details Card */}
              <PatientDetailsCard
                patient={parsedData.patient}
                onUpdatePatient={handleUpdatePatient}
                t={t}
              />

              {/* 2. Executive Health Summary & Key Findings Card */}
              <ExecutiveSummary
                patient={parsedData.patient}
                biomarkers={parsedData.biomarkers}
                diagnosticFindings={parsedData.diagnosticFindings}
                overallIndex={riskData.overallIndex}
                clinicalSummary={riskData.clinicalSummary}
                onPrint={handlePrint}
                t={t}
              />

              {/* 3. Visual Risk & Health Score Overview */}
              <RiskOverview
                patient={parsedData.patient}
                overallIndex={riskData.overallIndex}
                overallUrgency={riskData.overallUrgency}
                clinicalSummary={riskData.clinicalSummary}
                risks={riskData.risks}
                onSaveReport={handleSaveReport}
                isSaved={isCurrentSaved}
                isSaving={isSavingReport}
                t={t}
              />

              {/* 4. Biomarkers Table & Visual Range Gauges */}
              <BiomarkerTable
                biomarkers={parsedData.biomarkers}
                t={t}
              />

              {/* 5. Actionable Doctor Questions */}
              <DoctorQuestions
                questions={riskData.doctorQuestions}
                t={t}
              />

              {/* 6. Evidence-Based Lifestyle & Nutrition Guidance */}
              <LifestyleAdvice
                recommendations={riskData.lifestyleRecommendations}
                t={t}
              />

              {/* 7. Interactive AI Health Assistant Chat */}
              <AIAssistantChat
                biomarkers={parsedData.biomarkers}
                patient={parsedData.patient}
                risks={riskData.risks}
                t={t}
              />
            </div>
          </ErrorBoundary>
        ) : null}

        {/* How It Works, Why We Built, The Problem, Our Solution, What Makes Us Different */}
        <AboutAndHowItWorks t={t} />

        {/* Persistent Clinical Safety Disclaimer */}
        <MedicalDisclaimer t={t} />

      </main>

      {/* Saved Reports Drawer */}
      <SavedReportsDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        reports={savedReports}
        onSelectReport={(raw) => handleAnalyze(raw)}
        onDeleteReport={handleDeleteReport}
        onExport={handleExportReports}
        t={t}
      />

    </div>
  );
}

export default App;
