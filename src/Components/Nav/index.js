import React, { useState } from 'react'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa"
import { useAuthState } from 'react-firebase-hooks/auth'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom';

import Button from '../Button'
import CantoNavigator from '../CantoNavigator'
import Spacer from '../Spacer'

import { auth } from '../../App';

import {
  NavContainer,
  InnerContainer,
  ButtonsContainer,
  UserArea,
  OuterContainer,
  UserDropdown,
} from './styles'
import { PART_ORDER } from '../../Utils/constants';
import { getInitials } from '../../Utils/utility';

const Nav = ({ hideCantoNav, canto, part }) => {
  const [user] = useAuthState(auth)

  const [showCantoNav, setShowCantoNav] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const navigate = useNavigate()

  const logout = () => {
    signOut(auth)
  }

  const nextCanto = () => {
    if (!canto || !part) return
    if (part === 'paradiso' && canto === 33) return

    if (
      (part === 'inferno' && canto >= 34) ||
      (part === 'purgatorio' && canto >= 33)
    ) {
      navigate(`/${PART_ORDER[part]["next"]}/1`)
      setShowCantoNav(false)
    } else {
      navigate(`/${part}/${canto + 1}`)
      setShowCantoNav(false)
    }
  }

  const prevCanto = () => {
    if (!canto || !part) return
    if (part === 'inferno' && canto === 1) return

    if (
      (part === 'purgatorio' || part === 'paradiso') &&
      canto <= 1
    ) {
      navigate(`/${PART_ORDER[part]["prev"]}/${PART_ORDER[part]["prevNum"]}`)
      setShowCantoNav(false)
    } else {
      navigate(`/${part}/${canto - 1}`)
      setShowCantoNav(false)
    }
  }
  
  return (
    <NavContainer>
      <OuterContainer>
        <div className="left" />
        <InnerContainer onClick={() => setShowUserDropdown(false)}>
          <div id="title" className="title" onClick={() => navigate("/")}>
            Divina Commedia Commentary Hub
          </div>
          {!hideCantoNav && (
            <ButtonsContainer>
              <Button icon={<FaAngleLeft />} onClick={prevCanto} />
              <Spacer width="8px" />
              <Button text={showCantoNav ? "Hide" : "Cantos"} onClick={() => setShowCantoNav(!showCantoNav)} />
              <Spacer width="8px" />
              <Button icon={<FaAngleRight />} onClick={nextCanto}/>
            </ButtonsContainer>
          )}
          {showCantoNav && 
            <>
              <Spacer height="12px" />
              <CantoNavigator
                hideCantoNav={() => setShowCantoNav(false)}
                currentPart={part}
                currentCanto={canto}
              />
            </>
          }
        </InnerContainer>
        {user ? (
          <UserArea>
            <div className="initials" onClick={() => setShowUserDropdown(!showUserDropdown)}>
              {getInitials(user.displayName)}
            </div>
            {showUserDropdown && (
              <UserDropdown>
                <div onClick={() => navigate("/comments")}>My Comments</div>
                <div onClick={() => navigate("/saved")}>Saved Comments</div>
                <div onClick={logout}>Sign Out</div>
              </UserDropdown>
            )}
          </UserArea>
        ) : <div className="right" />}
      </OuterContainer>
    </NavContainer>
  )
}

export default Nav