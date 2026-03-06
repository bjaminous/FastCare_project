import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ArrowLeft, Heart, Weight, Brain, Baby } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const GoalContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
  padding: 2rem;
  display: flex;
  flex-direction: column;
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
      radial-gradient(circle at 20% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(6, 182, 212, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
    animation: float 20s ease-in-out infinite;
    pointer-events: none;
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    33% { transform: translateY(-15px) rotate(0.5deg); }
    66% { transform: translateY(8px) rotate(-0.5deg); }
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
  color: white;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const Title = styled.h1`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  color: white;
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  color: rgba(255, 255, 255, 0.9);
  text-align: center;
  margin-bottom: 4rem;
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 300;
`;

const GoalsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: 768px) {
    max-width: 100%;
    gap: 1.2rem;
  }
`;

const GoalCard = styled(Card)`
  padding: 2rem;
  text-align: left;
  background: rgba(255, 255, 255, 0.95);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 2rem;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6, #ec4899);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -10px rgba(99, 102, 241, 0.25);
    
    &::before {
      transform: scaleX(1);
    }
  }
  
  ${props => props.selected && `
    border-color: #6366f1;
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%);
    transform: translateY(-2px);
    box-shadow: 0 12px 25px -8px rgba(99, 102, 241, 0.2);
    
    &::before {
      transform: scaleX(1);
    }
  `}
`;

const GoalIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #06B6D4 0%, #0891B2 50%, #67E8F9 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 6px 16px -6px rgba(6, 182, 212, 0.3);
  position: relative;
  flex-shrink: 0;
  
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, #06B6D4, #0891B2, #67E8F9);
    border-radius: 16px;
    z-index: -1;
    opacity: 0.1;
  }
`;

const GoalTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 800;
  color: #000000;
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
`;

const GoalDescription = styled.p`
  color: #1a1a1a;
  line-height: 1.5;
  font-size: 0.9rem;
  font-weight: 500;
`;

const Navigation = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: auto;
  padding-top: 2rem;
  width: 100%;
`;

const Dot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.active ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.3)'};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  ${props => props.active && `
    box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.3);
    transform: scale(1.2);
  `}
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.6);
  }
`;

const GoalSelection = () => {
  const navigate = useNavigate();
  const [selectedGoal, setSelectedGoal] = useState(null);

  const goals = [
    {
      id: 'health',
      icon: Heart,
      title: 'Santé',
      description: 'Améliorer votre bien-être général et votre vitalité grâce au jeûne régulier'
    },
    {
      id: 'weight-loss',
      icon: Weight,
      title: 'Perte de poids',
      description: 'Atteindre vos objectifs de poids de manière saine et durable'
    },
    {
      id: 'spiritual',
      icon: Brain,
      title: 'Spirituel / Ramadan',
      description: 'Pratiquer le jeûne pour des raisons spirituelles ou religieuses'
    },
    {
      id: 'learning',
      icon: Baby,
      title: 'Apprentissage (Enfants)',
      description: 'Initier les jeunes au jeûne en toute sécurité et progressivement'
    }
  ];

  const handleBack = () => {
    navigate('/');
  };

  const handleGoalSelect = (goalId) => {
    setSelectedGoal(goalId);
  };

  const handleContinue = () => {
    if (selectedGoal) {
      // Stocker l'objectif sélectionné
      localStorage.setItem('fastingGoal', selectedGoal);
      navigate('/timer');
    }
  };

  return (
    <GoalContainer>
      <Header>
        <Button variant="outline" onClick={handleBack}>
          <ArrowLeft size={20} />
          Retour
        </Button>
      </Header>

      <Content>
        <Title>Quel est votre objectif ?</Title>
        <Subtitle>
          Choisissez l'objectif principal qui vous motive à jeûner. 
          Cela nous aidera à personnaliser votre expérience.
        </Subtitle>

        <GoalsGrid>
          {goals.map((goal) => {
            const Icon = goal.icon;
            return (
              <GoalCard
                key={goal.id}
                selected={selectedGoal === goal.id}
                onClick={() => handleGoalSelect(goal.id)}
              >
                <GoalIcon>
                  <Icon size={40} />
                </GoalIcon>
                <GoalTitle>{goal.title}</GoalTitle>
                <GoalDescription>{goal.description}</GoalDescription>
              </GoalCard>
            );
          })}
        </GoalsGrid>

        <Navigation>
          <Dot active={false} />
          <Dot active={true} />
          <Dot active={false} />
          <Button 
            variant="primary" 
            size="large"
            onClick={handleContinue}
            disabled={!selectedGoal}
          >
            Continuer
          </Button>
        </Navigation>
      </Content>
    </GoalContainer>
  );
};

export default GoalSelection;
