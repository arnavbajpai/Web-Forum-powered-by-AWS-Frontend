// pages/Callback/Callback.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const params = new URLSearchParams(hash.slice(1));
      const idToken = params.get('id_token');
      const accessToken = params.get('access_token');

      if (idToken && accessToken) {
        localStorage.setItem('id_token', idToken);
        localStorage.setItem('access_token', accessToken);
        navigate('/food'); // Redirect to a default authenticated page
      } else {
        alert('Authentication failed. Please log in again.');
        navigate('/');
      }
    } else {
      alert('No tokens found. Please log in again.');
      navigate('/');
    }
  }, [navigate]);

  return <h2>Processing login...</h2>;
};

export default Callback;
