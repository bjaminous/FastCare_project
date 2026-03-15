import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import {
  ArrowLeft, Heart, Scale, Moon, Brain, ArrowRight,
  Sparkles, Clock, Shield, Star, Users, Zap, Flame,
} from 'lucide-react';

/* ─── Animations ─── */
const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const floatY = keyframes`
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(-12px); }
`;
const pulse = keyframes`
  0%,100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.15); }
  50%      { box-shadow: 0 0 0 20px rgba(255,255,255,0); }
`;

/* ─── Layout ─── */
const Page = styled.div`
  min-height: 100vh; background: #F8FAFF;
  display: flex; flex-direction: column; overflow-x: hidden;
`;
const TopBar = styled.nav`
  position: sticky; top: 0; z-index: 100;
  background: rgba(248,250,255,0.92); backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(42,125,225,0.08);
  padding: 0 2rem; height: 68px;
  display: flex; align-items: center; justify-content: space-between;
`;
const Logo = styled.div`
  font-size: 1.45rem; font-weight: 900;
  background: linear-gradient(135deg,#2A7DE1,#2ED1A2);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  letter-spacing: -0.03em; cursor: pointer;
`;
const BackBtn = styled.button`
  display: flex; align-items: center; gap: 0.45rem;
  background: none; border: 1.5px solid rgba(42,125,225,0.2);
  color: #2A7DE1; font-size: 0.88rem; font-weight: 700;
  cursor: pointer; padding: 0.5rem 1rem; border-radius: 10px; transition: all 0.2s;
  &:hover { background: rgba(42,125,225,0.06); }
`;

/* ─── Hero ─── */
const Hero = styled.section`
  background: ${p => p.heroBg};
  padding: 4rem 2rem 5rem; text-align: center;
  position: relative; overflow: hidden;
  @media (max-width: 768px) { padding: 3rem 1.5rem 4rem; }
`;
const Orb = styled.div`
  position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none;
  &.a { width:450px;height:450px;background:rgba(255,255,255,0.08);top:-180px;left:-120px; }
  &.b { width:380px;height:380px;background:rgba(255,255,255,0.06);bottom:-120px;right:-80px; }
`;
const IconBubble = styled.div`
  width: 96px; height: 96px; border-radius: 28px;
  background: rgba(255,255,255,0.18); border: 2px solid rgba(255,255,255,0.3);
  display: flex; align-items: center; justify-content: center;
  color: white; margin: 0 auto 1.75rem;
  animation: ${floatY} 4s ease-in-out infinite, ${pulse} 3s ease-in-out infinite;
  backdrop-filter: blur(10px);
  @media(max-width:480px){width:76px;height:76px;}
`;
const HeroBadge = styled.div`
  display: inline-flex; align-items: center; gap: 0.4rem;
  background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.22);
  color: rgba(255,255,255,0.9); padding: 0.35rem 1rem; border-radius: 9999px;
  font-size: 0.75rem; font-weight: 700; letter-spacing: 0.06em;
  text-transform: uppercase; margin-bottom: 1.25rem;
  animation: ${fadeInUp} 0.5s ease both;
`;
const HeroTitle = styled.h1`
  font-size: clamp(2rem,5vw,3.5rem); font-weight: 900; color: white;
  letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 1rem;
  animation: ${fadeInUp} 0.55s ease 0.05s both;
`;
const HeroSub = styled.p`
  font-size: clamp(1rem,2vw,1.2rem); color: rgba(255,255,255,0.72);
  line-height: 1.7; max-width: 580px; margin: 0 auto;
  animation: ${fadeInUp} 0.6s ease 0.1s both;
`;
const HeroStats = styled.div`
  display: flex; justify-content: center; gap: 2.5rem; flex-wrap: wrap;
  margin-top: 2.5rem; animation: ${fadeInUp} 0.65s ease 0.15s both;
  @media(max-width:480px){gap:1.5rem;}
`;
const StatItem = styled.div`
  text-align: center;
  .value { font-size: 1.8rem; font-weight: 900; color: white; line-height: 1; }
  .label { font-size: 0.75rem; color: rgba(255,255,255,0.6); font-weight: 600; margin-top: 0.25rem; }
  @media(max-width:480px){ .value{font-size:1.4rem;} }
`;

/* ─── Content sections ─── */
const Main = styled.main`
  max-width: 1060px; width: 100%; margin: 0 auto;
  padding: 4rem 2rem 6rem;
  @media(max-width:768px){padding:2.5rem 1.25rem 5rem;}
`;

const Section = styled.section`
  margin-bottom: 4rem;
  animation: ${fadeInUp} 0.6s ease both;
  animation-delay: ${p => p.delay || '0s'};
`;
const SectionTitle = styled.h2`
  font-size: clamp(1.4rem,3vw,2rem); font-weight: 900; color: #0F172A;
  letter-spacing: -0.02em; margin-bottom: 0.5rem;
  span { background: ${p => p.grad}; -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
`;
const SectionSub = styled.p`
  font-size: 0.95rem; color: #64748b; line-height: 1.7; margin-bottom: 2rem;
`;

