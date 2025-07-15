import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Box sx={{ padding: 2, paddingTop: '30px' }}>
        <Outlet />
      </Box>
    </>
  );
};

export default MainLayout;