import React from 'react';
import { useStore } from '../store/useStore';
import { useTranslation } from '../i18n/context';
import { Line, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, RadialLinearScale, Filler
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, RadialLinearScale, Filler
);

export function Dashboard() {
  const { state } = useStore();
  const { t } = useTranslation();

  const history = state.history;

  if (!state.profile && history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <p className="text-theme-muted">{t('msg_complete_profile')}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <p className="text-theme-muted">{t('msg_no_assessments')}</p>
      </div>
    );
  }

  const latest = history[history.length - 1];

  const radarData = {
    labels: [t('label_paralysis'), t('label_fomo'), t('label_fear'), t('label_hesitation'), t('label_addiction')],
    datasets: [
      {
        label: t('dash_load'),
        data: [
          latest.scores.analysisParalysis,
          latest.scores.fomo,
          latest.rootCauses.find(r => r.cause === 'Fear of Loss')?.score || 50,
          latest.rootCauses.find(r => r.cause === 'Lack of Strategy Trust')?.score || 50,
          latest.rootCauses.find(r => r.cause === 'Confirmation Addiction')?.score || 50,
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        color: '#fff'
      },
    ],
  };

  const lineData = {
    labels: history.map((h, i) => `Wk ${i + 1}`),
    datasets: [
      {
        label: t('label_discipline'),
        data: history.map(h => h.scores.discipline),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
      },
      {
        label: t('label_paralysis'),
        data: history.map(h => h.scores.analysisParalysis),
        borderColor: '#ef4444',
        backgroundColor: 'transparent',
      },
      {
        label: t('label_fomo'),
        data: history.map(h => h.scores.fomo),
        borderColor: '#f59e0b',
        backgroundColor: 'transparent',
      }
    ],
  };

  const ScoreCard = ({ title, value, color }: { title: string, value: number, color: string }) => (
    <div className="bg-theme-card p-6 rounded-xl border border-theme-border flex flex-col gap-2">
      <span className="text-theme-muted text-sm font-medium uppercase tracking-wider">{title}</span>
      <div className={`text-4xl font-bold font-mono ${color}`}>{value}%</div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-theme-text">{t('dash_title')}</h1>
          <p className="text-theme-muted mt-1">{t('dash_greeting', { name: state.profile?.name || 'Trader' })}</p>
        </div>
        <div className="bg-theme-accent border border-theme-border2 px-4 py-2 rounded-lg">
          <span className="text-xs text-theme-accent uppercase font-bold tracking-wider block">{t('dash_archetype')}</span>
          <span className="text-lg font-bold text-theme-text">{latest.archetype}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ScoreCard title={t('label_discipline')} value={latest.scores.discipline} color="text-emerald-400" />
        <ScoreCard title={t('label_confidence')} value={latest.scores.confidence} color="text-blue-400" />
        <ScoreCard title={t('label_paralysis')} value={latest.scores.analysisParalysis} color="text-red-400" />
        <ScoreCard title={t('label_fomo')} value={latest.scores.fomo} color="text-amber-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-theme-card p-6 rounded-xl border border-theme-border md:col-span-2 space-y-4">
          <h3 className="font-bold text-theme-text">{t('dash_history')}</h3>
          <div className="h-[300px] w-full">
            <Line data={lineData} options={{ maintainAspectRatio: false, responsive: true, scales: { y: { min: 0, max: 100 } }, plugins: { legend: { labels: { color: 'var(--text)' } } } }} />
          </div>
        </div>

        <div className="bg-theme-card p-6 rounded-xl border border-theme-border space-y-4">
          <h3 className="font-bold text-theme-text">{t('dash_load')}</h3>
          <div className="h-[300px] w-full">
            <Radar data={radarData} options={{ maintainAspectRatio: false, scales: { r: { min: 0, max: 100, ticks: { display: false } } }, plugins: { legend: { display: false } } }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-theme-card border border-theme-border p-6 rounded-xl space-y-6">
          <h3 className="font-bold border-b border-theme-border pb-2 text-theme-text">{t('dash_root_causes')}</h3>
          <div className="space-y-4">
            {latest.rootCauses.map((cause, i) => (
              <div key={i} className="flex justify-between items-center bg-theme-surface2 p-3 rounded-lg border border-theme-border2">
                <div>
                  <span className="block font-medium text-theme-text">{cause.cause}</span>
                  <span className="text-xs text-theme-muted uppercase">{cause.type} {t('factor_type')}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-bold ${cause.severity === 'High' ? 'bg-red-500/20 text-red-400' :
                    cause.severity === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-theme-active text-theme-muted'
                  }`}>
                  {cause.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-theme-card border border-theme-border p-6 rounded-xl space-y-6">
          <h3 className="font-bold border-b border-theme-border pb-2 text-theme-text">{t('dash_actions')}</h3>
          <div className="space-y-4">
            {latest.recommendations.map((rec, i) => (
              <div key={i} className="flex gap-4 items-start">
                <span className="bg-theme-accent text-theme-accent text-xs font-bold px-2 py-1 rounded mt-0.5">
                  {rec.type}
                </span>
                <p className="text-theme-text text-sm">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
