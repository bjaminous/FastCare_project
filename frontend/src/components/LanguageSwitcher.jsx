import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English',  flag: '🇬🇧' },
  { code: 'ar', label: 'العربية',  flag: '🇸🇦' },
  { code: 'es', label: 'Español',  flag: '🇪🇸' },
  { code: 'pt', label: 'Português',flag: '🇵🇹' },
  { code: 'de', label: 'Deutsch',  flag: '🇩🇪' },
  { code: 'tr', label: 'Türkçe',   flag: '🇹🇷' },
  { code: 'id', label: 'Indonesia',flag: '🇮🇩' },
  { code: 'zh', label: '中文',      flag: '🇨🇳' },
];

const Wrapper = styled.div`position: relative; flex-shrink: 0;`;

const Trigger = styled.button`
  display: flex; align-items: center; gap: 0.4rem;
  background: none; border: 1.5px solid rgba(42,125,225,0.2);
  border-radius: 9999px; padding: 0.3rem 0.75rem;
  cursor: pointer; font-size: 0.82rem; font-weight: 600;
  color: #1e293b; transition: all 0.18s;
  &:hover { background: rgba(42,125,225,0.07); border-color: #2A7DE1; }
`;

const Flag = styled.span`font-size: 1rem;`;

const Dropdown = styled.div`
  position: absolute; top: calc(100% + 8px); right: 0;
  background: white; border-radius: 14px;
  border: 1.5px solid rgba(0,0,0,0.08);
  box-shadow: 0 12px 40px rgba(0,0,0,0.12);
  min-width: 170px; overflow: hidden; z-index: 999;
`;

const LangItem = styled.button`
  display: flex; align-items: center; gap: 0.65rem;
  width: 100%; padding: 0.65rem 1rem;
  background: ${p => p.$active ? 'rgba(42,125,225,0.07)' : 'none'};
  border: none; cursor: pointer; text-align: left;
  font-size: 0.88rem; font-weight: ${p => p.$active ? '700' : '500'};
  color: ${p => p.$active ? '#2A7DE1' : '#374151'};
  transition: background 0.15s;
  &:hover { background: rgba(42,125,225,0.07); }
`;

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const handleSelect = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('fc_lang', code);
    // RTL pour l'arabe
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = code;
    setOpen(false);
  };

  // Appliquer RTL au chargement
  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  // Fermer si clic extérieur
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <Wrapper ref={ref}>
      <Trigger onClick={() => setOpen(o => !o)}>
        <Globe size={14} />
        <Flag>{current.flag}</Flag>
        <span>{current.code.toUpperCase()}</span>
      </Trigger>
      {open && (
        <Dropdown>
          {LANGUAGES.map(l => (
            <LangItem key={l.code} $active={l.code === i18n.language} onClick={() => handleSelect(l.code)}>
              <span style={{ fontSize: '1.1rem' }}>{l.flag}</span>
              <span>{l.label}</span>
            </LangItem>
          ))}
        </Dropdown>
      )}
    </Wrapper>
  );
};

export default LanguageSwitcher;
