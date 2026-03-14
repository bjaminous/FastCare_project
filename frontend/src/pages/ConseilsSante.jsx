import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import {
  Heart, Scale, Moon, Brain, Zap, Droplets, Shield,
  Apple, Clock, Flame, Star, Sparkles, Users,
} from 'lucide-react';
import AppNav from '../components/AppNav';

const fadeInUp = keyframes`
  from { opacity:0; transform:translateY(20px); }
  to   { opacity:1; transform:translateY(0); }
`;

const Page = styled.div`min-height:100vh;background:#F8FAFF;padding-bottom:5rem;`;
const Content = styled.div`
  max-width:1060px;width:100%;margin:0 auto;padding:2.5rem 2rem;
  @media(max-width:768px){padding:1.75rem 1.25rem;}
  @media(max-width:480px){padding:1.25rem 1rem;}
`;

const PageTitle = styled.h1`
  font-size:clamp(1.5rem,3vw,2rem);font-weight:900;color:#0F172A;
  letter-spacing:-0.02em;margin-bottom:0.3rem;
  animation:${fadeInUp} 0.4s ease both;
`;
const PageSub = styled.p`
  font-size:0.88rem;color:#64748b;margin-bottom:2rem;
  animation:${fadeInUp} 0.4s ease 0.04s both;
`;

/* ── Filtre objectif ── */
const FilterRow = styled.div`
  display:flex;gap:0.6rem;flex-wrap:wrap;margin-bottom:2.5rem;
  animation:${fadeInUp} 0.4s ease 0.08s both;
`;
const FilterBtn = styled.button`
  display:flex;align-items:center;gap:0.45rem;
  background:${p=>p.active?p.activeBg:'white'};
  color:${p=>p.active?'white':'#475569'};
  border:2px solid ${p=>p.active?'transparent':'rgba(42,125,225,0.12)'};
  border-radius:12px;padding:0.5rem 1rem;font-size:0.83rem;font-weight:700;
  cursor:pointer;transition:all 0.18s;
  &:hover{border-color:${p=>p.hoverColor};color:${p=>p.hoverColor};}
`;

/* ── Section ── */
const SectionTitle = styled.h2`
  font-size:1.1rem;font-weight:900;color:#0F172A;
  margin-bottom:1.25rem;display:flex;align-items:center;gap:0.5rem;
`;
const SectionIcon = styled.div`
  width:28px;height:28px;border-radius:8px;
  background:${p=>p.bg};display:flex;align-items:center;justify-content:center;
  color:${p=>p.color};
`;

/* ── Cards ── */
const Grid = styled.div`
  display:grid;grid-template-columns:repeat(3,1fr);gap:1.1rem;margin-bottom:3rem;
  @media(max-width:900px){grid-template-columns:repeat(2,1fr);}
  @media(max-width:560px){grid-template-columns:1fr;}
`;
const TipCard = styled.div`
  background:white;border-radius:18px;padding:1.4rem;
  border:1.5px solid rgba(42,125,225,0.07);
  box-shadow:0 2px 12px rgba(0,0,0,0.04);
  transition:transform 0.22s,box-shadow 0.22s;
  animation:${fadeInUp} 0.45s ease ${p=>p.delay||'0s'} both;
  &:hover{transform:translateY(-4px);box-shadow:0 12px 30px -8px ${p=>p.shadow||'rgba(42,125,225,0.15)'};}
`;
const TipIconBox = styled.div`
  width:42px;height:42px;border-radius:12px;
  background:${p=>p.bg};display:flex;align-items:center;justify-content:center;
  color:${p=>p.color};margin-bottom:0.85rem;
`;
const TipTitle = styled.div`font-size:0.95rem;font-weight:800;color:#0F172A;margin-bottom:0.4rem;`;
const TipText = styled.div`font-size:0.82rem;color:#64748b;line-height:1.65;`;
const TipTag = styled.span`
  display:inline-block;margin-top:0.75rem;
  font-size:0.66rem;font-weight:700;
  background:${p=>p.bg};color:${p=>p.color};
  border-radius:9999px;padding:0.2rem 0.6rem;
`;

/* ── Important banner ── */
const WarningBanner = styled.div`
  background:rgba(245,158,11,0.07);border:1.5px solid rgba(245,158,11,0.25);
  border-radius:16px;padding:1.1rem 1.5rem;margin-bottom:2.5rem;
  display:flex;align-items:flex-start;gap:0.75rem;
  font-size:0.83rem;color:#92400E;font-weight:600;line-height:1.6;
  animation:${fadeInUp} 0.4s ease 0.12s both;
`;

