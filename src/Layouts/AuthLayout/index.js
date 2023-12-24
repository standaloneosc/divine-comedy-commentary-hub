import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Navigate, useNavigate } from 'react-router-dom'


import { auth } from '../../App'
import BaseLayout from '../BaseLayout'

const AuthLayout = ({ children, ...props }) => {
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
    <BaseLayout {...props}>{children}</BaseLayout>
  )
}

export default AuthLayout