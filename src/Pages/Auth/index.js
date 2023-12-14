import React, { useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'

import { auth } from '../../App'
import BaseLayout from '../../Layouts/BaseLayout'
import { Navigate } from 'react-router-dom'
import { Container, Error, Input, LoginBox, SwitchLoginSignup } from './styles'
import Button from '../../Components/Button'
import Spacer from '../../Components/Spacer'
import { AUTH_ERROR_CODES } from '../../Utils/constants'

const Auth = () => {
  const [user, userLoading, userError] = useAuthState(auth)
  const [signingUp, setSigningUp] = useState(false)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const [loginError, setLoginError] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)
  const [signupError, setSignupError] = useState("")
  const [signupLoading, setSignupLoading] = useState(false)

  if (user && !(signupLoading || signupError)) {
    return <Navigate to="/" />
  }

  const login = () => {
    setLoginLoading(true)
    
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setLoginLoading(false)
      })
      .catch(err => {
        setLoginLoading(false)
        setLoginError(getErrorCode(err.code))
      })
  }

  const signup = () => {
    if (!name || name.split(" ").length < 2) {
      setSignupError(AUTH_ERROR_CODES["auth/missing-name"])
      return
    }

    if (!email) {
      setSignupError(AUTH_ERROR_CODES["auth/missing-email"])
      return
    }

    if (!password) {
      setSignupError(AUTH_ERROR_CODES["auth/missing-password"])
      return
    }

    setSignupLoading(true)
    createUserWithEmailAndPassword(auth, email, password)
      .then(user => {
        updateProfile(
          user.user,
          { displayName: name }
        ).then(() => {
            setSignupLoading(false)
            setSignupError("")
        }).catch(err => {
            setSignupLoading(false)
            setSignupError("An error occurred setting your name.")
            console.log("Error setting displayname:", err)
        })
      })
      .catch(err => {
        console.log('error:', err)
        setSignupLoading(false)
        setSignupError(getErrorCode(err.code))
      })
  }

  const switchLoginSignup = () => {
    setSigningUp(!signingUp)
  }

  const getErrorCode = code => {
    console.log("error code:", code)
    if (code in AUTH_ERROR_CODES) {
      return AUTH_ERROR_CODES[code]
    }
    return AUTH_ERROR_CODES["default"]
  }

  return (
    <BaseLayout hideCantoNav>
      <Container>
        <LoginBox>
          <h3>{signingUp ? "Create an account" : "Log in"}</h3>
          {userError && <Error>{userError.message}</Error>}
          {signupError && <Error>{signupError}</Error>}
          {loginError && <Error>{loginError}</Error>}
          {signingUp && <Input placeholder='Name' value={name} onChange={e => setName(e.target.value)} />}
          <Input placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
          <Input placeholder='Password' type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <Button
            text={signingUp ? "Sign up" : "Log in"}
            loading={userLoading || signupLoading || loginLoading}
            onClick={signingUp ? signup : login}
          />
          <Spacer height="18px" />
          <SwitchLoginSignup>
            {signingUp ? <>Already have an account? <span onClick={switchLoginSignup}>Log in</span>.</>
            : <>Don't have an account yet? <span onClick={switchLoginSignup}>Sign up</span>.</>}
          </SwitchLoginSignup>
        </LoginBox>
      </Container>
    </BaseLayout>
  )
}

export default Auth