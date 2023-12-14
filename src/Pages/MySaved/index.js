import React, { useState, useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate, Navigate } from 'react-router-dom'

import { auth, db } from '../../App'

import BaseLayout from '../../Layouts/BaseLayout/index'

import { Container, Header } from './styles'
import ViewCommentModal from '../../Components/ViewCommentModal'
import Spacer from '../../Components/Spacer'
import { child, get, ref } from 'firebase/database'
import { BiHome } from 'react-icons/bi'
import Button from '../../Components/Button'

const MySaved = ({ userUpvotes, userSaves }) => {  
  const [user, userLoading, userError] = useAuthState(auth)
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

    // setSavedComments(tmp)
  }, [user, userSaves])

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
    </BaseLayout>
  )
}

export default MySaved