import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { Play, BookOpen, HelpCircle, ChevronDown, ChevronUp, Check, X, ArrowRight, Star } from 'lucide-react';
import AppNav from '../components/AppNav';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const Page = styled.div`min-height: 100vh; background: #F8FAFF;`;

const Hero = styled.div`
  background: linear-gradient(135deg, #0F172A 0%, #1E3A5F 60%, #4C1D95 100%);
  padding: 3rem 2rem 4rem; text-align: center; position: relative; overflow: hidden;
`;
const HeroOrb = styled.div`
  position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none;
  &.a { width:400px;height:400px;background:rgba(245,158,11,0.2);top:-150px;left:-80px; }
  &.b { width:350px;height:350px;background:rgba(139,92,246,0.15);bottom:-100px;right:-60px; }
`;
const HeroBadge = styled.div`
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.3);
  color: #FCD34D; padding: 0.4rem 1.1rem; border-radius: 9999px;
  font-size: 0.78rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  margin-bottom: 1.2rem;
`;
const HeroTitle = styled.h1`
  font-size: clamp(1.8rem, 5vw, 3rem); font-weight: 900; color: white;
  letter-spacing: -0.03em; line-height: 1.15; margin-bottom: 1rem;
  animation: ${fadeInUp} 0.5s ease both;
  span { background: linear-gradient(90deg,#FCD34D,#F97316);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
`;
const HeroSub = styled.p`
  font-size: clamp(0.9rem,2vw,1.05rem); color: rgba(255,255,255,0.65);
  line-height: 1.7; max-width: 580px; margin: 0 auto 1.5rem;
`;
const StepPills = styled.div`
  display: flex; justify-content: center; gap: 0.75rem; flex-wrap: wrap;
`;
const StepPill = styled.div`
  display: flex; align-items: center; gap: 0.4rem;
  background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15);
  color: rgba(255,255,255,0.8); padding: 0.35rem 0.9rem; border-radius: 9999px;
  font-size: 0.78rem; font-weight: 600;
`;

const Content = styled.div`max-width: 1000px; margin: 0 auto; padding: 3rem 2rem 5rem;`;

const SectionTitle = styled.h2`
  font-size: 1.5rem; font-weight: 900; color: #0F172A;
  letter-spacing: -0.02em; margin-bottom: 0.4rem;
  display: flex; align-items: center; gap: 0.6rem;
`;
const SectionSub = styled.p`color: #64748b; font-size: 0.9rem; margin-bottom: 2rem; line-height: 1.6;`;

/* ── Section tabs ── */
const TabBar = styled.div`
  display: flex; gap: 0.5rem; margin-bottom: 2.5rem; flex-wrap: wrap;
`;
const Tab = styled.button`
  display: flex; align-items: center; gap: 0.4rem;
  padding: 0.55rem 1.2rem; border-radius: 12px; font-size: 0.88rem; font-weight: 700;
  border: 2px solid ${p => p.active ? '#F59E0B' : 'rgba(42,125,225,0.15)'};
  background: ${p => p.active ? 'rgba(245,158,11,0.1)' : 'white'};
  color: ${p => p.active ? '#D97706' : '#475569'};
  cursor: pointer; transition: all 0.18s;
  &:hover { border-color: #F59E0B; color: #D97706; }
`;

/* ── Videos ── */
const VideoGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr)); gap: 1.5rem;
`;
const VideoCard = styled.div`
  background: white; border-radius: 20px; overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  border: 1px solid rgba(42,125,225,0.08);
  transition: transform 0.25s, box-shadow 0.25s;
  animation: ${fadeInUp} 0.4s ease both;
  &:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.1); }
`;
const VideoThumb = styled.div`
  position: relative; padding-top: 56.25%; background: #0F172A; cursor: pointer;
  iframe { position:absolute;top:0;left:0;width:100%;height:100%;border:none; }
`;
const VideoInfo = styled.div`padding: 1.25rem;`;
const VideoCategory = styled.span`
  font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;
  color: #D97706; background: rgba(245,158,11,0.1); padding: 0.2rem 0.6rem;
  border-radius: 9999px; display: inline-block; margin-bottom: 0.5rem;
