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
        <p className="text-zinc-400">{t('msg_complete_profile')}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <p className="text-zinc-400">{t('msg_no_assessments')}</p>
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
    <div className="bg-[#121214] p-6 rounded-xl border border-zinc-800 flex flex-col gap-2">
      <span className="text-zinc-400 text-sm font-medium uppercase tracking-wider">{title}</span>
      <div className={`text-4xl font-bold font-mono ${color}`}>{value}%</div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('dash_title')}</h1>
          <p className="text-zinc-400 mt-1">{t('dash_greeting', { name: state.profile?.name || 'Trader' })}</p>
        </div>
        <div className="bg-indigo-600/10 border border-indigo-500/20 px-4 py-2 rounded-lg">
          <span className="text-xs text-indigo-400 uppercase font-bold tracking-wider block">{t('dash_archetype')}</span>
          <span className="text-lg font-bold text-indigo-100">{latest.archetype}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <ScoreCard title={t('label_discipline')} value={latest.scores.discipline} color="text-emerald-400" />
        <ScoreCard title={t('label_confidence')} value={latest.scores.confidence} color="text-blue-400" />
        <ScoreCard title={t('label_paralysis')} value={latest.scores.analysisParalysis} color="text-red-400" />
        <ScoreCard title={t('label_fomo')} value={latest.scores.fomo} color="text-amber-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#121214] p-6 rounded-xl border border-zinc-800 md:col-span-2 space-y-4">
          <h3 className="font-bold">{t('dash_history')}</h3>
          <div className="h-[300px] w-full">
             <Line data={lineData} options={{ maintainAspectRatio: false, responsive: true, scales: { y: { min: 0, max: 100 } }, plugins: { legend: { labels: { color: '#fff' } } } }} />
          </div>
        </div>

        <div className="bg-[#121214] p-6 rounded-xl border border-zinc-800 space-y-4">
          <h3 className="font-bold">{t('dash_load')}</h3>
          <div className="h-[300px] w-full">
            <Radar data={radarData} options={{ maintainAspectRatio: false, scales: { r: { min: 0, max: 100, ticks: { display: false } } }, plugins: { legend: { display: false } } }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#121214] border border-zinc-800 p-6 rounded-xl space-y-6">
          <h3 className="font-bold border-b border-zinc-800 pb-2">{t('dash_root_causes')}</h3>
          <div className="space-y-4">
            {latest.rootCauses.map((cause, i) => (
              <div key={i} className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                <div>
                  <span className="block font-medium text-zinc-200">{cause.cause}</span>
                  <span className="text-xs text-zinc-500 uppercase">{cause.type} {t('factor_type')}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-bold ${
                  cause.severity === 'High' ? 'bg-red-500/20 text-red-400' :
                  cause.severity === 'Medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {cause.severity}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#121214] border border-zinc-800 p-6 rounded-xl space-y-6">
          <h3 className="font-bold border-b border-zinc-800 pb-2">{t('dash_actions')}</h3>
          <div className="space-y-4">
            {latest.recommendations.map((rec, i) => (
              <div key={i} className="flex gap-4 items-start">
                <span className="bg-indigo-600/20 text-indigo-400 text-xs font-bold px-2 py-1 rounded mt-0.5">
                  {rec.type}
                </span>
                <p className="text-zinc-300 text-sm">{rec.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
