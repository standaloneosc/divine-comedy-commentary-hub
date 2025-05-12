import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../Components/Input'
import { child, onValue, push, ref, set } from 'firebase/database'

import { db } from '../../App'

import Button from '../../Components/Button'
import Spacer from '../../Components/Spacer'
import AuthLayout from '../../Layouts/AuthLayout'

import { makeJoinCode } from '../../Utils/utility'
import { Box, Container, Error, UserList, UserItem } from './styles'

const Admin = () => {
  const [allGroups, setAllGroups] = useState(null)
  const [allUsers, setAllUsers] = useState(null)
  const navigate = useNavigate()

  const [newGroupName, setNewGroupName] = useState("")
  const [createGroupLoading, setCreateGroupLoading] = useState(false)
  const [createGroupError, setCreateGroupError] = useState(null)

  useEffect(() => {
    const groupsRef = ref(db, `groups`)
    return onValue(groupsRef, snapshot => {
      if (snapshot.exists()) {
        const groups = snapshot.val()
        setAllGroups(groups)
      }
    })
  }, [])

  useEffect(() => {
    const usersRef = ref(db, `users`)
    return onValue(usersRef, snapshot => {
      if (snapshot.exists()) {
        const users = snapshot.val()
        setAllUsers(users)
      }
    })
  }, [])

  const createGroup = async () => {
    if (newGroupName.length < 5) {
      setCreateGroupError("Please choose a longer group name.")
      return
    }

    setCreateGroupLoading(true)

    try {
      const groupKey = push(child(ref(db), 'groups')).key
      await set(ref(db, `groups/${groupKey}`), {
        name: newGroupName,
        memberCount: 0,
        joinCode: makeJoinCode(),
      })

      setNewGroupName("")
      setCreateGroupError(null)
    } catch (err) {
      setCreateGroupError(err.message)
    }
    
    setCreateGroupLoading(false)
  }

  const getUsersInGroup = (groupId) => {
    if (!allUsers) return []
    return Object.entries(allUsers)
      .filter(([_, user]) => user.group === groupId)
      .map(([userId, user]) => ({ userId, ...user }))
  }

  const navigateToUserComments = (userId) => {
    navigate(`/user/${userId}`)
  }

  return (
    <AuthLayout hideCantoNav>
      <Container>
        <Box>
          <h3>Add New Group</h3>
          {createGroupError && <Error>{createGroupError}</Error>}
          <Input placeholder="New group name" value={newGroupName} setValue={setNewGroupName} />
          <Button text="Create Group" onClick={createGroup} loading={createGroupLoading} />
        </Box>
        <Spacer height="24px" />
        <Box>
          <h3>Current Groups</h3>
          {allGroups && (
            <div>
              {Object.entries(allGroups).map(([groupId, group]) => (
                <div key={groupId}>
                  <h4>{group.name} (Join code: {group.joinCode})</h4>
                  {allUsers && (
                    <UserList>
                      <h5>Members:</h5>
                      {getUsersInGroup(groupId).length > 0 ? (
                        getUsersInGroup(groupId).map(user => (
                          <UserItem 
                            key={user.userId}
                            onClick={() => navigateToUserComments(user.userId)}
                          >
                            {user.name || 'Anonymous User'} ({user.email})
                          </UserItem>
                        ))
                      ) : (
                        <p>No members in this group yet</p>
                      )}
                    </UserList>
                  )}
                  <Spacer height="12px" />
                </div>
              ))}
            </div>
          )}
        </Box>
      </Container>
    </AuthLayout>
  )
}

export default Admin