import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import {
  ArrowLeft, Heart, Shield, Zap, Users, Timer,
  TrendingUp, BookOpen, Bell, Check, Star,
  ArrowRight, Droplets, Brain, Sun, Moon,
  Activity, AlertCircle
} from 'lucide-react';

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const floatY = keyframes`
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-14px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.7; transform: scale(1.08); }
`;

const rotateSlow = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;

// ─── Layout ───────────────────────────────────────────────────────────────────

const Page = styled.div`
  background: #F8FAFF;
  overflow-x: hidden;
`;

// ─── Nav ──────────────────────────────────────────────────────────────────────

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(248, 250, 255, 0.88);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(42, 125, 225, 0.08);
  padding: 0 2rem;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const NavLogo = styled.div`
  font-size: 1.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #2A7DE1, #2ED1A2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.03em;
  cursor: pointer;
`;

const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 1.5px solid rgba(42,125,225,0.25);
  color: #2A7DE1;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0.5rem 1.1rem;
  border-radius: 10px;
  transition: all 0.2s;
  &:hover { background: rgba(42,125,225,0.06); }
`;

const StartBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #2A7DE1, #2ED1A2);
  color: white;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  padding: 0.55rem 1.25rem;
  border: none;
  border-radius: 10px;
  transition: all 0.2s;
  &:hover { opacity: 0.9; transform: translateY(-1px); }
`;

// ─── Reusable section helpers ─────────────────────────────────────────────────

const Wrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  @media (max-width: 480px) { padding: 0 1rem; }
`;

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: ${p => p.bg || 'rgba(42,125,225,0.08)'};
  color: ${p => p.color || '#2A7DE1'};
  border: 1px solid ${p => p.border || 'rgba(42,125,225,0.18)'};
  padding: 0.35rem 0.9rem;
  border-radius: 9999px;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 1rem;
  width: fit-content;
`;

const H2 = styled.h2`
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 900;
  color: #0F172A;
  letter-spacing: -0.03em;
  line-height: 1.12;
  margin-bottom: 1rem;

  span {
    background: linear-gradient(135deg, #2A7DE1, #2ED1A2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Lead = styled.p`
  font-size: clamp(1rem, 2vw, 1.15rem);
  color: #475569;
  line-height: 1.75;
  max-width: 640px;
