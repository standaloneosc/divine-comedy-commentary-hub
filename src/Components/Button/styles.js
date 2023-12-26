import styled, { css } from 'styled-components'
import { theme } from '../../theme'

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${props => props.small ? '18px' : '24px'};
  width: ${props => props.iconOnly ? '24px' : props.small ? '75px' : '96px'};
  padding: 8px;
  margin: 0;
  font-size: ${props => props.iconOnly ? '18px' : '16px'};
  cursor: pointer;
  transition: 0.25s all;
  border-radius: 8px;
  color: white;
  font-weight: bold;

  background: ${theme.colors.backgroundTan};
  color: ${theme.colors.accentBrown};
  border: 2px solid ${theme.colors.accentBrown};

  &:hover {
    background: ${theme.colors.backgroundTanHover};
  }

  &:active {
    background: ${theme.colors.backgroundTanClick};
  }
  

  ${props => props.primary && css`
    background-color: ${theme.colors.accentBrown};

    &:hover {
      background-color: ${theme.colors.accentBrownHover};  
    }

    &:active {
      background-color: ${theme.colors.accentBrownHover};  
    }
  `}
`
