import React from 'react';
import { useTranslation } from '../i18n/context';
import { Button } from '../components/Button';
import { ActivitySquare, TrendingUp, Brain } from 'lucide-react';
import negadrasLogo from '../assets/negadras-logo.svg';

export function Welcome({ onStart }: { onStart: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12 animate-in fade-in zoom-in-95 duration-700">
      <div className="space-y-6 max-w-2xl">
        <div className="inline-flex items-center justify-center p-4 bg-zinc-800/40 rounded-full border border-zinc-700/40 mb-4">
          <img src={negadrasLogo} alt="Negadras Logo" className="w-16 h-16" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-zinc-100 to-zinc-500">
          {t('app_title')}
        </h1>

        <p className="text-lg text-zinc-400 leading-relaxed max-w-xl mx-auto">
          {t('welcome_text')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl text-left">
        <Card
          icon={<ActivitySquare className="w-6 h-6 text-emerald-400" />}
          title={t('welcome_title1')}
          desc={t('welcome_title1_desc')}
          onClick={onStart}
        />
        <Card
          icon={<Brain className="w-6 h-6 text-indigo-400" />}
          title={t('welcome_title2')}
          desc={t('welcome_title2_desc')}
          onClick={onStart}
        />
        <Card
          icon={<TrendingUp className="w-6 h-6 text-amber-400" />}
          title={t('welcome_title3')}
          desc={t('welcome_title3_desc')}
          onClick={onStart}
        />
      </div>

      <div className="pt-8 w-full max-w-sm mx-auto">
        <Button size="lg" className="w-full text-lg shadow-lg shadow-indigo-600/20" onClick={onStart}>
          {t('start_setup')}
        </Button>
      </div>
    </div>
  );
}

function Card({ icon, title, desc, onClick }: { icon: React.ReactNode, title: string, desc: string, onClick?: () => void }) {
  return (
    <div
      className="bg-[#121214] border border-zinc-800/50 p-6 rounded-2xl flex flex-col gap-3 cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
    >
      <div className="w-12 h-12 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800">
        {icon}
      </div>
      <h3 className="font-bold text-lg text-zinc-200">{title}</h3>
      <p className="text-zinc-500 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}
