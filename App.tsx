import React, { useState } from 'react';
import Layout from './components/Layout';
import AuditForm from './components/AuditForm';
import AuditProgress from './components/AuditProgress';
import AuditReport from './components/AuditReport';
import Dashboard from './components/Dashboard';
import Monitoring from './components/Monitoring';
import Settings from './components/Settings';
import { AuditResult, AuditType } from './types';
import { generateAuditReport, AuditServiceError } from './services/geminiService';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { AppProvider } from './context/AppContext';

enum AppState {
  DASHBOARD = 'DASHBOARD',
  FORM = 'FORM',
  AUDITING = 'AUDITING',
  GENERATING = 'GENERATING',
  REPORT = 'REPORT',
  ERROR = 'ERROR',
}

function AppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appState, setAppState] = useState<AppState>(AppState.DASHBOARD);
  
  const [currentAuditTarget, setCurrentAuditTarget] = useState('');
  const [currentAuditType, setCurrentAuditType] = useState<AuditType>(AuditType.MINI_APP);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [errorDetails, setErrorDetails] = useState<{ message: string; suggestion?: string; code?: string } | null>(null);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (tabId === 'audit') {
      setAppState(AppState.FORM);
    } else {
      if (activeTab === 'audit' && appState !== AppState.FORM) {
         setAppState(AppState.DASHBOARD);
      }
    }
  };

  const startAudit = (target: string, type: AuditType) => {
    setCurrentAuditTarget(target);
    setCurrentAuditType(type);
    setAppState(AppState.AUDITING);
  };

  const handleAuditComplete = async () => {
    setAppState(AppState.GENERATING);
    setErrorDetails(null);
    
    try {
      const report = await generateAuditReport(currentAuditTarget, currentAuditType);
      setAuditResult(report);
      setAppState(AppState.REPORT);
    } catch (err: any) {
      console.error("Audit Generation Error:", err);
      
      let details = { 
        message: "An unexpected error occurred during report generation.",
        suggestion: "Please try again.",
        code: "UNKNOWN"
      };

      if (err instanceof AuditServiceError) {
         details = {
           message: err.details.message,
           suggestion: err.details.suggestion,
           code: err.details.code
         };
      } else if (err.message) {
         details.message = err.message;
      }
      
      setErrorDetails(details);
      setAppState(AppState.ERROR);
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={handleTabChange}>
      
      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <Dashboard onNewAudit={() => {
          setActiveTab('audit');
          setAppState(AppState.FORM);
        }} />
      )}

      {/* Monitoring Tab */}
      {activeTab === 'monitor' && (
        <Monitoring />
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <Settings />
      )}

      {/* Audit Flow (Virtual Tab) */}
      {activeTab === 'audit' && (
        <>
          {appState === AppState.FORM && (
            <AuditForm onSubmit={startAudit} />
          )}

          {appState === AppState.AUDITING && (
            <AuditProgress 
              target={currentAuditTarget} 
              type={currentAuditType} 
              onComplete={handleAuditComplete} 
            />
          )}

          {appState === AppState.GENERATING && (
            <div className="flex flex-col items-center justify-center h-[60vh] animate-fade-in text-center px-4">
              <div className="bg-black border-4 border-base-blue p-8 flex flex-col items-center max-w-md shadow-pixel-blue relative w-full">
                
                <div className="relative mb-8">
                   <Loader2 className="w-20 h-20 text-base-blue animate-spin" />
                </div>
                
                <h3 className="text-3xl font-bold text-white mb-4 uppercase tracking-widest">ANALYZING ARTIFACTS</h3>
                <p className="text-gray-400 mb-8 font-mono text-lg">
                  Gemini AI processing 142 checkpoints...
                </p>
                
                <div className="w-full space-y-4 bg-gray-900 border-2 border-gray-700 p-6">
                   <div className="flex items-center gap-3 text-lg text-green-500 font-mono">
                      <div className="w-4 h-4 bg-green-500"></div>
                      <span>Simulation Complete</span>
                   </div>
                   <div className="flex items-center gap-3 text-lg text-base-blue font-mono animate-pulse">
                      <div className="w-4 h-4 bg-base-blue"></div>
                      <span>Verifying Checkpoints (142/142)</span>
                   </div>
                   <div className="flex items-center gap-3 text-lg text-gray-500 font-mono">
                      <div className="w-4 h-4 border-2 border-gray-500"></div>
                      <span>Generating Action Plan</span>
                   </div>
                </div>
              </div>
            </div>
          )}

          {appState === AppState.REPORT && auditResult && (
            <AuditReport result={auditResult} />
          )}

          {appState === AppState.ERROR && (
            <div className="flex flex-col items-center justify-center h-[60vh] animate-fade-in text-center px-4">
              <div className="bg-black border-4 border-red-500 p-8 max-w-lg shadow-pixel">
                <AlertTriangle className="w-20 h-20 text-red-500 mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-white mb-2 uppercase">Analysis Failure</h3>
                <p className="text-red-400 font-bold mb-6 font-mono text-xl">{errorDetails?.message}</p>
                {errorDetails?.suggestion && (
                    <div className="text-gray-400 text-lg mb-8 bg-gray-900 p-4 border-2 border-gray-700 font-mono">
                        <span className="block text-gray-500 text-sm uppercase font-bold mb-2">System Suggestion</span>
                        {errorDetails.suggestion}
                    </div>
                )}
                
                <div className="flex gap-4 justify-center">
                  <button 
                    onClick={() => {
                      setActiveTab('dashboard');
                      setAppState(AppState.DASHBOARD);
                    }}
                    className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold transition-colors border-2 border-gray-600 uppercase"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={handleAuditComplete}
                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold transition-colors flex items-center gap-2 border-2 border-white uppercase"
                  >
                    <RefreshCw className="w-5 h-5" /> Retry
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;