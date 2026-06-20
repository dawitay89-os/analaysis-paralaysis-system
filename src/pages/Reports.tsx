import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Button } from '../components/Button';
import { jsPDF } from 'jspdf';
import { useTranslation } from '../i18n/context';
import { ARCHETYPE_META, mapEducationalConcepts } from '../lib/engine';
import { Brain, FileText, Target, Zap, TrendingUp, BookOpen, CheckSquare } from 'lucide-react';

// ─── PDF colour palette ───────────────────────────────────────────────────────
const C = {
  indigo: [79, 70, 229] as [number, number, number],
  indigoLight: [238, 242, 255] as [number, number, number],
  emerald: [5, 150, 105] as [number, number, number],
  emeraldLight: [236, 253, 245] as [number, number, number],
  red: [220, 38, 38] as [number, number, number],
  redLight: [254, 242, 242] as [number, number, number],
  amber: [217, 119, 6] as [number, number, number],
  amberLight: [255, 251, 235] as [number, number, number],
  blue: [37, 99, 235] as [number, number, number],
  blueLight: [239, 246, 255] as [number, number, number],
  gray900: [17, 24, 39] as [number, number, number],
  gray700: [55, 65, 81] as [number, number, number],
  gray500: [107, 114, 128] as [number, number, number],
  gray200: [229, 231, 235] as [number, number, number],
  gray100: [243, 244, 246] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
};

// ─── jsPDF helpers ────────────────────────────────────────────────────────────
function pdfText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  opts: {
    size?: number;
    bold?: boolean;
    color?: [number, number, number];
    align?: 'left' | 'center' | 'right';
    maxWidth?: number;
  } = {}
) {
  const { size = 10, bold = false, color = C.gray900, align = 'left', maxWidth } = opts;
  doc.setFontSize(size);
  doc.setFont('helvetica', bold ? 'bold' : 'normal');
  doc.setTextColor(...color);
  if (maxWidth) {
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y, { align });
    return lines.length * (size * 0.35 + 1.5);
  }
  doc.text(text, x, y, { align });
  return size * 0.35 + 1.5;
}

function pdfRect(
  doc: jsPDF,
  x: number, y: number, w: number, h: number,
  fill: [number, number, number],
  stroke?: [number, number, number]
) {
  doc.setFillColor(...fill);
  if (stroke) {
    doc.setDrawColor(...stroke);
    doc.roundedRect(x, y, w, h, 2, 2, 'FD');
  } else {
    doc.roundedRect(x, y, w, h, 2, 2, 'F');
  }
}

function pdfLine(doc: jsPDF, x1: number, y1: number, x2: number, y2: number, color: [number, number, number], width = 0.3) {
  doc.setDrawColor(...color);
  doc.setLineWidth(width);
  doc.line(x1, y1, x2, y2);
}

function pdfBar(doc: jsPDF, x: number, y: number, totalW: number, value: number, color: [number, number, number]) {
  const h = 3.5;
  pdfRect(doc, x, y, totalW, h, C.gray200);
  const filled = Math.max(1, (value / 100) * totalW);
  pdfRect(doc, x, y, filled, h, color);
}

// ─── Page header/footer helper ────────────────────────────────────────────────
function addPageChrome(doc: jsPDF, pageNum: number, trader: string, date: string) {
  const W = 210; const margin = 15;
  // Top accent bar
  doc.setFillColor(...C.indigo);
  doc.rect(0, 0, W, 6, 'F');
  // Header text
  pdfText(doc, 'NEGADRAS GROUP 6  •  Psychological Intelligence Report', margin, 13, { size: 8, color: C.gray500 });
  pdfText(doc, `Page ${pageNum} of 3`, W - margin, 13, { size: 8, color: C.gray500, align: 'right' });
  pdfLine(doc, margin, 16, W - margin, 16, C.gray200);
  // Footer
  const fY = 287;
  pdfLine(doc, margin, fY, W - margin, fY, C.gray200);
  pdfText(doc, 'Trader Psychology Intelligence Platform  •  Generated for educational purposes only', margin, fY + 5, { size: 7.5, color: C.gray500 });
  pdfText(doc, `${date}  |  ${trader}`, W - margin, fY + 5, { size: 7.5, color: C.gray500, align: 'right' });
}