/* ── Data ── */
const FILTERS = [
  { key:'all',      label:'Tous les conseils', icon:Sparkles, activeBg:'linear-gradient(135deg,#2A7DE1,#2ED1A2)', hoverColor:'#2A7DE1' },
  { key:'health',   label:'Santé',             icon:Heart,    activeBg:'linear-gradient(135deg,#EF4444,#F97316)', hoverColor:'#EF4444' },
  { key:'weight',   label:'Poids',             icon:Scale,    activeBg:'linear-gradient(135deg,#3B82F6,#8B5CF6)', hoverColor:'#3B82F6' },
  { key:'spiritual',label:'Spirituel',         icon:Moon,     activeBg:'linear-gradient(135deg,#F59E0B,#EF4444)', hoverColor:'#F59E0B' },
  { key:'beginner', label:'Débutant',          icon:Brain,    activeBg:'linear-gradient(135deg,#2ED1A2,#06B6D4)', hoverColor:'#2ED1A2' },
];

const SECTIONS = [
  {
    key:'hydratation',
    title:'Hydratation',
    icon: Droplets, iconBg:'rgba(59,130,246,0.1)', iconColor:'#3B82F6',
    tips:[
      { title:'2L minimum par jour', text:'Pendant le jeûne, l\'eau est votre meilleure alliée. Visez 2L répartis tout au long de la journée.', icon:Droplets, bg:'rgba(59,130,246,0.1)', color:'#3B82F6', shadow:'rgba(59,130,246,0.18)', tag:'Essentiel', tagBg:'rgba(59,130,246,0.1)', tagColor:'#3B82F6', cats:['all','health','weight','spiritual','beginner'] },
      { title:'Eau + électrolytes', text:'Ajoutez une pincée de sel de mer à votre eau pour maintenir l\'équilibre électrolytique et éviter les crampes.', icon:Droplets, bg:'rgba(59,130,246,0.1)', color:'#3B82F6', shadow:'rgba(59,130,246,0.18)', tag:'Avancé', tagBg:'rgba(59,130,246,0.08)', tagColor:'#2563EB', cats:['all','health','weight'] },
      { title:'Café et thé OK', text:'Café noir et thé sans sucre sont autorisés pendant le jeûne. Ils peuvent même aider à gérer la faim.', icon:Zap, bg:'rgba(245,158,11,0.1)', color:'#D97706', shadow:'rgba(245,158,11,0.18)', tag:'Pratique', tagBg:'rgba(245,158,11,0.1)', tagColor:'#D97706', cats:['all','health','weight','beginner'] },
    ]
  },
  {
    key:'alimentation',
    title:'Alimentation',
    icon: Apple, iconBg:'rgba(46,209,162,0.1)', iconColor:'#059669',
    tips:[
      { title:'Brisez le jeûne en douceur', text:'Commencez par des aliments légers : fruits, yaourt, oeufs. Évitez un repas copieux immédiatement après le jeûne.', icon:Apple, bg:'rgba(46,209,162,0.1)', color:'#059669', shadow:'rgba(46,209,162,0.18)', tag:'Nutrition', tagBg:'rgba(46,209,162,0.1)', tagColor:'#059669', cats:['all','health','weight','spiritual','beginner'] },
      { title:'Protéines à l\'Iftar', text:'Un repas riche en protéines après le jeûne préserve votre masse musculaire et vous rassasie durablement.', icon:Flame, bg:'rgba(239,68,68,0.1)', color:'#EF4444', shadow:'rgba(239,68,68,0.18)', tag:'Muscles', tagBg:'rgba(239,68,68,0.1)', tagColor:'#EF4444', cats:['all','health','weight','spiritual'] },
      { title:'Évitez le sucre rapide', text:'Le sucre rapide crée un pic d\'insuline puis un crash d\'énergie. Préférez les glucides complexes et les fibres.', icon:Shield, bg:'rgba(139,92,246,0.1)', color:'#7C3AED', shadow:'rgba(139,92,246,0.18)', tag:'Glycémie', tagBg:'rgba(139,92,246,0.1)', tagColor:'#7C3AED', cats:['all','health','weight'] },
      { title:'Recettes Iftar équilibrées', text:'Dattes + eau pour briser le jeûne, soupe légère, puis repas principal 30 min après. Cette tradition est scientifiquement fondée.', icon:Star, bg:'rgba(245,158,11,0.1)', color:'#D97706', shadow:'rgba(245,158,11,0.18)', tag:'Ramadan', tagBg:'rgba(245,158,11,0.1)', tagColor:'#D97706', cats:['all','spiritual'] },
    ]
  },
  {
    key:'mental',
    title:'Mental & Lifestyle',
    icon: Brain, iconBg:'rgba(139,92,246,0.1)', iconColor:'#7C3AED',
    tips:[
      { title:'La faim vient par vagues', text:'La sensation de faim dure environ 20 min puis s\'atténue. Buvez un verre d\'eau et attendez — elle passe presque toujours.', icon:Brain, bg:'rgba(139,92,246,0.1)', color:'#7C3AED', shadow:'rgba(139,92,246,0.18)', tag:'Mental', tagBg:'rgba(139,92,246,0.1)', tagColor:'#7C3AED', cats:['all','health','beginner','spiritual'] },
      { title:'Occupez votre esprit', text:'La faim est souvent amplifiée par l\'ennui. Travaillez, lisez, promenez-vous — l\'activité mentale réduit la perception de la faim.', icon:Sparkles, bg:'rgba(42,125,225,0.1)', color:'#2A7DE1', shadow:'rgba(42,125,225,0.18)', tag:'Astuce', tagBg:'rgba(42,125,225,0.1)', tagColor:'#2A7DE1', cats:['all','beginner','health'] },
      { title:'Dormez suffisamment', text:'Le sommeil régule les hormones de la faim (ghréline et leptine). Une nuit courte augmente l\'appétit le lendemain.', icon:Moon, bg:'rgba(99,102,241,0.1)', color:'#6366F1', shadow:'rgba(99,102,241,0.18)', tag:'Sommeil', tagBg:'rgba(99,102,241,0.1)', tagColor:'#6366F1', cats:['all','health','weight'] },
      { title:'Ne vous culpabilisez pas', text:'Craquer sur un repas ne ruine pas tout. Le jeûne intermittent est un style de vie, pas un régime. Reprenez simplement le lendemain.', icon:Users, bg:'rgba(46,209,162,0.1)', color:'#059669', shadow:'rgba(46,209,162,0.18)', tag:'Bienveillance', tagBg:'rgba(46,209,162,0.1)', tagColor:'#059669', cats:['all','beginner','spiritual'] },
    ]
  },
  {
    key:'timing',
    title:'Timing & Stratégie',
    icon: Clock, iconBg:'rgba(245,158,11,0.1)', iconColor:'#D97706',
    tips:[
      { title:'Commencez par le soir', text:'Votre jeûne commence au dernier repas du soir. Si vous dînez à 20h, vous êtes déjà à 8h de jeûne à 4h du matin !', icon:Clock, bg:'rgba(245,158,11,0.1)', color:'#D97706', shadow:'rgba(245,158,11,0.18)', tag:'Débutant', tagBg:'rgba(46,209,162,0.1)', tagColor:'#059669', cats:['all','beginner','health'] },
      { title:'Progressez graduellement', text:'Passez de 12h à 14h, puis à 16h sur 2-3 semaines. Votre corps a besoin de temps pour s\'adapter.', icon:Zap, bg:'rgba(46,209,162,0.1)', color:'#059669', shadow:'rgba(46,209,162,0.18)', tag:'Progression', tagBg:'rgba(46,209,162,0.1)', tagColor:'#059669', cats:['all','beginner'] },
      { title:'Fenêtre alimentaire fixe', text:'Mangez toujours aux mêmes horaires. La régularité optimise votre rythme circadien et améliore la qualité du sommeil.', icon:Star, bg:'rgba(42,125,225,0.1)', color:'#2A7DE1', shadow:'rgba(42,125,225,0.18)', tag:'Régularité', tagBg:'rgba(42,125,225,0.1)', tagColor:'#2A7DE1', cats:['all','health','weight'] },
    ]
  },
];

