import React, { useRef, useState } from 'react';
import { useStore } from '../store/useStore';
import { Button } from '../components/Button';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useTranslation } from '../i18n/context';

export function Reports() {
  const { state } = useStore();
  const { t } = useTranslation();
  const reportRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  if (state.history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <p className="text-zinc-400">{t('msg_complete_assessment')}</p>
      </div>
    );
  }

  const latest = state.history[state.history.length - 1];

  const handleDownload = async () => {
    if (!reportRef.current) return;
    setGenerating(true);

    try {
      const el = reportRef.current;

      // Temporarily expand the element so html2canvas sees the full height
      // without scroll clipping, then restore it after capture.
      const prevOverflow = el.style.overflow;
      const prevHeight = el.style.height;
      el.style.overflow = 'visible';
      el.style.height = 'auto';

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        scrollX: 0,
        scrollY: -window.scrollY,
        width: el.scrollWidth,
        height: el.scrollHeight,
        windowWidth: el.scrollWidth,
        windowHeight: el.scrollHeight,
      });

      // Restore original styles
      el.style.overflow = prevOverflow;
      el.style.height = prevHeight;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pdfW = pdf.internal.pageSize.getWidth();   // 210 mm
      const pdfH = pdf.internal.pageSize.getHeight();  // 297 mm
      const imgH = (canvas.height * pdfW) / canvas.width;

      // Paginate across A4 pages
      let heightLeft = imgH;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfW, imgH);
      heightLeft -= pdfH;

      while (heightLeft > 0) {
        position -= pdfH;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfW, imgH);
        heightLeft -= pdfH;
      }

      pdf.save('Trader_Psychological_Intelligence_Report.pdf');
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-20">
      <div className="flex justify-between items-center bg-[#121214] p-6 rounded-xl border border-zinc-800">
        <div>
          <h2 className="text-xl font-bold">{t('rep_title')}</h2>
          <p className="text-zinc-400 text-sm mt-1">{t('rep_desc')}</p>
        </div>
        <Button onClick={handleDownload} disabled={generating}>
          {generating ? t('btn_generating') : t('btn_download')}
        </Button>
      </div>

      <div className="border border-zinc-800 rounded-xl bg-white text-black shadow-2xl relative overflow-x-auto">
        <div ref={reportRef} className="p-12 w-[800px] mx-auto bg-white" style={{ minHeight: '1122px' }}>

          <header className="border-b-4 border-indigo-600 pb-6 mb-8">
            <h1 className="text-4xl font-bold text-gray-900">{t('rep_header')}</h1>
            <p className="text-gray-500 mt-2 text-lg">{t('rep_sub')}</p>
            <div className="mt-4 flex gap-4 text-sm font-medium text-gray-600">
              <span>{t('rep_date')}: {new Date(latest.date).toLocaleDateString()}</span>
              <span>•</span>
              <span>{t('rep_name')}: {state.profile?.name || 'Anonymous Trader'}</span>
              <span>•</span>
              <span>{t('rep_market')}: {state.profile?.market || 'Unknown'}</span>
            </div>
          </header>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('rep_exec')}</h2>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-50 p-4 border border-gray-200 rounded text-center">
                <span className="text-gray-500 text-xs font-bold uppercase block mb-1">{t('label_discipline')}</span>
                <span className="text-2xl font-bold text-emerald-600">{latest.scores.discipline}%</span>
              </div>
              <div className="bg-gray-50 p-4 border border-gray-200 rounded text-center">
                <span className="text-gray-500 text-xs font-bold uppercase block mb-1">{t('label_confidence')}</span>
                <span className="text-2xl font-bold text-blue-600">{latest.scores.confidence}%</span>
              </div>
              <div className="bg-gray-50 p-4 border border-gray-200 rounded text-center">
                <span className="text-gray-500 text-xs font-bold uppercase block mb-1">{t('label_paralysis')}</span>
                <span className="text-2xl font-bold text-red-600">{latest.scores.analysisParalysis}%</span>
              </div>
              <div className="bg-gray-50 p-4 border border-gray-200 rounded text-center">
                <span className="text-gray-500 text-xs font-bold uppercase block mb-1">{t('label_fomo')}</span>
                <span className="text-2xl font-bold text-amber-600">{latest.scores.fomo}%</span>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 p-5 rounded font-medium text-indigo-900">
              <span className="block text-indigo-500 text-xs font-bold uppercase mb-1">{t('dash_archetype')}</span>
              <span className="text-xl">{latest.archetype}</span>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('rep_root')}</h2>
            <div className="space-y-3">
              {latest.rootCauses.map((cause, i) => (
                <div key={i} className="flex justify-between items-center border-b border-gray-100 py-2">
                  <span className="font-semibold text-gray-700">{cause.cause}</span>
                  <div className="flex gap-4">
                    <span className="text-gray-500 text-sm">{cause.type}</span>
                    <span className={`text-sm font-bold w-20 text-right ${cause.severity === 'High' ? 'text-red-500' :
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
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('rep_plan')}</h2>
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
            {t('rep_footer')}
          </footer>

        </div>
      </div>
    </div>
  );
}
