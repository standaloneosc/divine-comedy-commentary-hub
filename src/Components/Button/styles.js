import styled, { css } from 'styled-components'
import { theme } from '../../theme'

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 25px;
  width: ${props => props.iconOnly ? '25px' : '100px'};
  padding: 8px;
  margin: 0;
  font-size: ${props => props.iconOnly ? '18px' : '16px'};
  cursor: pointer;
  transition: 0.25s all;
  border-radius: 8px;
  color: white;
  font-weight: bold;

  background: ${theme.colors.backgroundTan};
  color: ${theme.colors.backgroundBrown};
  border: 2px solid ${theme.colors.backgroundBrown};

  &:hover {
    background: ${theme.colors.backgroundTanHover};
  }

  &:active {
    background: ${theme.colors.backgroundTanClick};
  }
  

  ${props => props.primary && css`
    background-color: ${theme.colors.red};

    &:hover {
      background-color: ${theme.colors.redHover};  
    }

    &:active {
      background-color: ${theme.colors.redClick};  
    }
  `}
`
