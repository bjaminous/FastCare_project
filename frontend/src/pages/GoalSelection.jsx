import { useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { keyframes } from 'styled-components';
import { ArrowLeft, Heart, Scale, Moon, Brain, ArrowRight, Sparkles, Check, X } from 'lucide-react';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const floatY = keyframes`
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-10px); }
`;

const Page = styled.div`
  min-height: 100vh;
  background: #F8FAFF;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
`;

const TopBar = styled.nav`
  position: sticky; top: 0; z-index: 100;
  background: rgba(248,250,255,0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(42,125,225,0.08);
  padding: 0 2rem; height: 68px;
  display: flex; align-items: center; justify-content: space-between;
`;
const Logo = styled.div`
  font-size: 1.45rem; font-weight: 900;
  background: linear-gradient(135deg, #2A7DE1, #2ED1A2);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  letter-spacing: -0.03em; cursor: pointer;
`;
const BackBtn = styled.button`
  display: flex; align-items: center; gap: 0.45rem;
  background: none; border: 1.5px solid rgba(42,125,225,0.2);
  color: #2A7DE1; font-size: 0.88rem; font-weight: 700;
  cursor: pointer; padding: 0.5rem 1rem; border-radius: 10px;
  transition: all 0.2s;
  &:hover { background: rgba(42,125,225,0.06); }
`;

const HeroBanner = styled.section`
  background: linear-gradient(135deg, #0F172A 0%, #1E3A5F 60%, #0F4C3A 100%);
  padding: 3.5rem 2rem 4rem; text-align: center; position: relative; overflow: hidden;
  @media (max-width: 768px) { padding: 2.5rem 1.5rem 3rem; }
`;
const Orb = styled.div`
  position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none;
  &.a { width:400px;height:400px;background:rgba(42,125,225,0.2);top:-150px;left:-80px; }
  &.b { width:350px;height:350px;background:rgba(46,209,162,0.15);bottom:-100px;right:-60px; }
`;
const StepBadge = styled.div`
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);
  color: rgba(255,255,255,0.85); padding: 0.4rem 1.1rem; border-radius: 9999px;
  font-size: 0.78rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  margin-bottom: 1.5rem; animation: ${fadeInUp} 0.5s ease both;
`;
const HeroTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3.8rem); font-weight: 900; color: white;
  letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 1rem;
  animation: ${fadeInUp} 0.6s ease 0.05s both;
  span { background: linear-gradient(90deg,#60A5FA,#2ED1A2);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
`;
const HeroSub = styled.p`
  font-size: clamp(0.95rem,2vw,1.15rem); color: rgba(255,255,255,0.65);
  line-height: 1.7; max-width: 560px; margin: 0 auto;
  animation: ${fadeInUp} 0.6s ease 0.1s both;
`;

const StepBar = styled.div`
  background: white; border-bottom: 1px solid rgba(42,125,225,0.08);
  padding: 1rem 2rem; display: flex; justify-content: center; align-items: center;
`;
const StepItem = styled.div`
  display: flex; align-items: center; gap: 0.5rem;
  .circle {
    width:32px;height:32px;border-radius:50%;
    display:flex;align-items:center;justify-content:center;
    font-size:0.8rem;font-weight:800;
    background:${p=>p.done||p.active?'linear-gradient(135deg,#2A7DE1,#2ED1A2)':'#E2E8F0'};
    color:${p=>(p.done||p.active)?'white':'#94a3b8'};
  }
  .label { font-size:0.78rem;font-weight:700;color:${p=>(p.done||p.active)?'#2A7DE1':'#94a3b8'};
    @media(max-width:480px){display:none;} }
`;
const StepLine = styled.div`
  width:60px;height:2px;
  background:${p=>p.done?'linear-gradient(90deg,#2A7DE1,#2ED1A2)':'#E2E8F0'};
  margin:0 0.5rem;
  @media(max-width:480px){width:30px;}
`;

const Main = styled.main`
  flex: 1; max-width: 1280px; width: 100%; margin: 0 auto;
  padding: 3rem 2rem 4rem;
  @media (max-width: 768px) { padding: 2rem 1.25rem 3rem; }
  @media (max-width: 480px) { padding: 1.5rem 1rem 2.5rem; }
`;

const SectionLabel = styled.p`
  text-align: center; font-size: 0.85rem; font-weight: 700;
  color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid; grid-template-columns: repeat(2,1fr); gap: 1.5rem;
  @media (max-width: 680px) { grid-template-columns: 1fr; }
`;

const GoalCard = styled.div`
  background: white; border-radius: 22px; padding: 2rem;
  cursor: pointer; border: 2px solid rgba(42,125,225,0.08);
  box-shadow: 0 2px 16px rgba(0,0,0,0.04);
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  position: relative; overflow: hidden;
  animation: ${fadeInUp} 0.6s ease both;
  animation-delay: ${p => p.delay || '0s'};

  &::before {
    content:''; position:absolute; left:0;top:0;bottom:0; width:4px;
    background:${p=>p.accent}; border-radius:0 4px 4px 0;
    opacity:0; transition:opacity 0.3s;
  }
  &:hover {
    transform: translateY(-6px);
    border-color: ${p => p.accentColor};
    box-shadow: 0 24px 60px -15px ${p => p.shadowColor};
    &::before { opacity: 1; }
  }
  @media (max-width:480px) { padding: 1.5rem; }
`;

const CardTop = styled.div`
  display: flex; align-items: flex-start;
  justify-content: space-between; margin-bottom: 1.25rem;
`;
const IconBox = styled.div`
  width:62px;height:62px;min-width:62px;
  background:${p=>p.bg}; border-radius:18px;
  display:flex;align-items:center;justify-content:center; color:white;
  box-shadow:0 10px 25px -8px ${p=>p.shadow};
  animation:${floatY} ${p=>p.dur||'4s'} ease-in-out infinite;
  animation-delay:${p=>p.delay||'0s'};
  @media(max-width:480px){width:52px;height:52px;min-width:52px;}
`;
const Pill = styled.div`
  display:inline-flex;align-items:center;gap:0.3rem;
  background:${p=>p.bg};color:${p=>p.color};border:1px solid ${p=>p.border};
  padding:0.25rem 0.7rem;border-radius:9999px;font-size:0.72rem;font-weight:700;
  white-space:nowrap;letter-spacing:0.03em;
`;
const CardTitle = styled.h3`
  font-size:1.2rem;font-weight:900;color:#0F172A;
  margin-bottom:0.5rem;letter-spacing:-0.02em;
`;
const CardDesc = styled.p`
  font-size:0.88rem;color:#64748b;line-height:1.65;margin-bottom:1.25rem;
`;
const BulletList = styled.div`
  display:flex;flex-direction:column;gap:0.4rem;margin-bottom:1.5rem;
`;
const Bullet = styled.div`
  display:flex;align-items:center;gap:0.5rem;font-size:0.8rem;font-weight:600;color:#475569;
  .dot{width:16px;height:16px;min-width:16px;background:${p=>p.bg};border-radius:50%;
    display:flex;align-items:center;justify-content:center;color:${p=>p.color};}
`;
const SeeMore = styled.div`
  display:flex;align-items:center;justify-content:space-between;
  padding-top:1rem;border-top:1px solid rgba(42,125,225,0.07);
  font-size:0.85rem;font-weight:800;color:${p=>p.color||'#2A7DE1'};
  transition:gap 0.2s;
  ${GoalCard}:hover & { gap:0.5rem; }
`;

const GOALS = [
  {
    id: 'health', tKey: 'health', icon: Heart, title: 'Santé & Vitalité',
    desc: 'Réduire l\'inflammation, booster votre énergie et améliorer votre bien-être global.',
    bullets: ['Énergie et concentration accrues', 'Meilleur sommeil et récupération', 'Système immunitaire renforcé'],
    badge: { text: '⭐ Recommandé pour débuter', bg:'rgba(239,68,68,0.08)', color:'#DC2626', border:'rgba(239,68,68,0.18)' },
    iconBg:'linear-gradient(135deg,#EF4444,#F97316)', iconShadow:'rgba(239,68,68,0.35)',
    accentColor:'#EF4444', accent:'linear-gradient(180deg,#EF4444,#F97316)',
    shadowColor:'rgba(239,68,68,0.18)', bulletBg:'rgba(239,68,68,0.1)', bulletColor:'#EF4444',
    seeMoreColor:'#EF4444', dur:'4s',
  },
  {
    id: 'weight-loss', tKey: 'weight', icon: Scale, title: 'Perte de Poids',
    desc: 'Un déficit calorique naturel, sans régime strict, pour des résultats durables.',
    bullets: ['Perte de poids progressive et saine', 'Préservation de la masse musculaire', 'Suivi précis du poids intégré'],
    badge: { text: '🔥 Le plus populaire', bg:'rgba(59,130,246,0.08)', color:'#3B82F6', border:'rgba(59,130,246,0.18)' },
    iconBg:'linear-gradient(135deg,#3B82F6,#8B5CF6)', iconShadow:'rgba(59,130,246,0.35)',
    accentColor:'#3B82F6', accent:'linear-gradient(180deg,#3B82F6,#8B5CF6)',
    shadowColor:'rgba(59,130,246,0.18)', bulletBg:'rgba(59,130,246,0.1)', bulletColor:'#3B82F6',
    seeMoreColor:'#3B82F6', dur:'4.5s',
  },
  {
    id: 'spiritual', tKey: 'spiritual', icon: Moon, title: 'Ramadan / Carême',
    desc: 'Un accompagnement respectueux de votre démarche religieuse ou spirituelle.',
    bullets: ['Mode Ramadan & Carême', 'Suivi de l\'hydratation (Iftar)', 'Conseils santé spécifiques'],
    badge: { text: '🌙 Ramadan / Carême', bg:'rgba(245,158,11,0.08)', color:'#D97706', border:'rgba(245,158,11,0.2)' },
    iconBg:'linear-gradient(135deg,#F59E0B,#EF4444)', iconShadow:'rgba(245,158,11,0.35)',
    accentColor:'#F59E0B', accent:'linear-gradient(180deg,#F59E0B,#EF4444)',
    shadowColor:'rgba(245,158,11,0.18)', bulletBg:'rgba(245,158,11,0.1)', bulletColor:'#D97706',
    seeMoreColor:'#D97706', dur:'5s',
  },
  {
    id: 'learning', tKey: 'learning', icon: Brain, title: 'Découverte & Apprentissage',
    desc: 'Débutez en douceur avec des protocoles progressifs et un accompagnement bienveillant.',
    bullets: ['Protocoles adaptés aux débutants', 'Progression graduelle', 'Zéro pression, 100% bienveillant'],
    badge: { text: '🌱 Idéal pour débuter', bg:'rgba(46,209,162,0.08)', color:'#059669', border:'rgba(46,209,162,0.2)' },
    iconBg:'linear-gradient(135deg,#2ED1A2,#06B6D4)', iconShadow:'rgba(46,209,162,0.35)',
    accentColor:'#2ED1A2', accent:'linear-gradient(180deg,#2ED1A2,#06B6D4)',
    shadowColor:'rgba(46,209,162,0.18)', bulletBg:'rgba(46,209,162,0.1)', bulletColor:'#059669',
    seeMoreColor:'#059669', dur:'3.8s',
  },
];

/* ─── Modal styles ─── */
const Overlay = styled.div`
  position: fixed; inset: 0; z-index: 500;
  background: rgba(15,23,42,0.55); backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  padding: 1.5rem;
  animation: ${fadeInUp} 0.2s ease both;
`;
const ModalBox = styled.div`
  background: white; border-radius: 24px; padding: 2.5rem 2rem 2rem;
  max-width: 460px; width: 100%;
  box-shadow: 0 32px 80px -12px rgba(0,0,0,0.28);
  position: relative;
  animation: ${fadeInUp} 0.25s ease both;
`;
const ModalClose = styled.button`
  position: absolute; top: 1rem; right: 1rem;
  background: #F1F5F9; border: none; border-radius: 9999px;
  width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #64748b; transition: background 0.2s;
  &:hover { background: #E2E8F0; }
`;
const ModalIcon = styled.div`
  font-size: 3rem; text-align: center; margin-bottom: 1rem; line-height: 1;
`;
const ModalTitle = styled.h2`
  font-size: 1.35rem; font-weight: 900; color: #0F172A;
  letter-spacing: -0.02em; text-align: center; margin-bottom: 0.5rem;
`;
const ModalSub = styled.p`
  font-size: 0.88rem; color: #64748b; text-align: center;
  line-height: 1.6; margin-bottom: 1.75rem;
`;
const ChoiceGrid = styled.div`display: flex; flex-direction: column; gap: 0.85rem;`;
const ChoiceBtn = styled.button`
  display: flex; align-items: center; gap: 1rem;
  background: white; border: 2px solid ${p => p.active ? p.accent : 'rgba(42,125,225,0.12)'};
  border-radius: 16px; padding: 1rem 1.25rem; cursor: pointer; text-align: left;
  transition: all 0.2s; width: 100%;
  &:hover { border-color: ${p => p.accent}; background: ${p => p.hoverBg}; transform: translateY(-1px); }
`;
const ChoiceEmoji = styled.div`
  font-size: 2rem; min-width: 44px; text-align: center; line-height: 1;
`;
const ChoiceText = styled.div``;
const ChoiceTitle = styled.div`font-size: 0.98rem; font-weight: 800; color: #0F172A; margin-bottom: 0.15rem;`;
const ChoiceDesc = styled.div`font-size: 0.78rem; color: #64748b; line-height: 1.5;`;

const GoalSelection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (searchParams.get('modal') === 'spiritual') {
      setShowModal(true);
    }
  }, [searchParams]);

  const handleCardClick = (id) => {
    if (id === 'spiritual') {
      setShowModal(true);
    } else {
      navigate(`/goal/${id}`);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    // nettoie le ?modal= de l'URL sans recharger la page
    if (searchParams.get('modal')) navigate('/goal-selection', { replace: true });
  };

  const handleSpiritualChoice = (type) => {
    setShowModal(false);
    navigate(`/goal/spiritual?type=${type}`);
  };

  return (
    <Page>
      <TopBar>
        <BackBtn onClick={() => navigate('/')}><ArrowLeft size={15} /> Retour</BackBtn>
        <Logo>FastCare</Logo>
        <div style={{ width: 100 }} />
      </TopBar>

      <HeroBanner>
        <Orb className="a" /><Orb className="b" />
        <StepBadge><Sparkles size={13} /> Étape 2 sur 3 — Personnalisation</StepBadge>
        <HeroTitle>{t('goalSelection.title')}</HeroTitle>
        <HeroSub>
          Cliquez sur un objectif pour en savoir plus et comprendre comment FastCare vous accompagne spécifiquement.
        </HeroSub>
      </HeroBanner>

      <StepBar>
        <StepItem done><div className="circle"><Check size={14}/></div><div className="label">Inscription</div></StepItem>
        <StepLine done />
        <StepItem active><div className="circle">2</div><div className="label">Objectif</div></StepItem>
        <StepLine />
        <StepItem><div className="circle">3</div><div className="label">Timer</div></StepItem>
      </StepBar>

      <Main>
        <SectionLabel>Appuyez sur un objectif pour en savoir plus →</SectionLabel>
        <Grid>
          {GOALS.map((g, i) => {
            const Icon = g.icon;
            return (
              <GoalCard key={g.id} delay={`${i*0.08}s`} accentColor={g.accentColor}
                accent={g.accent} shadowColor={g.shadowColor}
                onClick={() => handleCardClick(g.id)}>
                <CardTop>
                  <IconBox bg={g.iconBg} shadow={g.iconShadow} dur={g.dur} delay={`${i*0.4}s`}>
                    <Icon size={26} />
                  </IconBox>
                  <Pill bg={g.badge.bg} color={g.badge.color} border={g.badge.border}>{g.badge.text}</Pill>
                </CardTop>
                <CardTitle>{t(`goalSelection.goals.${g.tKey}.name`, g.title)}</CardTitle>
                <CardDesc>{t(`goalSelection.goals.${g.tKey}.desc`, g.desc)}</CardDesc>
                <BulletList>
                  {g.bullets.map((b,j) => (
                    <Bullet key={j} bg={g.bulletBg} color={g.bulletColor}>
                      <span className="dot"><Check size={9}/></span>{b}
                    </Bullet>
                  ))}
                </BulletList>
                <SeeMore color={g.seeMoreColor}>
                  <span>Découvrir cet objectif</span>
                  <ArrowRight size={16}/>
                </SeeMore>
              </GoalCard>
            );
          })}
        </Grid>
      </Main>

      {showModal && (
        <Overlay onClick={closeModal}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalClose onClick={closeModal}><X size={15} /></ModalClose>
            <ModalIcon>🌙✝️</ModalIcon>
            <ModalTitle>Quel jeûne pratiquez-vous ?</ModalTitle>
            <ModalSub>
              FastCare adapte votre accompagnement selon votre pratique religieuse ou spirituelle.
            </ModalSub>
            <ChoiceGrid>
              <ChoiceBtn accent="#F59E0B" hoverBg="rgba(245,158,11,0.04)"
                onClick={() => handleSpiritualChoice('ramadan')}>
                <ChoiceEmoji>🌙</ChoiceEmoji>
                <ChoiceText>
                  <ChoiceTitle>Je fais le Ramadan</ChoiceTitle>
                  <ChoiceDesc>Jeûne du lever au coucher du soleil · Rappels Suhoor & Iftar · Conseils halal</ChoiceDesc>
                </ChoiceText>
              </ChoiceBtn>
              <ChoiceBtn accent="#8B5CF6" hoverBg="rgba(139,92,246,0.04)"
                onClick={() => handleSpiritualChoice('careme')}>
                <ChoiceEmoji>✝️</ChoiceEmoji>
                <ChoiceText>
                  <ChoiceTitle>Je fais le Carême</ChoiceTitle>
                  <ChoiceDesc>40 jours de jeûne · Mercredi des Cendres au Vendredi Saint · Accompagnement chrétien</ChoiceDesc>
                </ChoiceText>
              </ChoiceBtn>
            </ChoiceGrid>
          </ModalBox>
        </Overlay>
      )}
    </Page>
  );
};

export default GoalSelection;
