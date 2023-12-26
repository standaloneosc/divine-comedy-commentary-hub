import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { theme } from '../../theme'

const LinkStyle = styled(Link)`
  color: ${theme.colors.accentBrown};
  transition: 0.25s;

  &:hover {
    color: ${theme.colors.orangeHover};
  }
`

const NavLink = ({ children, ...props }) => (
  <LinkStyle {...props}>{children}</LinkStyle>
)

export default NavLink