
import React, { useEffect } from 'react';
import AdminLogin from '@/components/AdminLogin';
import { initializeData } from '@/lib/data';

const Admin = () => {
  useEffect(() => {
    // Initialize data when the admin page loads
    initializeData();
  }, []);

  return (
    <AdminLogin />
  );
};

export default Admin;
