import styled from "styled-components"
import { theme } from "../../theme"

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 18px 24px;

  border: 2px solid ${theme.colors.accentBrown};
  border-radius: 8px;
  width: 324px;

  h3 {
    margin: 0 0 18px 0;
  }

  ul {
    margin: 0;
    text-align: left;
  }
`

export const Error = styled.div`
  color: ${theme.colors.red};
  font-size: 12px;
  margin-bottom: 12px;
`