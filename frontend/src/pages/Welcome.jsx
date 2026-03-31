import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { CheckCircle, ArrowRight, Edit3, Heart, Scale, Brain } from 'lucide-react';
import FastCareLogo from '../components/Logo';

/* ─── Animations ─────────────────────────────────────────────────────────────── */
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-10px); }
`;
const confettiFall = keyframes`
  0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
`;
const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(42,125,225,0.3); }
  50%       { box-shadow: 0 0 0 12px rgba(42,125,225,0); }
`;

/* ─── Confettis ───────────────────────────────────────────────────────────────── */
const COLORS = ['#2A7DE1','#2ED1A2','#F59E0B','#EF4444','#8B5CF6','#EC4899','#06B6D4'];
const pieces = Array.from({ length: 50 }, (_, i) => ({
  id: i, left: Math.random() * 100,
  w: 6 + Math.random() * 8, h: 10 + Math.random() * 14,
  color: COLORS[i % COLORS.length],
  dur: 2.5 + Math.random() * 2,
  delay: Math.random() * 1.5,
  round: Math.random() > 0.6,
}));

const ConfettiPiece = styled.div`
  position: fixed; top: -20px;
  width: ${p => p.$w}px; height: ${p => p.$h}px;
  left: ${p => p.$left}%; background: ${p => p.$color};
  border-radius: ${p => p.$round ? '50%' : '3px'};
  animation: ${confettiFall} ${p => p.$dur}s ease-in ${p => p.$delay}s both;
  z-index: 0; pointer-events: none;
`;

/* ─── Layout ──────────────────────────────────────────────────────────────────── */
const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0F172A 0%, #1E3A5F 55%, #0F4C3A 100%);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 2rem; overflow: hidden; position: relative;
`;
const Orb = styled.div`
  position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none;
  &.a { width:500px;height:500px;background:rgba(42,125,225,0.18);top:-200px;left:-150px; }
  &.b { width:400px;height:400px;background:rgba(46,209,162,0.15);bottom:-150px;right:-100px; }
  &.c { width:300px;height:300px;background:rgba(139,92,246,0.1);top:50%;left:50%;transform:translate(-50%,-50%); }
`;
const Card = styled.div`
  position: relative; z-index: 1;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  backdrop-filter: blur(20px);
  border-radius: 32px; padding: 3rem 2.5rem;
  max-width: 500px; width: 100%; text-align: center;
  box-shadow: 0 40px 80px rgba(0,0,0,0.4);
  animation: ${fadeInUp} 0.5s ease both;
  @media (max-width: 480px) { padding: 2rem 1.5rem; border-radius: 24px; }
`;
const LogoWrap = styled.div`
  display: flex; justify-content: center; margin-bottom: 1.5rem;
`;
const EmojiBox = styled.div`
  font-size: 4rem; margin-bottom: 1.25rem;
  display: inline-block; animation: ${float} 3s ease-in-out infinite;
