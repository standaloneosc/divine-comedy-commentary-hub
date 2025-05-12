// src/Utils/UserListContext.js
import React, { useContext, useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../App';

const UserListContext = React.createContext();

export const useUserList = () => useContext(UserListContext);

export const UserListProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const commentsRef = ref(db, 'comments');

    return onValue(commentsRef, snapshot => {
      if (!snapshot.exists()) return;

      const data = snapshot.val();
      const userMap = {};

      Object.values(data).forEach(comment => {
        if (comment.user && !userMap[comment.user]) {
          userMap[comment.user] = {
            id: comment.user,
            name: comment.name || 'Anonymous User',
          };
        }

        // Include users from replies too
        if (comment.replies) {
          Object.values(comment.replies).forEach(reply => {
            if (reply.user && !userMap[reply.user]) {
              userMap[reply.user] = {
                id: reply.user,
                name: reply.name || 'Anonymous User',
              };
            }
          });
        }
      });

      const userList = Object.values(userMap);
      setUsers(userList);
    });
  }, []);

  return (
    <UserListContext.Provider value={{ users }}>
      {children}
    </UserListContext.Provider>
  );
};
