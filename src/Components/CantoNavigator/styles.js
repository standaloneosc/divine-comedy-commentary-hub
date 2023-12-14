import styled from 'styled-components'
import { theme } from '../../theme'

export const CantosContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 800px;
  margin: auto;
`

export const PartContainer = styled.div`
  padding: 6px 20px;

  .partTitle {
    font-weight: bold;
    font-size: 28px;
    margin-bottom: 12px;
    font-family: ${theme.fonts.almendra};
    color: ${theme.colors.backgroundBrown};
  }

  .list {
    display: flex;
    flex-wrap: wrap;
  }
`

export const CantoItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px 4px;

  width: 36px;
  height: 36px;
  transition: 0.25s all;
  border-radius: 8px;
  cursor: pointer;

  color: ${props => props.current ? 'white': theme.colors.orange};;
  background: ${props => props.current ? theme.colors.orange : theme.colors.backgroundTan};
  border: 2px solid ${theme.colors.orange};
  font-weight: bold;
  font-family: ${theme.fonts.garamond};
  font-size: 16px;

  &:hover {
    background: ${theme.colors.orangeHover};
    color: white;
  }

  &:active {
    background: ${theme.colors.orangeClick};
  }
`