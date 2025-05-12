import styled from 'styled-components'
import { theme } from '../../theme'

export const Wrapper = styled.div`
  position: relative;
  background: ${theme.colors.backgroundTan};
`
export const PageContainer = styled.div`
  max-width: ${theme.sizes.pageMaxWidth};
  margin: 24px auto;
  padding: 24px 48px;
  position: relative;
  font-family: ${theme.fonts.garamond};

  @media screen and (max-width: ${theme.sizes.phone}) {
    padding: 24px 0;
  }
`
