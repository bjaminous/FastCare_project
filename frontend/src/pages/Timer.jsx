import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
const API = 'http://localhost:5000/api';
const authHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('fc_token')}` } });
import styled, { keyframes } from 'styled-components';
import { Play, Pause, RotateCcw, Droplets, X, Check, PartyPopper } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import AppNav from '../components/AppNav';
import { useFasting, FASTING_TYPES, CUSTOM_OPTIONS } from '../context/FastingContext';

const TimerContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #2A7DE1 0%, #2ED1A2 100%);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 2rem;
  @media (max-width: 480px) { padding: 1rem; justify-content: flex-start; padding-top: 2rem; }
`;

const TimerCard = styled(Card)`
  width: 100%; max-width: 760px;
  padding: 3rem 2rem; text-align: center;
  background: rgba(255,255,255,0.95); backdrop-filter: blur(10px);
  @media (max-width: 768px) { padding: 2rem 1.5rem; }
  @media (max-width: 480px) { padding: 1.5rem 1rem; }
`;

const Title = styled.h2`
  font-size: clamp(1.6rem, 5vw, 2.5rem); font-weight: 700;
  color: #1e293b; margin-bottom: 1rem;
`;
const Subtitle = styled.p`color: #64748b; margin-bottom: 2rem;`;

const TimerDisplay = styled.div`
  font-size: clamp(2.5rem, 8vw, 4rem); font-weight: 700;
  color: #2A7DE1; margin-bottom: 2rem;
  font-family: 'Courier New', monospace;
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const confettiFall = keyframes`
  0%   { transform: translateY(-20px) rotate(0deg);   opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
`;
const scaleIn = keyframes`
  from { opacity:0; transform:scale(0.7); }
  to   { opacity:1; transform:scale(1);   }
`;

const ConfettiPiece = styled.div`
  position: fixed; top: -20px; width: ${p => p.$w}px; height: ${p => p.$h}px;
  left: ${p => p.$left}%;
  background: ${p => p.$color};
  border-radius: ${p => p.$round ? '50%' : '2px'};
  animation: ${confettiFall} ${p => p.$dur}s ease-in ${p => p.$delay}s both;
  z-index: 9999; pointer-events: none;
`;
const CelebrationBanner = styled.div`
  background: linear-gradient(135deg, rgba(46,209,162,0.12), rgba(42,125,225,0.1));
  border: 2px solid rgba(46,209,162,0.35);
  border-radius: 18px; padding: 1.25rem 1.5rem;
  text-align: center; margin-bottom: 1.5rem;
  animation: ${scaleIn} 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
`;
const CelebTitle = styled.div`
  font-size: 1.2rem; font-weight: 900; color: #059669; margin-bottom: 0.3rem;
`;
const CelebSub = styled.div`font-size: 0.85rem; color: #64748b; font-weight: 600;`;

const CONFETTI_COLORS = ['#2A7DE1','#2ED1A2','#F59E0B','#EF4444','#8B5CF6','#EC4899','#06B6D4'];
const confettiPieces = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  left:  Math.random() * 100,
  w:     6 + Math.random() * 8,
  h:     10 + Math.random() * 14,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  dur:   2.5 + Math.random() * 2,
  delay: Math.random() * 1.2,
  round: Math.random() > 0.6,
}));

const TimerType = styled.div`
  display: flex; gap: 1rem; justify-content: center;
  margin-bottom: 2rem; flex-wrap: wrap;
`;
const TypeButton = styled(Button)`
  ${p => p.active && `background-color: ${p.theme.colors.primary}; color: white;`}
`;

