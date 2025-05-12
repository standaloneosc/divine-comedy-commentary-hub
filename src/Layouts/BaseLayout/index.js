import React from 'react'
import {Helmet} from 'react-helmet'

import Nav from '../../Components/Nav/index'
import { Wrapper, PageContainer } from './styles.js' 

const BaseLayout = ({ children, hideCantoNav, canto, part }) => {  
  return (
    <Wrapper>
      <Helmet>
        <title>Divina Commedia | Commentary Hub</title>
      </Helmet>
      <Nav hideCantoNav={hideCantoNav} canto={canto} part={part} />
      <PageContainer>
        {children}
      </PageContainer>
    </Wrapper>
  )
}

export default BaseLayout