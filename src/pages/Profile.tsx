import React, { useState } from 'react';
import { useTranslation, Language } from '../i18n/context';
import { useStore } from '../store/useStore';
import { Button } from '../components/Button';
import { UserProfile, ExperienceLevel, TradingStyle, Market, AccountType } from '../types';

const fieldClass = "w-full bg-theme-surface2 border border-theme-border rounded-md py-2 px-3 text-sm text-theme-text focus:ring-1 focus:ring-theme-accent outline-none transition-colors placeholder:text-theme-muted";
const labelClass = "text-sm font-medium text-theme-text";

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
        <h1 className="text-3xl font-bold tracking-tight text-theme-text">{t('profile_setup')}</h1>
        <p className="text-theme-muted">{t('profile_desc')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-theme-card border border-theme-border p-6 md:p-8 rounded-xl shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className={labelClass}>{t('name_optional')}</label>
            <input
              name="name"
              value={profile.name}
              onChange={handleChange}
              className={fieldClass}
              placeholder="Trader 1"
            />
          </div>

          <div className="space-y-2">
            <label className={labelClass}>{t('experience')}</label>
            <select name="experience" value={profile.experience} onChange={handleChange} className={fieldClass}>
              <option value="Beginner">{t('option_beginner')}</option>
              <option value="Intermediate">{t('option_intermediate')}</option>
              <option value="Advanced">{t('option_advanced')}</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>{t('style')}</label>
            <select name="style" value={profile.style} onChange={handleChange} className={fieldClass}>
              <option value="Scalping">Scalping</option>
              <option value="Day Trading">Day Trading</option>
              <option value="Swing Trading">Swing Trading</option>
              <option value="Position Trading">Position Trading</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>{t('market')}</label>
            <select name="market" value={profile.market} onChange={handleChange} className={fieldClass}>
              <option value="Forex">Forex</option>
              <option value="Crypto">Crypto</option>
              <option value="Stocks">Stocks</option>
              <option value="Indices">Indices</option>
              <option value="Commodities">Commodities</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>{t('account_type')}</label>
            <select name="accountType" value={profile.accountType} onChange={handleChange} className={fieldClass}>
              <option value="Demo">Demo</option>
              <option value="Live">Live</option>
              <option value="Funded">Funded</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className={labelClass}>{t('account_size')}</label>
            <input type="number" name="accountSize" value={profile.accountSize || ''} onChange={handleChange} className={fieldClass} />
          </div>

          <div className="space-y-2">
            <label className={labelClass}>{t('avg_trades')}</label>
            <input type="number" name="averageTradesPerWeek" value={profile.averageTradesPerWeek || ''} onChange={handleChange} className={fieldClass} />
          </div>

          <div className="space-y-2">
            <label className={labelClass}>{t('risk_per_trade')}</label>
            <input type="number" step="0.1" name="riskPerTrade" value={profile.riskPerTrade || ''} onChange={handleChange} className={fieldClass} />
          </div>

          <div className="space-y-2">
            <label className={labelClass}>{t('strategy_rules')}</label>
            <input type="number" name="strategyRules" value={profile.strategyRules || ''} onChange={handleChange} className={fieldClass} />
          </div>

          <div className="space-y-2">
            <label className={labelClass}>{t('required_confirmations')}</label>
            <input type="number" name="entryConfirmations" value={profile.entryConfirmations || ''} onChange={handleChange} className={fieldClass} />
          </div>
        </div>

        <Button type="submit" className="w-full" size="lg">{t('save_profile')}</Button>
      </form>
    </div>
  );
}