/* ── Modale custom ── */
const Overlay = styled.div`
  position: fixed; inset: 0; z-index: 500;
  background: rgba(15,23,42,0.5); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center; padding: 1.5rem;
  animation: ${fadeInUp} 0.2s ease both;
`;
const ModalBox = styled.div`
  background: white; border-radius: 24px; padding: 2rem;
  max-width: 480px; width: 100%;
  box-shadow: 0 32px 80px -12px rgba(0,0,0,0.22);
  position: relative; max-height: 90vh; overflow-y: auto;
  animation: ${fadeInUp} 0.22s ease both;
`;
const ModalTitle = styled.h2`
  font-size: 1.2rem; font-weight: 900; color: #0F172A;
  margin-bottom: 0.35rem; letter-spacing: -0.02em;
`;
const ModalSub = styled.p`font-size: 0.83rem; color: #64748b; margin-bottom: 1.5rem;`;
const ModalClose = styled.button`
  position: absolute; top: 1rem; right: 1rem;
  background: #F1F5F9; border: none; border-radius: 9999px;
  width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #64748b;
  &:hover { background: #E2E8F0; }
`;
const OptionList = styled.div`display: flex; flex-direction: column; gap: 0.6rem;`;
const OptionRow = styled.button`
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  background: ${p => p.selected ? 'rgba(42,125,225,0.07)' : 'white'};
  border: 2px solid ${p => p.selected ? '#2A7DE1' : 'rgba(42,125,225,0.12)'};
  border-radius: 14px; padding: 0.85rem 1rem; cursor: pointer; text-align: left;
  transition: all 0.18s; width: 100%;
  &:hover { border-color: #2A7DE1; background: rgba(42,125,225,0.05); }
`;
const OptionLeft = styled.div``;
const OptionName = styled.div`font-size: 1rem; font-weight: 800; color: #0F172A;`;
const OptionDesc = styled.div`font-size: 0.75rem; color: #64748b; margin-top: 0.15rem; line-height: 1.5;`;
const OptionBadge = styled.div`
  font-size: 0.65rem; font-weight: 700; padding: 0.2rem 0.6rem;
  background: rgba(42,125,225,0.1); color: #2A7DE1;
  border-radius: 9999px; white-space: nowrap; flex-shrink: 0;
`;
const ConfirmBtn = styled.button`
  width: 100%; margin-top: 1.25rem;
  background: linear-gradient(135deg,#2A7DE1,#2ED1A2);
  color: white; border: none; border-radius: 12px;
  padding: 0.85rem; font-size: 0.95rem; font-weight: 800;
  cursor: pointer; transition: opacity 0.2s;
  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.4; cursor: default; }
`;

const Controls = styled.div`
  display: flex; gap: 1rem; justify-content: center; margin-bottom: 2rem;
`;

const ProgressRingWrapper = styled.div`
  width: 100%; max-width: 260px; margin: 0 auto 2rem;
`;
const ProgressRing = styled.svg`transform: rotate(-90deg); width: 100%; height: auto;`;
const ProgressCircle = styled.circle`transition: stroke-dashoffset 0.5s ease;`;

const InfoSection = styled.div`
  background: #f8fafc; border-radius: 0.75rem;
  padding: 1.5rem; margin-top: 2rem;
`;
const InfoTitle = styled.h4`
  color: #374151; font-weight: 600; margin-bottom: 1rem;
  display: flex; align-items: center; gap: 0.5rem;
`;
const InfoList = styled.ul`
  list-style: none; color: #64748b; line-height: 1.6;
  li { margin-bottom: 0.5rem; padding-left: 1rem; position: relative;
    &::before { content: '•'; position: absolute; left: 0; color: #2A7DE1; } }
`;

