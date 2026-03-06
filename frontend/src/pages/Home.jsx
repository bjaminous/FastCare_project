import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Timer, Heart, TrendingUp, Calendar } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
    animation: float 20s ease-in-out infinite;
    pointer-events: none;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-20px) rotate(1deg); }
    66% { transform: translateY(10px) rotate(-1deg); }
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const Hero = styled.div`
  margin-bottom: 3rem;
  padding: 0 2rem;
`;

const Title = styled.h1`
  font-size: clamp(3.5rem, 8vw, 6rem);
  font-weight: 800;
  color: white;
  margin-bottom: 2rem;
  line-height: 1.1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: -0.02em;
  position: relative;
  
  &::after {
    content: 'FastCare';
    position: absolute;
    top: 2px;
    left: 0;
    color: rgba(255, 255, 255, 0.3);
    z-index: -1;
  }
`;

const Subtitle = styled.p`
  font-size: clamp(1.1rem, 2.5vw, 1.6rem);
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 3rem;
  line-height: 1.7;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 300;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 3rem;
  margin-bottom: 4rem;
  width: 100%;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    max-width: 600px;
    gap: 2.5rem;
  }
  
  @media (max-width: 768px) {
    gap: 2rem;
  }
  
  @media (max-width: 480px) {
    gap: 1.5rem;
  }
`;

const FeatureCard = styled(Card)`
  text-align: center;
  padding: 3rem 2.5rem;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 32px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform-style: preserve-3d;
  perspective: 1000px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #06B6D4, #0891B2, #67E8F9);
    transform: scaleX(0);
    transition: transform 0.4s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }
  
  &:hover {
    transform: translateY(-15px) rotateX(5deg);
    box-shadow: 0 40px 80px -20px rgba(6, 182, 212, 0.3);
    
    &::before {
      transform: scaleX(1);
    }
    
    &::after {
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    padding: 2.5rem 2rem;
    
    &:hover {
      transform: translateY(-10px);
    }
  }
`;

const FeatureIcon = styled.div`
  width: 90px;
  height: 90px;
  background: linear-gradient(135deg, #06B6D4 0%, #0891B2 50%, #67E8F9 100%);
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 2rem;
  color: white;
  box-shadow: 0 15px 35px -10px rgba(6, 182, 212, 0.4);
  position: relative;
  flex-shrink: 0;
  animation: pulse 3s ease-in-out infinite;
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    background: linear-gradient(135deg, #06B6D4, #0891B2, #67E8F9);
    border-radius: 28px;
    z-index: -1;
    opacity: 0.2;
    animation: rotate 4s linear infinite;
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 800;
  color: #000000;
  margin-bottom: 1rem;
  letter-spacing: -0.01em;
  line-height: 1.3;
`;

const FeatureDescription = styled.p`
  color: #1a1a1a;
  line-height: 1.7;
  font-size: 1rem;
  font-weight: 500;
  flex-grow: 1;
`;

const CTAContainer = styled.div`
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 2rem;
  animation: slideUp 1s ease-out 0.5s both;
  
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @media (max-width: 768px) {
    gap: 1.5rem;
    margin-top: 1.5rem;
  }
`;

const Home = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/goal-selection');
  };

  const handleLearnMore = () => {
    navigate('/about');
  };

  return (
    <HomeContainer>
      <Hero>
        <Title>FastCare</Title>
        <Subtitle>
          Votre compagnon intelligent pour un jeûne sain et équilibré. 
          Suivez votre progression, recevez des conseils personnalisés et atteignez vos objectifs.
        </Subtitle>
      </Hero>

      <Features>
        <FeatureCard>
          <FeatureIcon>
            <Timer size={28} />
          </FeatureIcon>
          <FeatureTitle>Timer Intelligent</FeatureTitle>
          <FeatureDescription>
            Suivez vos jeûnes avec un timer personnalisé et des notifications intelligentes
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>
            <Heart size={28} />
          </FeatureIcon>
          <FeatureTitle>Suivi Quotidien</FeatureTitle>
          <FeatureDescription>
            Enregistrez votre poids, votre énergie et votre humeur pour une analyse complète
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>
            <TrendingUp size={28} />
          </FeatureIcon>
          <FeatureTitle>Statistiques</FeatureTitle>
          <FeatureDescription>
            Visualisez votre progression avec des graphiques détaillés et des insights
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>
            <Calendar size={28} />
          </FeatureIcon>
          <FeatureTitle>Journal de Ressenti</FeatureTitle>
          <FeatureDescription>
            Notez vos expériences et émotions pour mieux comprendre votre corps
          </FeatureDescription>
        </FeatureCard>
      </Features>

      <CTAContainer>
        <Button variant="primary" size="large" onClick={handleStart}>
          Commencer maintenant
        </Button>
        <Button variant="outline" size="large" onClick={handleLearnMore}>
          En savoir plus
        </Button>
      </CTAContainer>
    </HomeContainer>
  );
};

export default Home;
