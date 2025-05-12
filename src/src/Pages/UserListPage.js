import React from 'react';
import { useNavigate } from 'react-router-dom';
import FullPageUserList from '../Components/UserList/FullPageUserList';

const UserListPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      padding: '40px',
      maxWidth: '700px',
      margin: '0 auto',
      backgroundColor: '#feffe6', // backgroundTan
      fontFamily: '"EB Garamond", serif',
      color: '#5e5e5e' // textGray
    }}>
      <button
        onClick={() => navigate('/')}
        style={{
          marginBottom: '20px',
          padding: '8px 16px',
          fontSize: '14px',
          backgroundColor: '#8a5117',       // accentBrown
          color: '#feffe6',                  // backgroundTan
          border: '1px solid #633a10',       // accentBrownHover
          borderRadius: '6px',
          cursor: 'pointer',
          fontFamily: '"EB Garamond", serif',
          transition: 'background-color 0.2s ease'
        }}
        onMouseOver={e => e.currentTarget.style.backgroundColor = '#633a10'} // accentBrownHover
        onMouseOut={e => e.currentTarget.style.backgroundColor = '#8a5117'}  // revert to accentBrown
        onMouseDown={e => e.currentTarget.style.backgroundColor = '#522f0b'} // accentBrownClick
        onMouseUp={e => e.currentTarget.style.backgroundColor = '#633a10'}   // accentBrownHover
      >
        ← Back to Home
      </button>
      <FullPageUserList />
    </div>
  );
};

export default UserListPage;
