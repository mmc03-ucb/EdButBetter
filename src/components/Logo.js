import React from 'react';
import { Box, Typography } from '@mui/material';

function Logo({ size = 'medium' }) {
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
      width: 50,
      height: 50,
      fontSize: '1.5rem',
    }
  };

  const selectedSize = sizes[size] || sizes.medium;

  return (
    <Box display="flex" alignItems="center">
      {/* Chat bubble logo */}
      <Box
        component="div"
        sx={{
          width: selectedSize.width,
          height: selectedSize.height,
          position: 'relative',
          mr: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: '#5FE3D3',
          borderRadius: '12px',
          transform: 'rotate(-5deg)',
          '&::before': {
            content: '""',
            position: 'absolute',
            bottom: -4,
            right: -4,
            width: 8,
            height: 8,
            bgcolor: '#5FE3D3',
            borderRadius: '50%'
          }
        }}
      >
        {/* Three dots inside chat bubble */}
        <Box sx={{ display: 'flex', gap: 0.5, transform: 'translateY(-2px)' }}>
          {[...Array(3)].map((_, i) => (
            <Box
              key={i}
              sx={{
                width: selectedSize.width * 0.15,
                height: selectedSize.width * 0.15,
                bgcolor: 'white',
                borderRadius: '50%'
              }}
            />
          ))}
        </Box>
      </Box>
      
      {/* Brand name */}
      <Typography 
        variant={size === 'large' ? 'h4' : 'h6'} 
        sx={{
          fontWeight: 'bold',
          color: '#1a1a1a',
          letterSpacing: '0.5px'
        }}
      >
        HackaByte
      </Typography>
    </Box>
  );
}

export default Logo; 