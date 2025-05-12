import React from 'react';
import { useNavigate } from 'react-router-dom';

import CantoNavigator from '../../Components/CantoNavigator';
import AuthLayout from '../../Layouts/AuthLayout';

const Home = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout hideCantoNav>
      <CantoNavigator />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '30px',
        }}
      >
        <button
          onClick={() => navigate('/users')}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#8a5117',         // accentBrown
            color: '#feffe6',                   // backgroundTan
            border: '1px solid #633a10',        // accentBrownHover
            borderRadius: '6px',
            cursor: 'pointer',
            fontFamily: '"EB Garamond", serif',
            transition: 'background-color 0.2s ease',
          }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = '#633a10') // hover
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = '#8a5117') // default
          }
          onMouseDown={(e) =>
            (e.currentTarget.style.backgroundColor = '#522f0b') // click
          }
          onMouseUp={(e) =>
            (e.currentTarget.style.backgroundColor = '#633a10') // hover again
          }
        >
          View All Users
        </button>
      </div>
    </AuthLayout>
  );
};

export default Home;
