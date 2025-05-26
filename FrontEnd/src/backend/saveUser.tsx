import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const SyncUserWithBackend = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const sendUserToBackend = async () => {
      if (!isAuthenticated || !user) return;

      try {
        const token = await getAccessTokenSilently();

        
        const userData = {
          username: user.name || user.email?.split('@')[0],
          email: user.email,

        };

        await axios.post(
          'http://localhost:4000/api/user/upsert', 
          userData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (error) {
        console.error('Failed to sync user with backend:', error);
      }
    };

    sendUserToBackend();
  }, [isAuthenticated, user, getAccessTokenSilently]);

  return null;
};

export default SyncUserWithBackend;