// ─── Generate PDF (pure jsPDF, no canvas) ─────────────────────────────────────
function generatePDF(doc: jsPDF, state: any, latest: any) {
  const W = 210;
  const margin = 15;
  const contentW = W - margin * 2;
  const traderName = state.profile?.name || 'Anonymous Trader';
  const dateStr = new Date(latest.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const meta = ARCHETYPE_META[latest.archetype as keyof typeof ARCHETYPE_META];

  // ════════════════════════════════════════════════════════
  // PAGE 1 — Executive Summary, Scores, Archetype, Root Causes
  // ════════════════════════════════════════════════════════
  addPageChrome(doc, 1, traderName, dateStr);
  let y = 24;

  // Title block
  pdfText(doc, 'Psychological Intelligence Report', margin, y, { size: 20, bold: true, color: C.gray900 });
  y += 9;
  pdfText(doc, 'Trader Diagnostics & Performance Coaching', margin, y, { size: 11, color: C.gray500 });
  y += 6;
  pdfLine(doc, margin, y, W - margin, y, C.indigo, 0.8);
  y += 7;

  // Meta row
  const metaItems = [
    `Date: ${dateStr}`,
    `Trader: ${traderName}`,
    `Market: ${state.profile?.market || 'N/A'}`,
    `Style: ${state.profile?.style || 'N/A'}`,
    `Account: ${state.profile?.accountType || 'N/A'}`,
  ];
  pdfText(doc, metaItems.join('   •   '), margin, y, { size: 8, color: C.gray500, maxWidth: contentW });
  y += 10;

  // ── Executive Summary heading
  pdfText(doc, 'EXECUTIVE SUMMARY', margin, y, { size: 9, bold: true, color: C.indigo });
  y += 6;
  pdfLine(doc, margin, y, W - margin, y, C.gray200, 0.2);
  y += 5;

  // ── 4 Score boxes
  const boxW = (contentW - 9) / 4;
  const scores = [
    { label: 'Discipline', value: latest.scores.discipline, color: C.emerald, light: C.emeraldLight },
    { label: 'Confidence', value: latest.scores.confidence, color: C.blue, light: C.blueLight },
    { label: 'Paralysis', value: latest.scores.analysisParalysis, color: C.red, light: C.redLight },
    { label: 'FOMO', value: latest.scores.fomo, color: C.amber, light: C.amberLight },
  ];
  scores.forEach((s, i) => {
    const bx = margin + i * (boxW + 3);
    pdfRect(doc, bx, y, boxW, 26, s.light, C.gray200);
    pdfText(doc, s.label.toUpperCase(), bx + boxW / 2, y + 6, { size: 7, bold: true, color: C.gray500, align: 'center' });
    pdfText(doc, `${s.value}%`, bx + boxW / 2, y + 16, { size: 16, bold: true, color: s.color, align: 'center' });
    pdfBar(doc, bx + 4, y + 21, boxW - 8, s.value, s.color);
  });
  y += 34;

  // ── Archetype box
  pdfRect(doc, margin, y, contentW, 28, C.indigoLight, C.indigo);
  pdfText(doc, 'IDENTIFIED ARCHETYPE', margin + 5, y + 6, { size: 7.5, bold: true, color: C.indigo });
  pdfText(doc, latest.archetype, margin + 5, y + 14, { size: 14, bold: true, color: C.gray900 });
  const traitStr = meta?.traits?.join('  •  ') ?? '';
  pdfText(doc, traitStr, margin + 5, y + 22, { size: 8, color: C.gray700 });
  y += 35;

  // ── Archetype description
  pdfText(doc, 'Archetype Profile', margin, y, { size: 9, bold: true, color: C.gray700 });
  y += 5;
  const descH = pdfText(doc, meta?.description || '', margin, y, { size: 8.5, color: C.gray700, maxWidth: contentW });
  y += descH + 8;

  // ── Root Causes
  pdfText(doc, 'ROOT CAUSE DIAGNOSTICS', margin, y, { size: 9, bold: true, color: C.indigo });
  y += 6;
  pdfLine(doc, margin, y, W - margin, y, C.gray200, 0.2);
  y += 5;

  const causeColors = { High: C.red, Medium: C.amber, Low: C.emerald };
  const causeLight = { High: C.redLight, Medium: C.amberLight, Low: C.emeraldLight };
  latest.rootCauses.forEach((cause: any) => {
    const rowH = 14;
    pdfRect(doc, margin, y, contentW, rowH, C.gray100, C.gray200);
    pdfText(doc, cause.cause, margin + 4, y + 5.5, { size: 9, bold: true, color: C.gray900 });
    pdfText(doc, cause.type + ' Factor', margin + 4, y + 11, { size: 7.5, color: C.gray500 });
    const sevW = 22;
    const sevX = W - margin - sevW - 2;
    const sevCol = causeColors[cause.severity as keyof typeof causeColors] ?? C.gray500;
    const sevLight = causeLight[cause.severity as keyof typeof causeLight] ?? C.gray100;
    pdfRect(doc, sevX, y + 3, sevW, 8, sevLight, sevCol);
    pdfText(doc, cause.severity, sevX + sevW / 2, y + 9, { size: 8, bold: true, color: sevCol, align: 'center' });
    y += rowH + 3;
  });

  // ════════════════════════════════════════════════════════
  // PAGE 2 — Educational Concepts, Lessons, Insights
  // ════════════════════════════════════════════════════════
  doc.addPage();
  addPageChrome(doc, 2, traderName, dateStr);
  y = 24;

  pdfText(doc, 'EDUCATIONAL CONCEPTS & PERSONALIZED LESSONS', margin, y, { size: 9, bold: true, color: C.indigo });
  y += 6;
  pdfLine(doc, margin, y, W - margin, y, C.gray200, 0.2);
  y += 6;

  // Sub-description
  pdfText(doc, 'The following concepts and exercises have been selected based on your psychological profile and identified root causes.', margin, y, { size: 8.5, color: C.gray500, maxWidth: contentW });
  y += 10;

  const concepts = latest.educationalConcepts?.length
    ? latest.educationalConcepts
    : mapEducationalConcepts(latest.scores, latest.rootCauses);

  concepts.forEach((concept: any, idx: number) => {
    // Concept header
    pdfRect(doc, margin, y, contentW, 10, C.indigoLight, C.indigo);
    pdfText(doc, `${idx + 1}. ${concept.trigger}`, margin + 4, y + 4, { size: 8.5, bold: true, color: C.indigo });
    pdfText(doc, `→  ${concept.lesson}`, margin + 4, y + 9.5, { size: 8, color: C.gray700 });
    y += 14;

    // Insight
    pdfText(doc, 'Key Psychological Insight:', margin, y, { size: 8.5, bold: true, color: C.gray700 });
    y += 5;
    const insH = pdfText(doc, concept.insight, margin + 3, y, { size: 8, color: C.gray700, maxWidth: contentW - 3 });
    y += insH + 5;

    // Exercise
    pdfRect(doc, margin, y, contentW, 6, C.gray100);
    pdfText(doc, 'Applied Exercise:', margin + 3, y + 4.5, { size: 8, bold: true, color: C.gray700 });
    y += 9;
    const exH = pdfText(doc, concept.exercise, margin + 3, y, { size: 8, color: C.gray700, maxWidth: contentW - 6 });
    y += exH + 10;

    if (idx < concepts.length - 1) {
      pdfLine(doc, margin, y - 4, W - margin, y - 4, C.gray200, 0.2);
    }
  });

  // Additional: Concept-Cause Mapping Table
  y += 4;
  pdfText(doc, 'CONCEPT-TO-CAUSE MAPPING', margin, y, { size: 9, bold: true, color: C.indigo });
  y += 6;
  pdfLine(doc, margin, y, W - margin, y, C.gray200, 0.2);
  y += 5;

  const mappings = [
    { cause: 'Fear of Being Wrong', lesson: 'Probability Thinking — Decouple identity from individual trade outcomes.' },
    { cause: 'Fear of Loss', lesson: 'Risk Acceptance Training — Pre-accept risk before every entry.' },
    { cause: 'Overthinking', lesson: 'Simplification Framework — Reduce entry criteria to 3 rules maximum.' },
    { cause: 'FOMO', lesson: 'Process Discipline — Pre-plan entries; eliminate reactive execution.' },
    { cause: 'Revenge Trading', lesson: 'Emotional Recovery Routine — Mandatory 15-minute cooldown post-loss.' },
    { cause: 'Confidence Issues', lesson: 'Evidence-Based Confidence — Build confidence through process scoring.' },
  ];
  mappings.forEach((m) => {
    pdfText(doc, `• ${m.cause}`, margin, y, { size: 8, bold: true, color: C.gray700 });
    y += 5;
    pdfText(doc, `  ${m.lesson}`, margin + 3, y, { size: 7.5, color: C.gray500, maxWidth: contentW - 3 });
    y += 6;
  });

  // ════════════════════════════════════════════════════════
  // PAGE 3 — Action Plan, Weekly Challenge, Improvement Checklist
  // ════════════════════════════════════════════════════════
  doc.addPage();
  addPageChrome(doc, 3, traderName, dateStr);
  y = 24;

  pdfText(doc, 'PRESCRIBED ACTION PLAN', margin, y, { size: 9, bold: true, color: C.indigo });
  y += 6;
  pdfLine(doc, margin, y, W - margin, y, C.gray200, 0.2);
  y += 6;

  const recColors = {
    Task: { bg: C.indigoLight, text: C.indigo, label: 'DAILY TASK' },
    Challenge: { bg: C.amberLight, text: C.amber, label: 'WEEKLY CHALLENGE' },
    Objective: { bg: C.emeraldLight, text: C.emerald, label: 'IMPROVEMENT OBJECTIVE' },
  };

  latest.recommendations.forEach((rec: any, i: number) => {
    const col = recColors[rec.type as keyof typeof recColors] ?? recColors.Task;
    pdfRect(doc, margin, y, contentW, 8, col.bg);
    pdfText(doc, col.label, margin + 4, y + 5.5, { size: 7.5, bold: true, color: col.text });
    y += 11;
    const h = pdfText(doc, rec.description, margin + 3, y, { size: 8.5, color: C.gray700, maxWidth: contentW - 6 });
    y += h + 8;
    pdfLine(doc, margin + 10, y - 3, W - margin - 10, y - 3, C.gray200, 0.15);
  });

  y += 5;

  // ── Weekly Challenge summary
  const challenge = latest.recommendations.find((r: any) => r.type === 'Challenge');
  pdfText(doc, 'THIS WEEK\'S CHALLENGE', margin, y, { size: 9, bold: true, color: C.indigo });
  y += 6;
  pdfRect(doc, margin, y, contentW, 22, C.amberLight, C.amber);
  if (challenge) {
    const cH = pdfText(doc, challenge.description, margin + 5, y + 7, { size: 8.5, color: C.gray700, maxWidth: contentW - 10 });
    y += Math.max(22, cH + 14);
  } else {
    y += 26;
  }
  y += 6;

  // ── 30-Day Improvement Checklist
  pdfText(doc, '30-DAY IMPROVEMENT CHECKLIST', margin, y, { size: 9, bold: true, color: C.indigo });
  y += 6;
  pdfLine(doc, margin, y, W - margin, y, C.gray200, 0.2);
  y += 5;

  const checklist = [
    'Complete weekly psychological assessment to track score changes.',
    'Journal every trade with a process score (1–5) independent of PnL.',
    'Practice the Risk Acceptance Ritual before every session.',
    'Review root cause analysis after each losing streak of 3+ trades.',
    'Apply the identified Simplification or FOMO exercise for 10 consecutive trades.',
    'Compare Week 1 and Week 4 radar scores — target 10% improvement in primary weakness.',
    'Read one chapter from a trader psychology resource (minimum once per week).',
    'Grade your archetype consistency — are you moving toward Disciplined Operator?',
    'Debrief your weekly challenge outcome every Sunday evening.',
    'Reset and re-take the full assessment at the start of each new month.',
  ];

  checklist.forEach((item, i) => {
    // Checkbox square
    doc.setDrawColor(...C.gray500);
    doc.setLineWidth(0.3);
    doc.rect(margin, y - 3, 4, 4);
    pdfText(doc, item, margin + 7, y, { size: 8, color: C.gray700, maxWidth: contentW - 7 });
    y += 8;
  });

  y += 5;

  // ── Progress Note
  pdfRect(doc, margin, y, contentW, 18, C.indigoLight, C.indigo);
  pdfText(doc, 'NEXT ASSESSMENT RECOMMENDATION', margin + 5, y + 6, { size: 8, bold: true, color: C.indigo });
  pdfText(doc, 'Re-assess in 7 days to track psychological score movement. A 5-point improvement in your primary weakness area indicates effective application of the prescribed concepts. Consistency compounds.', margin + 5, y + 12, { size: 7.5, color: C.gray700, maxWidth: contentW - 10 });
}

// ─── Reports Component ────────────────────────────────────────────────────────
export function Reports() {
  const { state } = useStore();
  const { t } = useTranslation();
  const [generating, setGenerating] = useState(false);

  if (state.history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 py-24">
        <Brain className="w-12 h-12 text-theme-muted opacity-50" />
        <p className="text-theme-muted text-lg">{t('msg_complete_assessment')}</p>
      </div>
    );
  }

  const latest = state.history[state.history.length - 1];
  const meta = ARCHETYPE_META[latest.archetype];
  const concepts = latest.educationalConcepts?.length
    ? latest.educationalConcepts
    : mapEducationalConcepts(latest.scores, latest.rootCauses);

  const handleDownload = () => {
    setGenerating(true);
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      generatePDF(doc, state, latest);
      doc.save('Trader_Psychological_Intelligence_Report.pdf');
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  // ── Severity badge helper ────────────────────────────────────────────────
  const SeverityBadge = ({ s }: { s: 'High' | 'Medium' | 'Low' }) => {
    const map = {
      High: 'bg-red-500/15 text-red-400 border border-red-500/30',
      Medium: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
      Low: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    };
    return <span className={`text-xs px-2 py-0.5 rounded font-bold ${map[s]}`}>{s}</span>;
  };

  const RecBadge = ({ type }: { type: 'Task' | 'Challenge' | 'Objective' }) => {
    const map = {
      Task: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30',
      Challenge: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
      Objective: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    };
    const icons = {
      Task: <Target className="w-3 h-3 inline mr-1" />,
      Challenge: <Zap className="w-3 h-3 inline mr-1" />,
      Objective: <TrendingUp className="w-3 h-3 inline mr-1" />,
    };
    return (
      <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${map[type]}`}>
        {icons[type]}{type}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-20">

      {/* ── Top bar ───────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-theme-card p-6 rounded-xl border border-theme-border">
        <div>
          <h2 className="text-xl font-bold text-theme-text">{t('rep_title')}</h2>
          <p className="text-theme-muted text-sm mt-1">{t('rep_desc')}</p>
          <p className="text-xs text-theme-muted mt-1">
            {new Date(latest.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Button onClick={handleDownload} disabled={generating} className="flex items-center gap-2 flex-shrink-0">
          <FileText className="w-4 h-4" />
          {generating ? t('btn_generating') : t('btn_download')}
        </Button>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          PAGE 1 PREVIEW — Executive Summary, Scores, Archetype, Root Causes
      ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white text-gray-900 rounded-xl border border-theme-border shadow-xl overflow-hidden">
        {/* Page label */}
        <div className="bg-indigo-600 px-6 py-2">
          <span className="text-xs font-bold text-white uppercase tracking-widest">Page 1 — Executive Summary & Diagnostics</span>
        </div>

        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="border-b-4 border-indigo-600 pb-5">
            <h1 className="text-3xl font-bold text-gray-900">{t('rep_header')}</h1>
            <p className="text-gray-500 mt-1">{t('rep_sub')}</p>
            <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-600">
              <span>{t('rep_date')}: {new Date(latest.date).toLocaleDateString()}</span>
              <span>•</span>
              <span>{t('rep_name')}: {state.profile?.name || 'Anonymous Trader'}</span>
              <span>•</span>
              <span>{t('rep_market')}: {state.profile?.market || 'N/A'}</span>
              <span>•</span>
              <span>Style: {state.profile?.style || 'N/A'}</span>
            </div>
          </div>

          {/* Score boxes */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-3">{t('rep_exec')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {[
                { label: t('label_discipline'), val: latest.scores.discipline, cls: 'text-emerald-600', bar: 'bg-emerald-500' },
                { label: t('label_confidence'), val: latest.scores.confidence, cls: 'text-blue-600', bar: 'bg-blue-500' },
                { label: t('label_paralysis'), val: latest.scores.analysisParalysis, cls: 'text-red-600', bar: 'bg-red-500' },
                { label: t('label_fomo'), val: latest.scores.fomo, cls: 'text-amber-600', bar: 'bg-amber-500' },
              ].map(({ label, val, cls, bar }) => (
                <div key={label} className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <span className="text-gray-500 text-xs font-bold uppercase block mb-1">{label}</span>
                  <span className={`text-3xl font-bold font-mono ${cls}`}>{val}%</span>
                  <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${bar}`} style={{ width: `${val}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Archetype */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-5 flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <span className="block text-indigo-500 text-xs font-bold uppercase tracking-wider mb-1">{t('dash_archetype')}</span>
                <span className="text-xl font-bold text-gray-900">{latest.archetype}</span>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {meta?.traits?.map(tr => (
                    <span key={tr} className="text-xs bg-white border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded-full">{tr}</span>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-relaxed">{meta?.description?.slice(0, 200)}…</p>
              </div>
            </div>
          </div>

          {/* Root Causes */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-3">{t('rep_root')}</h2>
            <div className="space-y-2">
              {latest.rootCauses.map((cause, i) => (
                <div key={i} className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 bg-gray-50">
                  <div>
                    <span className="font-semibold text-gray-800 block">{cause.cause}</span>
                    <span className="text-xs text-gray-500 uppercase">{cause.type} Factor</span>
                  </div>
                  <SeverityBadge s={cause.severity} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          PAGE 2 PREVIEW — Educational Concepts, Lessons, Insights
      ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white text-gray-900 rounded-xl border border-theme-border shadow-xl overflow-hidden">
        <div className="bg-indigo-600 px-6 py-2">
          <span className="text-xs font-bold text-white uppercase tracking-widest">Page 2 — Educational Concepts & Psychological Insights</span>
        </div>

        <div className="p-8 space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" />
              Personalized Educational Concepts
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Selected based on your psychological profile and identified root causes.
            </p>
          </div>

          {concepts.map((concept, i) => (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-indigo-50 border-b border-indigo-100 px-5 py-3 flex items-center gap-3">
                <span className="text-xs font-bold bg-indigo-600 text-white px-2 py-0.5 rounded">{i + 1}</span>
                <span className="font-bold text-indigo-800">{concept.trigger}</span>
                <span className="text-indigo-400">→</span>
                <span className="text-sm font-semibold text-indigo-700">{concept.lesson}</span>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Key Psychological Insight</span>
                  <p className="text-sm text-gray-700 leading-relaxed italic border-l-2 border-indigo-300 pl-3">{concept.insight}</p>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <span className="text-xs font-bold text-gray-600 uppercase tracking-wider block mb-2">Applied Exercise</span>
                  <p className="text-sm text-gray-700 leading-relaxed">{concept.exercise}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Concept-Cause Mapping */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Core Concept Reference Map</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                { cause: 'Fear of Being Wrong', lesson: 'Probability Thinking' },
                { cause: 'Fear of Loss', lesson: 'Risk Acceptance Training' },
                { cause: 'Overthinking', lesson: 'Simplification Framework' },
                { cause: 'FOMO', lesson: 'Process Discipline' },
                { cause: 'Revenge Trading', lesson: 'Emotional Recovery Routine' },
                { cause: 'Confidence Issues', lesson: 'Evidence-Based Confidence' },
              ].map(({ cause, lesson }) => (
                <div key={cause} className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded px-3 py-2">
                  <span className="font-semibold text-gray-800 w-36 flex-shrink-0">{cause}</span>
                  <span className="text-gray-400">→</span>
                  <span>{lesson}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          PAGE 3 PREVIEW — Action Plan, Weekly Challenge, Checklist
      ════════════════════════════════════════════════════════════════════ */}
      <div className="bg-white text-gray-900 rounded-xl border border-theme-border shadow-xl overflow-hidden">
        <div className="bg-indigo-600 px-6 py-2">
          <span className="text-xs font-bold text-white uppercase tracking-widest">Page 3 — Action Plan, Weekly Challenge & Improvement Checklist</span>
        </div>

        <div className="p-8 space-y-6">
          {/* Action Plan */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-3">{t('rep_plan')}</h2>
            <div className="space-y-3">
              {latest.recommendations.map((rec, i) => (
                <div key={i} className="flex gap-4 items-start border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="pt-0.5 flex-shrink-0">
                    <RecBadge type={rec.type} />
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{rec.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Challenge highlight */}
          {latest.recommendations.find(r => r.type === 'Challenge') && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-amber-500" />
                <span className="font-bold text-amber-800 text-sm uppercase tracking-wide">This Week's Challenge</span>
              </div>
              <p className="text-sm text-amber-900 leading-relaxed">
                {latest.recommendations.find(r => r.type === 'Challenge')!.description}
              </p>
            </div>
          )}

          {/* 30-Day Improvement Checklist */}
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-indigo-500" />
              30-Day Improvement Checklist
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {[
                'Complete weekly psychological assessment to track score changes.',
                'Journal every trade with a process score (1–5) independent of PnL.',
                'Practice the Risk Acceptance Ritual before every session.',
                'Review root cause analysis after each losing streak of 3+ trades.',
                'Apply your identified exercise for 10 consecutive trades.',
                'Compare Week 1 and Week 4 radar scores — target 10% improvement.',
                'Read one chapter from a trader psychology resource each week.',
                'Grade your archetype consistency — are you moving forward?',
                'Debrief your weekly challenge outcome every Sunday.',
                'Re-take the full assessment at the start of each new month.',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reassessment note */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-5">
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider block mb-1">Next Assessment Recommendation</span>
            <p className="text-sm text-indigo-900 leading-relaxed">
              Re-assess in 7 days to track psychological score movement. A 5-point improvement in your primary weakness area indicates effective application of the prescribed concepts. Consistency compounds over time.
            </p>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-5 text-center">
            <p className="text-xs text-gray-400">{t('rep_footer')}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
