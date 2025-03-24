// App.js - Main application file defining routes and theme
// This file sets up the routing structure and the Material UI theme
// It acts as the entry point for the React application

import React from 'react';
// React Router imports for navigation
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// Material UI theming imports
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { purple } from '@mui/material/colors';
// Component imports for different pages
import SignInSignUp from './components/SignInSignUp';
import Landing from './components/Landing';
import Profile from './components/Profile';
import ThreadDetail from './components/ThreadDetail';

// Create a custom theme with colors and styling for the entire application
// This theme will be applied to all Material UI components
const theme = createTheme({
  palette: {
    primary: {
      main: purple[700], // Purple color instead of green (main brand color)
    },
    secondary: {
      main: '#f0b952', // Yellow/amber accent color for secondary elements
    },
    background: {
      default: '#f5f0fa', // Light purple-tinted background for pages
      paper: '#ffffff', // White background for cards and surfaces
    },
    text: {
      primary: '#1a1a1a', // Dark gray for primary text
      secondary: '#555555', // Medium gray for secondary text
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif', // Font stack with Poppins as primary
    h4: {
      fontWeight: 700, // Bold headers
    },
    button: {
      textTransform: 'none', // No uppercase transformation for buttons
      fontWeight: 600, // Semi-bold button text
    },
  },
  shape: {
    borderRadius: 8, // Default border radius for elements
  },
  components: {
    // Override styles for specific components
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30, // Rounded buttons
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16, // Rounded paper components (cards, etc.)
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
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;