`;
const Title = styled.h1`
  font-size: clamp(1.7rem, 5vw, 2.3rem); font-weight: 900; color: white;
  letter-spacing: -0.03em; line-height: 1.2; margin-bottom: 0.75rem;
  span { background: linear-gradient(90deg,#60A5FA,#2ED1A2);
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text; }
`;
const Sub = styled.p`
  font-size: 0.97rem; color: rgba(255,255,255,0.6); line-height: 1.7; margin-bottom: 2rem;
`;

/* ─── Boutons ─────────────────────────────────────────────────────────────────── */
const BtnPrimary = styled.button`
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  background: linear-gradient(135deg, #2A7DE1, #2ED1A2);
  color: white; border: none; border-radius: 14px;
  padding: 0.9rem 2rem; font-size: 1rem; font-weight: 800;
  cursor: pointer; width: 100%; transition: all 0.2s;
  animation: ${pulse} 2s ease-in-out infinite;
  &:hover { opacity: 0.92; transform: translateY(-2px); }
`;
const BtnRow = styled.div`display: flex; gap: 0.85rem; width: 100%;`;
const BtnYes = styled.button`
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  background: linear-gradient(135deg,#2A7DE1,#2ED1A2); color: white;
  border: none; border-radius: 14px; padding: 0.9rem 1.5rem;
  font-size: 0.95rem; font-weight: 800; cursor: pointer; transition: all 0.2s;
  &:hover { opacity: 0.9; transform: translateY(-2px); }
`;
const BtnNo = styled.button`
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem;
  background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.75);
  border: 1.5px solid rgba(255,255,255,0.15); border-radius: 14px;
  padding: 0.9rem 1.5rem; font-size: 0.95rem; font-weight: 700;
  cursor: pointer; transition: all 0.2s;
  &:hover { background: rgba(255,255,255,0.12); transform: translateY(-2px); }
`;

/* ─── Carte de confirmation ───────────────────────────────────────────────────── */
const InfoCard = styled.div`
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12);
  border-radius: 18px; padding: 1.25rem 1.5rem; margin-bottom: 1.75rem;
  display: flex; flex-direction: column; gap: 0.75rem; text-align: left;
`;
const InfoRow = styled.div`
  display: flex; align-items: center; justify-content: space-between;
`;
const InfoLabel = styled.span`font-size: 0.82rem; color: rgba(255,255,255,0.5); font-weight: 600;`;
const InfoValue = styled.span`font-size: 1rem; color: white; font-weight: 800;`;

/* ─── Carte recommandation ────────────────────────────────────────────────────── */
const RecoCard = styled.div`
  background: rgba(255,255,255,0.06);
  border: 1.5px solid ${p => p.$borderColor || 'rgba(255,255,255,0.15)'};
  border-radius: 20px; padding: 1.5rem; margin-bottom: 1.5rem; text-align: left;
`;
const RecoHeader = styled.div`display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem;`;
const IconBox = styled.div`
  width: 54px; height: 54px; border-radius: 16px; flex-shrink: 0;
  background: ${p => p.$bg}; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 8px 20px -6px ${p => p.$shadow};
`;
const RecoTitle = styled.div`font-size: 1.1rem; font-weight: 900; color: white;`;
const RecoBadge = styled.div`
  display: inline-flex; align-items: center; gap: 0.3rem;
  background: ${p => p.$bg}; color: ${p => p.$color};
  border: 1px solid ${p => p.$border}; border-radius: 9999px;
  padding: 0.2rem 0.75rem; font-size: 0.75rem; font-weight: 700;
  margin-top: 0.3rem;
`;
const RecoDesc = styled.p`font-size: 0.88rem; color: rgba(255,255,255,0.65); line-height: 1.65;`;
const RecoNote = styled.p`
  font-size: 0.8rem; color: rgba(255,255,255,0.4); line-height: 1.6;
  margin-top: 1.25rem; border-top: 1px solid rgba(255,255,255,0.07);
  padding-top: 1rem; font-style: italic;
`;

/* ─── Logique de recommandation ───────────────────────────────────────────────── */
const GOALS_META = {
  'health': {
    label: 'Santé & Vitalité', emoji: '❤️', Icon: Heart,
    bg: 'linear-gradient(135deg,#EF4444,#F97316)', shadow: 'rgba(239,68,68,0.4)',
    badgeBg: 'rgba(239,68,68,0.12)', badgeColor: '#EF4444', badgeBorder: 'rgba(239,68,68,0.25)',
    desc: 'Booster votre énergie, réduire l\'inflammation et améliorer votre bien-être global. Un protocole équilibré et progressif, idéal pour votre profil.',
  },
  'weight-loss': {
    label: 'Perte de Poids', emoji: '⚖️', Icon: Scale,
    bg: 'linear-gradient(135deg,#3B82F6,#8B5CF6)', shadow: 'rgba(59,130,246,0.4)',
    badgeBg: 'rgba(59,130,246,0.12)', badgeColor: '#3B82F6', badgeBorder: 'rgba(59,130,246,0.25)',
    desc: 'Un déficit calorique naturel, sans régime strict, pour des résultats durables. Le jeûne intermittent vous aidera à atteindre votre objectif de manière saine.',
  },
  'learning': {
    label: 'Découverte & Apprentissage', emoji: '🌱', Icon: Brain,
    bg: 'linear-gradient(135deg,#2ED1A2,#06B6D4)', shadow: 'rgba(46,209,162,0.4)',
    badgeBg: 'rgba(46,209,162,0.12)', badgeColor: '#059669', badgeBorder: 'rgba(46,209,162,0.25)',
    desc: 'Débutez en douceur avec des protocoles progressifs et un accompagnement bienveillant. Le jeûne doux, idéal pour prendre soin de vous à votre rythme.',
  },
};

// Catégories IMC
function getIMC(poids, taille) {
  if (!poids || !taille) return null;
  return poids / ((taille / 100) ** 2);
}

function getIMCCategory(imc) {
  if (imc === null) return null;
  if (imc < 18.5) return 'underweight';
  if (imc < 25)   return 'normal';
  if (imc < 30)   return 'overweight';
  return 'obese';
}

function getIMCLabel(imc) {
  if (imc === null) return null;
  if (imc < 18.5) return `${imc.toFixed(1)} — Sous-poids`;
  if (imc < 25)   return `${imc.toFixed(1)} — Normal`;
  if (imc < 30)   return `${imc.toFixed(1)} — Surpoids`;
  return `${imc.toFixed(1)} — Obésité`;
}

function getIMCColor(imc) {
  if (imc === null) return '#64748b';
  if (imc < 18.5) return '#3B82F6';
  if (imc < 25)   return '#10B981';
  if (imc < 30)   return '#F59E0B';
  return '#EF4444';
}

function getRecommendation(dateNaissance, poids, taille) {
  const age = dateNaissance
    ? Math.floor((Date.now() - new Date(dateNaissance)) / (365.25 * 24 * 3600 * 1000))
    : null;
  const imc = getIMC(Number(poids) || null, Number(taille) || null);
  const cat = getIMCCategory(imc);

  // Âge prioritaire
  if (age !== null && (age < 18 || age > 65)) return 'learning';

  // IMC si disponible
  if (cat === 'overweight' || cat === 'obese') return 'weight-loss';
  if (cat === 'underweight' || cat === 'normal') return 'health';

  // Fallback poids seul
  if (!taille && poids && Number(poids) > 85) return 'weight-loss';
  return 'health';
}

function calcAge(dateNaissance) {
  if (!dateNaissance) return null;
  return Math.floor((Date.now() - new Date(dateNaissance)) / (365.25 * 24 * 3600 * 1000));
}

/* ─── Composant ───────────────────────────────────────────────────────────────── */
const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState('welcome'); // 'welcome' | 'confirm' | 'reco'

  const prenom    = user?.prenom || user?.nom || '';
  const age       = calcAge(user?.dateNaissance);
  const poids     = user?.poidsInitial ? Number(user.poidsInitial) : null;
  const taille    = user?.taille ? Number(user.taille) : null;
  const imc       = getIMC(poids, taille);
  const imcLabel  = getIMCLabel(imc);
  const imcColor  = getIMCColor(imc);
  const recoId    = getRecommendation(user?.dateNaissance, user?.poidsInitial, user?.taille);
  const reco      = GOALS_META[recoId];
  const GoalIcon  = reco.Icon;

  const hasProfile = age !== null || poids !== null || taille !== null;

  const handleStart = () => {
    // S'il n'a pas renseigné age/poids, on va directement à la sélection manuelle
    if (!hasProfile) { navigate('/goal-selection'); return; }
    setStep('confirm');
  };

  const handleYes  = () => setStep('reco');
  const handleNo   = () => navigate('/mon-espace');
  const handleGo   = () => navigate(`/goal/${recoId}`);
  const handleChange = () => navigate('/goal-selection');

  /* ── Étape 1 : Bienvenue ────────────────────────────────────────────────────── */
  if (step === 'welcome') return (
    <Page>
      <Orb className="a" /><Orb className="b" /><Orb className="c" />
      {pieces.map(p => (
        <ConfettiPiece key={p.id} $left={p.left} $w={p.w} $h={p.h}
          $color={p.color} $dur={p.dur} $delay={p.delay} $round={p.round} />
      ))}
      <Card>
        <LogoWrap><FastCareLogo visibleWidth={130} /></LogoWrap>
        <EmojiBox>🎉</EmojiBox>
        <Title>
          Bonjour{prenom ? <>, <span>{prenom}</span></> : ''} !<br />
          Bienvenu{prenom ? 'e' : ''} sur FastCare
        </Title>
        <Sub>
          Votre compte est créé. Avant de commencer, laissez-nous personnaliser votre expérience selon votre profil.
        </Sub>
        <BtnPrimary onClick={handleStart}>
          Personnaliser mon parcours <ArrowRight size={18} />
        </BtnPrimary>
      </Card>
    </Page>
  );

  /* ── Étape 2 : Confirmation profil ─────────────────────────────────────────── */
  if (step === 'confirm') return (
    <Page>
      <Orb className="a" /><Orb className="b" />
      <Card>
        <LogoWrap><FastCareLogo visibleWidth={130} /></LogoWrap>
        <EmojiBox style={{ fontSize: '3rem', animation: 'none' }}>🧾</EmojiBox>
        <Title style={{ fontSize: 'clamp(1.4rem,4vw,1.9rem)' }}>
          D'après vos informations
        </Title>
        <Sub style={{ marginBottom: '1.25rem' }}>
          Voici ce que vous nous avez indiqué lors de votre inscription. Est-ce correct ?
        </Sub>

        <InfoCard>
          {prenom && (
            <InfoRow>
              <InfoLabel>👤 Prénom</InfoLabel>
              <InfoValue>{prenom}</InfoValue>
            </InfoRow>
          )}
          {age !== null && (
            <InfoRow>
              <InfoLabel>🎂 Âge</InfoLabel>
              <InfoValue>{age} ans</InfoValue>
            </InfoRow>
          )}
          {poids !== null && (
            <InfoRow>
              <InfoLabel>⚖️ Poids</InfoLabel>
              <InfoValue>{poids} kg</InfoValue>
            </InfoRow>
          )}
          {taille !== null && (
            <InfoRow>
              <InfoLabel>📏 Taille</InfoLabel>
              <InfoValue>{taille} cm</InfoValue>
            </InfoRow>
          )}
          {imc !== null && (
            <InfoRow>
              <InfoLabel>📊 IMC</InfoLabel>
              <InfoValue style={{ color: imcColor }}>{imcLabel}</InfoValue>
            </InfoRow>
          )}
        </InfoCard>

        <BtnRow>
          <BtnNo onClick={handleNo}>
            <Edit3 size={16} /> Non, modifier
          </BtnNo>
          <BtnYes onClick={handleYes}>
            <CheckCircle size={16} /> Oui, c'est correct
          </BtnYes>
        </BtnRow>
      </Card>
    </Page>
  );

  /* ── Étape 3 : Recommandation ───────────────────────────────────────────────── */
  return (
    <Page>
      <Orb className="a" /><Orb className="b" />
      <Card>
        <LogoWrap><FastCareLogo visibleWidth={130} /></LogoWrap>
        <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>✨</div>
        <Title style={{ fontSize: 'clamp(1.35rem,4vw,1.8rem)', marginBottom: '0.5rem' }}>
          Notre recommandation<br />pour <span>{prenom || 'vous'}</span>
        </Title>
        <Sub style={{ fontSize: '0.88rem', marginBottom: '1.25rem' }}>
          D'après votre profil{age ? ` (${age} ans` : ''}
          {poids ? ` · ${poids} kg` : ''}
          {taille ? ` · ${taille} cm` : ''}
          {imc ? ` · IMC ` : ''}{imc ? <span style={{ color: imcColor, fontWeight: 700 }}>{imc.toFixed(1)}</span> : ''}
          {age || poids || taille ? ')' : ''}, voici le type de jeûne que nous vous conseillons.
        </Sub>

        <RecoCard $borderColor={`${reco.badgeColor}44`}>
          <RecoHeader>
            <IconBox $bg={reco.bg} $shadow={reco.shadow}>
              <GoalIcon size={24} color="white" />
            </IconBox>
            <div>
              <RecoTitle>{reco.label}</RecoTitle>
              <RecoBadge $bg={reco.badgeBg} $color={reco.badgeColor} $border={reco.badgeBorder}>
                ⭐ Recommandé pour votre profil
              </RecoBadge>
            </div>
          </RecoHeader>
          <RecoDesc>{reco.desc}</RecoDesc>
          <RecoNote>
            Nous sommes là pour vous accompagner à jeûner de manière saine et responsable.
            N'hésitez pas à changer d'objectif si ce jeûne ne vous convient pas — vous pourrez le faire à tout moment depuis <strong style={{ color: 'rgba(255,255,255,0.6)' }}>Mon Espace</strong>.
          </RecoNote>
        </RecoCard>

        <BtnPrimary onClick={handleGo} style={{ marginBottom: '0.75rem' }}>
          Commencer avec {reco.label} <ArrowRight size={18} />
        </BtnPrimary>
        <button onClick={handleChange} style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.45)',
          fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline',
        }}>
          Voir tous les objectifs et choisir moi-même
        </button>
      </Card>
    </Page>
  );
};

export default Welcome;
