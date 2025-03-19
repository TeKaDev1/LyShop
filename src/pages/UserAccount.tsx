import React, { useEffect, useState } from 'react';
import UserLogin from '@/components/UserLogin';
import UserDashboard from '@/components/UserDashboard';
import Layout from '@/components/Layout';

const UserAccount: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const userLoggedIn = sessionStorage.getItem('userLoggedIn') === 'true';
    setIsLoggedIn(userLoggedIn);
  }, []);

  return (
    <Layout>
      {isLoggedIn ? <UserDashboard /> : <UserLogin />}
    </Layout>
  );
};

export default UserAccount;