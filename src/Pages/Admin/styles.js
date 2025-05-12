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

  h4 {
    margin: 12px 0 8px 0;
    font-size: 16px;
  }

  h5 {
    margin: 8px 0;
    font-size: 14px;
  }

  > div {
    width: 100%;
  }
`

export const Error = styled.div`
  color: ${theme.colors.red};
  font-size: 12px;
  margin-bottom: 12px;
`

export const UserList = styled.div`
  margin-left: 12px;
  font-size: 14px;
`

export const UserItem = styled.div`
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  margin: 4px 0;

  &:hover {
    background-color: ${theme.colors.backgroundTanClick};
    text-decoration: underline;
  }
`