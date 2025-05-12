import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserList } from '../../Utils/UserListContext';
import {
  Container,
  Dropdown,
  Title,
  UserItem,
  EmptyMessage,
  UserListScroll
} from './styles';

const UserList = () => {
  const { users } = useUserList();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Container>
      <Dropdown>
        <Title onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '▼ User List' : '▶ User List'}
        </Title>
        {isOpen && (
          <UserListScroll>
            {users.length > 0 ? (
              users.map(user => (
                <UserItem
                  key={user.id}
                  onClick={() => navigate(`/user/${user.id}`)}
                >
                  {user.name || 'Anonymous User'}
                </UserItem>
              ))
            ) : (
              <EmptyMessage>No users found.</EmptyMessage>
            )}
          </UserListScroll>
        )}
      </Dropdown>
    </Container>
  );
};

export default UserList;
