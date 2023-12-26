import styled from 'styled-components'
import { theme } from '../../theme'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px;
  align-items: center;

  background: ${theme.colors.orange};
  box-shadow: 0 10px 15px ${theme.colors.textGrayLight};
  height: ${theme.sizes.commentModalHeight};
  width: ${theme.sizes.commentModalWidth};
  border-radius: 8px;
  transition: 0.25s all;

  color: white;
  font-weight: bold;

  >* {
    opacity: ${props => props.visible ? 1 : 0};
  }
`

export const TextBox = styled.textarea`
  padding: 12px;
  border-radius: 8px;
  height: 65%;
  width: 90%;
  font-family: ${theme.fonts.garamond};

  background: ${theme.colors.backgroundTan};
  border: 2px solid ${theme.colors.accentBrown};
  outline: none;
  color: ${theme.colors.offBlack};
  font-size: 14px;
  transition: 0.25s all;
`

export const RangeBox = styled.div`
  padding: 12px;
  border-radius: 8px;
  background: ${theme.colors.backgroundTan};
  border: 2px solid ${theme.colors.accentBrown};
  transition: 0.25s all;

  height: 65%;
  width: 90%;

  font-weight: normal;
  color: ${theme.colors.textGray};
  text-align: left;
`

export const Label = styled.h4`
  margin: 0 0 12px 0;
`

export const Actions = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  padding-top: 12px;
  justify-content: center;
`

export const RangeItem = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.light ? theme.colors.textGrayLight : theme.colors.textGray};
`

export const Remove = styled.div`
  cursor: pointer;
  margin-left: 12px;
  margin-top: 4px;

  &:hover {
    color: ${theme.colors.red};
  }
`

export const Checkbox = styled.div`
  margin-top: 6px;
  background: ${theme.colors.backgroundTan};
  padding: 6px 12px;
  width: 90%;
  border-radius: 8px;
  border: 2px solid ${theme.colors.accentBrown};
  color: ${theme.colors.textGray};
  font-size: 12px;

  input {
    margin-right: 8px;
  }

  label {
    font-family: ${theme.fonts.garamond};
  }
`