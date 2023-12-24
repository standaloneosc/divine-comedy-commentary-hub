import React, { useEffect, useState } from 'react'
import Input from '../../Components/Input'
import { child, onValue, push, ref, set } from 'firebase/database'

import { db } from '../../App'

import Button from '../../Components/Button'
import Spacer from '../../Components/Spacer'
import AuthLayout from '../../Layouts/AuthLayout'

import { makeJoinCode } from '../../Utils/utility'
import { Box, Container, Error } from './styles'

const Admin = () => {
  const [allGroups, setAllGroups] = useState(null)

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
            <ul>
              {Object.keys(allGroups).map(k => (
                <li>{`${allGroups[k].name} (Join code: ${allGroups[k].joinCode})`}</li>
              ))}
            </ul>
          )}
        </Box>
      </Container>
    </AuthLayout>
  )
}

export default Admin