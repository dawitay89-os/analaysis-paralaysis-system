import React, { useState } from 'react';
import { useTranslation, Language } from '../i18n/context';
import { useStore } from '../store/useStore';
import { Button } from '../components/Button';
import { UserProfile, ExperienceLevel, TradingStyle, Market, AccountType } from '../types';

export function Profile({ onComplete }: { onComplete: () => void }) {
  const { t } = useTranslation();
  const { state, updateProfile } = useStore();

  const [profile, setProfile] = useState<UserProfile>(state.profile || {
    experience: 'Beginner',
    style: 'Day Trading',
    market: 'Forex',
    averageTradesPerWeek: 10,
    strategyRules: 3,
    entryConfirmations: 2,
    accountType: 'Demo',
    accountSize: 1000,
    riskPerTrade: 1,
    name: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(p => ({
      ...p,
      [name]: ['averageTradesPerWeek', 'strategyRules', 'entryConfirmations', 'accountSize', 'riskPerTrade'].includes(name) 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profile);
    onComplete();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{t('profile_setup')}</h1>
        <p className="text-zinc-400">Configure your baseline trading metrics for personalized analysis.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-[#121214] border border-zinc-800 p-6 md:p-8 rounded-xl shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Name (Optional)</label>
            <input 
              name="name" 
              value={profile.name} 
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
              placeholder="Trader 1"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">{t('experience')}</label>
            <select 
              name="experience" 
              value={profile.experience} 
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
            >
              <option value="Beginner">Beginner (&lt;1 year)</option>
              <option value="Intermediate">Intermediate (1-3 years)</option>
              <option value="Advanced">Advanced (&gt;3 years)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">{t('style')}</label>
            <select 
              name="style" 
              value={profile.style} 
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
            >
              <option value="Scalping">Scalping</option>
              <option value="Day Trading">Day Trading</option>
              <option value="Swing Trading">Swing Trading</option>
              <option value="Position Trading">Position Trading</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">{t('market')}</label>
            <select 
              name="market" 
              value={profile.market} 
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
            >
              <option value="Forex">Forex</option>
              <option value="Crypto">Crypto</option>
              <option value="Stocks">Stocks</option>
              <option value="Indices">Indices</option>
              <option value="Commodities">Commodities</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Account Type</label>
            <select 
              name="accountType" 
              value={profile.accountType} 
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
            >
              <option value="Demo">Demo</option>
              <option value="Live">Live</option>
              <option value="Funded">Funded</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Account Size ($)</label>
            <input 
              type="number"
              name="accountSize" 
              value={profile.accountSize || ''} 
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Avg Trades / Week</label>
            <input 
              type="number"
              name="averageTradesPerWeek" 
              value={profile.averageTradesPerWeek || ''} 
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Risk Per Trade (%)</label>
            <input 
              type="number"
              step="0.1"
              name="riskPerTrade" 
              value={profile.riskPerTrade || ''} 
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Strategy Rules Count</label>
            <input 
              type="number"
              name="strategyRules" 
              value={profile.strategyRules || ''} 
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">Required Confirmations</label>
            <input 
              type="number"
              name="entryConfirmations" 
              value={profile.entryConfirmations || ''} 
              onChange={handleChange}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-md py-2 px-3 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

        </div>

        <Button type="submit" className="w-full" size="lg">{t('save_profile')}</Button>
      </form>
    </div>
  );
}