export default function ConseilsSante() {
  const [activeFilter, setActiveFilter] = useState('all');

  const visibleSections = SECTIONS.map(section => ({
    ...section,
    tips: section.tips.filter(t => t.cats.includes(activeFilter)),
  })).filter(s => s.tips.length > 0);

  return (
    <Page>
      <AppNav />
      <Content>
        <PageTitle>Conseils santé</PageTitle>
        <PageSub>Des conseils pratiques et scientifiquement fondés pour optimiser votre jeûne.</PageSub>

        <FilterRow>
          {FILTERS.map(f => {
            const Icon = f.icon;
            return (
              <FilterBtn key={f.key} active={activeFilter === f.key}
                activeBg={f.activeBg} hoverColor={f.hoverColor}
                onClick={() => setActiveFilter(f.key)}>
                <Icon size={14}/> {f.label}
              </FilterBtn>
            );
          })}
        </FilterRow>

        <WarningBanner>
          <Shield size={16} style={{ marginTop:2, flexShrink:0 }} />
          Ces conseils sont à titre informatif et ne remplacent pas un avis médical. En cas de condition de santé particulière, consultez un professionnel avant de jeûner.
        </WarningBanner>

        {visibleSections.map(section => {
          const SIcon = section.icon;
          return (
            <div key={section.key}>
              <SectionTitle>
                <SectionIcon bg={section.iconBg} color={section.iconColor}>
                  <SIcon size={15}/>
                </SectionIcon>
                {section.title}
              </SectionTitle>
              <Grid>
                {section.tips.map((tip, i) => {
                  const TIcon = tip.icon;
                  return (
                    <TipCard key={i} delay={`${i * 0.06}s`} shadow={tip.shadow}>
                      <TipIconBox bg={tip.bg} color={tip.color}><TIcon size={18}/></TipIconBox>
                      <TipTitle>{tip.title}</TipTitle>
                      <TipText>{tip.text}</TipText>
                      <TipTag bg={tip.tagBg} color={tip.tagColor}>{tip.tag}</TipTag>
                    </TipCard>
                  );
                })}
              </Grid>
            </div>
          );
        })}
      </Content>
    </Page>
  );
}
