// App.js - Main application file defining routes and theme
// This file sets up the routing structure and the Material UI theme
// It acts as the entry point for the React application

import React from 'react';
// React Router imports for navigation
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// Material UI theming imports
import { ThemeProvider, createTheme } from '@mui/material/styles';
// Component imports for different pages
import SignInSignUp from './components/SignInSignUp';
import Landing from './components/Landing';
import Profile from './components/Profile';
import ThreadDetail from './components/ThreadDetail';
import AIQandA from './components/AIQandA';
// Import cache context provider
import { CacheProvider } from './context/CacheContext';

// Create a custom theme with colors and styling for the entire application
// This theme will be applied to all Material UI components
const theme = createTheme({
  palette: {
    primary: {
      main: '#5FE3D3', // Turquoise color from the logo
      dark: '#4CC5B7', // Darker shade for hover states
    },
    secondary: {
      main: '#f0b952', // Keep the amber accent color
    },
    background: {
      default: '#f5f0fa', // Light background
      paper: '#ffffff', // White background for cards
    },
    text: {
      primary: '#1a1a1a', // Dark gray for primary text
      secondary: '#555555', // Medium gray for secondary text
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
      },
    },
  },
});

// Main App component defining the application structure and routes
function App() {
  return (
    // ThemeProvider applies our custom theme to all child components
    <ThemeProvider theme={theme}>
      {/* CacheProvider wraps the application to provide cached data */}
      <CacheProvider>
        {/* Router sets up the navigation system */}
        <Router>
          {/* Routes define the available paths and which component to render for each */}
          <Routes>
            {/* Sign In / Sign Up page (default route) */}
            <Route path="/" element={<SignInSignUp />} />
            {/* Landing page with forum listing */}
            <Route path="/landing" element={<Landing />} />
            {/* User profile page */}
            <Route path="/profile" element={<Profile />} />
            {/* Thread detail page with dynamic threadId parameter */}
            <Route path="/thread/:threadId" element={<ThreadDetail />} />
            {/* AI Q/A page */}
            <Route path="/ai-qa" element={<AIQandA />} />
          </Routes>
        </Router>
      </CacheProvider>
    </ThemeProvider>
  );
}

export default App;