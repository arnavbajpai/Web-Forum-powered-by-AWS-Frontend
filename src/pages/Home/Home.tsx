// pages/Home/Home.tsx
import React, { useState } from 'react';

const Home: React.FC = () => {
  const handleLogin = () => {
    const cognitoDomain = 'https://us-east-1cdunkweya.auth.us-east-1.amazoncognito.com'; // Replace with your Cognito domain
    const clientId = '2j38uir75r970liae8rm669cor'; // Replace with your App Client ID
    const redirectUri = `http://localhost:3000/callback`;

    const loginUrl = `${cognitoDomain}/login?client_id=${clientId}&response_type=token&scope=openid+email+profile&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = loginUrl;
  };

  return (
    <div className="App">
      <h1>React App with Cognito Authentication</h1>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};

export default Home;
