import React from 'react';
import { Box } from '@material-ui/core';
import logo from '../assets/honeyside-logo.png';

const Logo = (props) => {
  return (
    <Box display="flex" alignItems="center">
      <img
        alt="Logo"
        src={logo}
        style={{ width: 42, height: 42 }}
        {...props}
      />
    </Box>
  );
};

export default Logo;
