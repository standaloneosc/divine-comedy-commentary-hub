import React from 'react'

import CantoNavigator from '../../Components/CantoNavigator'
import AuthLayout from '../../Layouts/AuthLayout'

const Home = () => {  
  return (
    <AuthLayout hideCantoNav>
      <CantoNavigator />
    </AuthLayout>
  )
}

export default Home