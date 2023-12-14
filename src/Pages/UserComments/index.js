import React, { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useNavigate, Navigate, useParams } from 'react-router-dom'
import { child, get, onValue, ref } from 'firebase/database'

import { auth, db } from '../../App'

import BaseLayout from '../../Layouts/BaseLayout/index'

import { Container, Header } from './styles'
import ViewCommentModal from '../../Components/ViewCommentModal'
import Spacer from '../../Components/Spacer'
import Button from '../../Components/Button'
import { BiHome } from 'react-icons/bi'

const UserComments = ({ userUpvotes: currentUserUpvotes, userSaves: currentUserSaves }) => {  
  const { otherUserId } = useParams()
  const navigate = useNavigate()

  const [user, userLoading, userError] = useAuthState(auth)

  const [userComments, setUserComments] = useState(null)
  const [otherUserData, setOtherUserData] = useState(null)
  const [otherUserLoading, setOtherUserLoading] = useState(!!otherUserId)
  
  useEffect(() => {
    if (!user) return

    const uid = otherUserId || user.uid
    const commentsRef = ref(db, `user-comments/${uid}`)
    return onValue(commentsRef, snapshot => {
      if (snapshot.exists()) {
        const comments = snapshot.val()
        Object.keys(comments).forEach(k => {
          if (comments[k]["private"] && comments[k]["user"] !== user.uid) {
            delete comments[k]
          }
        })
        setUserComments(comments)
      }
    })

  }, [user, otherUserId])

  useEffect(() => {
    if (!otherUserId) return

    get(child(ref(db), `users/${otherUserId}`))
      .then(snapshot => {
        if (snapshot.exists()) {
          setOtherUserData(snapshot.val())
          setOtherUserLoading(false)
        }
      })
      .catch(err => {
        console.log("Error getting other user data:", err)
      })
  }, [otherUserId])

  if (userLoading || otherUserLoading) {
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

  const otherUserName = otherUserData ? otherUserData["name"] : "Dantista Anonimo"
  const pageTitle = otherUserData ? `${otherUserName}'s Comments` : 'My Comments'
  const emptyMessage = otherUserId 
    ? `${otherUserName.split(" ")[0]} hasn't written any comments yet.`
    : 'You have not written any comments. Write your first one!'

  return (
    <BaseLayout hideCantoNav>
      <Container>
        <Header>
          <div className="button"><Button onClick={() => navigate("/")} icon={<BiHome />} /></div>
          <div className="title"><h2>{pageTitle}</h2></div>
          <div className="right" />
        </Header>
        {userComments && Object.keys(userComments).length > 0
        ? Object.keys(userComments).map(k => (
          <div key={`comment-${k}`}>
            <ViewCommentModal
              comment={userComments[k]}
              commentKey={k}
              userUpvotes={currentUserUpvotes}
              userSaves={currentUserSaves}
              commentsPage
            />
            <Spacer height="24px" />
          </div>
        ))
        : <>{emptyMessage}</>
        }
      </Container>
    </BaseLayout>
  )
}

export default UserComments