const formatTime = (seconds) => {
  const s = Math.max(0, seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
};

const Timer = () => {
  const { isRunning, isCompleted, fastingType, targetSeconds, hasSession, getElapsed, start, pause, resume, reset, finalize, changeType } = useFasting();
  const { t } = useTranslation();
  const [elapsed, setElapsed] = useState(() => getElapsed());
  const rafRef = useRef(null);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [selectedCustom, setSelectedCustom] = useState(null);
  const lastHydraHour = useRef(0);

  const sendHydraNotif = useCallback(async (hour) => {
    try {
      // Appel au nouvel endpoint dédié : crée la notif in-app ET envoie l'email
      const res = await axios.post(`${API}/notifications/water-reminder`, { hour }, authHeader());
      const conseil = res.data?.conseil || "Buvez un grand verre d'eau pour rester bien hydraté(e).";
      // Notification système navigateur
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('FastCare 💧', {
          body: `${hour}h de jeûne — ${conseil}`,
          icon: '/favicon.ico',
        });
      }
    } catch { /* silencieux */ }
  }, []);

  // Tick via requestAnimationFrame — continue même si on revient sur la page
  useEffect(() => {
    const tick = () => {
      setElapsed(getElapsed());
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [getElapsed]);

  // Rappel hydratation toutes les 2h de jeûne actif
  useEffect(() => {
    if (!isRunning) return;
    const currentHour = Math.floor(elapsed / 3600);
    if (currentHour >= 2 && currentHour % 2 === 0 && currentHour !== lastHydraHour.current) {
      lastHydraHour.current = currentHour;
      sendHydraNotif(currentHour);
    }
  }, [elapsed, isRunning, sendHydraNotif]);

  // Fin de jeûne naturelle → sauvegarde backend + notification
  useEffect(() => {
    if (elapsed >= targetSeconds && targetSeconds > 0 && isRunning) {
      finalize();
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('FastCare', { body: 'Bravo ! Votre jeûne est terminé 🎉', icon: '/favicon.ico' });
      }
    }
  }, [elapsed, targetSeconds, isRunning, finalize]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const timeLeft   = Math.max(0, targetSeconds - elapsed);
  const progress   = targetSeconds > 0 ? Math.min((elapsed / targetSeconds) * 100, 100) : 0;
  const circumference    = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const handleToggle = () => {
    if (!hasSession) { start(fastingType); return; }
    if (isRunning) pause(); else resume();
  };

  const handleReset = () => reset();

  const handleTypeChange = (type) => {
    if (type === 'custom') { setShowCustomModal(true); return; }
    if (isRunning) pause();
    changeType(type);
  };

  const handleConfirmCustom = () => {
    if (!selectedCustom) return;
    if (isRunning) pause();
    changeType('custom', selectedCustom.hours);
    setShowCustomModal(false);
    setSelectedCustom(null);
  };

  return (
    <>
      <AppNav />
      <TimerContainer>
        <TimerCard>
          <Title>Timer de Jeûne</Title>
          <Subtitle>Suivez votre temps de jeûne en temps réel</Subtitle>

          <TimerType>
            {Object.entries(FASTING_TYPES).map(([key, val]) => (
              <TypeButton key={key}
                variant={fastingType === key ? 'primary' : 'outline'}
                active={fastingType === key}
                onClick={() => handleTypeChange(key)}>
                {val.name}
              </TypeButton>
            ))}
          </TimerType>

          <ProgressRingWrapper>
            <ProgressRing viewBox="0 0 260 260">
              <ProgressCircle cx="130" cy="130" r="120" stroke="#e2e8f0" strokeWidth="8" fill="none" />
              <ProgressCircle cx="130" cy="130" r="120" stroke="#2A7DE1" strokeWidth="8" fill="none"
                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" />
            </ProgressRing>
          </ProgressRingWrapper>

          <TimerDisplay>{formatTime(timeLeft)}</TimerDisplay>

          {isCompleted && (
            <>
              {/* Confettis */}
              {confettiPieces.map(p => (
                <ConfettiPiece key={p.id}
                  $left={p.left} $w={p.w} $h={p.h}
                  $color={p.color} $dur={p.dur} $delay={p.delay} $round={p.round}
                />
              ))}
              <CelebrationBanner>
                <CelebTitle><PartyPopper size={20} style={{ marginRight:6, verticalAlign:'middle' }}/>{t('timer.celebration.title')}</CelebTitle>
                <CelebSub>{t('timer.celebration.subtitle')}</CelebSub>
              </CelebrationBanner>
            </>
          )}

          <Controls>
            {!isCompleted && (
              <Button variant={isRunning ? 'secondary' : 'primary'} size="large" onClick={handleToggle}>
                {isRunning ? <Pause size={24} /> : <Play size={24} />}
                {isRunning ? t('timer.pause') : hasSession ? t('timer.resume') : t('timer.start')}
              </Button>
            )}
            <Button variant="outline" size="large" onClick={handleReset}>
              <RotateCcw size={24} /> {isCompleted ? t('timer.newFast') : t('timer.reset')}
            </Button>
          </Controls>

          <InfoSection>
            <InfoTitle><Droplets size={20} /> {t('timer.infoTitle')}</InfoTitle>
            <InfoList>
              <li>{t('timer.infos.water')}</li>
              <li>Ajoutez un peu de sel pour maintenir l'équilibre électrolytique</li>
              <li>{t('timer.infos.avoid')}</li>
              <li>{t('timer.infos.listen')}</li>
            </InfoList>
          </InfoSection>
        </TimerCard>
      </TimerContainer>

      {showCustomModal && (
        <Overlay onClick={() => setShowCustomModal(false)}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalClose onClick={() => setShowCustomModal(false)}><X size={14} /></ModalClose>
            <ModalTitle>Choisissez votre durée de jeûne</ModalTitle>
            <ModalSub>Sélectionnez le protocole qui correspond à votre niveau et vos objectifs.</ModalSub>
            <OptionList>
              {CUSTOM_OPTIONS.map(opt => (
                <OptionRow key={opt.key}
                  selected={selectedCustom?.key === opt.key}
                  onClick={() => setSelectedCustom(opt)}>
                  <OptionLeft>
                    <OptionName>{opt.name} — {opt.hours}h</OptionName>
                    <OptionDesc>{opt.desc}</OptionDesc>
                  </OptionLeft>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                    <OptionBadge>{opt.label}</OptionBadge>
                    {selectedCustom?.key === opt.key && <Check size={16} color="#2A7DE1" />}
                  </div>
                </OptionRow>
              ))}
            </OptionList>
            <ConfirmBtn disabled={!selectedCustom} onClick={handleConfirmCustom}>
              Confirmer — {selectedCustom ? `${selectedCustom.name} (${selectedCustom.hours}h)` : 'Choisissez un protocole'}
            </ConfirmBtn>
          </ModalBox>
        </Overlay>
      )}
    </>
  );
};

export default Timer;
