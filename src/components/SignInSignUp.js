import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Paper, Divider, Snackbar, Alert } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';
import { auth, db, provider } from '../firebase/config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

function SignInSignUp() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleToggle = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = '/landing';
    } catch (err) {
      setError("Invalid Email or Password. Please try again.");
      setSnackbarOpen(true);
    }
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setSnackbarOpen(true);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
        createdAt: serverTimestamp(),
        profilePicture: '',
        features: ['basic'],
        preferences: {},
      });

      window.location.href = '/landing';
    } catch (err) {
      setError("Account already exists, please Sign In Instead.");
      setSnackbarOpen(true);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        profilePicture: user.photoURL,
        createdAt: serverTimestamp(),
        features: ['basic'],
        preferences: {},
      }, { merge: true });

      window.location.href = '/landing';
    } catch (err) {
      setError(err.message);
      setSnackbarOpen(true);
    }
  };

  // Brand logo component in the style of the image
  const Logo = () => (
    <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
      <Box
        component="div"
        sx={{
          bgcolor: '#7b1fa2',
          borderRadius: '50%',
          width: 50,
          height: 50,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mr: 1
        }}
      >
        <Typography variant="h6" sx={{ color: '#f0e8d6', fontWeight: 'bold' }}>S</Typography>
      </Box>
      <Typography 
        variant="h4" 
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

  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      height="100vh" 
      sx={{ 
        background: 'linear-gradient(135deg, #f5f0fa 0%, #e8e0f4 100%)',
        padding: 3
      }}
    >
      <Paper 
        elevation={4} 
        sx={{ 
          padding: 4, 
          borderRadius: 6, 
          minWidth: 350, 
          maxWidth: 430, 
          textAlign: 'center',
          backgroundColor: '#ffffff',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Logo />
        
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#7b1fa2',
            fontWeight: 'bold',
            fontSize: '2rem',
            mb: 3
          }}
        >
          {isSignUp ? 'Create Account' : 'Welcome Back!'}
        </Typography>
        
        {isSignUp && (
          <TextField 
            fullWidth 
            margin="normal" 
            label="Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                '&.Mui-focused fieldset': {
                  borderColor: '#7b1fa2',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#7b1fa2',
              }
            }}
          />
        )}
        
        <TextField 
          fullWidth 
          margin="normal" 
          label="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              '&.Mui-focused fieldset': {
                borderColor: '#7b1fa2',
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#7b1fa2',
            }
          }}
        />
        
        <TextField 
          fullWidth 
          margin="normal" 
          label="Password" 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              '&.Mui-focused fieldset': {
                borderColor: '#7b1fa2',
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#7b1fa2',
            }
          }}
        />
        
        {isSignUp && (
          <TextField 
            fullWidth 
            margin="normal" 
            label="Confirm Password" 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                '&.Mui-focused fieldset': {
                  borderColor: '#7b1fa2',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#7b1fa2',
              }
            }}
          />
        )}
        
        <Button 
          fullWidth 
          variant="contained" 
          onClick={isSignUp ? handleSignUp : handleSignIn} 
          sx={{ 
            marginTop: 3, 
            padding: 1.2,
            borderRadius: 6,
            backgroundColor: '#7b1fa2',
            fontSize: '1rem',
            fontWeight: 'bold',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#6a1b9a',
            }
          }}
        >
          {isSignUp ? 'Create Account' : 'Sign In'}
        </Button>
        
        <Box sx={{ position: 'relative', textAlign: 'center', margin: '20px 0' }}>
          <Divider sx={{ margin: '20px 0' }} />
          <Typography 
            variant="body2" 
            sx={{ 
              position: 'absolute', 
              top: '10px', 
              left: '50%', 
              transform: 'translateX(-50%)', 
              backgroundColor: 'white', 
              padding: '0 10px',
              color: '#888'
            }}
          >
            or
          </Typography>
        </Box>
        
        <Button 
          fullWidth 
          variant="outlined" 
          startIcon={<GoogleIcon />} 
          onClick={handleGoogleSignIn} 
          sx={{ 
            padding: 1.2,
            borderRadius: 6,
            borderColor: '#e2e8f0',
            color: '#4a5568',
            textTransform: 'none',
            fontWeight: 'medium',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            '&:hover': {
              backgroundColor: '#f8f9fa',
              borderColor: '#cbd5e0',
            }
          }}
        >
          Continue with Google
        </Button>
        
        <Typography 
          variant="body1" 
          sx={{ 
            marginTop: 3,
            color: '#7b1fa2',
            fontWeight: 'medium',
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline'
            }
          }} 
          onClick={handleToggle}
        >
          {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </Typography>

      </Paper>

      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%', borderRadius: 3 }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default SignInSignUp;
