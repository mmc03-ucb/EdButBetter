import React from 'react';
import { Box, Typography } from '@mui/material';
import logoImage from '../assets/logo.png'; // Import the logo image

function Logo({ size = 'medium', showText = true }) {
  // Size variants for the logo
  const sizes = {
    small: {
      width: 36,
      height: 36,
      fontSize: '1rem',
    },
    medium: {
      width: 40,
      height: 40,
      fontSize: '1.25rem',
    },
    large: {
      width: 60,
      height: 60,
      fontSize: '1.5rem',
    }
  };

  const selectedSize = sizes[size] || sizes.medium;

  return (
    <Box display="flex" alignItems="center">
      {/* Logo image */}
      <Box
        component="img"
        src={logoImage}
        alt="EdButBetter Logo"
        sx={{
          width: selectedSize.width,
          height: selectedSize.height,
          objectFit: 'contain',
          mr: showText ? 1 : 0
        }}
      />
      
      {/* Brand name (optional) */}
      {showText && (
        <Typography 
          variant={size === 'large' ? 'h4' : 'h6'} 
          sx={{
            fontWeight: 'bold',
            color: '#000000',
            letterSpacing: '0.5px'
          }}
        >
          EdButBetter
        </Typography>
      )}
    </Box>
  );
}

export default Logo; 