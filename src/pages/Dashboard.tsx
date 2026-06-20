import React, { useEffect, useRef } from 'react';
import { useStore } from '../store/useStore';
import { useTranslation } from '../i18n/context';
import { Line, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  Filler,
} from 'chart.js';
import { ARCHETYPE_META } from '../lib/engine';
import { Brain, Target, Zap, TrendingUp, AlertTriangle, CheckCircle2, Shield } from 'lucide-react';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, RadialLinearScale, Filler
);

// ─── Score Card ──────────────────────────────────────────────────────────────
function ScoreCard({ title, value, color, icon }: { title: string; value: number; color: string; icon: React.ReactNode }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <div className="bg-theme-card p-5 rounded-xl border border-theme-border flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-theme-muted text-xs font-semibold uppercase tracking-wider">{title}</span>
        <div className="opacity-60">{icon}</div>
      </div>
      <div className={`text-4xl font-bold font-mono ${color}`}>{value}%</div>
      <div className="w-full bg-theme-active rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color.replace('text-', 'bg-')}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Severity Badge ───────────────────────────────────────────────────────────
function SeverityBadge({ severity }: { severity: 'High' | 'Medium' | 'Low' }) {
  const map = {
    High: 'bg-red-500/15 text-red-400 border border-red-500/30',
    Medium: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    Low: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded font-bold ${map[severity]}`}>
      {severity}
    </span>
  );
}

// ─── Recommendation Type Badge ────────────────────────────────────────────────
function RecBadge({ type }: { type: 'Task' | 'Challenge' | 'Objective' }) {
  const map = {
    Task: { cls: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/30', icon: <Target className="w-3 h-3" /> },
    Challenge: { cls: 'bg-amber-500/15 text-amber-400 border border-amber-500/30', icon: <Zap className="w-3 h-3" /> },
    Objective: { cls: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30', icon: <TrendingUp className="w-3 h-3" /> },
  };
  const { cls, icon } = map[type];
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-bold ${cls} whitespace-nowrap`}>
      {icon}{type}
    </span>
  );
}

