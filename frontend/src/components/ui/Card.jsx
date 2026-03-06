import styled from 'styled-components';

const StyledCard = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
  padding: ${props => props.padding || props.theme.spacing.lg};
  margin: ${props => props.margin || '0'};
  border: ${props => props.border ? `1px solid ${props.theme.colors.border}` : 'none'};
  transition: all 0.2s ease;

  ${props => props.hover && `
    &:hover {
      box-shadow: ${props.theme.shadows.lg};
      transform: translateY(-2px);
    }
  `}

  ${props => props.fullWidth && `
    width: 100%;
  `}
`;

const Card = ({ children, ...props }) => {
  return <StyledCard {...props}>{children}</StyledCard>;
};

export default Card;