/* Benefits grid */
const BenefitGrid = styled.div`
  display: grid; grid-template-columns: repeat(3,1fr); gap: 1.25rem;
  @media(max-width:768px){grid-template-columns:repeat(2,1fr);}
  @media(max-width:480px){grid-template-columns:1fr;}
`;
const BenefitCard = styled.div`
  background: white; border-radius: 18px; padding: 1.5rem;
  border: 1.5px solid rgba(42,125,225,0.08);
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
  transition: transform 0.25s, box-shadow 0.25s;
  &:hover { transform: translateY(-4px); box-shadow: 0 12px 30px -8px ${p => p.shadow || 'rgba(42,125,225,0.15)'}; }
`;
const BenefitIcon = styled.div`
  width: 44px; height: 44px; border-radius: 12px;
  background: ${p => p.bg}; display: flex; align-items: center; justify-content: center;
  color: ${p => p.color}; margin-bottom: 0.85rem;
`;
const BenefitTitle = styled.div`font-size:0.95rem;font-weight:800;color:#0F172A;margin-bottom:0.3rem;`;
const BenefitDesc = styled.div`font-size:0.82rem;color:#64748b;line-height:1.6;`;

/* How it works */
const StepList = styled.div`display:flex;flex-direction:column;gap:1rem;`;
const StepRow = styled.div`
  display:flex;align-items:flex-start;gap:1.25rem;
  background:white;border-radius:16px;padding:1.25rem 1.5rem;
  border:1.5px solid rgba(42,125,225,0.07);
  box-shadow:0 2px 10px rgba(0,0,0,0.03);
`;
const StepNum = styled.div`
  min-width:40px;height:40px;border-radius:12px;
  background:${p=>p.bg};display:flex;align-items:center;justify-content:center;
  font-size:0.9rem;font-weight:900;color:white;
`;
const StepText = styled.div``;
const StepTitle = styled.div`font-size:0.95rem;font-weight:800;color:#0F172A;margin-bottom:0.2rem;`;
const StepDesc = styled.div`font-size:0.83rem;color:#64748b;line-height:1.6;`;

/* Who is it for */
const ProfileGrid = styled.div`
  display:grid;grid-template-columns:repeat(2,1fr);gap:1.25rem;
  @media(max-width:600px){grid-template-columns:1fr;}
`;
const ProfileCard = styled.div`
  background:white;border-radius:18px;padding:1.4rem 1.5rem;
  border:1.5px solid rgba(42,125,225,0.08);
  display:flex;align-items:flex-start;gap:1rem;
`;
const ProfileEmoji = styled.div`font-size:2rem;line-height:1;`;
const ProfileText = styled.div``;
const ProfileTitle = styled.div`font-size:0.95rem;font-weight:800;color:#0F172A;margin-bottom:0.25rem;`;
const ProfileDesc = styled.div`font-size:0.82rem;color:#64748b;line-height:1.6;`;

/* Disclaimer */
const Disclaimer = styled.div`
  background:rgba(245,158,11,0.07);border:1px solid rgba(245,158,11,0.25);
  border-radius:14px;padding:1rem 1.25rem;margin-top:2rem;
  font-size:0.82rem;color:#92400e;line-height:1.6;font-weight:600;
  display:flex;align-items:flex-start;gap:0.7rem;
`;

/* Sticky CTA */
const StickyBar = styled.div`
  position: fixed; bottom: 0; left: 0; right: 0; z-index: 200;
  background: rgba(255,255,255,0.96); backdrop-filter:blur(20px);
  border-top: 1px solid rgba(42,125,225,0.1);
  padding: 1rem 2rem;
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  @media(max-width:600px){ flex-direction:column; padding:1rem 1.25rem; }
`;
const BarLeft = styled.div`
  .title { font-size:1rem;font-weight:800;color:#0F172A; }
  .sub   { font-size:0.8rem;color:#64748b; }
`;
const CtaBtn = styled.button`
  display:flex;align-items:center;gap:0.6rem;
  background:${p=>p.bg};color:white;border:none;
  font-size:1rem;font-weight:800;cursor:pointer;
  padding:0.85rem 2rem;border-radius:14px;
  box-shadow:0 8px 24px -6px ${p=>p.shadow};
  transition:transform 0.2s,box-shadow 0.2s;
  &:hover{transform:translateY(-2px);box-shadow:0 14px 32px -6px ${p=>p.shadow};}
  white-space:nowrap;
  @media(max-width:600px){width:100%;justify-content:center;}
`;

