import React from 'react';
import { useTranslation } from '../i18n/context';
import { Button } from '../components/Button';
import { ActivitySquare, TrendingUp, Brain } from 'lucide-react';

function NegadrasLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wl" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8e8e8" />
          <stop offset="40%" stopColor="#ffffff" />
          <stop offset="70%" stopColor="#b0b8c8" />
          <stop offset="100%" stopColor="#8892a0" />
        </linearGradient>
        <linearGradient id="wt" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#d0d8e8" />
          <stop offset="100%" stopColor="#8892a0" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="115" r="62" stroke="url(#wl)" strokeWidth="3.5" />
      <circle cx="100" cy="115" r="54" stroke="url(#wl)" strokeWidth="1.2" strokeDasharray="2 8" strokeLinecap="round" />
      <circle cx="100" cy="47" r="7" stroke="url(#wl)" strokeWidth="3" />
      <line x1="100" y1="53" x2="100" y2="54" stroke="url(#wl)" strokeWidth="3" strokeLinecap="round" />
      <polyline points="68,135 82,118 93,128 112,98" stroke="url(#wl)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="112" y1="98" x2="136" y2="82" stroke="url(#wl)" strokeWidth="3.5" strokeLinecap="round" />
      <polyline points="122,78 136,82 132,95" stroke="url(#wl)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <text x="100" y="200" textAnchor="middle" fontFamily="'Helvetica Neue',Helvetica,Arial,sans-serif" fontSize="22" fontWeight="700" letterSpacing="6" fill="url(#wt)">NEGADRAS</text>
      <text x="100" y="216" textAnchor="middle" fontFamily="'Helvetica Neue',Helvetica,Arial,sans-serif" fontSize="9" fontWeight="400" letterSpacing="4" fill="url(#wt)">GROUP 6</text>
    </svg>
  );
}

export function Welcome({ onStart }: { onStart: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12 animate-in fade-in zoom-in-95 duration-700">
      <div className="space-y-6 max-w-2xl">
        <div className="inline-flex items-center justify-center p-4 bg-theme-surface2 rounded-full border border-theme-border mb-4">
          <NegadrasLogo className="w-16 h-16" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-zinc-100 to-zinc-500">
          {t('app_title')}
        </h1>

        <p className="text-lg text-theme-muted leading-relaxed max-w-xl mx-auto">
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
      className="bg-theme-card border border-theme-border2 p-6 rounded-2xl flex flex-col gap-3 cursor-pointer hover:border-theme-border transition-colors duration-200"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick?.(); }}
    >
      <div className="w-12 h-12 rounded-lg bg-theme-surface2 flex items-center justify-center border border-theme-border">
        {icon}
      </div>
      <h3 className="font-bold text-lg text-theme-text">{title}</h3>
      <p className="text-theme-muted text-sm leading-relaxed">{desc}</p>
    </div>
  )
}