// ─── Archetype Icon ───────────────────────────────────────────────────────────
function ArchetypeIcon({ archetype }: { archetype: string }) {
  if (archetype === 'Disciplined Operator') return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
  if (archetype === 'Developing Professional') return <TrendingUp className="w-5 h-5 text-blue-400" />;
  if (archetype === 'Fear-Based Trader') return <Shield className="w-5 h-5 text-purple-400" />;
  if (archetype === 'Reactive Chaser') return <Zap className="w-5 h-5 text-orange-400" />;
  return <AlertTriangle className="w-5 h-5 text-amber-400" />;
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export function Dashboard() {
  const { state } = useStore();
  const { t } = useTranslation();

  const history = state.history;

  if (!state.profile && history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 py-24">
        <Brain className="w-12 h-12 text-theme-muted opacity-50" />
        <p className="text-theme-muted text-lg">{t('msg_complete_profile')}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 py-24">
        <Brain className="w-12 h-12 text-theme-muted opacity-50" />
        <p className="text-theme-muted text-lg">{t('msg_no_assessments')}</p>
      </div>
    );
  }

  const latest = history[history.length - 1];
  const meta = ARCHETYPE_META[latest.archetype];

  // ── Chart Data ────────────────────────────────────────────────────────────
  const lineData = {
    labels: history.map((_, i) => `Wk ${i + 1}`),
    datasets: [
      {
        label: t('label_discipline'),
        data: history.map(h => h.scores.discipline),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16,185,129,0.08)',
        fill: true,
        tension: 0.4,
      },
      {
        label: t('label_paralysis'),
        data: history.map(h => h.scores.analysisParalysis),
        borderColor: '#ef4444',
        backgroundColor: 'transparent',
        tension: 0.4,
      },
      {
        label: t('label_fomo'),
        data: history.map(h => h.scores.fomo),
        borderColor: '#f59e0b',
        backgroundColor: 'transparent',
        tension: 0.4,
      },
      {
        label: t('label_confidence'),
        data: history.map(h => h.scores.confidence),
        borderColor: '#60a5fa',
        backgroundColor: 'transparent',
        tension: 0.4,
      },
    ],
  };

  const radarData = {
    labels: [
      t('label_paralysis'),
      t('label_fomo'),
      t('label_fear'),
      t('label_addiction'),
      t('label_hesitation'),
    ],
    datasets: [
      {
        label: t('dash_load'),
        data: [
          latest.scores.analysisParalysis,
          latest.scores.fomo,
          latest.scores.fear ?? 50,
          latest.scores.addictionScore ?? 50,
          latest.scores.friction ?? 50,
        ],
        backgroundColor: 'rgba(99,102,241,0.18)',
        borderColor: 'rgba(99,102,241,0.9)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(99,102,241,1)',
      },
    ],
  };

  const chartTextColor = 'rgba(161,161,170,0.9)';
  const gridColor = 'rgba(63,63,70,0.5)';

  const lineOptions = {
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: { color: chartTextColor },
        grid: { color: gridColor },
      },
      x: {
        ticks: { color: chartTextColor },
        grid: { color: gridColor },
      },
    },
    plugins: {
      legend: { labels: { color: chartTextColor, font: { size: 11 } } },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` ${ctx.dataset.label}: ${ctx.parsed.y}%`,
        },
      },
    },
  };

  const radarOptions = {
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: { display: false },
        grid: { color: gridColor },
        pointLabels: { color: chartTextColor, font: { size: 11 } },
        angleLines: { color: gridColor },
      },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-theme-text">{t('dash_title')}</h1>
          <p className="text-theme-muted mt-1">
            {t('dash_greeting', { name: state.profile?.name || 'Trader' })}
          </p>
        </div>
        <div className="text-xs text-theme-muted">
          {history.length} {history.length === 1 ? 'assessment' : 'assessments'} recorded
        </div>
      </div>

      {/* ── Score Cards ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ScoreCard title={t('label_discipline')} value={latest.scores.discipline} color="text-emerald-400" icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />} />
        <ScoreCard title={t('label_confidence')} value={latest.scores.confidence} color="text-blue-400" icon={<Shield className="w-4 h-4 text-blue-400" />} />
        <ScoreCard title={t('label_paralysis')} value={latest.scores.analysisParalysis} color="text-red-400" icon={<AlertTriangle className="w-4 h-4 text-red-400" />} />
        <ScoreCard title={t('label_fomo')} value={latest.scores.fomo} color="text-amber-400" icon={<Zap className="w-4 h-4 text-amber-400" />} />
      </div>

      {/* ── Archetype Block ───────────────────────────────────────────────── */}
      <div className="bg-theme-card border border-theme-border rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-theme-surface2 border border-theme-border flex items-center justify-center">
              <ArchetypeIcon archetype={latest.archetype} />
            </div>
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-theme-muted">{t('dash_archetype')}</span>
              <span className={`text-xl font-bold ${meta.color}`}>{latest.archetype}</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {meta.traits.map((trait) => (
              <span key={trait} className="text-xs bg-theme-surface2 border border-theme-border2 px-2 py-1 rounded-full text-theme-muted">
                {trait}
              </span>
            ))}
          </div>
        </div>
        <p className="text-sm text-theme-muted leading-relaxed border-t border-theme-border pt-4">
          {meta.description}
        </p>
      </div>

      {/* ── Charts ───────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-theme-card p-6 rounded-xl border border-theme-border md:col-span-2 space-y-4">
          <h3 className="font-bold text-theme-text">{t('dash_history')}</h3>
          <div className="h-[280px] w-full">
            <Line data={lineData} options={lineOptions as any} />
          </div>
        </div>

        <div className="bg-theme-card p-6 rounded-xl border border-theme-border space-y-4">
          <h3 className="font-bold text-theme-text">{t('dash_load')}</h3>
          <div className="h-[280px] w-full">
            <Radar data={radarData} options={radarOptions as any} />
          </div>
        </div>
      </div>

      {/* ── Root Causes & Coaching ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Root Causes */}
        <div className="bg-theme-card border border-theme-border p-6 rounded-xl space-y-4">
          <h3 className="font-bold border-b border-theme-border pb-3 text-theme-text">{t('dash_root_causes')}</h3>
          <div className="space-y-3">
            {latest.rootCauses.map((cause, i) => (
              <div key={i} className="flex justify-between items-center bg-theme-surface2 p-3 rounded-lg border border-theme-border2 gap-3">
                <div className="min-w-0">
                  <span className="block font-semibold text-sm text-theme-text truncate">{cause.cause}</span>
                  <span className="text-xs text-theme-muted uppercase tracking-wide">{cause.type} {t('factor_type')}</span>
                </div>
                <SeverityBadge severity={cause.severity} />
              </div>
            ))}
          </div>

          {/* Supporting Factors Note */}
          <p className="text-xs text-theme-muted leading-relaxed pt-2 border-t border-theme-border2">
            Primary and secondary causes drive the majority of execution friction. Supporting factors amplify the primary cause under stress.
          </p>
        </div>

        {/* Coaching Actions */}
        <div className="bg-theme-card border border-theme-border p-6 rounded-xl space-y-4">
          <h3 className="font-bold border-b border-theme-border pb-3 text-theme-text">{t('dash_actions')}</h3>
          <div className="space-y-4">
            {latest.recommendations.map((rec, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="pt-0.5 flex-shrink-0">
                  <RecBadge type={rec.type} />
                </div>
                <p className="text-sm text-theme-text leading-relaxed">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Educational Insights ─────────────────────────────────────────── */}
      {latest.educationalConcepts && latest.educationalConcepts.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-bold text-theme-text flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-400" />
            Personalized Psychological Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latest.educationalConcepts.map((concept, i) => (
              <div key={i} className="bg-theme-card border border-theme-border p-5 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                    {concept.trigger}
                  </span>
                  <span className="text-xs text-theme-muted">→</span>
                  <span className="text-xs font-bold text-theme-text">{concept.lesson}</span>
                </div>
                <p className="text-xs text-theme-muted leading-relaxed italic">{concept.insight}</p>
                <div className="bg-theme-surface2 border border-theme-border2 rounded-lg p-3">
                  <span className="text-xs font-bold text-theme-accent block mb-1">Exercise:</span>
                  <p className="text-xs text-theme-text leading-relaxed">{concept.exercise}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
