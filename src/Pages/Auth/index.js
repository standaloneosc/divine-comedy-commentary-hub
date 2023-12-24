import React, { useEffect, useState } from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth'
import { PiCaretDownBold } from "react-icons/pi"
import { Navigate } from 'react-router-dom'

import { auth, db } from '../../App'
import BaseLayout from '../../Layouts/BaseLayout'
import Button from '../../Components/Button'
import Spacer from '../../Components/Spacer'

import { AUTH_ERROR_CODES, SELECT_DEFAULT } from '../../Utils/constants'
import { increment, onValue, ref, set } from 'firebase/database'

import { Container, Error, LoginBox, SelectGroup, SwitchLoginSignup } from './styles'
import Input from '../../Components/Input'

const Auth = () => {
  const [user, userLoading, userError] = useAuthState(auth)
  const [signingUp, setSigningUp] = useState(false)
  const [groups, setGroups] = useState(null)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [userGroup, setUserGroup] = useState(SELECT_DEFAULT)
  const [groupCode, setGroupCode] = useState("")

  const [loginError, setLoginError] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)
  const [signupError, setSignupError] = useState("")
  const [signupLoading, setSignupLoading] = useState(false)

  useEffect(() => {
    const groupsRef = ref(db, `groups`)
    return onValue(groupsRef, snapshot => {
      if (snapshot.exists()) {
        const groups = snapshot.val()
        setGroups(groups)
      }
    })
  }, [])

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

  const signup = async () => {
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

    if (userGroup !== SELECT_DEFAULT && !groupCode) {
      setSignupError("Please enter your group's join code.")
      return
    }

    if (userGroup !== SELECT_DEFAULT && groups[userGroup]["joinCode"] !== groupCode.trim().toUpperCase()) {
      setSignupError("Your group code is incorrect. Select a different group or try again.")
      return
    }

    setSignupLoading(true)

    try {
      const user = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(user.user, { displayName: name })
      const userData = {
        name,
        email,
        group: userGroup === SELECT_DEFAULT ? null : userGroup,
        groupName: userGroup === SELECT_DEFAULT ? null : groups[userGroup].name,
      }
      await set(ref(db, `users/${user.user.uid}`), userData)

      if (userGroup !== SELECT_DEFAULT) {
        await set(ref(db, `groups/${userGroup}/memberCount`), increment(1))
      }

      setSignupLoading(false)
      setSignupError("")
    } catch (err) {
      console.log("Error signing up", err)
      setSignupLoading(false)
      setSignupError(getErrorCode(err.code))
    }
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
          {signingUp && <Input placeholder='Name' value={name} setValue={setName} />}
          <Input placeholder='Email' value={email} setValue={setEmail} />
          <Input placeholder='Password' type="password" value={password} setValue={setPassword} />
          {signingUp && groups ? (
            <>
            <SelectGroup notSelected={userGroup === SELECT_DEFAULT}>
              <select value={userGroup} onChange={e => setUserGroup(e.target.value)}>
                <option default value={SELECT_DEFAULT}>Join a group (optional)</option>
                {Object.keys(groups).map(k => (
                  <option value={k}>{groups[k]["name"]}</option>
                ))}
              </select>
              <PiCaretDownBold />
            </SelectGroup>
            <Spacer height="12px" />
            </>
          ) : null}
          {signingUp && userGroup !== SELECT_DEFAULT ? (
            <Input placeholder="Group code (6 letters)" value={groupCode} setValue={setGroupCode} upperCaseOnly maxLength={6} />
          ) : null}
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