import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useAuth } from '../context/AuthContext';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const scaleIn = keyframes`
  from { opacity: 0; transform: scale(0.6); }
  to   { opacity: 1; transform: scale(1); }
`;
const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50%       { transform: scale(1.08); opacity: 0.85; }
`;
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-12px); }
`;
const confettiFall = keyframes`
  0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
  100% { transform: translateY(110vh) rotate(720deg); opacity: 0; }
`;
const progressBar = keyframes`
  from { width: 0%; }
  to   { width: 100%; }
`;

const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0F4C3A 100%);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 2rem; overflow: hidden; position: relative;
`;

const Orb = styled.div`
  position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none;
  &.a { width: 500px; height: 500px; background: rgba(42,125,225,0.18); top: -200px; left: -150px; }
  &.b { width: 400px; height: 400px; background: rgba(46,209,162,0.15); bottom: -150px; right: -100px; }
  &.c { width: 300px; height: 300px; background: rgba(139,92,246,0.1); top: 50%; left: 50%; transform: translate(-50%,-50%); }
`;

const ConfettiPiece = styled.div`
  position: fixed; top: -20px;
  width: ${p => p.$w}px; height: ${p => p.$h}px;
  left: ${p => p.$left}%;
  background: ${p => p.$color};
  border-radius: ${p => p.$round ? '50%' : '3px'};
  animation: ${confettiFall} ${p => p.$dur}s ease-in ${p => p.$delay}s both;
  z-index: 0; pointer-events: none;
`;

const Card = styled.div`
  position: relative; z-index: 1;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  backdrop-filter: blur(20px);
  border-radius: 32px; padding: 3rem 2.5rem;
  max-width: 480px; width: 100%; text-align: center;
  box-shadow: 0 40px 80px rgba(0,0,0,0.4);
  animation: ${fadeIn} 0.6s ease both;
  @media (max-width: 480px) { padding: 2rem 1.5rem; }
`;

const EmojiBox = styled.div`
  font-size: 4.5rem; margin-bottom: 1.5rem;
  animation: ${float} 3s ease-in-out infinite;
  display: inline-block;
`;

const Logo = styled.div`
  font-size: 1.2rem; font-weight: 900;
  background: linear-gradient(135deg, #2A7DE1, #2ED1A2);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  letter-spacing: -0.02em; margin-bottom: 1.25rem;
  animation: ${fadeIn} 0.5s ease 0.1s both; opacity: 0;
  animation-fill-mode: forwards;
`;

const Title = styled.h1`
  font-size: clamp(1.8rem, 5vw, 2.4rem); font-weight: 900; color: white;
  letter-spacing: -0.03em; line-height: 1.15; margin-bottom: 0.75rem;
  animation: ${fadeIn} 0.6s ease 0.2s both; opacity: 0;
  animation-fill-mode: forwards;
  span {
    background: linear-gradient(90deg, #60A5FA, #2ED1A2);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
`;

const Sub = styled.p`
  font-size: 1rem; color: rgba(255,255,255,0.65); line-height: 1.7;
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.6s ease 0.35s both; opacity: 0;
  animation-fill-mode: forwards;
`;

const FeatureList = styled.div`
  display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2.5rem;
  animation: ${fadeIn} 0.6s ease 0.5s both; opacity: 0;
  animation-fill-mode: forwards;
`;

const FeatureItem = styled.div`
  display: flex; align-items: center; gap: 0.75rem;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px; padding: 0.75rem 1rem; text-align: left;
`;
const FeatureIcon = styled.div`font-size: 1.4rem; min-width: 32px; text-align: center;`;
const FeatureText = styled.div`
  font-size: 0.88rem; color: rgba(255,255,255,0.8); font-weight: 600; line-height: 1.4;
`;

const ProgressWrap = styled.div`
  animation: ${fadeIn} 0.6s ease 0.7s both; opacity: 0;
  animation-fill-mode: forwards;
`;
const ProgressLabel = styled.div`
  font-size: 0.78rem; color: rgba(255,255,255,0.45); margin-bottom: 0.6rem; font-weight: 600;
`;
const ProgressTrack = styled.div`
  height: 4px; background: rgba(255,255,255,0.1); border-radius: 9999px; overflow: hidden;
`;
const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #2A7DE1, #2ED1A2);
  border-radius: 9999px;
  animation: ${progressBar} 3s ease forwards;
`;

// ─── Confettis ────────────────────────────────────────────────────────────────
const COLORS = ['#2A7DE1','#2ED1A2','#F59E0B','#EF4444','#8B5CF6','#EC4899','#06B6D4'];
const pieces = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  left:  Math.random() * 100,
  w:     6 + Math.random() * 8,
  h:     10 + Math.random() * 14,
  color: COLORS[i % COLORS.length],
  dur:   2.5 + Math.random() * 2,
  delay: Math.random() * 1.5,
  round: Math.random() > 0.6,
}));

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const prenom = user?.prenom || user?.nom || '';

  // Redirige automatiquement après 4 secondes
  useEffect(() => {
    const timer = setTimeout(() => navigate('/goal-selection'), 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Page>
      <Orb className="a" /><Orb className="b" /><Orb className="c" />

      {pieces.map(p => (
        <ConfettiPiece key={p.id}
          $left={p.left} $w={p.w} $h={p.h}
          $color={p.color} $dur={p.dur} $delay={p.delay} $round={p.round}
        />
      ))}

      <Card>
        <EmojiBox>🎉</EmojiBox>
        <Logo>FastCare</Logo>
        <Title>
          Bienvenue{prenom ? <>, <span>{prenom}</span></> : ''} !
        </Title>
        <Sub>
          Ton compte est créé. Tu rejoins des milliers de personnes qui prennent soin d'elles grâce au jeûne.
        </Sub>

        <FeatureList>
          <FeatureItem>
            <FeatureIcon>⏱️</FeatureIcon>
            <FeatureText>Timer de jeûne intelligent — suivi en temps réel</FeatureText>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>📊</FeatureIcon>
            <FeatureText>Statistiques & progression — vois tes résultats</FeatureText>
          </FeatureItem>
          <FeatureItem>
            <FeatureIcon>🌙</FeatureIcon>
            <FeatureText>Contenus Ramadan — vidéos & guides pour enfants</FeatureText>
          </FeatureItem>
        </FeatureList>

        <ProgressWrap>
          <ProgressLabel>Préparation de ton espace personnel...</ProgressLabel>
          <ProgressTrack>
            <ProgressFill />
          </ProgressTrack>
        </ProgressWrap>
      </Card>
    </Page>
  );
};

export default Welcome;
