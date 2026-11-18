import React from 'react';
import { Activity, Globe, Printer, Volume2, Square, Database, User, LogOut } from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../data/translations.js';

export function Header({
  currentLang,
  onLanguageChange,
  t,
  onPrint,
  onToggleSpeech,
  isAudioPlaying,
  onOpenSavedDrawer,
  savedReportsCount,
  currentUser,
  onLogout
}) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-clinical-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-clinical-500/20">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  {t.appTitle}
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-clinical-50 text-clinical-700 border border-clinical-200">
                  AI v2.0
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block truncate max-w-md">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* User Authentication Pill / Login Button */}
            {currentUser ? (
              <div className="flex items-center space-x-2 bg-slate-100 p-1 pl-2.5 rounded-xl border border-slate-200">
                <div className="flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-slate-600" />
                  <span className="text-xs font-bold text-slate-800 max-w-[100px] truncate">
                    {currentUser.name}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  title="Sign Out"
                  className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : null}

            {/* Saved Reports Database Button */}
            <button
              onClick={onOpenSavedDrawer}
              title={t.savedReportsTitle}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200 relative"
            >
              <Database className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">My Reports</span>
              {savedReportsCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-clinical-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {savedReportsCount}
                </span>
              )}
            </button>

            {/* Audio Explanation Button */}
            <button
              onClick={onToggleSpeech}
              title={isAudioPlaying ? t.stopAudio : t.listenAudio}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                isAudioPlaying 
                  ? 'bg-rose-50 text-rose-700 border border-rose-300 animate-pulse'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
              }`}
            >
              {isAudioPlaying ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">{t.stopAudio}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.listenAudio}</span>
                </>
              )}
            </button>

            {/* Print/Export Button */}
            <button
              onClick={onPrint}
              title={t.exportPdf}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.exportPdf}</span>
            </button>

            {/* Language Selector */}
            <div className="relative flex items-center">
              <Globe className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={currentLang}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="pl-8 pr-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-clinical-500"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.native} ({lang.name})
                  </option>
                ))}
              </select>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
}
