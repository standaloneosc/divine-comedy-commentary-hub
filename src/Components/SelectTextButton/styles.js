import styled, { css } from 'styled-components'
import { theme } from '../../theme'

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  background: ${theme.colors.orange};
  box-shadow: 0 10px 15px ${theme.colors.textGrayLight};
  height: 72px;
  width: 72px;
  border-radius: 100%;
  color: white;
  transition: 0.25s all;

  cursor: pointer;
  font-size: 30px;

  &:hover {
    background: ${theme.colors.orangeHover};
  }

  &:active {
    background: ${theme.colors.orangeClick};
  }

  ${props => props.selecting && css`
    height: ${theme.sizes.commentModalHeight};
    width: ${theme.sizes.commentModalWidth};
    border-radius: 8px;
    padding: 12px;
  `}
`