/* ─── Goal Data ─── */
const GOAL_DATA = {
  'health': {
    icon: Heart,
    badge: '❤️ Santé & Vitalité',
    heroBg: 'linear-gradient(135deg,#1a0a0a 0%,#3d1515 40%,#1a2a1a 100%)',
    accentBg: 'linear-gradient(135deg,#EF4444,#F97316)',
    accentColor: '#EF4444',
    accentColor2: '#F97316',
    grad: 'linear-gradient(90deg,#EF4444,#F97316)',
    shadow: 'rgba(239,68,68,0.22)',
    title: 'Santé & Vitalité',
    subtitle: 'Réduire l\'inflammation, booster votre énergie et améliorer votre bien-être global grâce au jeûne intermittent.',
    stats: [
      { value: '84%', label: 'Énergie améliorée' },
      { value: '3×', label: 'Moins d\'inflammation' },
      { value: '21j', label: 'Résultats visibles' },
    ],
    description: 'Le jeûne intermittent pour la santé n\'est pas un régime — c\'est un rythme de vie. En donnant à votre corps des fenêtres de repos digestif, vous activez des processus de régénération cellulaire profonds, notamment l\'autophagie (nettoyage cellulaire naturel). Résultat : plus d\'énergie, un système immunitaire renforcé, et une meilleure clarté mentale.',
    benefits: [
      { icon: Zap, title: 'Énergie décuplée', desc: 'Fini les coups de fatigue après les repas. Votre énergie devient stable et soutenue tout au long de la journée.', iconBg: 'rgba(239,68,68,0.1)', iconColor: '#EF4444' },
      { icon: Shield, title: 'Immunité renforcée', desc: 'Le jeûne stimule la production de nouvelles cellules immunitaires et réduit les marqueurs inflammatoires.', iconBg: 'rgba(239,68,68,0.1)', iconColor: '#EF4444' },
      { icon: Brain, title: 'Clarté mentale', desc: 'Les corps cétoniques produits pendant le jeûne sont un carburant premium pour votre cerveau.', iconBg: 'rgba(239,68,68,0.1)', iconColor: '#EF4444' },
      { icon: Clock, title: 'Sommeil profond', desc: 'Manger dans une fenêtre définie régule votre rythme circadien pour un sommeil réparateur.', iconBg: 'rgba(239,68,68,0.1)', iconColor: '#EF4444' },
      { icon: Heart, title: 'Santé cardiovasculaire', desc: 'Réduit la glycémie, le LDL et la pression artérielle — trois facteurs clés pour le cœur.', iconBg: 'rgba(239,68,68,0.1)', iconColor: '#EF4444' },
      { icon: Sparkles, title: 'Autophagie activée', desc: 'Après 16h de jeûne, votre corps nettoie ses cellules endommagées — un anti-âge naturel.', iconBg: 'rgba(239,68,68,0.1)', iconColor: '#EF4444' },
    ],
    steps: [
      { num: '1', title: 'Commencez par le 16/8', desc: 'Jeûnez 16h, mangez sur une fenêtre de 8h. La plupart des gens sautent simplement le petit-déjeuner.' },
      { num: '2', title: 'Hydratez-vous bien', desc: 'Eau, thé, café noir pendant le jeûne. FastCare vous envoie des rappels personnalisés pour boire suffisamment.' },
      { num: '3', title: 'Suivez vos ressentis', desc: 'Notez votre énergie, humeur et concentration chaque jour. Les données révèlent vos patterns optimaux.' },
      { num: '4', title: 'Progressez à votre rythme', desc: 'Après 2 semaines, votre corps s\'adapte. Vous pouvez étendre la fenêtre de jeûne si vous le souhaitez.' },
    ],
    profiles: [
      { emoji: '👩‍💼', title: 'Actifs surmenés', desc: 'Vous manquez d\'énergie malgré une alimentation correcte. Le jeûne régule vos niveaux d\'énergie naturellement.' },
      { emoji: '🏃', title: 'Sportifs', desc: 'Optimisez votre récupération et votre sensibilité à l\'insuline pour de meilleures performances.' },
      { emoji: '🧘', title: 'Bien-être holistique', desc: 'Vous cherchez une approche globale corps-esprit. Le jeûne s\'intègre parfaitement à votre démarche.' },
      { emoji: '🌿', title: 'Mode de vie sain', desc: 'Vous mangez bien mais voulez aller plus loin dans l\'optimisation de votre santé.' },
    ],
    ctaBg: 'linear-gradient(135deg,#EF4444,#F97316)',
    ctaShadow: 'rgba(239,68,68,0.4)',
  },
  'weight-loss': {
    icon: Scale,
    badge: '🔥 Perte de Poids',
    heroBg: 'linear-gradient(135deg,#0a0a1a 0%,#152040 40%,#1a0a2a 100%)',
    accentBg: 'linear-gradient(135deg,#3B82F6,#8B5CF6)',
    accentColor: '#3B82F6',
    accentColor2: '#8B5CF6',
    grad: 'linear-gradient(90deg,#3B82F6,#8B5CF6)',
    shadow: 'rgba(59,130,246,0.22)',
    title: 'Perte de Poids',
    subtitle: 'Perdez du poids naturellement, sans régime strict ni comptage obsessionnel de calories.',
    stats: [
      { value: '−4kg', label: 'En moyenne / mois' },
      { value: '91%', label: 'Masse musculaire préservée' },
      { value: '8 sem.', label: 'Pour des résultats stables' },
    ],
    description: 'Le jeûne intermittent pour la perte de poids crée un déficit calorique naturel sans vous affamer. En réduisant la fenêtre alimentaire, vous consommez moins de calories sans y penser. De plus, le jeûne booste l\'hormone de croissance et maintient votre masse musculaire — contrairement aux régimes classiques qui font perdre muscles et graisses simultanément.',
    benefits: [
      { icon: Flame, title: 'Combustion des graisses', desc: 'Après 12-16h de jeûne, votre corps puise dans ses réserves de graisses comme source d\'énergie principale.', iconBg: 'rgba(59,130,246,0.1)', iconColor: '#3B82F6' },
      { icon: Scale, title: 'Déficit naturel', desc: 'Moins de fenêtre pour manger = moins de calories ingérées, sans compter ni peser vos aliments.', iconBg: 'rgba(59,130,246,0.1)', iconColor: '#3B82F6' },
      { icon: Shield, title: 'Muscles préservés', desc: 'L\'hormone de croissance augmente pendant le jeûne, protégeant votre masse musculaire précieuse.', iconBg: 'rgba(59,130,246,0.1)', iconColor: '#3B82F6' },
      { icon: Zap, title: 'Insuline régulée', desc: 'Moins de pics d\'insuline = moins de stockage des graisses. Votre métabolisme devient plus efficace.', iconBg: 'rgba(59,130,246,0.1)', iconColor: '#3B82F6' },
      { icon: Star, title: 'Résultats durables', desc: 'Contrairement aux régimes yo-yo, le jeûne intermittent s\'adapte à votre vie et se maintient long terme.', iconBg: 'rgba(59,130,246,0.1)', iconColor: '#3B82F6' },
      { icon: Heart, title: 'Santé métabolique', desc: 'Améliore la glycémie, réduit le cholestérol et diminue la graisse viscérale (la plus dangereuse).', iconBg: 'rgba(59,130,246,0.1)', iconColor: '#3B82F6' },
    ],
    steps: [
      { num: '1', title: 'Fixez votre fenêtre alimentaire', desc: 'Choisissez vos 8h de repas (ex: 12h-20h). Vous pouvez boire de l\'eau, café et thé en dehors.' },
      { num: '2', title: 'Mangez normalement dans la fenêtre', desc: 'Pas de régime ni d\'aliments interdits. Mangez vos repas normaux — juste dans la fenêtre définie.' },
      { num: '3', title: 'Pesez-vous le matin', desc: 'FastCare trace votre courbe de poids. Vous verrez la tendance baissière se confirmer semaine après semaine.' },
      { num: '4', title: 'Ajustez selon vos résultats', desc: 'Si le poids stagne, réduisez légèrement la fenêtre ou ajoutez une courte marche. FastCare vous guide.' },
    ],
    profiles: [
      { emoji: '⚖️', title: 'Ceux qui ont tout essayé', desc: 'Régimes, comptage de calories, rien n\'a tenu. Le jeûne est différent car il s\'adapte à votre vie.' },
      { emoji: '🍕', title: 'Les gourmands', desc: 'Pas question de manger des salades toute la journée. Le jeûne vous permet de manger ce que vous aimez.' },
      { emoji: '📊', title: 'Orientés résultats', desc: 'Vous voulez voir des chiffres concrets. FastCare traque chaque gramme perdu avec des graphiques clairs.' },
      { emoji: '🏠', title: 'Vie occupée', desc: 'Pas de préparation de repas spéciaux ni de courses complexes. Juste un timing à respecter.' },
    ],
    ctaBg: 'linear-gradient(135deg,#3B82F6,#8B5CF6)',
    ctaShadow: 'rgba(59,130,246,0.4)',
  },
  'spiritual': {
    icon: Moon,
    heroBg: 'linear-gradient(135deg,#0a0808 0%,#2a1a06 40%,#1a0a0a 100%)',
    accentBg: 'linear-gradient(135deg,#F59E0B,#8B5CF6)',
    accentColor: '#F59E0B',
    grad: 'linear-gradient(90deg,#F59E0B,#8B5CF6)',
    shadow: 'rgba(245,158,11,0.22)',
    ctaBg: 'linear-gradient(135deg,#F59E0B,#EF4444)',
    ctaShadow: 'rgba(245,158,11,0.4)',
    // variants par type
    variants: {
      ramadan: {
        badge: '🌙 Ramadan',
        title: 'Le Ramadan',
        subtitle: 'Un accompagnement respectueux pour vivre le mois sacré du Ramadan en pleine santé et sérénité.',
        stats: [
          { value: '30j', label: 'Mode Ramadan dédié' },
          { value: '2×/j', label: 'Rappels Suhoor & Iftar' },
          { value: '100%', label: 'Halal & respectueux' },
        ],
        description: 'Durant le Ramadan, vous jeûnez de l\'aube (Fajr) au coucher du soleil (Maghrib). FastCare adapte automatiquement votre timer selon votre géolocalisation et le calendrier lunaire. L\'objectif : traverser ce mois sacré en bonne santé, bien hydraté, avec une énergie préservée pour vos prières et votre vie quotidienne.',
        benefits: [
          { icon: Moon, title: 'Horaires automatiques', desc: 'Fajr, Suhoor, Iftar, Maghrib — tous calculés selon votre ville et le calendrier islamique.', iconBg: 'rgba(245,158,11,0.1)', iconColor: '#D97706' },
          { icon: Clock, title: 'Rappels Suhoor', desc: 'Notification douce 30 min avant l\'aube pour que vous ne ratiez jamais le repas du Suhoor.', iconBg: 'rgba(245,158,11,0.1)', iconColor: '#D97706' },
          { icon: Shield, title: 'Hydratation entre Iftar et Suhoor', desc: 'Guide pour boire suffisamment pendant la nuit et éviter la déshydratation en journée.', iconBg: 'rgba(245,158,11,0.1)', iconColor: '#D97706' },
          { icon: Heart, title: 'Conseils santé halal', desc: 'Recettes d\'Iftar équilibrées, aliments à privilégier, comment briser le jeûne sans surcharger l\'estomac.', iconBg: 'rgba(245,158,11,0.1)', iconColor: '#D97706' },
          { icon: Sparkles, title: 'Autophagie & spiritualité', desc: 'Le jeûne du Ramadan déclenche l\'autophagie — un nettoyage cellulaire profond aux bienfaits reconnus par la science.', iconBg: 'rgba(245,158,11,0.1)', iconColor: '#D97706' },
          { icon: Users, title: 'Communauté Ramadan', desc: 'Rejoignez une communauté de pratiquants qui partagent conseils, recettes et encouragements.', iconBg: 'rgba(245,158,11,0.1)', iconColor: '#D97706' },
        ],
        steps: [
          { num: '1', title: 'Activez le mode Ramadan', desc: 'En un clic, l\'app détecte votre ville et adapte tous les horaires au calendrier lunaire actuel.' },
          { num: '2', title: 'Recevez vos rappels', desc: 'Notifications pour le Suhoor et l\'Iftar. Vous ne raterez jamais l\'heure de rompre le jeûne.' },
          { num: '3', title: 'Suivez votre hydratation nocturne', desc: 'Entre Iftar et Suhoor, loggez vos verres d\'eau. FastCare vous indique si vous buvez suffisamment.' },
          { num: '4', title: 'Consultez les conseils quotidiens', desc: 'Chaque jour, un conseil nutrition halal adapté au Ramadan : quoi manger à l\'Iftar, comment gérer la fatigue.' },
        ],
        profiles: [
          { emoji: '🕌', title: 'Pratiquants du Ramadan', desc: 'Vivez ce mois sacré sereinement avec un outil pensé pour vous et qui respecte votre démarche.' },
          { emoji: '👨‍👩‍👧', title: 'Familles', desc: 'Gérez le jeûne de toute la famille avec des profils multiples et des rappels partagés.' },
          { emoji: '🌍', title: 'Expatriés', desc: 'Calcul automatique des horaires selon votre localisation, où que vous soyez dans le monde.' },
          { emoji: '💪', title: 'Actifs pendant le Ramadan', desc: 'Vous travaillez ou faites du sport pendant le Ramadan. FastCare vous aide à préserver votre énergie.' },
        ],
      },
      careme: {
        badge: '✝️ Carême',
        title: 'Le Carême',
        subtitle: 'Un accompagnement spirituel et nutritionnel pour vivre les 40 jours du Carême chrétien en pleine conscience.',
        stats: [
          { value: '40j', label: 'Mercredi des Cendres au Vendredi Saint' },
          { value: '3×/j', label: 'Rappels personnalisés' },
          { value: '100%', label: 'Adapté à votre pratique' },
        ],
        description: 'Le Carême est une période de 40 jours de jeûne, prière et pénitence vécue par des millions de chrétiens à travers le monde. Selon votre pratique (catholique, orthodoxe, protestant), les règles varient : jeûne strict les jours maigres (Mercredi des Cendres, Vendredi Saint), abstinence de viande les vendredis, ou restriction personnelle choisie. FastCare s\'adapte à votre tradition.',
        benefits: [
          { icon: Star, title: 'Calendrier du Carême intégré', desc: 'Mercredi des Cendres, Vendredi Saint, Semaine Sainte — tous les temps forts notifiés selon votre tradition.', iconBg: 'rgba(139,92,246,0.1)', iconColor: '#7C3AED' },
          { icon: Clock, title: 'Jeûne des jours maigres', desc: 'Rappels pour les vendredi d\'abstinence et les jours de jeûne strict. Ne rien oublier, rester focalisé.', iconBg: 'rgba(139,92,246,0.1)', iconColor: '#7C3AED' },
          { icon: Heart, title: 'Conseils nutritionnels', desc: 'Recettes végétariennes et de poisson, menus équilibrés sans viande pour les vendredis du Carême.', iconBg: 'rgba(139,92,246,0.1)', iconColor: '#7C3AED' },
          { icon: Shield, title: 'Restriction personnalisée', desc: 'Vous renoncez au sucre, à l\'alcool ou aux réseaux sociaux ? Définissez votre engagement et suivez-le.', iconBg: 'rgba(139,92,246,0.1)', iconColor: '#7C3AED' },
          { icon: Sparkles, title: 'Dimension intérieure', desc: 'Le Carême unit jeûne du corps et jeûne de l\'esprit. FastCare vous propose des intentions quotidiennes.', iconBg: 'rgba(139,92,246,0.1)', iconColor: '#7C3AED' },
          { icon: Users, title: 'Communauté Carême', desc: 'Partagez votre parcours avec d\'autres pratiquants. L\'entraide rend chaque jour plus fort.', iconBg: 'rgba(139,92,246,0.1)', iconColor: '#7C3AED' },
        ],
        steps: [
          { num: '1', title: 'Choisissez votre tradition', desc: 'Catholique, orthodoxe ou protestant — les règles sont différentes. FastCare adapte le calendrier automatiquement.' },
          { num: '2', title: 'Définissez votre engagement', desc: 'Jeûne alimentaire, abstinence de viande, restriction d\'un plaisir personnel. Vous choisissez, FastCare suit.' },
          { num: '3', title: 'Recevez vos rappels', desc: 'Chaque vendredi, chaque jour maigre, chaque étape de la Semaine Sainte — une notification douce et respectueuse.' },
          { num: '4', title: 'Vivez Pâques en pleine forme', desc: 'Au bout des 40 jours, vous vous sentirez plus léger, plus centré, prêt à célébrer la Résurrection.' },
        ],
        profiles: [
          { emoji: '✝️', title: 'Catholiques pratiquants', desc: 'Vivez le Carême dans sa plénitude : jeûne, abstinence, prière — accompagnés et sans vous perdre.' },
          { emoji: '☦️', title: 'Orthodoxes', desc: 'Le Carême orthodoxe est l\'un des plus stricts. FastCare adapte son calendrier à votre tradition.' },
          { emoji: '🙏', title: 'Protestants & autres', desc: 'Vous pratiquez un Carême personnel. FastCare respecte votre démarche quelle qu\'elle soit.' },
          { emoji: '🌿', title: 'Débutants du Carême', desc: 'Vous souhaitez vivre votre premier Carême. Nous vous guidons étape par étape avec bienveillance.' },
        ],
      },
      both: {
        badge: '🌙✝️ Ramadan & Carême',
        title: 'Ramadan & Carême',
        subtitle: 'Deux pratiques religieuses, un même élan spirituel. FastCare accompagne toutes les formes de jeûne sacré.',
        stats: [
          { value: '2', label: 'Traditions respectées' },
          { value: '100%', label: 'Personnalisable' },
          { value: '∞', label: 'Bienveillance' },
        ],
        description: 'Que vous pratiquiez le Ramadan, le Carême, ou que vous souhaitiez simplement comprendre ces deux traditions pour choisir la vôtre, FastCare vous accueille sans jugement. Le Ramadan (Islam) et le Carême (Christianisme) partagent une même philosophie : le jeûne comme acte de foi, de purification et de recentrage spirituel. Les corps changent, les âmes se fortifient.',
        benefits: [
          { icon: Moon, title: 'Mode Ramadan complet', desc: 'Horaires Fajr/Maghrib automatiques, rappels Suhoor & Iftar, guide hydratation nocturne, conseils halal.', iconBg: 'rgba(245,158,11,0.1)', iconColor: '#D97706' },
          { icon: Star, title: 'Mode Carême complet', desc: 'Calendrier liturgique, jours maigres notifiés, recettes sans viande, engagement personnel suivi.', iconBg: 'rgba(139,92,246,0.1)', iconColor: '#7C3AED' },
          { icon: Heart, title: 'Respect de chaque tradition', desc: 'Aucune tradition n\'est hiérarchisée. Chaque pratique est accompagnée avec le même soin et la même profondeur.', iconBg: 'rgba(46,209,162,0.1)', iconColor: '#059669' },
          { icon: Sparkles, title: 'Bienfaits partagés', desc: 'Autophagie, clarté mentale, régulation du métabolisme — la science confirme les bienfaits du jeûne dans les deux traditions.', iconBg: 'rgba(46,209,162,0.1)', iconColor: '#059669' },
          { icon: Shield, title: 'Santé préservée', desc: 'Conseils adaptés à chaque pratique pour jeûner sans risque et maintenir votre vitalité tout au long de la période.', iconBg: 'rgba(46,209,162,0.1)', iconColor: '#059669' },
          { icon: Users, title: 'Communauté universelle', desc: 'Un espace bienveillant où musulmans, chrétiens et curieux partagent leur expérience du jeûne spirituel.', iconBg: 'rgba(46,209,162,0.1)', iconColor: '#059669' },
        ],
        steps: [
          { num: '1', title: 'Choisissez votre pratique', desc: 'À tout moment, basculez entre le mode Ramadan et le mode Carême selon votre tradition ou votre curiosité.' },
          { num: '2', title: 'Activez les rappels adaptés', desc: 'Chaque mode a ses propres notifications, son calendrier, ses conseils — rien n\'est mélangé.' },
          { num: '3', title: 'Suivez vos ressentis', desc: 'Énergie, humeur, spiritualité — notez votre expérience intérieure jour après jour.' },
          { num: '4', title: 'Terminez plus fort', desc: 'Quel que soit votre chemin, FastCare vous accompagne jusqu\'au bout avec respect et bienveillance.' },
        ],
        profiles: [
          { emoji: '🌍', title: 'Familles interreligieuses', desc: 'Un parent musulman, l\'autre chrétien ? FastCare accompagne toute la famille avec respect.' },
          { emoji: '🔍', title: 'Curieux spirituels', desc: 'Vous souhaitez explorer les deux traditions avant de choisir la vôtre. Bienvenue.' },
          { emoji: '🤝', title: 'Ouverture interreligieuse', desc: 'Comprendre l\'autre passe aussi par le corps. Le jeûne est un pont entre les traditions.' },
          { emoji: '🕊️', title: 'Chercheurs de sens', desc: 'Le jeûne spirituel vous parle mais vous cherchez encore votre voie. FastCare vous accompagne sans imposer.' },
        ],
      },
    },
  },
  'learning': {
    icon: Brain,
    badge: '🌱 Découverte & Apprentissage',
    heroBg: 'linear-gradient(135deg,#040f0f 0%,#0a2a1f 40%,#0a1a2a 100%)',
    accentBg: 'linear-gradient(135deg,#2ED1A2,#06B6D4)',
    accentColor: '#2ED1A2',
    accentColor2: '#06B6D4',
    grad: 'linear-gradient(90deg,#2ED1A2,#06B6D4)',
    shadow: 'rgba(46,209,162,0.22)',
    title: 'Découverte & Apprentissage',
    subtitle: 'Commencez votre voyage dans le jeûne intermittent sans pression, avec des protocoles progressifs et un accompagnement bienveillant.',
    stats: [
      { value: '7j', label: 'Pour ressentir les effets' },
      { value: '0', label: 'Régime requis' },
      { value: '100%', label: 'À votre rythme' },
    ],
    description: 'Vous entendez parler du jeûne intermittent depuis un moment mais vous ne savez pas par où commencer ? Ce parcours est fait pour vous. Nous commençons en douceur — même 12h de jeûne comptent — et augmentons progressivement selon votre confort. Zéro pression, zéro culpabilité. L\'objectif est de trouver le rythme qui vous convient et de comprendre comment votre corps réagit.',
    benefits: [
      { icon: Sparkles, title: 'Protocoles progressifs', desc: 'On commence à 12h de jeûne et on monte progressivement. Votre corps s\'adapte sans choc.', iconBg: 'rgba(46,209,162,0.1)', iconColor: '#059669' },
      { icon: Brain, title: 'Éducation intégrée', desc: 'Chaque jour, une micro-leçon sur le jeûne : comment ça fonctionne, pourquoi ça marche.', iconBg: 'rgba(46,209,162,0.1)', iconColor: '#059669' },
      { icon: Heart, title: 'Zéro pression', desc: 'Si vous cassez le jeûne, ce n\'est pas grave. FastCare repart de là où vous en êtes, sans jugement.', iconBg: 'rgba(46,209,162,0.1)', iconColor: '#059669' },
      { icon: Star, title: 'Découverte personnelle', desc: 'Apprenez à écouter votre corps : quand vous avez vraiment faim, quand c\'est de l\'ennui ou du stress.', iconBg: 'rgba(46,209,162,0.1)', iconColor: '#059669' },
      { icon: Users, title: 'Communauté débutants', desc: 'Rejoignez des milliers de débutants qui partagent leurs expériences et s\'encouragent mutuellement.', iconBg: 'rgba(46,209,162,0.1)', iconColor: '#059669' },
      { icon: Shield, title: 'Suivi bienveillant', desc: 'FastCare analyse vos ressentis (énergie, humeur, faim) pour adapter vos protocoles en temps réel.', iconBg: 'rgba(46,209,162,0.1)', iconColor: '#059669' },
    ],
    steps: [
      { num: '1', title: 'Commencez par 12 heures', desc: 'Si vous dînez à 20h et déjeunez à 8h, vous faites déjà 12h de jeûne ! C\'est plus simple qu\'on ne le croit.' },
      { num: '2', title: 'Observez votre corps', desc: 'Comment vous sentez-vous le matin ? Avez-vous faim ? Énergie ? FastCare vous guide pour noter vos ressentis.' },
      { num: '3', title: 'Augmentez progressivement', desc: 'Chaque semaine, on peut essayer d\'étendre de 30 minutes. À votre rythme, sans forcer.' },
      { num: '4', title: 'Trouvez votre rythme idéal', desc: 'Certains préfèrent 14h, d\'autres 16h. Il n\'y a pas de bonne réponse — juste ce qui fonctionne pour vous.' },
    ],
    profiles: [
      { emoji: '🆕', title: 'Vrais débutants', desc: 'Vous n\'avez jamais jeûné intentionnellement. Bienvenue — c\'est exactement pour vous que ce parcours a été créé.' },
      { emoji: '📚', title: 'Curieux', desc: 'Vous avez lu des articles sur le jeûne et voulez tester sans vous engager à fond. Parfait, explorez !' },
      { emoji: '⚡', title: 'Reprise après pause', desc: 'Vous avez déjà essayé mais abandonné. Repartez sur de bonnes bases avec un protocole plus doux.' },
      { emoji: '🧪', title: 'Expérimentateurs', desc: 'Vous aimez tester différentes approches et observer les effets sur votre corps et votre esprit.' },
    ],
    ctaBg: 'linear-gradient(135deg,#2ED1A2,#06B6D4)',
    ctaShadow: 'rgba(46,209,162,0.4)',
  },
};

const GoalDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const raw = GOAL_DATA[id];

  if (!raw) {
    navigate('/goal-selection');
    return null;
  }

  // Pour l'objectif spiritual, on fusionne les données de base avec le variant choisi
  let data;
  if (id === 'spiritual') {
    const type = searchParams.get('type') || 'ramadan';
    const variant = raw.variants[type] || raw.variants.ramadan;
    data = { ...raw, ...variant };
  } else {
    data = raw;
  }

  const Icon = data.icon;

  const handleChoose = () => {
    localStorage.setItem('fastingGoal', id);
    if (id === 'learning') {
      navigate('/apprendre');
    } else {
      navigate('/timer');
    }
  };

  return (
    <Page>
      <TopBar>
        <BackBtn onClick={() => navigate(id === 'spiritual' ? '/goal-selection?modal=spiritual' : '/goal-selection')}>
          <ArrowLeft size={15} /> Retour
        </BackBtn>
        <Logo onClick={() => navigate('/')}>FastCare</Logo>
        <div style={{ width: 100 }} />
      </TopBar>

      {/* ── Hero ── */}
      <Hero heroBg={data.heroBg}>
        <Orb className="a" /><Orb className="b" />
        <HeroBadge><Sparkles size={12} /> {data.badge}</HeroBadge>
        <IconBubble><Icon size={42} /></IconBubble>
        <HeroTitle>{data.title}</HeroTitle>
        <HeroSub>{data.subtitle}</HeroSub>
        <HeroStats>
          {data.stats.map((s, i) => (
            <StatItem key={i}>
              <div className="value">{s.value}</div>
              <div className="label">{s.label}</div>
            </StatItem>
          ))}
        </HeroStats>
      </Hero>

      <Main>
        {/* ── Description ── */}
        <Section delay="0.05s">
          <SectionTitle grad={data.grad}>
            Comprendre <span>cet objectif</span>
          </SectionTitle>
          <SectionSub>{data.description}</SectionSub>
        </Section>

        {/* ── Bénéfices ── */}
        <Section delay="0.1s">
          <SectionTitle grad={data.grad}>
            Les <span>bénéfices concrets</span>
          </SectionTitle>
          <SectionSub>Ce que vous allez ressentir et observer en pratiquant régulièrement.</SectionSub>
          <BenefitGrid>
            {data.benefits.map((b, i) => {
              const BIcon = b.icon;
              return (
                <BenefitCard key={i} shadow={data.shadow}>
                  <BenefitIcon bg={b.iconBg} color={b.iconColor}>
                    <BIcon size={20} />
                  </BenefitIcon>
                  <BenefitTitle>{b.title}</BenefitTitle>
                  <BenefitDesc>{b.desc}</BenefitDesc>
                </BenefitCard>
              );
            })}
          </BenefitGrid>
        </Section>

        {/* ── Comment ça marche ── */}
        <Section delay="0.15s">
          <SectionTitle grad={data.grad}>
            Comment <span>FastCare vous accompagne</span>
          </SectionTitle>
          <SectionSub>Un parcours structuré, semaine après semaine, pour vous mener à vos objectifs.</SectionSub>
          <StepList>
            {data.steps.map((s, i) => (
              <StepRow key={i}>
                <StepNum bg={data.accentBg}>{s.num}</StepNum>
                <StepText>
                  <StepTitle>{s.title}</StepTitle>
                  <StepDesc>{s.desc}</StepDesc>
                </StepText>
              </StepRow>
            ))}
          </StepList>
        </Section>

        {/* ── Pour qui ── */}
        <Section delay="0.2s">
          <SectionTitle grad={data.grad}>
            Pour <span>qui est cet objectif ?</span>
          </SectionTitle>
          <SectionSub>Cet objectif est particulièrement adapté aux profils suivants.</SectionSub>
          <ProfileGrid>
            {data.profiles.map((p, i) => (
              <ProfileCard key={i}>
                <ProfileEmoji>{p.emoji}</ProfileEmoji>
                <ProfileText>
                  <ProfileTitle>{p.title}</ProfileTitle>
                  <ProfileDesc>{p.desc}</ProfileDesc>
                </ProfileText>
              </ProfileCard>
            ))}
          </ProfileGrid>
          <Disclaimer>
            <Shield size={16} style={{ marginTop: 2, flexShrink: 0 }} />
            FastCare est une application de bien-être et ne remplace pas un avis médical. Si vous avez des conditions de santé particulières, consultez un professionnel de santé avant de commencer un protocole de jeûne.
          </Disclaimer>
        </Section>
      </Main>

      {/* ── Sticky CTA ── */}
      <StickyBar>
        <BarLeft>
          <div className="title">Prêt à commencer avec {data.title} ?</div>
          <div className="sub">Votre premier jeûne guidé vous attend — c'est gratuit.</div>
        </BarLeft>
        <CtaBtn bg={data.ctaBg} shadow={data.ctaShadow} onClick={handleChoose}>
          Choisir cet objectif <ArrowRight size={18} />
        </CtaBtn>
      </StickyBar>
    </Page>
  );
};

export default GoalDetail;
