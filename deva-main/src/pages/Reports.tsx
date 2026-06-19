import React, { useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { Button } from '../components/Button';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export function Reports() {
  const { state } = useStore();
  const reportRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  if (state.history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <p className="text-zinc-400">Complete an assessment to generate a report.</p>
      </div>
    );
  }

  const latest = state.history[state.history.length - 1];

  const handleDownload = async () => {
    if (!reportRef.current) return;
    setGenerating(true);
    
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Trading_Psychology_Report.pdf');
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-20">
      <div className="flex justify-between items-center bg-[#121214] p-6 rounded-xl border border-zinc-800">
        <div>
          <h2 className="text-xl font-bold">Latest Educational Report</h2>
          <p className="text-zinc-400 text-sm mt-1">Generated based on your most recent assessment.</p>
        </div>
        <Button onClick={handleDownload} disabled={generating}>
          {generating ? 'Generating...' : 'Download PDF Report'}
        </Button>
      </div>

      <div className="overflow-hidden border border-zinc-800 rounded-xl bg-white text-black p-0 shadow-2xl relative">
        {/* We render a hidden version strictly for the PDF layout logic, but accessible to html2canvas */}
        <div ref={reportRef} className="p-12 w-[800px] mx-auto bg-white" style={{ minHeight: '1122px' }}>
          
          <header className="border-b-4 border-indigo-600 pb-6 mb-8">
            <h1 className="text-4xl font-bold text-gray-900">Psychological Intelligence Report</h1>
            <p className="text-gray-500 mt-2 text-lg">Trader Diagnostics & Performance Coaching</p>
            <div className="mt-4 flex gap-4 text-sm font-medium text-gray-600">
              <span>Date: {new Date(latest.date).toLocaleDateString()}</span>
              <span>•</span>
              <span>Name: {state.profile?.name || 'Anonymous Trader'}</span>
              <span>•</span>
              <span>Market: {state.profile?.market || 'Unknown'}</span>
            </div>
          </header>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Executive Summary</h2>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 border border-gray-200 rounded text-center">
                <span className="text-gray-500 text-xs font-bold uppercase block mb-1">Discipline</span>
                <span className="text-2xl font-bold text-emerald-600">{latest.scores.discipline}%</span>
              </div>
              <div className="bg-gray-50 p-4 border border-gray-200 rounded text-center">
                <span className="text-gray-500 text-xs font-bold uppercase block mb-1">Confidence</span>
                <span className="text-2xl font-bold text-blue-600">{latest.scores.confidence}%</span>
              </div>
              <div className="bg-gray-50 p-4 border border-gray-200 rounded text-center">
                <span className="text-gray-500 text-xs font-bold uppercase block mb-1">Paralysis</span>
                <span className="text-2xl font-bold text-red-600">{latest.scores.analysisParalysis}%</span>
              </div>
              <div className="bg-gray-50 p-4 border border-gray-200 rounded text-center">
                <span className="text-gray-500 text-xs font-bold uppercase block mb-1">FOMO</span>
                <span className="text-2xl font-bold text-amber-600">{latest.scores.fomo}%</span>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 p-5 rounded font-medium text-indigo-900">
              <span className="block text-indigo-500 text-xs font-bold uppercase mb-1">Identified Archetype</span>
              <span className="text-xl">{latest.archetype}</span>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Root Cause Diagnostics</h2>
            <div className="space-y-3">
              {latest.rootCauses.map((cause, i) => (
                <div key={i} className="flex justify-between items-center border-b border-gray-100 py-2">
                  <span className="font-semibold text-gray-700">{cause.cause}</span>
                  <div className="flex gap-4">
                    <span className="text-gray-500 text-sm">{cause.type}</span>
                    <span className={`text-sm font-bold w-20 text-right ${
                      cause.severity === 'High' ? 'text-red-500' :
                      cause.severity === 'Medium' ? 'text-amber-500' : 'text-gray-400'
                    }`}>
                      {cause.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Prescribed Action Plan</h2>
            <div className="space-y-4">
              {latest.recommendations.map((rec, i) => (
                <div key={i} className="bg-gray-50 border border-gray-200 p-4 rounded flex gap-4">
                  <div className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded h-6 mt-0.5">
                    {rec.type}
                  </div>
                  <p className="text-gray-800">{rec.description}</p>
                </div>
              ))}
            </div>
          </section>

          <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm">
            Trader Psychology Intelligence Platform • Generated for educational purposes
          </footer>

        </div>
      </div>
    </div>
  );
}
