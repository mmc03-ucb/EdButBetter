// SignInSignUp.js - Authentication component for user login and registration
// This component handles both sign in and sign up functionality
// It includes email/password authentication and Google Sign In

import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  TextField, 
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

// Shared styles
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    background: `linear-gradient(135deg, #f5f0fa 0%, #ede7f6 100%)`,
    padding: { xs: 2, md: 4 }
  },
  formField: {
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
  },
  primaryButton: {
    py: 1.5,
    bgcolor: '#7b1fa2',
    '&:hover': {
      bgcolor: '#6a1b9a'
    },
    borderRadius: 8,
    fontSize: '1rem',
    mb: 2
  },
  googleButton: {
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
  },
  divider: {
    position: 'relative', 
    my: 3
  },
  dividerText: {
    position: 'absolute', 
    top: -10, 
    left: '50%', 
    transform: 'translateX(-50%)',
    bgcolor: 'white',
    px: 2
  }
};

// Reusable form field component
const FormField = ({ label, value, onChange, type = 'text', icon: Icon, showPassword, onTogglePassword }) => (
  <TextField
    fullWidth
    margin="normal"
    label={label}
    type={type}
    value={value}
    onChange={onChange}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <Icon sx={{ color: 'text.secondary' }} />
        </InputAdornment>
      ),
      ...(showPassword !== undefined && {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={onTogglePassword} edge="end">
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        )
      })
    }}
    sx={styles.formField}
  />
);

function SignInSignUp() {
  // State variables for form data and UI control
  const [isSignIn, setIsSignIn] = useState(true); // Controls which form is shown (sign in or sign up)
  const [loading, setLoading] = useState(false); // Loading state for form submissions
  const [showPassword, setShowPassword] = useState(false); // Controls password visibility
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' }); // Controls notification display
  
  // Form field state values
  const [formData, setFormData] = useState({ name: '', email: '', password: '' }); // Form data
  
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
    setFormData({ name: '', email: '', password: '' });
  };

  // Toggle password visibility
  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Close notification snackbar
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Handle input change
  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  // Show error message
  const showError = (message) => {
    setSnackbar({ open: true, message, severity: 'error' });
  };

  // Handle email/password sign in or sign up
  const handleAuth = async (isSignIn) => {
    const { email, password, name } = formData;
    
    if (!email || !password || (!isSignIn && !name)) {
      showError("Please fill in all fields");
      return;
    }

    if (!isSignIn && password.length < 6) {
      showError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      if (isSignIn) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name,
          email,
          createdAt: new Date().toISOString()
        });
      }
      window.location.href = '/landing';
    } catch (err) {
      console.error(`Error during ${isSignIn ? 'sign in' : 'sign up'}:`, err.message);
      showError(err.code === 'auth/email-already-in-use' ? "Email address is already in use" :
               err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' ? "Invalid email or password" :
               `Error ${isSignIn ? 'signing in' : 'creating account'}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', result.user.uid), {
          name: result.user.displayName || 'Google User',
          email: result.user.email,
          createdAt: new Date().toISOString()
        });
      }
      window.location.href = '/landing';
    } catch (err) {
      console.error("Error during Google sign in:", err.message);
      showError("Error signing in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Main component render
  return (
    <Box sx={styles.container}>
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
            <Box component="form" onSubmit={(e) => { e.preventDefault(); handleAuth(isSignIn); }}>
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                {isSignIn ? 'Sign In' : 'Create Account'}
              </Typography>
              
              {!isSignIn && (
                <FormField
                  label="Full Name"
                  value={formData.name}
                  onChange={handleInputChange('name')}
                  icon={PersonIcon}
                />
              )}
              
              <FormField
                label="Email Address"
                value={formData.email}
                onChange={handleInputChange('email')}
                icon={EmailIcon}
              />
              
              <FormField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange('password')}
                icon={LockIcon}
                showPassword={showPassword}
                onTogglePassword={handlePasswordVisibility}
              />
              
              {isSignIn && (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <Button variant="text" size="small" sx={{ color: '#7b1fa2', '&:hover': { bgcolor: 'rgba(123, 31, 162, 0.04)' } }}>
                    Forgot password?
                  </Button>
                </Box>
              )}
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={styles.primaryButton}
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : (isSignIn ? 'Sign In' : 'Create Account')}
              </Button>
              
              <Box sx={styles.divider}>
                <Divider />
                <Typography variant="body2" sx={styles.dividerText}>or</Typography>
              </Box>
              
              <Button
                fullWidth
                variant="outlined"
                startIcon={<GoogleIcon />}
                onClick={handleGoogleSignIn}
                disabled={loading}
                sx={styles.googleButton}
              >
                Continue with Google
              </Button>
              
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="body1" color="text.secondary" sx={{ mr: 1 }}>
                  {isSignIn ? "Don't have an account?" : "Already have an account?"}
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
                  {isSignIn ? 'Sign Up' : 'Sign In'}
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      {/* Notification Snackbar for displaying errors */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={5000} 
        onClose={handleSnackbarClose} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity} 
          sx={{ width: '100%', borderRadius: 3 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SignInSignUp;