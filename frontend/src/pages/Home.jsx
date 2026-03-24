import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import {
  Timer, Heart, TrendingUp, BookOpen,
  ArrowRight, Check, Star, Users, Zap,
  Moon, Scale, Brain, Bell, Shield
} from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import FastCareLogo from '../components/Logo';

// ─── Animations ──────────────────────────────────────────────────────────────

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(40px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const floatOrb = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(30px, -40px) scale(1.05); }
  66%       { transform: translate(-20px, 20px) scale(0.97); }
`;

const rotateSlow = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`;


const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.6; }
`;

const timerAnim = keyframes`
  from { stroke-dashoffset: 628; }
  to   { stroke-dashoffset: 188; }
`;

const badgePop = keyframes`
  from { opacity: 0; transform: scale(0.8) translateY(-10px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;

// ─── Layout ───────────────────────────────────────────────────────────────────

const Page = styled.div`
  background: #F8FAFF;
  overflow-x: hidden;
`;

// ─── Navbar ───────────────────────────────────────────────────────────────────

const Nav = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(248, 250, 255, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(42, 125, 225, 0.08);
  padding: 0 2rem;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 100%;
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

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2.5rem;

  @media (max-width: 768px) { display: none; }
`;

const NavLink = styled.a`
  color: #4B5563;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.2s;
  &:hover { color: #2A7DE1; }
`;

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

// ─── Hero ─────────────────────────────────────────────────────────────────────

const HeroSection = styled.section`
  min-height: calc(100vh - 70px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 4rem;
  max-width: 1280px;
  margin: 0 auto;
  padding: 4rem 2rem 6rem;
  position: relative;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 3rem;
    padding: 3rem 1.5rem 4rem;
  }

  @media (max-width: 480px) {
    padding: 2rem 1rem 3rem;
  }
`;

const HeroOrb = styled.div`
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  animation: ${floatOrb} 12s ease-in-out infinite;

  &.orb1 {
    width: 500px;
    height: 500px;
    background: rgba(42, 125, 225, 0.12);
    top: -100px;
    right: -100px;
    animation-delay: 0s;
  }
  &.orb2 {
    width: 400px;
    height: 400px;
    background: rgba(46, 209, 162, 0.10);
    bottom: -50px;
    left: -80px;
    animation-delay: -4s;
  }
  &.orb3 {
    width: 250px;
    height: 250px;
    background: rgba(96, 165, 250, 0.08);
    top: 40%;
    left: 30%;
    animation-delay: -8s;
  }
`;

const HeroLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  animation: ${fadeInUp} 0.8s ease both;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) { align-items: center; }
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(42, 125, 225, 0.08);
  border: 1px solid rgba(42, 125, 225, 0.2);
  color: #2A7DE1;
  padding: 0.4rem 1rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  width: fit-content;
  animation: ${badgePop} 0.6s ease 0.2s both;

  span.dot {
    width: 8px;
    height: 8px;
    background: #2ED1A2;
    border-radius: 50%;
    animation: ${pulse} 2s ease-in-out infinite;
  }
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.8rem, 6vw, 5rem);
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: #0F172A;

  span.gradient {
    background: linear-gradient(135deg, #2A7DE1 0%, #2ED1A2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const HeroSubtitle = styled.p`
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: #475569;
  line-height: 1.75;
  max-width: 520px;

  @media (max-width: 1024px) { max-width: 600px; }
`;

const HeroCTA = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 1024px) { justify-content: center; }
`;

const HeroTrustLine = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #64748b;
  font-size: 0.85rem;

  @media (max-width: 1024px) { justify-content: center; }
`;

const TrustDot = styled.span`
  color: #2ED1A2;
  font-weight: 700;
`;

// ─── Hero Visual (Timer Mockup) ───────────────────────────────────────────────

const HeroRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeInUp} 0.8s ease 0.2s both;
  position: relative;
  z-index: 1;

  @media (max-width: 1024px) { order: -1; }
`;

const MockupCard = styled.div`
  background: white;
  border-radius: 28px;
  padding: 2.5rem;
  box-shadow:
    0 0 0 1px rgba(42, 125, 225, 0.08),
    0 30px 80px -20px rgba(42, 125, 225, 0.18),
    0 10px 30px -10px rgba(0,0,0,0.07);
  width: 320px;
  text-align: center;
  position: relative;

  @media (max-width: 480px) { width: 280px; padding: 2rem; }
`;

const MockupLabel = styled.div`
  font-size: 0.8rem;
  font-weight: 700;
  color: #2ED1A2;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
`;

const MockupRingWrap = styled.div`
  width: 160px;
  height: 160px;
  margin: 0 auto 1.5rem;
  position: relative;

  svg { transform: rotate(-90deg); }

  .ring-track {
    stroke: #EFF6FF;
    stroke-width: 10;
    fill: none;
  }
  .ring-progress {
    stroke: url(#timerGrad);
    stroke-width: 10;
    fill: none;
    stroke-linecap: round;
    stroke-dasharray: 439;
    animation: ${timerAnim} 3s ease-out 1s both;
  }
`;

const MockupTime = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .time {
    font-size: 1.5rem;
    font-weight: 800;
    color: #0F172A;
    font-family: 'Courier New', monospace;
    letter-spacing: 0.02em;
  }
  .label {
    font-size: 0.7rem;
    color: #94a3b8;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-top: 0.2rem;
  }
`;

const MockupType = styled.div`
  background: linear-gradient(135deg, rgba(42,125,225,0.08), rgba(46,209,162,0.08));
  border-radius: 12px;
  padding: 0.75rem 1rem;
  margin-bottom: 1.25rem;
  font-weight: 700;
  color: #2A7DE1;
  font-size: 0.95rem;
`;

const MockupStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
`;

const MockupStat = styled.div`
  background: #F8FAFF;
  border-radius: 10px;
  padding: 0.6rem;
  text-align: center;

  .val {
    font-size: 1.1rem;
    font-weight: 800;
    color: #0F172A;
  }
  .key {
    font-size: 0.7rem;
    color: #94a3b8;
    font-weight: 600;
    margin-top: 0.1rem;
  }
`;

const FloatingBadge = styled.div`
  position: absolute;
  background: white;
  border-radius: 14px;
  padding: 0.6rem 0.9rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
  animation: ${floatOrb} 6s ease-in-out infinite;

  &.top-right {
    top: -20px;
    right: -30px;
    animation-delay: -2s;
    color: #2ED1A2;
  }
  &.bottom-left {
    bottom: 10px;
    left: -40px;
    animation-delay: -4s;
    color: #2A7DE1;
  }

  @media (max-width: 480px) {
    &.bottom-left { left: -10px; }
    &.top-right { right: -10px; }
  }
`;

// ─── Stats Bar ────────────────────────────────────────────────────────────────

const StatsBar = styled.section`
  background: white;
  border-top: 1px solid #EFF6FF;
  border-bottom: 1px solid #EFF6FF;
`;

const StatsInner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
`;

const StatItem = styled.div`
  text-align: center;
  animation: ${fadeInUp} 0.6s ease both;
  animation-delay: ${props => props.delay || '0s'};

  .number {
    font-size: clamp(1.8rem, 4vw, 2.5rem);
    font-weight: 900;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, #2A7DE1, #2ED1A2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .desc {
    font-size: 0.9rem;
    color: #64748b;
    font-weight: 600;
    margin-top: 0.25rem;
  }
`;

// ─── Section Shell ────────────────────────────────────────────────────────────

const Section = styled.section`
  max-width: 1280px;
  margin: 0 auto;
  padding: 6rem 2rem;

  @media (max-width: 768px) { padding: 4rem 1.5rem; }
  @media (max-width: 480px) { padding: 3rem 1rem; }
`;

const SectionTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(46, 209, 162, 0.1);
  color: #059669;
  padding: 0.35rem 0.85rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 900;
  color: #0F172A;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin-bottom: 1rem;

  span {
    background: linear-gradient(135deg, #2A7DE1, #2ED1A2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const SectionSub = styled.p`
  font-size: clamp(1rem, 2vw, 1.15rem);
  color: #64748b;
  line-height: 1.7;
  max-width: 600px;
  margin-bottom: 3.5rem;
`;

const SectionHeader = styled.div`
  text-align: ${props => props.center ? 'center' : 'left'};
  ${props => props.center && 'display:flex; flex-direction:column; align-items:center;'}
`;

// ─── Features ─────────────────────────────────────────────────────────────────

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;

  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const FeatureCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2.25rem;
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  border: 1.5px solid transparent;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
  animation: ${fadeInUp} 0.6s ease both;
  animation-delay: ${props => props.delay || '0s'};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(42,125,225,0.03), rgba(46,209,162,0.03));
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    transform: translateY(-6px);
    border-color: rgba(42,125,225,0.2);
    box-shadow: 0 20px 50px -15px rgba(42,125,225,0.15);
    &::before { opacity: 1; }
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
    gap: 1rem;
  }
`;

const FeatureIconBox = styled.div`
  width: 56px;
  height: 56px;
  min-width: 56px;
  background: ${props => props.bg || 'linear-gradient(135deg, #2A7DE1, #2ED1A2)'};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 20px -6px ${props => props.shadow || 'rgba(42,125,225,0.35)'};
`;

const FeatureText = styled.div`
  h3 {
    font-size: 1.1rem;
    font-weight: 800;
    color: #0F172A;
    margin-bottom: 0.5rem;
    letter-spacing: -0.01em;
  }
  p {
    font-size: 0.93rem;
    color: #64748b;
    line-height: 1.65;
  }
`;

// ─── How It Works ─────────────────────────────────────────────────────────────

const StepsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 36px;
    left: calc(16.66% + 24px);
    right: calc(16.66% + 24px);
    height: 2px;
    background: linear-gradient(90deg, #2A7DE1, #2ED1A2);
    z-index: 0;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    &::before { display: none; }
  }
`;

const Step = styled.div`
  text-align: center;
  animation: ${fadeInUp} 0.6s ease both;
  animation-delay: ${props => props.delay || '0s'};
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    display: flex;
    align-items: flex-start;
    gap: 1.25rem;
    text-align: left;
  }
`;

const StepNumber = styled.div`
  width: 72px;
  height: 72px;
  min-width: 72px;
  background: linear-gradient(135deg, #2A7DE1, #2ED1A2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 900;
  color: white;
  margin: 0 auto 1.5rem;
  box-shadow: 0 12px 30px -8px rgba(42,125,225,0.35);
  border: 4px solid white;

  @media (max-width: 768px) {
    margin: 0;
    width: 56px;
    height: 56px;
    min-width: 56px;
    font-size: 1.2rem;
  }
`;

const StepContent = styled.div`
  h3 {
    font-size: 1.1rem;
    font-weight: 800;
    color: #0F172A;
    margin-bottom: 0.5rem;
  }
  p {
    font-size: 0.9rem;
    color: #64748b;
    line-height: 1.65;
  }
`;

// ─── Goals ────────────────────────────────────────────────────────────────────

const GoalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;

  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px)  { grid-template-columns: 1fr; }
`;

const GoalCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 2rem 1.5rem;
  text-align: center;
  border: 2px solid transparent;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.6s ease both;
  animation-delay: ${props => props.delay || '0s'};
  cursor: pointer;

  &:hover {
    border-color: rgba(42,125,225,0.25);
    transform: translateY(-5px);
    box-shadow: 0 20px 40px -12px rgba(42,125,225,0.15);
  }
`;

const GoalIcon = styled.div`
  width: 64px;
  height: 64px;
  background: ${props => props.bg};
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  color: white;
  box-shadow: 0 8px 20px -5px ${props => props.shadow};
`;

const GoalTitle = styled.h3`
  font-size: 1rem;
  font-weight: 800;
  color: #0F172A;
  margin-bottom: 0.5rem;
`;

const GoalDesc = styled.p`
  font-size: 0.82rem;
  color: #64748b;
  line-height: 1.6;
`;

// ─── Final CTA ────────────────────────────────────────────────────────────────

const CTASection = styled.section`
  background: linear-gradient(135deg, #2A7DE1 0%, #1a9e7a 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: rgba(255,255,255,0.05);
    border-radius: 50%;
    top: -200px;
    right: -200px;
    animation: ${rotateSlow} 30s linear infinite;
  }
`;

const CTAInner = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 6rem 2rem;
  text-align: center;
  position: relative;
  z-index: 1;

  @media (max-width: 480px) { padding: 4rem 1.5rem; }
`;

const CTATitle = styled.h2`
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 900;
  color: white;
  letter-spacing: -0.03em;
  line-height: 1.15;
  margin-bottom: 1rem;
`;

const CTASub = styled.p`
  font-size: 1.1rem;
  color: rgba(255,255,255,0.8);
  line-height: 1.7;
  margin-bottom: 2.5rem;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const CTAButtonPrimary = styled.button`
  background: white;
  color: #2A7DE1;
  font-weight: 800;
  font-size: 1.05rem;
  padding: 1rem 2.25rem;
  border-radius: 14px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.2);
  }

  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
  }
`;

const CTAButtonSecondary = styled.button`
  background: rgba(255,255,255,0.15);
  color: white;
  font-weight: 700;
  font-size: 1.05rem;
  padding: 1rem 2.25rem;
  border-radius: 14px;
  border: 2px solid rgba(255,255,255,0.35);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);

  &:hover {
    background: rgba(255,255,255,0.25);
    transform: translateY(-3px);
  }

  @media (max-width: 480px) {
    width: 100%;
    justify-content: center;
  }
