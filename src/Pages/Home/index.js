import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate, Navigate } from 'react-router-dom'

import { auth } from '../../App'

import CantoNavigator from '../../Components/CantoNavigator'
import BaseLayout from '../../Layouts/BaseLayout/index'

const Home = () => {  
  const [user, userLoading, userError] = useAuthState(auth)
  const navigate = useNavigate()
  
  if (userLoading) {
    return (
      <BaseLayout>
        <p>Loading...</p>
      </BaseLayout>
    )
  } else if (userError) {
    return (
      <BaseLayout>
        <p>An authentication error occurred. Please  
          <span
            onClick={() => navigate("/auth")}
            style={{ marginLeft: '4px', textDecoration: 'underline', cursor: 'pointer' }}
          >
            try again
          </span>
          .
        </p>
      </BaseLayout>
    )
  } else if (!user) {
    return <Navigate to="/auth" />
  }

  return (
    <BaseLayout hideCantoNav>
      <CantoNavigator />
    </BaseLayout>
  )
}

export default Home