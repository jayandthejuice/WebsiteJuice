import React, { useEffect, useState } from 'react';
import { fetchAdminData } from '../utils/api';

const Admin = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const getAdminData = async () => {
      try {
        const { data } = await fetchAdminData();
        setMessage(data.message);
      } catch {
        setMessage('Access denied.');
      }
    };
    getAdminData();
  }, []);

  return <h1>{message}</h1>;
};

export default Admin;
