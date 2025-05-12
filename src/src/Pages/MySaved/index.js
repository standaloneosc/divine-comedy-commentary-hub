import React, { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate } from 'react-router-dom'
import { BiHome } from 'react-icons/bi'
import { child, get, ref } from 'firebase/database'

import { auth, db } from '../../App'

import ViewCommentModal from '../../Components/ViewCommentModal'
import Spacer from '../../Components/Spacer'
import Button from '../../Components/Button'
import AuthLayout from '../../Layouts/AuthLayout'

import { Container, Header } from './styles'

const MySaved = ({ userUpvotes, userSaves }) => {  
  const [user] = useAuthState(auth)
  const navigate = useNavigate()

  const [savedComments, setSavedComments] = useState(null)

  useEffect(() => {
    if (!user) return
    setSavedComments(null)

    for (let commentKey in userSaves) {
      console.log('fetch key:', commentKey)
      if (userSaves[commentKey]) {
        get(child(ref(db), `comments/${commentKey}`))
          .then(snapshot => {
            if (snapshot.exists()) {
              setSavedComments(c => ({ ...c, [commentKey]: snapshot.val() }))
            }
          })
          .catch(err => {
            console.log("Error getting saved comment:", err)
          })
      }
    }
  }, [user, userSaves])

  return (
    <AuthLayout hideCantoNav>
      <Container>
        <Header>
          <div className="button"><Button onClick={() => navigate("/")} icon={<BiHome />} /></div>
          <div className="title"><h2>My Saved</h2></div>
          <div className="right" />
        </Header>
        {savedComments
        ? Object.keys(savedComments).map(k => (
          <>
            <ViewCommentModal
              comment={savedComments[k]}
              commentKey={k}
              userUpvotes={userUpvotes}
              userSaves={userSaves}
              commentsPage
            />
            <Spacer height="24px" />
          </>
        ))
        : <>You have not saved any comments. Go read some commentary!</>
        }
      </Container>
    </AuthLayout>
  )
}

export default MySaved