`;

// ─── 1. HERO ──────────────────────────────────────────────────────────────────

const HeroSection = styled.section`
  background: linear-gradient(135deg, #0F172A 0%, #1E3A5F 60%, #0F4C3A 100%);
  padding: 6rem 2rem 5rem;
  position: relative;
  overflow: hidden;
  text-align: center;

  @media (max-width: 768px) { padding: 4rem 1.5rem 3.5rem; }
`;

const HeroOrb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
  animation: ${floatY} ${p => p.dur || '10s'} ease-in-out infinite;
  animation-delay: ${p => p.delay || '0s'};

  &.a { width: 500px; height: 500px; background: rgba(42,125,225,0.25); top: -150px; left: -100px; }
  &.b { width: 400px; height: 400px; background: rgba(46,209,162,0.2);  bottom: -100px; right: -80px; }
  &.c { width: 250px; height: 250px; background: rgba(96,165,250,0.15); top: 30%; left: 40%; }
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.9);
  padding: 0.4rem 1.1rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 2rem;
  letter-spacing: 0.05em;
  animation: ${fadeInUp} 0.6s ease both;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.5rem, 7vw, 5.5rem);
  font-weight: 900;
  color: white;
  letter-spacing: -0.04em;
  line-height: 1.05;
  margin-bottom: 1.5rem;
  animation: ${fadeInUp} 0.7s ease 0.1s both;

  span {
    background: linear-gradient(90deg, #60A5FA, #2ED1A2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const HeroSub = styled.p`
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: rgba(255,255,255,0.72);
  line-height: 1.75;
  max-width: 680px;
  margin: 0 auto 3rem;
  animation: ${fadeInUp} 0.7s ease 0.2s both;
`;

const HeroStats = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  flex-wrap: wrap;
  animation: ${fadeInUp} 0.7s ease 0.3s both;

  @media (max-width: 480px) { gap: 1.5rem; }
`;

const HeroStat = styled.div`
  text-align: center;
  .n {
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 900;
    color: white;
    letter-spacing: -0.03em;
    line-height: 1;
  }
  .l {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.6);
    font-weight: 600;
    margin-top: 0.3rem;
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }
`;

const HeroDivider = styled.div`
  width: 1px;
  height: 40px;
  background: rgba(255,255,255,0.2);
  align-self: center;
  @media (max-width: 480px) { display: none; }
`;

// ─── 2. MISSION ───────────────────────────────────────────────────────────────

const MissionSection = styled.section`
  padding: 7rem 0;
  background: white;

  @media (max-width: 768px) { padding: 5rem 0; }
`;

const MissionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 5rem;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const MissionVisual = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  animation: ${fadeInUp} 0.7s ease both;

  @media (max-width: 900px) { order: -1; }
`;

const VisualCard = styled.div`
  background: linear-gradient(135deg, #0F172A, #1E3A5F);
  border-radius: 28px;
  padding: 2.5rem;
  width: 320px;
  color: white;
  position: relative;
  box-shadow: 0 40px 80px -20px rgba(15,23,42,0.35);

  @media (max-width: 480px) { width: 100%; max-width: 320px; }
`;

const VisualTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #2ED1A2;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  .dot {
    width: 7px; height: 7px;
    background: #2ED1A2;
    border-radius: 50%;
    animation: ${pulse} 2s ease-in-out infinite;
  }
`;

const VisualBenefits = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Benefit = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  background: rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(255,255,255,0.08);
  transition: background 0.2s;

  .icon {
    width: 36px; height: 36px; min-width: 36px;
    background: ${p => p.bg || 'rgba(42,125,225,0.3)'};
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    color: white;
  }
  .text {
    .t { font-size: 0.88rem; font-weight: 700; color: white; }
    .s { font-size: 0.75rem; color: rgba(255,255,255,0.5); margin-top: 0.1rem; }
  }
`;

const FloatingPill = styled.div`
  position: absolute;
  background: white;
  border-radius: 14px;
  padding: 0.6rem 1rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.12);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
  animation: ${floatY} 5s ease-in-out infinite;
  animation-delay: ${p => p.delay || '0s'};

  &.top { top: -18px; right: -20px; color: #2A7DE1; }
  &.bot { bottom: -18px; left: -20px; color: #059669; animation-delay: -2.5s; }

  @media (max-width: 480px) {
    &.top { right: 0; }
    &.bot { left: 0; }
  }
`;

const MissionText = styled.div`
  animation: ${fadeInUp} 0.7s ease 0.15s both;
`;

const MissionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const MissionItem = styled.div`
  display: flex;
  gap: 0.875rem;
  align-items: flex-start;

  .check {
    width: 24px; height: 24px; min-width: 24px;
    background: linear-gradient(135deg, #2A7DE1, #2ED1A2);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin-top: 2px;
  }
  .txt {
    .t { font-size: 1rem; font-weight: 700; color: #0F172A; margin-bottom: 0.2rem; }
    .s { font-size: 0.9rem; color: #64748b; line-height: 1.6; }
  }
`;

// ─── 3. WHAT IS FASTING ───────────────────────────────────────────────────────

const FastingSection = styled.section`
  padding: 7rem 0;
  background: #F8FAFF;
  @media (max-width: 768px) { padding: 5rem 0; }
`;

const FastingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 3.5rem;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

const FastingCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  border: 1.5px solid rgba(42,125,225,0.07);
  box-shadow: 0 2px 16px rgba(0,0,0,0.04);
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.6s ease both;
  animation-delay: ${p => p.delay || '0s'};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 50px -15px rgba(42,125,225,0.15);
    border-color: rgba(42,125,225,0.2);
  }
`;

const FastingIcon = styled.div`
  width: 54px; height: 54px;
  background: ${p => p.bg};
  border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  color: white;
  margin-bottom: 1.25rem;
  box-shadow: 0 8px 20px -5px ${p => p.shadow};
  animation: ${floatY} 4s ease-in-out infinite;
  animation-delay: ${p => p.delay || '0s'};
`;

const FastingType = styled.div`
  font-size: 1.15rem;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
`;

const FastingDesc = styled.p`
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.65;
  margin-bottom: 1.25rem;
`;

const FastingBullets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;

  span {
    font-size: 0.82rem;
    color: #475569;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-weight: 600;

    &::before {
      content: '';
      width: 6px; height: 6px; min-width: 6px;
      background: linear-gradient(135deg, #2A7DE1, #2ED1A2);
      border-radius: 50%;
    }
  }
`;

// ─── 4. FEATURES DEEP ─────────────────────────────────────────────────────────

const FeaturesSection = styled.section`
  padding: 7rem 0;
  background: white;
  @media (max-width: 768px) { padding: 5rem 0; }
`;

const FeatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 3.5rem;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`;

const FeatCard = styled.div`
  background: #F8FAFF;
  border-radius: 20px;
  padding: 1.75rem;
  border: 1.5px solid rgba(42,125,225,0.07);
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.6s ease both;
  animation-delay: ${p => p.delay || '0s'};
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: ${p => p.accent || 'linear-gradient(90deg, #2A7DE1, #2ED1A2)'};
    transform: scaleX(0);
    transition: transform 0.3s ease;
    transform-origin: left;
  }

  &:hover {
    background: white;
    transform: translateY(-4px);
    box-shadow: 0 20px 50px -15px rgba(42,125,225,0.12);
    &::after { transform: scaleX(1); }
  }
`;

const FeatIconBox = styled.div`
  width: 48px; height: 48px;
  background: ${p => p.bg};
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  color: white;
  margin-bottom: 1.1rem;
  box-shadow: 0 6px 16px -4px ${p => p.shadow || 'rgba(42,125,225,0.3)'};
`;

const FeatTitle = styled.h3`
  font-size: 1rem;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 0.5rem;
`;

const FeatDesc = styled.p`
  font-size: 0.88rem;
  color: #64748b;
  line-height: 1.65;
`;

// ─── 5. FOR WHO ───────────────────────────────────────────────────────────────

const AudienceSection = styled.section`
  padding: 7rem 0;
  background: linear-gradient(135deg, #0F172A 0%, #1E3A5F 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 700px; height: 700px;
    background: rgba(46,209,162,0.06);
    border-radius: 50%;
    top: -200px; right: -200px;
    animation: ${rotateSlow} 40s linear infinite;
  }

  @media (max-width: 768px) { padding: 5rem 0; }
`;

const AudienceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-top: 3.5rem;

  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const AudienceCard = styled.div`
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.6s ease both;
  animation-delay: ${p => p.delay || '0s'};

  &:hover {
    background: rgba(255,255,255,0.09);
    transform: translateY(-4px);
    border-color: rgba(46,209,162,0.3);
  }
`;

const AudienceEmoji = styled.div`
  font-size: 2.5rem;
  margin-bottom: 1rem;
`;

const AudienceTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 800;
  color: white;
  margin-bottom: 0.6rem;
`;

const AudienceDesc = styled.p`
  font-size: 0.9rem;
  color: rgba(255,255,255,0.6);
  line-height: 1.65;
`;

const AudienceTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: rgba(46,209,162,0.15);
  color: #2ED1A2;
  border: 1px solid rgba(46,209,162,0.25);
  padding: 0.25rem 0.7rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-top: 1rem;
`;

// ─── 6. DISCLAIMER ────────────────────────────────────────────────────────────

const DisclaimerBand = styled.section`
  background: #FFF7ED;
  border-top: 1px solid #FED7AA;
  border-bottom: 1px solid #FED7AA;
  padding: 2rem;
`;

const DisclaimerInner = styled.div`
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  align-items: flex-start;
  gap: 1rem;

  .icon { color: #F59E0B; margin-top: 2px; flex-shrink: 0; }
  .text {
    .t { font-size: 0.95rem; font-weight: 800; color: #92400E; margin-bottom: 0.3rem; }
    .s { font-size: 0.88rem; color: #78350F; line-height: 1.65; }
  }
`;

// ─── 7. CTA ───────────────────────────────────────────────────────────────────

const CTASection = styled.section`
  background: linear-gradient(135deg, #2A7DE1 0%, #1a9e7a 100%);
  padding: 6rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 500px; height: 500px;
    background: rgba(255,255,255,0.05);
    border-radius: 50%;
    top: -200px; right: -150px;
    animation: ${rotateSlow} 30s linear infinite;
  }
`;

const CTATitle = styled.h2`
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 900;
  color: white;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin-bottom: 1rem;
  position: relative;
`;

const CTASub = styled.p`
  font-size: 1.1rem;
  color: rgba(255,255,255,0.8);
  line-height: 1.7;
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
`;

const CTARow = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  position: relative;
`;

const CTAWhite = styled.button`
  background: white;
  color: #2A7DE1;
  font-weight: 800;
  font-size: 1rem;
  padding: 0.9rem 2rem;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.25s;
  box-shadow: 0 8px 25px rgba(0,0,0,0.12);
  &:hover { transform: translateY(-2px); box-shadow: 0 14px 35px rgba(0,0,0,0.18); }
`;

const CTAGhost = styled.button`
  background: rgba(255,255,255,0.12);
  color: white;
  font-weight: 700;
  font-size: 1rem;
  padding: 0.9rem 2rem;
  border-radius: 12px;
  border: 2px solid rgba(255,255,255,0.3);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.25s;
  backdrop-filter: blur(8px);
  &:hover { background: rgba(255,255,255,0.22); transform: translateY(-2px); }
`;

// ─── Footer ───────────────────────────────────────────────────────────────────

const Footer = styled.footer`
  background: #0F172A;
  color: #64748b;
  text-align: center;
  padding: 2rem;
  font-size: 0.85rem;

  strong { color: #94a3b8; }
`;

// ─── Component ────────────────────────────────────────────────────────────────

const About = () => {
  const navigate = useNavigate();

  return (
    <Page>

      {/* ── Nav ── */}
      <Nav>
        <BackBtn onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Accueil
        </BackBtn>
        <NavLogo onClick={() => navigate('/')}>FastCare</NavLogo>
        <StartBtn onClick={() => navigate('/register')}>
          Commencer <ArrowRight size={15} />
        </StartBtn>
      </Nav>

      {/* ── Hero ── */}
      <HeroSection>
        <HeroOrb className="a" dur="12s" />
        <HeroOrb className="b" dur="15s" delay="-5s" />
        <HeroOrb className="c" dur="9s"  delay="-3s" />

        <HeroBadge>
          <Star size={13} fill="currentColor" /> Projet universitaire à vocation professionnelle
        </HeroBadge>

        <HeroTitle>
          Le jeûne,<br /><span>enfin simple et sécurisé.</span>
        </HeroTitle>

        <HeroSub>
          FastCare est né d'un constat simple : des millions de personnes pratiquent le jeûne sans aucun encadrement. Nous avons créé l'outil qu'il leur manquait — intelligent, bienveillant, et accessible à tous.
        </HeroSub>

        <HeroStats>
          <HeroStat><div className="n">50K+</div><div className="l">Utilisateurs</div></HeroStat>
          <HeroDivider />
          <HeroStat><div className="n">1M+</div><div className="l">Jeûnes complétés</div></HeroStat>
          <HeroDivider />
          <HeroStat><div className="n">4.8 ★</div><div className="l">Note moyenne</div></HeroStat>
          <HeroDivider />
          <HeroStat><div className="n">24/7</div><div className="l">Disponible</div></HeroStat>
        </HeroStats>
      </HeroSection>

      {/* ── Mission ── */}
      <MissionSection>
        <Wrap>
          <MissionGrid>
            <MissionVisual>
              <VisualCard>
                <FloatingPill className="top"><Zap size={13} /> Résultats visibles dès 7 jours</FloatingPill>
                <FloatingPill className="bot"><Shield size={13} /> 100% sécurisé & encadré</FloatingPill>

                <VisualTitle>
                  <span className="dot" />
                  Pourquoi FastCare ?
                </VisualTitle>
                <VisualBenefits>
                  <Benefit bg="rgba(42,125,225,0.25)">
                    <div className="icon"><Timer size={17} /></div>
                    <div className="text">
                      <div className="t">Timer intelligent</div>
                      <div className="s">16/8 · 24h · Personnalisé</div>
                    </div>
                  </Benefit>
                  <Benefit bg="rgba(46,209,162,0.25)">
                    <div className="icon"><Activity size={17} /></div>
                    <div className="text">
                      <div className="t">Suivi en temps réel</div>
                      <div className="s">Poids · Énergie · Humeur</div>
                    </div>
                  </Benefit>
                  <Benefit bg="rgba(245,158,11,0.25)">
                    <div className="icon"><Bell size={17} /></div>
                    <div className="text">
                      <div className="t">Notifications intelligentes</div>
                      <div className="s">Hydratation · Rappels · Fin de jeûne</div>
                    </div>
                  </Benefit>
                  <Benefit bg="rgba(139,92,246,0.25)">
                    <div className="icon"><TrendingUp size={17} /></div>
                    <div className="text">
                      <div className="t">Statistiques & progrès</div>
                      <div className="s">Graphiques · Insights · Tendances</div>
                    </div>
                  </Benefit>
                </VisualBenefits>
              </VisualCard>
            </MissionVisual>

            <MissionText>
              <Tag>Notre mission</Tag>
              <H2>Accompagner chaque<br /><span>jeûne, sans exception.</span></H2>
              <Lead>
                Trop de personnes abandonnent leur pratique faute de suivi et de motivation. FastCare change ça : nous vous donnons les outils, les conseils et la structure pour réussir — du premier au centième jeûne.
              </Lead>
              <MissionList>
                <MissionItem>
                  <div className="check"><Check size={13} color="white" /></div>
                  <div className="txt">
                    <div className="t">Accompagnement personnalisé</div>
                    <div className="s">Chaque utilisateur a ses propres objectifs. FastCare s'adapte à votre rythme, pas l'inverse.</div>
                  </div>
                </MissionItem>
                <MissionItem>
                  <div className="check"><Check size={13} color="white" /></div>
                  <div className="txt">
                    <div className="t">Motivation sur la durée</div>
                    <div className="s">Statistiques, streaks et journal de ressenti pour rester engagé semaine après semaine.</div>
                  </div>
                </MissionItem>
                <MissionItem>
                  <div className="check"><Check size={13} color="white" /></div>
                  <div className="txt">
                    <div className="t">Bonnes pratiques santé</div>
                    <div className="s">Des conseils basés sur des méthodes éprouvées, accessibles sans expertise médicale préalable.</div>
                  </div>
                </MissionItem>
              </MissionList>
            </MissionText>
          </MissionGrid>
        </Wrap>
      </MissionSection>

      {/* ── Fasting types ── */}
      <FastingSection>
        <Wrap>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Tag bg="rgba(46,209,162,0.1)" color="#059669" border="rgba(46,209,162,0.2)">
              <Droplets size={12} /> Comprendre le jeûne
            </Tag>
            <H2>Trois façons de <span>jeûner avec FastCare</span></H2>
            <Lead style={{ margin: '0 auto', textAlign: 'center' }}>
              Peu importe votre niveau ou votre objectif, il existe une méthode adaptée. FastCare vous guide dans chacune d'elles.
            </Lead>
          </div>

          <FastingGrid>
            <FastingCard delay="0s">
              <FastingIcon bg="linear-gradient(135deg,#2A7DE1,#60A5FA)" shadow="rgba(42,125,225,0.3)" delay="0s">
                <Moon size={24} />
              </FastingIcon>
              <FastingType>Jeûne 16/8</FastingType>
              <FastingDesc>
                La méthode la plus populaire et la plus accessible. 16 heures de jeûne, 8 heures d'alimentation. Idéale pour débuter.
              </FastingDesc>
              <FastingBullets>
                <span>Facile à intégrer au quotidien</span>
                <span>Améliore la sensibilité à l'insuline</span>
                <span>Favorise la perte de poids progressive</span>
                <span>Augmente l'énergie et la concentration</span>
              </FastingBullets>
            </FastingCard>

            <FastingCard delay="0.1s">
              <FastingIcon bg="linear-gradient(135deg,#F59E0B,#EF4444)" shadow="rgba(245,158,11,0.3)" delay="-1.5s">
                <Sun size={24} />
              </FastingIcon>
              <FastingType>Jeûne 24h</FastingType>
              <FastingDesc>
                Un jeûne complet sur une journée. Plus intense, il est conseillé aux pratiquants ayant déjà une base solide.
              </FastingDesc>
              <FastingBullets>
                <span>Stimule l'autophagie cellulaire</span>
                <span>Détoxification naturelle approfondie</span>
                <span>Reset digestif complet</span>
                <span>Renforcement mental et discipline</span>
              </FastingBullets>
            </FastingCard>

            <FastingCard delay="0.2s">
              <FastingIcon bg="linear-gradient(135deg,#8B5CF6,#EC4899)" shadow="rgba(139,92,246,0.3)" delay="-3s">
                <Brain size={24} />
              </FastingIcon>
              <FastingType>Jeûne Personnalisé</FastingType>
              <FastingDesc>
                Définissez votre propre durée selon vos besoins. Parfait pour le Ramadan, les pratiques spirituelles ou les protocoles médicaux.
              </FastingDesc>
              <FastingBullets>
                <span>Durée libre selon vos objectifs</span>
                <span>Adapté aux pratiques religieuses</span>
                <span>Convient aux protocoles spécifiques</span>
                <span>Suivi identique aux autres méthodes</span>
              </FastingBullets>
            </FastingCard>
          </FastingGrid>
        </Wrap>
      </FastingSection>

      {/* ── Features deep-dive ── */}
      <FeaturesSection>
        <Wrap>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Tag><Zap size={12} /> Fonctionnalités</Tag>
            <H2>Tout ce dont vous avez besoin,<br /><span>rien de superflu.</span></H2>
            <Lead style={{ margin: '0 auto', textAlign: 'center' }}>
              Chaque fonctionnalité a été pensée pour un usage réel — pas pour impressionner sur une brochure.
            </Lead>
          </div>

          <FeatGrid>
            <FeatCard delay="0s" accent="linear-gradient(90deg,#2A7DE1,#60A5FA)">
              <FeatIconBox bg="linear-gradient(135deg,#2A7DE1,#60A5FA)" shadow="rgba(42,125,225,0.3)"><Timer size={22} /></FeatIconBox>
              <FeatTitle>Timer de jeûne</FeatTitle>
              <FeatDesc>Lancez, mettez en pause, réinitialisez — tout en temps réel. Visualisation de la progression avec anneau animé.</FeatDesc>
            </FeatCard>

            <FeatCard delay="0.05s" accent="linear-gradient(90deg,#2ED1A2,#059669)">
              <FeatIconBox bg="linear-gradient(135deg,#2ED1A2,#059669)" shadow="rgba(46,209,162,0.3)"><Heart size={22} /></FeatIconBox>
              <FeatTitle>Suivi quotidien</FeatTitle>
              <FeatDesc>Enregistrez poids, niveau d'énergie et humeur chaque jour. Comprenez l'impact du jeûne sur votre corps.</FeatDesc>
            </FeatCard>

            <FeatCard delay="0.1s" accent="linear-gradient(90deg,#F59E0B,#EF4444)">
              <FeatIconBox bg="linear-gradient(135deg,#F59E0B,#EF4444)" shadow="rgba(245,158,11,0.3)"><TrendingUp size={22} /></FeatIconBox>
              <FeatTitle>Statistiques</FeatTitle>
              <FeatDesc>Graphiques clairs, évolution du poids, nombre de jeûnes complétés. Vos données lisibles en un coup d'œil.</FeatDesc>
            </FeatCard>

            <FeatCard delay="0.15s" accent="linear-gradient(90deg,#8B5CF6,#EC4899)">
              <FeatIconBox bg="linear-gradient(135deg,#8B5CF6,#EC4899)" shadow="rgba(139,92,246,0.3)"><BookOpen size={22} /></FeatIconBox>
              <FeatTitle>Journal de ressenti</FeatTitle>
              <FeatDesc>Notez vos émotions, observations et ressentis. Un journal intime pour mieux vous connaître.</FeatDesc>
            </FeatCard>

            <FeatCard delay="0.2s" accent="linear-gradient(90deg,#06B6D4,#3B82F6)">
              <FeatIconBox bg="linear-gradient(135deg,#06B6D4,#3B82F6)" shadow="rgba(6,182,212,0.3)"><Bell size={22} /></FeatIconBox>
              <FeatTitle>Notifications</FeatTitle>
              <FeatDesc>Rappels d'hydratation toutes les 2 heures, alerte de fin de jeûne, et encouragements personnalisés.</FeatDesc>
            </FeatCard>

            <FeatCard delay="0.25s" accent="linear-gradient(90deg,#10B981,#2A7DE1)">
              <FeatIconBox bg="linear-gradient(135deg,#10B981,#2A7DE1)" shadow="rgba(16,185,129,0.3)"><Shield size={22} /></FeatIconBox>
              <FeatTitle>Conseils santé</FeatTitle>
              <FeatDesc>Des conseils pratiques et fiables pour chaque phase de jeûne — avant, pendant et après.</FeatDesc>
            </FeatCard>
          </FeatGrid>
        </Wrap>
      </FeaturesSection>

      {/* ── For who ── */}
      <AudienceSection>
        <Wrap>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Tag bg="rgba(46,209,162,0.12)" color="#2ED1A2" border="rgba(46,209,162,0.25)">
              <Users size={12} /> Public cible
            </Tag>
            <H2 style={{ color: 'white' }}>
              FastCare est fait<br /><span>pour vous.</span>
            </H2>
            <Lead style={{ color: 'rgba(255,255,255,0.65)', margin: '0 auto', textAlign: 'center' }}>
              Que vous soyez débutant curieux ou pratiquant confirmé, FastCare s'adapte à votre réalité.
            </Lead>
          </div>

          <AudienceGrid>
            <AudienceCard delay="0s">
              <AudienceEmoji>🎓</AudienceEmoji>
              <AudienceTitle>Étudiants & Actifs</AudienceTitle>
              <AudienceDesc>
                Vous avez peu de temps mais souhaitez prendre soin de vous. FastCare s'intègre dans votre quotidien chargé sans friction.
              </AudienceDesc>
              <AudienceTag><Check size={11} /> Interface rapide & mobile</AudienceTag>
            </AudienceCard>

            <AudienceCard delay="0.1s">
              <AudienceEmoji>🌱</AudienceEmoji>
              <AudienceTitle>Débutants complets</AudienceTitle>
              <AudienceDesc>
                Jamais jeûné ? Aucun problème. FastCare vous guide pas à pas avec des méthodes progressives et sécurisées.
              </AudienceDesc>
              <AudienceTag><Check size={11} /> Conseils adaptés au niveau</AudienceTag>
            </AudienceCard>

            <AudienceCard delay="0.2s">
              <AudienceEmoji>🌙</AudienceEmoji>
              <AudienceTitle>Pratique spirituelle</AudienceTitle>
              <AudienceDesc>
                Ramadan, pratiques religieuses ou jeûne volontaire — FastCare supporte toutes les motivations avec respect et discernement.
              </AudienceDesc>
              <AudienceTag><Check size={11} /> Mode Ramadan dédié</AudienceTag>
            </AudienceCard>
          </AudienceGrid>
        </Wrap>
      </AudienceSection>

      {/* ── Disclaimer ── */}
      <DisclaimerBand>
        <DisclaimerInner>
          <AlertCircle size={20} className="icon" />
          <div className="text">
            <div className="t">Information médicale importante</div>
            <div className="s">
              FastCare est un outil d'accompagnement et de prévention. Il ne remplace en aucun cas un avis médical professionnel. En cas de problème de santé, de traitement médicamenteux ou de grossesse, consultez un médecin avant de pratiquer le jeûne.
            </div>
          </div>
        </DisclaimerInner>
      </DisclaimerBand>

      {/* ── CTA ── */}
      <CTASection>
        <CTATitle>Convaincu ? Alors on commence.</CTATitle>
        <CTASub>
          Rejoignez la communauté FastCare et commencez votre premier jeûne accompagné dès aujourd'hui. C'est gratuit, c'est simple, c'est pour vous.
        </CTASub>
        <CTARow>
          <CTAWhite onClick={() => navigate('/register')}>
            Créer mon compte <ArrowRight size={17} />
          </CTAWhite>
          <CTAGhost onClick={() => navigate('/login')}>
            Se connecter
          </CTAGhost>
        </CTARow>
      </CTASection>

      {/* ── Footer ── */}
      <Footer>
        © 2025 <strong>FastCare</strong> — Projet universitaire à vocation professionnelle · Tous droits réservés
      </Footer>

    </Page>
  );
};

export default About;