`;
const VideoTitle = styled.h3`font-size: 0.95rem; font-weight: 800; color: #0F172A; line-height: 1.4;`;
const VideoDuration = styled.div`
  font-size: 0.78rem; color: #94a3b8; font-weight: 600; margin-top: 0.4rem;
  display: flex; align-items: center; gap: 0.3rem;
`;

/* ── Lecture ── */
const ArticleCard = styled.div`
  background: white; border-radius: 20px; padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  border: 1px solid rgba(42,125,225,0.08);
  margin-bottom: 1.25rem;
  animation: ${fadeInUp} 0.4s ease both;
`;
const ArticleHeader = styled.button`
  width: 100%; background: none; border: none; cursor: pointer; text-align: left;
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
`;
const ArticleIcon = styled.div`
  font-size: 2rem; min-width: 44px; text-align: center;
`;
const ArticleMeta = styled.div`flex: 1;`;
const ArticleTitle = styled.div`font-size: 1.05rem; font-weight: 800; color: #0F172A;`;
const ArticleDesc = styled.div`font-size: 0.82rem; color: #64748b; margin-top: 0.2rem;`;
const ArticleBody = styled.div`
  margin-top: 1.5rem; padding-top: 1.5rem;
  border-top: 1px solid rgba(42,125,225,0.08);
  font-size: 0.92rem; color: #374151; line-height: 1.8;
  h4 { font-weight: 800; color: #0F172A; margin: 1.25rem 0 0.5rem; font-size: 1rem; }
  ul { padding-left: 1.2rem; margin: 0.5rem 0; }
  li { margin-bottom: 0.4rem; }
  .tip { background: rgba(245,158,11,0.08); border-left: 3px solid #F59E0B;
    padding: 0.75rem 1rem; border-radius: 0 10px 10px 0; margin: 1rem 0; font-weight: 600; color: #92400E; }
  .info { background: rgba(42,125,225,0.06); border-left: 3px solid #2A7DE1;
    padding: 0.75rem 1rem; border-radius: 0 10px 10px 0; margin: 1rem 0; font-weight: 600; color: #1E40AF; }
`;

