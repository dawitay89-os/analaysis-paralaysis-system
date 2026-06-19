import React, { createContext, useContext, useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

export type Language = 'en' | 'am' | 'om' | 'ti' | 'so' | 'aa';

type Translations = Record<string, string>;

const dictionaries: Record<Language, Translations> = {
  en: {
    app_title: "Trader Psychology Intelligence & Coach",
    welcome_text: "Identify, measure, and improve psychological weaknesses affecting your trading performance.",
    start_setup: "Start Profile Setup",
    profile_setup: "User Profile Setup",
    // Adding more terms gently
    experience: "Trading Experience",
    style: "Trading Style",
    market: "Market",
    save_profile: "Save Profile",
    take_assessment: "Take Weekly Assessment",
    dashboard: "Dashboard",
    reports: "Reports",
  },
  am: {
    app_title: "የትሬዲንግ ሳይኮሎጂ እና አሰልጣኝ",
    welcome_text: "በትሬዲንግ ላይ ተጽእኖ የሚያሳድሩ የስነ-ልቦና ድክመቶችን ይለዩ፣ ይለኩ እና ያሻሽሉ።",
    start_setup: "ፕሮፋይል ጀምር",
    profile_setup: "የተጠቃሚ ፕሮፋይል",
    experience: "የትሬዲንግ ልምድ",
    style: "የትሬዲንግ ስልት",
    market: "ገበያ",
    save_profile: "ፕሮፋይሉን አስቀምጥ",
    take_assessment: "ሳምንታዊ ግምገማ ውሰድ",
    dashboard: "ዳሽቦርድ",
    reports: "ሪፖርቶች",
  },
  om: {
    app_title: "Barnoota Xiinsammuu Trading",
    welcome_text: "Dadhabina xiinsammuu trading kee irratti dhiibbaa uumu adda baasi, safari, fi fooyyessi.",
    start_setup: "Profile Jalqabi",
    profile_setup: "Profile Fayyadamaa",
    experience: "Muuxannoo Trading",
    style: "Akkaataa Trading",
    market: "Gabaa",
    save_profile: "Profile Olkahi",
    take_assessment: "Madaallii Torbee Fudhadhu",
    dashboard: "Dashboard",
    reports: "Gabaasota",
  },
  ti: {
    app_title: "ናይ ትሬዲንግ ስነ-አእምሮን ኣሰልጣኒን",
    welcome_text: "ኣብ ትሬዲንግካ ጽልዋ ዝገብሩ ናይ ስነ-አእምሮ ድኻማት ኣለሊ፣ መዝን፣ ከምኡ’ውን ኣመሓይሽ።",
    start_setup: "ፕሮፋይል ጀምር",
    profile_setup: "ፕሮፋይል ተጠቃሚ",
    experience: "ተመክሮ ትሬዲንግ",
    style: "ቅዲ ትሬዲንግ",
    market: "ዕዳጋ",
    save_profile: "ፕሮፋይል ኣቐምጥ",
    take_assessment: "ሰሙናዊ ገምጋም ውሰድ",
    dashboard: "ዳሽቦርድ",
    reports: "ጸብጻባት",
  },
  so: {
    app_title: "Tababaraha Cilmi-nafsiga Trading-ka",
    welcome_text: "Aqoonso, cabbir, oo horumari daciifnimada cilmi-nafsiga ee saameeya waxqabadkaaga trading-ka.",
    start_setup: "Bilaaw Profile-ka",
    profile_setup: "Dejinta Profile-ka Isticmaalaha",
    experience: "Waayo-aragnimada Trading-ka",
    style: "Qaabka Trading-ka",
    market: "Suuqa",
    save_profile: "Kaydi Profile-ka",
    take_assessment: "Qaado Qiimeynta Toddobaadlaha ah",
    dashboard: "Dashboodhka",
    reports: "Warbixinada",
  },
  aa: {
    app_title: "Trading Macaashka & Tababaraha",
    welcome_text: "Baraf, madaal, fi gexisi macaashka trading kee.",
    start_setup: "Profile qabo",
    profile_setup: "Profile User",
    experience: "Trading xaalada",
    style: "Trading akah",
    market: "Boso",
    save_profile: "Profile dac",
    take_assessment: "Madaallii fudhadhu",
    dashboard: "Dashboard",
    reports: "Report",
  }
};

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { state, setLanguage: setStoreLang } = useStore();
  const [language, setLanguageState] = useState<Language>((state.language as Language) || 'en');

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    setStoreLang(lang);
  };

  useEffect(() => {
    if (state.language && state.language !== language) {
      setLanguageState(state.language as Language);
    }
  }, [state.language]);

  const t = (key: string, variables?: Record<string, string>) => {
    const dict = dictionaries[language] || dictionaries['en'];
    let text = dict[key] || dictionaries['en'][key] || key;
    
    if (variables) {
      Object.keys(variables).forEach(vKey => {
        text = text.replace(`{{${vKey}}}`, variables[vKey]);
      });
    }
    return text;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a I18nProvider');
  }
  return context;
}

export const LANGUAGES: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'am', name: 'አማርኛ' },
  { code: 'om', name: 'Afaan Oromo' },
  { code: 'ti', name: 'ትግርኛ' },
  { code: 'so', name: 'Af-Soomaali' },
  { code: 'aa', name: 'Qafar Af' },
];
