// SignInSignUp.js - Authentication component for user login and registration
// This component handles both sign in and sign up functionality
// It includes email/password authentication and Google Sign In

import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  TextField, 
  Paper, 
  Container, 
  Grid, 
  Divider, 
  CircularProgress,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
// Firebase authentication and database imports
import { auth, db, provider } from '../firebase/config';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
// Material UI icons
import GoogleIcon from '@mui/icons-material/Google';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import Logo from './Logo';

function SignInSignUp() {
  // State variables for form data and UI control
  const [isSignIn, setIsSignIn] = useState(true); // Controls which form is shown (sign in or sign up)
  const [loading, setLoading] = useState(false); // Loading state for form submissions
  const [showPassword, setShowPassword] = useState(false); // Controls password visibility
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Controls notification display
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Message for notifications
  const [snackbarSeverity, setSnackbarSeverity] = useState('error'); // Type of notification (success, error)
  
  // Form field state values
  const [name, setName] = useState(''); // User's name (only for sign up)
  const [email, setEmail] = useState(''); // User's email
  const [password, setPassword] = useState(''); // User's password
  
  // Check if user is already authenticated on component mount
  useEffect(() => {
    // If user is already logged in, redirect to landing page
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        window.location.href = '/landing';
      }
    });
    
    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  // Toggle between sign in and sign up forms
  const toggleForm = () => {
    setIsSignIn(!isSignIn);
    // Clear form fields when switching forms
    setName('');
    setEmail('');
    setPassword('');
  };

  // Toggle password visibility
  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Close notification snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Handle email/password sign in
  const handleSignIn = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!email || !password) {
      setSnackbarMessage("Please fill in all fields");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    
    setLoading(true);
    
    try {
      // Attempt to sign in with email and password
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to landing page on success
      window.location.href = '/landing';
    } catch (err) {
      console.error("Error during sign in:", err.message);
      // Show appropriate error message based on error code
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setSnackbarMessage("Invalid email or password");
      } else {
        setSnackbarMessage("Error signing in. Please try again.");
      }
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  // Handle email/password sign up
  const handleSignUp = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!name || !email || !password) {
      setSnackbarMessage("Please fill in all fields");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    
    if (password.length < 6) {
      setSnackbarMessage("Password must be at least 6 characters");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    
    setLoading(true);
    
    try {
      // Create new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
        createdAt: new Date().toISOString()
      });
      
      // Redirect to landing page on success
      window.location.href = '/landing';
    } catch (err) {
      console.error("Error during sign up:", err.message);
      // Show appropriate error message based on error code
      if (err.code === 'auth/email-already-in-use') {
        setSnackbarMessage("Email address is already in use");
      } else {
        setSnackbarMessage("Error creating account. Please try again.");
      }
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    
    try {
      // Sign in with Google popup
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      // If new user, create a document in Firestore
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName || 'Google User',
          email: user.email,
          createdAt: new Date().toISOString()
        });
      }
      
      // Redirect to landing page on success
      window.location.href = '/landing';
    } catch (err) {
      console.error("Error during Google sign in:", err.message);
      setSnackbarMessage("Error signing in with Google. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  // Main component render
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: `linear-gradient(135deg, #f5f0fa 0%, #ede7f6 100%)`,
        padding: { xs: 2, md: 4 }
      }}
    >
      <Container maxWidth="md" sx={{ my: 'auto' }}>
        <Grid container>
          {/* Left Side: Form Title and Logo */}
          <Grid 
            item 
            xs={12} 
            md={5} 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center',
              py: { xs: 4, md: 8 },
              px: { xs: 3, md: 5 },
              bgcolor: '#7b1fa2',
              borderRadius: { xs: '20px 20px 0 0', md: '20px 0 0 20px' },
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Background patterns (circles) for design */}
            <Box sx={{ position: 'absolute', left: -20, top: -20, width: 120, height: 120, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
            <Box sx={{ position: 'absolute', right: -40, bottom: -40, width: 180, height: 180, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
            
            <Logo size="large" />
            
            <Typography 
              variant="h4" 
              color="white" 
              align="center" 
              fontWeight="bold"
              sx={{ mb: 2, position: 'relative', zIndex: 1 }}
            >
              {isSignIn ? 'Welcome Back!' : 'Create Account'}
            </Typography>
            
            <Typography 
              variant="body1" 
              color="white" 
              align="center"
              sx={{ opacity: 0.9, position: 'relative', zIndex: 1 }}
            >
              {isSignIn 
                ? 'Sign in to continue to your educational forum.' 
                : 'Join our community of learners and educators.'
              }
            </Typography>
          </Grid>

          {/* Right Side: Authentication Form */}
          <Grid 
            item 
            xs={12} 
            md={7}
            sx={{
              bgcolor: 'white',
              borderRadius: { xs: '0 0 20px 20px', md: '0 20px 20px 0' },
              py: { xs: 4, md: 8 },
              px: { xs: 3, md: 5 },
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            }}
          >
            {/* Sign In Form */}
            {isSignIn ? (
              <Box component="form" onSubmit={handleSignIn}>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                  Sign In
                </Typography>
                
                {/* Email Input Field */}
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-focused fieldset': {
                        borderColor: '#7b1fa2',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#7b1fa2',
                    }
                  }}
                />
                
                {/* Password Input Field with visibility toggle */}
                <TextField
                  fullWidth
                  margin="normal"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handlePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-focused fieldset': {
                        borderColor: '#7b1fa2',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#7b1fa2',
                    }
                  }}
                />
                
                {/* Forgot Password Link */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <Button 
                    variant="text" 
                    size="small"
                    sx={{ 
                      color: '#7b1fa2',
                      '&:hover': {
                        bgcolor: 'rgba(123, 31, 162, 0.04)'
                      }
                    }}
                  >
                    Forgot password?
                  </Button>
                </Box>
                
                {/* Sign In Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    bgcolor: '#7b1fa2',
                    '&:hover': {
                      bgcolor: '#6a1b9a'
                    },
                    borderRadius: 8,
                    fontSize: '1rem',
                    mb: 2
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign In'}
                </Button>
                
                {/* Divider with "OR" text */}
                <Box sx={{ position: 'relative', my: 3 }}>
                  <Divider />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      position: 'absolute', 
                      top: -10, 
                      left: '50%', 
                      transform: 'translateX(-50%)',
                      bgcolor: 'white',
                      px: 2
                    }}
                  >
                    or
                  </Typography>
                </Box>
                
                {/* Google Sign In Button */}
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderColor: '#757575',
                    color: '#757575',
                    '&:hover': {
                      borderColor: '#424242',
                      bgcolor: 'rgba(0, 0, 0, 0.04)'
                    },
                    borderRadius: 8,
                    fontSize: '1rem',
                    mb: 3
                  }}
                >
                  Continue with Google
                </Button>
                
                {/* Toggle to Sign Up Form */}
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Typography variant="body1" color="text.secondary" sx={{ mr: 1 }}>
                    Don't have an account?
                  </Typography>
                  <Button 
                    variant="text" 
                    onClick={toggleForm}
                    sx={{ 
                      p: 0, 
                      minWidth: 0,
                      color: '#7b1fa2',
                      fontWeight: 'medium',
                      '&:hover': {
                        bgcolor: 'transparent',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Sign Up
                  </Button>
                </Box>
              </Box>
            ) : (
              // Sign Up Form
              <Box component="form" onSubmit={handleSignUp}>
                <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                  Create Account
                </Typography>
                
                {/* Name Input Field */}
                <TextField
                  fullWidth
                  margin="normal"
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-focused fieldset': {
                        borderColor: '#7b1fa2',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#7b1fa2',
                    }
                  }}
                />
                
                {/* Email Input Field */}
                <TextField
                  fullWidth
                  margin="normal"
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-focused fieldset': {
                        borderColor: '#7b1fa2',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#7b1fa2',
                    }
                  }}
                />
                
                {/* Password Input Field with visibility toggle */}
                <TextField
                  fullWidth
                  margin="normal"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handlePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    mb: 3,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-focused fieldset': {
                        borderColor: '#7b1fa2',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#7b1fa2',
                    }
                  }}
                />
                
                {/* Password helper text */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Password must be at least 6 characters long
                </Typography>
                
                {/* Sign Up Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    bgcolor: '#7b1fa2',
                    '&:hover': {
                      bgcolor: '#6a1b9a'
                    },
                    borderRadius: 8,
                    fontSize: '1rem',
                    mb: 2
                  }}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Create Account'}
                </Button>
                
                {/* Divider with "OR" text */}
                <Box sx={{ position: 'relative', my: 3 }}>
                  <Divider />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      position: 'absolute', 
                      top: -10, 
                      left: '50%', 
                      transform: 'translateX(-50%)',
                      bgcolor: 'white',
                      px: 2
                    }}
                  >
                    or
                  </Typography>
                </Box>
                
                {/* Google Sign In Button */}
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderColor: '#757575',
                    color: '#757575',
                    '&:hover': {
                      borderColor: '#424242',
                      bgcolor: 'rgba(0, 0, 0, 0.04)'
                    },
                    borderRadius: 8,
                    fontSize: '1rem',
                    mb: 3
                  }}
                >
                  Continue with Google
                </Button>
                
                {/* Toggle to Sign In Form */}
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Typography variant="body1" color="text.secondary" sx={{ mr: 1 }}>
                    Already have an account?
                  </Typography>
                  <Button 
                    variant="text" 
                    onClick={toggleForm}
                    sx={{ 
                      p: 0, 
                      minWidth: 0,
                      color: '#7b1fa2',
                      fontWeight: 'medium',
                      '&:hover': {
                        bgcolor: 'transparent',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Sign In
                  </Button>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
      
      {/* Notification Snackbar for displaying errors */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={5000} 
        onClose={handleSnackbarClose} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity} 
          sx={{ width: '100%', borderRadius: 3 }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SignInSignUp;