`;

const CheckList = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 2rem;

  span {
    color: rgba(255,255,255,0.85);
    font-size: 0.9rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
`;

// ─── Footer ───────────────────────────────────────────────────────────────────

const Footer = styled.footer`
  background: #0F172A;
  color: #94a3b8;
  text-align: center;
  padding: 2rem;
  font-size: 0.875rem;

  strong { color: white; }
`;

// ─── Component ────────────────────────────────────────────────────────────────

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const handleStart = () => navigate('/register');
  const handleLogin  = () => navigate('/login');

  return (
    <Page>

      {/* ── Navbar ── */}
      <Nav>
        <NavLogo onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <FastCareLogo visibleWidth={160} />
        </NavLogo>
        <NavLinks>
          <NavLink href="#features">{t('home.nav.features')}</NavLink>
          <NavLink href="#how">{t('home.nav.how')}</NavLink>
          <NavLink href="#goals">{t('home.nav.goals')}</NavLink>
        </NavLinks>
        <NavActions>
          <LanguageSwitcher />
          {isAuthenticated ? (
            <Button variant="primary" size="small" onClick={() => navigate('/mon-espace')}>
              {t('home.nav.mySpace')}
            </Button>
          ) : (
            <>
              <Button variant="outline" size="small" onClick={handleLogin}>{t('home.nav.login')}</Button>
              <Button variant="primary" size="small" onClick={handleStart}>{t('home.nav.register')}</Button>
            </>
          )}
        </NavActions>
      </Nav>

      {/* ── Hero ── */}
      <HeroSection>
        <HeroOrb className="orb1" />
        <HeroOrb className="orb2" />
        <HeroOrb className="orb3" />

        <HeroLeft>
          <Badge>
            <span className="dot" />
            {t('home.hero.badge')}
          </Badge>

          <HeroTitle>
            {t('home.hero.title1')}<br />
            <span className="gradient">{t('home.hero.title2')}</span>
          </HeroTitle>

          <HeroSubtitle>
            {t('home.hero.subtitle')}
          </HeroSubtitle>

          <HeroCTA>
            <Button variant="primary" size="large" onClick={handleStart}>
              {t('home.hero.start')} <ArrowRight size={18} />
            </Button>
            <Button variant="outline" size="large" onClick={() => navigate('/about')}>
              {t('home.hero.learn')}
            </Button>
          </HeroCTA>

          <HeroTrustLine>
            <TrustDot>✓</TrustDot> {t('home.hero.trust1')}
            <TrustDot>·</TrustDot>
            <TrustDot>✓</TrustDot> {t('home.hero.trust2')}
            <TrustDot>·</TrustDot>
            <TrustDot>✓</TrustDot> {t('home.hero.trust3')}
          </HeroTrustLine>
        </HeroLeft>

        {/* Timer Mockup */}
        <HeroRight>
          <MockupCard>
            <FloatingBadge className="top-right">
              <Zap size={14} /> {t('home.hero.streak')}
            </FloatingBadge>
            <FloatingBadge className="bottom-left">
              <Bell size={14} /> {t('home.hero.hydration')}
            </FloatingBadge>

            <MockupLabel>
              <span className="dot" style={{ width: 8, height: 8, background: '#2ED1A2', borderRadius: '50%', animation: 'none' }} />
              {t('home.hero.fastStatus')}
            </MockupLabel>

            <MockupRingWrap>
              <svg width="160" height="160" viewBox="0 0 160 160">
                <defs>
                  <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#2A7DE1" />
                    <stop offset="100%" stopColor="#2ED1A2" />
                  </linearGradient>
                </defs>
                <circle className="ring-track" cx="80" cy="80" r="70" />
                <circle className="ring-progress" cx="80" cy="80" r="70" />
              </svg>
              <MockupTime>
                <span className="time">14:32:07</span>
                <span className="label">{t('home.hero.remaining')}</span>
              </MockupTime>
            </MockupRingWrap>

            <MockupType>Intermittent 16/8</MockupType>

            <MockupStats>
              <MockupStat>
                <div className="val">62 kg</div>
                <div className="key">{t('home.hero.weight')}</div>
              </MockupStat>
              <MockupStat>
                <div className="val">⚡ 8/10</div>
                <div className="key">{t('home.hero.energy')}</div>
              </MockupStat>
              <MockupStat>
                <div className="val">12</div>
                <div className="key">{t('home.hero.days')}</div>
              </MockupStat>
              <MockupStat>
                <div className="val">😊</div>
                <div className="key">{t('home.hero.mood')}</div>
              </MockupStat>
            </MockupStats>
          </MockupCard>
        </HeroRight>
      </HeroSection>

      {/* ── Stats Bar ── */}
      <StatsBar>
        <StatsInner>
          <StatItem delay="0s">
            <div className="number">50K+</div>
            <div className="desc">{t('home.stats.users')}</div>
          </StatItem>
          <StatItem delay="0.1s">
            <div className="number">1M+</div>
            <div className="desc">{t('home.stats.fasts')}</div>
          </StatItem>
          <StatItem delay="0.2s">
            <div className="number">4.8 ★</div>
            <div className="desc">{t('home.stats.rating')}</div>
          </StatItem>
          <StatItem delay="0.3s">
            <div className="number">24/7</div>
            <div className="desc">{t('home.stats.support')}</div>
          </StatItem>
        </StatsInner>
      </StatsBar>

      {/* ── Features ── */}
      <Section id="features">
        <SectionHeader>
          <SectionTag><Zap size={12} /> {t('home.features.tag')}</SectionTag>
          <SectionTitle>{t('home.features.title1')}<br /><span>{t('home.features.title2')}</span></SectionTitle>
          <SectionSub>{t('home.features.subtitle')}</SectionSub>
        </SectionHeader>
        <FeaturesGrid>
          <FeatureCard delay="0s">
            <FeatureIconBox bg="linear-gradient(135deg, #2A7DE1, #60A5FA)" shadow="rgba(42,125,225,0.35)">
              <Timer size={26} />
            </FeatureIconBox>
            <FeatureText>
              <h3>{t('home.features.timer.title')}</h3>
              <p>{t('home.features.timer.desc')}</p>
            </FeatureText>
          </FeatureCard>

          <FeatureCard delay="0.1s">
            <FeatureIconBox bg="linear-gradient(135deg, #2ED1A2, #059669)" shadow="rgba(46,209,162,0.35)">
              <Heart size={26} />
            </FeatureIconBox>
            <FeatureText>
              <h3>{t('home.features.tracking.title')}</h3>
              <p>{t('home.features.tracking.desc')}</p>
            </FeatureText>
          </FeatureCard>

          <FeatureCard delay="0.2s">
            <FeatureIconBox bg="linear-gradient(135deg, #F59E0B, #EF4444)" shadow="rgba(245,158,11,0.35)">
              <TrendingUp size={26} />
            </FeatureIconBox>
            <FeatureText>
              <h3>{t('home.features.stats.title')}</h3>
              <p>{t('home.features.stats.desc')}</p>
            </FeatureText>
          </FeatureCard>

          <FeatureCard delay="0.3s">
            <FeatureIconBox bg="linear-gradient(135deg, #8B5CF6, #EC4899)" shadow="rgba(139,92,246,0.35)">
              <BookOpen size={26} />
            </FeatureIconBox>
            <FeatureText>
              <h3>{t('home.features.journal.title')}</h3>
              <p>{t('home.features.journal.desc')}</p>
            </FeatureText>
          </FeatureCard>

          <FeatureCard delay="0.1s">
            <FeatureIconBox bg="linear-gradient(135deg, #06B6D4, #3B82F6)" shadow="rgba(6,182,212,0.35)">
              <Bell size={26} />
            </FeatureIconBox>
            <FeatureText>
              <h3>{t('home.features.notifs.title')}</h3>
              <p>{t('home.features.notifs.desc')}</p>
            </FeatureText>
          </FeatureCard>

          <FeatureCard delay="0.2s">
            <FeatureIconBox bg="linear-gradient(135deg, #10B981, #2A7DE1)" shadow="rgba(16,185,129,0.35)">
              <Shield size={26} />
            </FeatureIconBox>
            <FeatureText>
              <h3>{t('home.features.tips.title')}</h3>
              <p>{t('home.features.tips.desc')}</p>
            </FeatureText>
          </FeatureCard>
        </FeaturesGrid>
      </Section>

      {/* ── How It Works ── */}
      <section id="how" style={{ background: 'white', padding: '0' }}>
        <Section style={{ padding: '6rem 2rem' }}>
          <SectionHeader center>
            <SectionTag><Star size={12} /> {t('home.how.tag')}</SectionTag>
            <SectionTitle>{t('home.how.title1')} <span>{t('home.how.title2')}</span></SectionTitle>
            <SectionSub>{t('home.how.subtitle')}</SectionSub>
          </SectionHeader>
          <StepsGrid>
            <Step delay="0s">
              <StepNumber>1</StepNumber>
              <StepContent>
                <h3>{t('home.how.step1.title')}</h3>
                <p>{t('home.how.step1.desc')}</p>
              </StepContent>
            </Step>
            <Step delay="0.15s">
              <StepNumber>2</StepNumber>
              <StepContent>
                <h3>{t('home.how.step2.title')}</h3>
                <p>{t('home.how.step2.desc')}</p>
              </StepContent>
            </Step>
            <Step delay="0.3s">
              <StepNumber>3</StepNumber>
              <StepContent>
                <h3>{t('home.how.step3.title')}</h3>
                <p>{t('home.how.step3.desc')}</p>
              </StepContent>
            </Step>
          </StepsGrid>
        </Section>
      </section>

      {/* ── Goals ── */}
      <Section id="goals">
        <SectionHeader center>
          <SectionTag><Users size={12} /> {t('home.goalsSection.tag')}</SectionTag>
          <SectionTitle>{t('home.goalsSection.title1')} <span>{t('home.goalsSection.title2')}</span> ?</SectionTitle>
          <SectionSub>{t('home.goalsSection.subtitle')}</SectionSub>
        </SectionHeader>
        <GoalsGrid>
          <GoalCard delay="0s" onClick={handleStart}>
            <GoalIcon bg="linear-gradient(135deg, #EF4444, #F97316)" shadow="rgba(239,68,68,0.3)">
              <Heart size={28} />
            </GoalIcon>
            <GoalTitle>{t('home.goalsSection.health.title')}</GoalTitle>
            <GoalDesc>{t('home.goalsSection.health.desc')}</GoalDesc>
          </GoalCard>

          <GoalCard delay="0.1s" onClick={handleStart}>
            <GoalIcon bg="linear-gradient(135deg, #3B82F6, #8B5CF6)" shadow="rgba(59,130,246,0.3)">
              <Scale size={28} />
            </GoalIcon>
            <GoalTitle>{t('home.goalsSection.weight.title')}</GoalTitle>
            <GoalDesc>{t('home.goalsSection.weight.desc')}</GoalDesc>
          </GoalCard>

          <GoalCard delay="0.2s" onClick={handleStart}>
            <GoalIcon bg="linear-gradient(135deg, #F59E0B, #EF4444)" shadow="rgba(245,158,11,0.3)">
              <Moon size={28} />
            </GoalIcon>
            <GoalTitle>{t('home.goalsSection.spiritual.title')}</GoalTitle>
            <GoalDesc>{t('home.goalsSection.spiritual.desc')}</GoalDesc>
          </GoalCard>

          <GoalCard delay="0.3s" onClick={handleStart}>
            <GoalIcon bg="linear-gradient(135deg, #2ED1A2, #06B6D4)" shadow="rgba(46,209,162,0.3)">
              <Brain size={28} />
            </GoalIcon>
            <GoalTitle>{t('home.goalsSection.learning.title')}</GoalTitle>
            <GoalDesc>{t('home.goalsSection.learning.desc')}</GoalDesc>
          </GoalCard>
        </GoalsGrid>
      </Section>

      {/* ── Final CTA ── */}
      <CTASection>
        <CTAInner>
          <CTATitle>{t('home.cta.title1')}<br />{t('home.cta.title2')}</CTATitle>
          <CTASub>{t('home.cta.subtitle')}</CTASub>
          <CTAButtons>
            <CTAButtonPrimary onClick={handleStart}>
              {t('home.cta.start')} <ArrowRight size={18} />
            </CTAButtonPrimary>
            <CTAButtonSecondary onClick={() => navigate('/about')}>
              {t('home.cta.learn')}
            </CTAButtonSecondary>
          </CTAButtons>
          <CheckList>
            <span><Check size={14} /> {t('home.cta.check1')}</span>
            <span><Check size={14} /> {t('home.cta.check2')}</span>
            <span><Check size={14} /> {t('home.cta.check3')}</span>
          </CheckList>
        </CTAInner>
      </CTASection>

      {/* ── Footer ── */}
      <Footer>
        {t('home.footer')}
      </Footer>

    </Page>
  );
};

export default Home;
