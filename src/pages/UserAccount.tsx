import React, { useEffect, useState } from 'react';
import UserLogin from '@/components/UserLogin';
import UserDashboard from '@/components/UserDashboard';
import Layout from '@/components/Layout';

const UserAccount: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const checkLoginStatus = () => {
    const userLoggedIn = sessionStorage.getItem('userLoggedIn') === 'true';
    setIsLoggedIn(userLoggedIn);
  };

  useEffect(() => {
    checkLoginStatus();
    // Listen to storage events if modifying from different tabs/windows
    window.addEventListener('storage', checkLoginStatus);
    // Listen for our custom event from UserLogin component
    window.addEventListener('userLoggedIn', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('userLoggedIn', checkLoginStatus);
    };
  }, []);

  return (
    <Layout>
      {isLoggedIn ? <UserDashboard /> : <UserLogin />}
    </Layout>
  );
};

export default UserAccount;
