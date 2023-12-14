import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate, Navigate } from 'react-router-dom'

import { auth, db } from '../../App'

import BaseLayout from '../../Layouts/BaseLayout/index'

import { Container, Header } from './styles'
import { onValue, ref } from 'firebase/database'
import ViewCommentModal from '../../Components/ViewCommentModal'
import Spacer from '../../Components/Spacer'
import Button from '../../Components/Button'
import { BiHome } from 'react-icons/bi'

const MyComments = ({ userUpvotes, userSaves }) => {  
  const [user, userLoading, userError] = useAuthState(auth)
  const navigate = useNavigate()

  const [userComments, setUserComments] = useState(null)
  
  useEffect(() => {
    if (!user) return

    const commentsRef = ref(db, `user-comments/${user.uid}`)
    return onValue(commentsRef, snapshot => {
      const comments = snapshot.val()
      if (snapshot.exists()) {
        setUserComments(comments)
      }
    })

  }, [user])

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
          <div className="title"><h2>My Comments</h2></div>
          <div className="right" />
        </Header>
        {userComments
        ? Object.keys(userComments).map(k => (
          <>
            <ViewCommentModal
              comment={userComments[k]}
              commentKey={k}
              userUpvotes={userUpvotes}
              userSaves={userSaves}
              commentsPage
            />
            <Spacer height="24px" />
          </>
        ))
        : <>You have not written any comments. Write your first one!</>
        }
      </Container>
    </BaseLayout>
  )
}

export default MyComments