/* ── Quiz ── */
const QuizCard = styled.div`
  background: white; border-radius: 20px; padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
  border: 1px solid rgba(42,125,225,0.08);
  animation: ${fadeInUp} 0.4s ease both;
`;
const QuizProgress = styled.div`
  display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem;
`;
const QuizStep = styled.div`
  width: 28px; height: 28px; border-radius: 50%; font-size: 0.75rem; font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  background: ${p => p.done ? 'linear-gradient(135deg,#2A7DE1,#2ED1A2)' : p.active ? '#FEF3C7' : '#F1F5F9'};
  color: ${p => p.done ? 'white' : p.active ? '#D97706' : '#94a3b8'};
  border: 2px solid ${p => p.done ? 'transparent' : p.active ? '#F59E0B' : 'transparent'};
`;
const QuizLine = styled.div`
  flex: 1; height: 2px;
  background: ${p => p.done ? 'linear-gradient(90deg,#2A7DE1,#2ED1A2)' : '#E2E8F0'};
`;
const QuizQuestion = styled.h3`
  font-size: 1.1rem; font-weight: 800; color: #0F172A; margin-bottom: 1.5rem; line-height: 1.4;
`;
const QuizOptions = styled.div`display: flex; flex-direction: column; gap: 0.75rem;`;
const QuizOption = styled.button`
  padding: 0.9rem 1.25rem; border-radius: 14px; font-size: 0.92rem; font-weight: 600;
  text-align: left; cursor: pointer; transition: all 0.2s; width: 100%;
  border: 2px solid ${p => p.correct ? '#2ED1A2' : p.wrong ? '#EF4444' : p.selected ? '#2A7DE1' : 'rgba(42,125,225,0.15)'};
  background: ${p => p.correct ? 'rgba(46,209,162,0.08)' : p.wrong ? 'rgba(239,68,68,0.06)' : p.selected ? 'rgba(42,125,225,0.06)' : 'white'};
  color: ${p => p.correct ? '#059669' : p.wrong ? '#DC2626' : '#0F172A'};
  &:hover:not(:disabled) { border-color: #2A7DE1; background: rgba(42,125,225,0.05); }
  &:disabled { cursor: default; }
`;
const QuizFeedback = styled.div`
  margin-top: 1rem; padding: 0.9rem 1.25rem; border-radius: 14px; font-size: 0.9rem; font-weight: 600;
  background: ${p => p.correct ? 'rgba(46,209,162,0.1)' : 'rgba(239,68,68,0.08)'};
  color: ${p => p.correct ? '#059669' : '#DC2626'};
  border: 1.5px solid ${p => p.correct ? 'rgba(46,209,162,0.25)' : 'rgba(239,68,68,0.2)'};
  display: flex; align-items: center; gap: 0.5rem;
`;
const NextBtn = styled.button`
  margin-top: 1.25rem; padding: 0.8rem 1.75rem; border-radius: 12px;
  background: linear-gradient(135deg,#2A7DE1,#2ED1A2); color: white;
  border: none; font-size: 0.92rem; font-weight: 800; cursor: pointer;
  display: flex; align-items: center; gap: 0.5rem; transition: opacity 0.2s;
  &:hover { opacity: 0.9; }
`;
const QuizResult = styled.div`
  text-align: center; padding: 1.5rem 0;
`;
const ScoreCircle = styled.div`
  width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 1rem;
  background: linear-gradient(135deg,#2A7DE1,#2ED1A2);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  color: white; font-size: 1.6rem; font-weight: 900;
  box-shadow: 0 12px 30px rgba(42,125,225,0.3);
`;
const CTABox = styled.div`
  background: linear-gradient(135deg,rgba(245,158,11,0.08),rgba(139,92,246,0.06));
  border: 2px solid rgba(245,158,11,0.2);
  border-radius: 20px; padding: 2rem; text-align: center; margin-top: 1.5rem;
`;
const CTATitle = styled.h3`font-size: 1.2rem; font-weight: 900; color: #0F172A; margin-bottom: 0.5rem;`;
const CTASub = styled.p`font-size: 0.88rem; color: #64748b; line-height: 1.6; margin-bottom: 1.5rem;`;
const CTABtns = styled.div`display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;`;
const CTABtn = styled.button`
  padding: 0.75rem 1.5rem; border-radius: 12px; font-size: 0.92rem; font-weight: 800;
  cursor: pointer; transition: all 0.2s; display: flex; align-items: center; gap: 0.5rem;
  ${p => p.primary ? `
    background: linear-gradient(135deg,#F59E0B,#EF4444); color: white; border: none;
    box-shadow: 0 8px 20px rgba(245,158,11,0.3);
    &:hover { opacity: 0.9; transform: translateY(-1px); }
  ` : `
    background: white; color: #2A7DE1; border: 2px solid rgba(42,125,225,0.2);
    &:hover { border-color: #2A7DE1; background: rgba(42,125,225,0.04); }
  `}
`;

// ─── Données ─────────────────────────────────────────────────────────────────

const VIDEOS = [
  {
    id: 1, category: 'Les bases',
    title: 'Jeûner c\'est quoi ? — Le Temps des Enfants (Ramadan)',
    videoId: '_DVy23YQwsU',
    duration: 'APBIF',
  },
  {
    id: 2, category: 'Les bases',
    title: 'Le jeûne du Ramadan — Leçon pour enfants',
    videoId: 'HUCBygdIXhI',
    duration: 'APBIF',
  },
  {
    id: 3, category: 'Pour les enfants',
    title: 'Qu\'est-ce que le Suhoor ? Que faire quand on jeûne ?',
    videoId: 'LvYdGWhP3oA',
    duration: 'APBIF',
  },
  {
    id: 4, category: 'Pour les enfants',
    title: 'Qu\'est-ce que le Sahour et la nuit d\'Al-Qadr ?',
    videoId: 'WMCOALP4O9Q',
    duration: 'APBIF',
  },
  {
    id: 5, category: 'Santé & Conseils',
    title: 'Le jeûne — Adorations & pratique (enfants)',
    videoId: 'gZ8UPllZD1M',
    duration: 'APBIF',
  },
  {
    id: 6, category: 'Motivation',
    title: 'Ramadan en Famille — Spécial Enfants & Parents',
    videoId: 'O_mqIry8jYE',
    duration: 'APBIF',
  },
];

const VIDEO_CATEGORIES = ['Tous', 'Les bases', 'Pour les enfants', 'Santé & Conseils', 'Motivation'];

const ARTICLES = [
  {
    id: 1, icon: '🌙', title: 'C\'est quoi le Ramadan ?',
    desc: 'Comprendre le sens du jeûne du Ramadan',
    content: `
      <h4>Le Ramadan, c'est quoi ?</h4>
      Le Ramadan est le mois sacré de l'islam. Pendant ce mois, les musulmans qui ont l'âge et la santé pour le faire s'abstiennent de manger et de boire du lever au coucher du soleil.
      <div class="info">📅 Le Ramadan dure 29 ou 30 jours selon le calendrier lunaire. Il change de date chaque année.</div>
      <h4>Pourquoi les musulmans jeûnent-ils ?</h4>
      <ul>
        <li>Pour se rapprocher de Dieu (Allah)</li>
        <li>Pour apprendre la patience et la gratitude</li>
        <li>Pour penser aux personnes qui manquent de nourriture</li>
        <li>Pour partager et renforcer les liens familiaux</li>
      </ul>
      <h4>Le Suhoor et l'Iftar</h4>
      <ul>
        <li><strong>Suhoor</strong> : le repas pris avant le lever du soleil pour se donner de l'énergie pour la journée.</li>
        <li><strong>Iftar</strong> : le repas de rupture du jeûne au coucher du soleil, souvent avec des dattes et de l'eau.</li>
      </ul>
      <div class="tip">💡 Le jeûne commence à l'aube (Fajr) et se termine au coucher du soleil (Maghrib).</div>
    `,
  },
  {
    id: 2, icon: '👶', title: 'Les enfants doivent-ils jeûner ?',
    desc: 'Ce que l\'islam dit sur le jeûne des enfants',
    content: `
      <h4>L'islam n'oblige pas les enfants à jeûner</h4>
      En islam, le jeûne du Ramadan devient obligatoire à la puberté. Avant cela, les enfants ne sont <strong>pas obligés</strong> de jeûner.
      <div class="info">📖 Le Prophète (paix et bénédiction sur lui) n'imposait pas le jeûne aux enfants.</div>
      <h4>Apprendre progressivement, c'est la clé</h4>
      Beaucoup de familles introduisent le jeûne progressivement :
      <ul>
        <li>Commencer par jeûner le matin seulement</li>
        <li>Jeûner jusqu'à midi ou 14h</li>
        <li>Faire un seul jour par semaine</li>
        <li>Augmenter progressivement avec les années</li>
      </ul>
      <div class="tip">✨ L'important c'est que l'enfant soit volontaire et que ses parents soient là pour l'accompagner.</div>
      <h4>Les signes que l'enfant est prêt</h4>
      <ul>
        <li>Il/elle demande de lui-même à jeûner</li>
        <li>Il/elle comprend le sens spirituel du jeûne</li>
        <li>Il/elle est en bonne santé</li>
      </ul>
    `,
  },
  {
    id: 3, icon: '🥗', title: 'Bien manger pendant le Ramadan',
    desc: 'Les aliments à privilégier au Suhoor et à l\'Iftar',
    content: `
      <h4>Le Suhoor : un repas essentiel</h4>
      Le Suhoor te donne l'énergie pour tenir jusqu'au soir. Privilégie des aliments qui tiennent longtemps :
      <ul>
        <li>🥣 Flocons d'avoine, pain complet</li>
        <li>🥚 Œufs (protéines qui tiennent longtemps)</li>
        <li>🍌 Fruits (banane surtout)</li>
        <li>💧 Beaucoup d'eau !</li>
      </ul>
      <div class="tip">🚫 Évite les aliments très sucrés au Suhoor : ils donnent un pic d'énergie puis une chute rapide.</div>
      <h4>L'Iftar : rompre le jeûne doucement</h4>
      <ul>
        <li>🌴 Commence par des dattes et de l'eau (tradition prophétique)</li>
        <li>🍲 Mange doucement, en petites quantités d'abord</li>
        <li>🥦 Légumes, protéines, glucides complexes</li>
      </ul>
      <div class="info">💧 Bois au moins 1,5L d'eau entre l'Iftar et le Suhoor pour bien t'hydrater.</div>
    `,
  },
  {
    id: 4, icon: '💪', title: 'Gérer la faim et la fatigue',
    desc: 'Conseils pratiques pour tenir pendant le jeûne',
    content: `
      <h4>C'est normal de ressentir la faim</h4>
      La faim fait partie du jeûne. C'est elle qui te rappelle pourquoi tu jeûnes et te rapproche de ceux qui n'ont pas à manger.
      <h4>Astuces pour mieux tenir</h4>
      <ul>
        <li>🛌 Dors suffisamment la nuit</li>
        <li>📵 Évite les activités physiques intenses en plein milieu de journée</li>
        <li>📖 Lis le Coran ou fais une activité calme pour occuper l'esprit</li>
        <li>🌬️ Reste dans un endroit frais</li>
      </ul>
      <div class="tip">🧒 Pour les enfants qui jeûnent partiellement : si tu as faim ou soif avant l'heure prévue, il vaut mieux manger que de te faire du mal. Le but c'est d'apprendre, pas de souffrir !</div>
      <h4>Les moments les plus difficiles</h4>
      <ul>
        <li>En milieu d'après-midi (vers 15h-16h) : c'est souvent le pic de faim</li>
        <li>Quand tu vois ou sens de la nourriture</li>
        <li>Après une activité sportive</li>
      </ul>
      <div class="info">💡 Pense que l'Iftar arrive bientôt — tenir encore un peu est une victoire !</div>
    `,
  },
];

const QUIZ = [
  {
    question: 'Quel est le repas pris avant le lever du soleil pendant le Ramadan ?',
    options: ['L\'Iftar', 'Le Suhoor', 'Le Couscous', 'Le Maghrib'],
    correct: 1,
    explanation: 'Le Suhoor est le repas pris avant l\'aube pour s\'énergiser avant le jeûne de la journée.',
  },
  {
    question: 'À partir de quel âge le jeûne du Ramadan est-il obligatoire en islam ?',
    options: ['7 ans', '10 ans', 'À la puberté', '18 ans'],
    correct: 2,
    explanation: 'En islam, le jeûne devient obligatoire à la puberté. Les enfants ne sont pas obligés de jeûner.',
  },
  {
    question: 'Un enfant qui apprend à jeûner peut-il s\'arrêter avant l\'heure de l\'Iftar ?',
    options: ['Non, jamais', 'Oui, s\'il a faim ou soif et que ses parents l\'acceptent', 'Seulement s\'il est malade', 'Non, c\'est interdit'],
    correct: 1,
    explanation: 'L\'apprentissage doit être progressif et bienveillant. Un enfant peut toujours s\'arrêter si besoin — l\'important c\'est d\'apprendre sans se faire du mal.',
  },
  {
    question: 'Quel aliment est recommandé pour rompre le jeûne à l\'Iftar selon la tradition ?',
    options: ['Du pain', 'Des dattes et de l\'eau', 'Un verre de lait', 'Du jus d\'orange'],
    correct: 1,
    explanation: 'La tradition prophétique recommande de rompre le jeûne avec des dattes et de l\'eau avant de manger un repas complet.',
  },
];

// ─── Composant ────────────────────────────────────────────────────────────────

const Apprendre = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('videos');
  const [videoCategory, setVideoCategory] = useState('Tous');
  const [openArticle, setOpenArticle] = useState(null);
  const [quizStep, setQuizStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);

  const filteredVideos = videoCategory === 'Tous'
    ? VIDEOS
    : VIDEOS.filter(v => v.category === videoCategory);

  const handleAnswer = (idx) => {
    if (answered) return;
    setSelectedAnswer(idx);
    setAnswered(true);
    if (idx === QUIZ[quizStep].correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (quizStep + 1 >= QUIZ.length) {
      setQuizDone(true);
    } else {
      setQuizStep(s => s + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    }
  };

  const resetQuiz = () => {
    setQuizStep(0); setSelectedAnswer(null);
    setAnswered(false); setScore(0); setQuizDone(false);
  };

  return (
    <>
      <AppNav />
      <Page>
        <Hero>
          <HeroOrb className="a" /><HeroOrb className="b" />
          <HeroBadge>🌙 Ramadan · Découverte & Apprentissage</HeroBadge>
          <HeroTitle>Apprendre le <span>jeûne du Ramadan</span></HeroTitle>
          <HeroSub>
            Des vidéos, des lectures et un quiz pour comprendre le Ramadan et apprendre à jeûner progressivement — à ton rythme, sans pression.
          </HeroSub>
          <StepPills>
            <StepPill><Play size={13} /> Vidéos</StepPill>
            <StepPill><BookOpen size={13} /> Lectures</StepPill>
            <StepPill><HelpCircle size={13} /> Quiz</StepPill>
          </StepPills>
        </Hero>

        <Content>
          <TabBar>
            <Tab active={activeTab === 'videos'} onClick={() => setActiveTab('videos')}>
              <Play size={15} /> Vidéos
            </Tab>
            <Tab active={activeTab === 'lecture'} onClick={() => setActiveTab('lecture')}>
              <BookOpen size={15} /> Lectures
            </Tab>
            <Tab active={activeTab === 'quiz'} onClick={() => setActiveTab('quiz')}>
              <HelpCircle size={15} /> Quiz
            </Tab>
          </TabBar>

          {/* ── VIDÉOS ── */}
          {activeTab === 'videos' && (
            <>
              <SectionTitle><Play size={22} color="#F59E0B" /> Vidéos explicatives</SectionTitle>
              <SectionSub>
                Regarde ces vidéos pour comprendre le Ramadan et apprendre à jeûner. Tu peux les regarder dans l'ordre ou choisir celles qui t'intéressent.
              </SectionSub>
              <TabBar>
                {VIDEO_CATEGORIES.map(cat => (
                  <Tab key={cat} active={videoCategory === cat} onClick={() => setVideoCategory(cat)}>
                    {cat}
                  </Tab>
                ))}
              </TabBar>
              <VideoGrid>
                {filteredVideos.map(v => (
                  <VideoCard key={v.id}>
                    <VideoThumb>
                      <iframe
                        src={`https://www.youtube.com/embed/${v.videoId}`}
                        title={v.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </VideoThumb>
                    <VideoInfo>
                      <VideoCategory>{v.category}</VideoCategory>
                      <VideoTitle>{v.title}</VideoTitle>
                      <VideoDuration><Play size={12} /> {v.duration}</VideoDuration>
                    </VideoInfo>
                  </VideoCard>
                ))}
              </VideoGrid>
              <div style={{ textAlign:'center', marginTop:'2.5rem' }}>
                <NextBtn onClick={() => setActiveTab('lecture')}>
                  Continuer vers les lectures <ArrowRight size={16} />
                </NextBtn>
              </div>
            </>
          )}

          {/* ── LECTURE ── */}
          {activeTab === 'lecture' && (
            <>
              <SectionTitle><BookOpen size={22} color="#2A7DE1" /> Articles à lire</SectionTitle>
              <SectionSub>
                Appuie sur un article pour le lire. Prends le temps de bien comprendre avant de passer au quiz.
              </SectionSub>
              {ARTICLES.map(a => (
                <ArticleCard key={a.id}>
                  <ArticleHeader onClick={() => setOpenArticle(openArticle === a.id ? null : a.id)}>
                    <ArticleIcon>{a.icon}</ArticleIcon>
                    <ArticleMeta>
                      <ArticleTitle>{a.title}</ArticleTitle>
                      <ArticleDesc>{a.desc}</ArticleDesc>
                    </ArticleMeta>
                    {openArticle === a.id ? <ChevronUp size={20} color="#94a3b8" /> : <ChevronDown size={20} color="#94a3b8" />}
                  </ArticleHeader>
                  {openArticle === a.id && (
                    <ArticleBody dangerouslySetInnerHTML={{ __html: a.content }} />
                  )}
                </ArticleCard>
              ))}
              <div style={{ textAlign:'center', marginTop:'2rem' }}>
                <NextBtn onClick={() => setActiveTab('quiz')}>
                  Passer au quiz <ArrowRight size={16} />
                </NextBtn>
              </div>
            </>
          )}

          {/* ── QUIZ ── */}
          {activeTab === 'quiz' && (
            <>
              <SectionTitle><HelpCircle size={22} color="#8B5CF6" /> Quiz — Teste tes connaissances</SectionTitle>
              <SectionSub>
                {QUIZ.length} questions pour voir si tu as bien compris. Pas de pression — tu peux recommencer autant de fois que tu veux !
              </SectionSub>
              <QuizCard>
                {!quizDone ? (
                  <>
                    <QuizProgress>
                      {QUIZ.map((_, i) => (
                        <>
                          <QuizStep key={i} done={i < quizStep} active={i === quizStep}>
                            {i < quizStep ? <Check size={12} /> : i + 1}
                          </QuizStep>
                          {i < QUIZ.length - 1 && <QuizLine key={`l${i}`} done={i < quizStep} />}
                        </>
                      ))}
                    </QuizProgress>
                    <QuizQuestion>
                      Question {quizStep + 1}/{QUIZ.length} — {QUIZ[quizStep].question}
                    </QuizQuestion>
                    <QuizOptions>
                      {QUIZ[quizStep].options.map((opt, i) => (
                        <QuizOption
                          key={i}
                          disabled={answered}
                          selected={selectedAnswer === i && !answered}
                          correct={answered && i === QUIZ[quizStep].correct}
                          wrong={answered && selectedAnswer === i && i !== QUIZ[quizStep].correct}
                          onClick={() => handleAnswer(i)}
                        >
                          {opt}
                        </QuizOption>
                      ))}
                    </QuizOptions>
                    {answered && (
                      <>
                        <QuizFeedback correct={selectedAnswer === QUIZ[quizStep].correct}>
                          {selectedAnswer === QUIZ[quizStep].correct
                            ? <><Check size={16} /> Bravo ! {QUIZ[quizStep].explanation}</>
                            : <><X size={16} /> {QUIZ[quizStep].explanation}</>
                          }
                        </QuizFeedback>
                        <NextBtn onClick={handleNext}>
                          {quizStep + 1 >= QUIZ.length ? 'Voir mon résultat' : 'Question suivante'}
                          <ArrowRight size={16} />
                        </NextBtn>
                      </>
                    )}
                  </>
                ) : (
                  <QuizResult>
                    <ScoreCircle>
                      {score}/{QUIZ.length}
                      <Star size={14} style={{ opacity: 0.8 }} />
                    </ScoreCircle>
                    <h3 style={{ fontWeight:900, color:'#0F172A', marginBottom:'0.5rem' }}>
                      {score === QUIZ.length ? '🎉 Parfait !' : score >= QUIZ.length / 2 ? '👍 Bien joué !' : '📖 Continue d\'apprendre !'}
                    </h3>
                    <p style={{ color:'#64748b', fontSize:'0.9rem', marginBottom:'1.5rem' }}>
                      {score === QUIZ.length
                        ? 'Tu as tout bon ! Tu connais très bien le Ramadan.'
                        : score >= QUIZ.length / 2
                        ? `${score} bonne${score > 1 ? 's' : ''} réponse${score > 1 ? 's' : ''} sur ${QUIZ.length}. Relis les articles pour progresser encore.`
                        : 'Pas grave ! Relis les articles et recommence — tu vas y arriver !'}
                    </p>
                    <NextBtn onClick={resetQuiz} style={{ margin:'0 auto' }}>
                      Recommencer le quiz <ArrowRight size={16} />
                    </NextBtn>

                    <CTABox style={{ marginTop:'2rem' }}>
                      <CTATitle>🌙 Tu veux commencer à jeûner ?</CTATitle>
                      <CTASub>
                        Tu n'es pas obligé(e) — mais si tu te sens prêt(e), FastCare t'accompagne à ton rythme.<br />
                        Tu peux commencer par jeûner jusqu'à midi ou 14h seulement.
                      </CTASub>
                      <CTABtns>
                        <CTABtn primary onClick={() => navigate('/timer')}>
                          <Play size={16} /> Je veux essayer le jeûne
                        </CTABtn>
                        <CTABtn onClick={() => setActiveTab('videos')}>
                          <BookOpen size={16} /> Revoir les vidéos
                        </CTABtn>
                      </CTABtns>
                    </CTABox>
                  </QuizResult>
                )}
              </QuizCard>
            </>
          )}
        </Content>
      </Page>
    </>
  );
};

export default Apprendre;
