// Profile.js - User profile management component
// This component handles displaying and editing user profile information

import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  CircularProgress, 
  Snackbar, 
  Alert, 
  Container,
  Avatar,
  IconButton,
  Divider,
  AppBar,
  Toolbar,
  Card,
  Chip
} from '@mui/material';
// Firebase imports for authentication and database
import { auth, db } from '../firebase/config';
import { signOut, deleteUser, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
// Material UI icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import Logo from './Logo';

function Profile() {
  // State variables for user data and UI control
  const [name, setName] = useState(''); // User's display name
  const [email, setEmail] = useState(''); // User's email address
  const [loading, setLoading] = useState(true); // Controls loading indicator
  const [open, setOpen] = useState(false); // Controls delete confirmation dialog
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Controls notification display
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Message for notifications
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Type of notification
  const [editing, setEditing] = useState(false); // Whether user is in edit mode
  const [isTutor, setIsTutor] = useState(false); // Whether user is a tutor or student

  // useEffect hook to fetch user data when component mounts
  useEffect(() => {
    // Function to get user data from Firestore database
    const fetchUserData = async (user) => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setName(data.name);
          setEmail(data.email);
          // Assuming we have a 'role' field in the user document
          // If not, we can set a default or mock value
          setIsTutor(data.role === 'tutor');
        }
      } catch (err) {
        console.error("Error fetching user data:", err.message);
        setSnackbarMessage("Failed to load profile data.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    // Firebase authentication state listener
    // Redirects to login page if user is not authenticated
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserData(user);
      } else {
        window.location.href = '/';
      }
    });

    // Clean up subscription when component unmounts
    return () => unsubscribe();
  }, []);

  // Handler for saving profile changes to Firestore
  const handleSave = async () => {
    // Validate input fields before saving
    if (!name || !email) {
      setSnackbarMessage("Name and email cannot be empty.");
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
      return;
    }

    try {
      // Update user data in Firestore
      const user = auth.currentUser;
      await updateDoc(doc(db, 'users', user.uid), { name, email });
      
      // Show success message and exit edit mode
      setSnackbarMessage("Profile updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err.message);
      setSnackbarMessage("Error updating profile.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Handler for deleting user account and associated data
  const handleDelete = async () => {
    try {
      const user = auth.currentUser;
      // Delete user data from Firestore
      await deleteDoc(doc(db, 'users', user.uid));
      await deleteDoc(doc(db, 'user_data', user.uid));
      // Delete user authentication account
      await deleteUser(user);
      // Redirect to sign in page
      window.location.href = '/';
    } catch (err) {
      console.error("Error deleting profile:", err.message);
      setSnackbarMessage("Error deleting profile.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Handler for user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (err) {
      console.error("Error during logout:", err.message);
      setSnackbarMessage("Error during logout.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // Dialog and UI control handlers
  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);
  const handleConfirmDelete = async () => { await handleDelete(); handleCloseDialog(); };
  const handleSnackbarClose = () => setSnackbarOpen(false);
  const toggleEditing = () => setEditing(!editing);

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress sx={{ color: '#7b1fa2' }} />
        <Typography variant="h6" marginLeft={2}>Loading Profile...</Typography>
      </Box>
    );
  }

  // Main component render
  return (
    <Box sx={{ bgcolor: '#f5f0fa', minHeight: '100vh' }}>
      {/* Top Navigation Bar - Contains back button, logo and logout button */}
      <AppBar position="static" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <Toolbar>
          <IconButton 
            edge="start" 
            color="inherit" 
            aria-label="back to landing"
            onClick={() => window.location.href = '/landing'}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Logo size="medium" />
          <Box sx={{ flexGrow: 1 }} />
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ 
              borderRadius: 30,
              mr: 1,
              borderColor: 'transparent',
              '&:hover': {
                borderColor: 'transparent',
                bgcolor: 'rgba(211, 47, 47, 0.08)'
              }
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Centered Profile Card */}
      <Container maxWidth="sm" sx={{ mt: 5, mb: 8, display: 'flex', justifyContent: 'center' }}>
        <Card sx={{ 
          borderRadius: 4, 
          overflow: 'hidden', 
          boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
          width: '100%'
        }}>
          {/* Purple header banner */}
          <Box sx={{ 
            bgcolor: '#7b1fa2', 
            height: 100, 
            width: '100%', 
            position: 'relative',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            p: 2
          }}>
            {/* Role indicator chip */}
            <Chip
              icon={isTutor ? 
                <SchoolIcon sx={{ fontSize: 28 }} /> : 
                <AccountCircleIcon sx={{ fontSize: 28 }} />
              }
              label={isTutor ? "Tutor" : "Student"}
              sx={{
                bgcolor: 'white',
                color: '#1a1a1a',
                borderRadius: '50px',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                py: 1.5,
                px: 1,
                height: 'auto',
                minWidth: '140px',
                '& .MuiChip-icon': {
                  color: '#7b1fa2',
                  marginRight: '8px'
                },
                '& .MuiChip-label': {
                  padding: '4px 8px',
                  fontSize: '1.1rem'
                }
              }}
            />
          </Box>
          
          {/* Profile avatar and user information */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            position: 'relative',
            mt: -5
          }}>
            <Avatar 
              sx={{ 
                width: 100, 
                height: 100, 
                bgcolor: isTutor ? '#f0b952' : '#7b1fa2',
                border: '4px solid white',
                fontSize: '2.5rem',
                fontWeight: 'bold'
              }}
            >
              {name.charAt(0).toUpperCase()}
            </Avatar>
            
            <Box sx={{ p: 3, width: '100%', textAlign: 'center' }}>
              {/* Show either edit form or profile information based on editing state */}
              {editing ? (
                // Edit mode - Show form fields
                <>
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
                </>
              ) : (
                // View mode - Show user information
                <>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {email}
                  </Typography>
                  {/* User badges/tags */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      gap: 1,
                      mt: 1,
                      mb: 2,
                      justifyContent: 'center',
                      flexWrap: 'wrap'
                    }}
                  >
                    <Button 
                      size="small" 
                      variant="outlined"
                      sx={{ 
                        borderRadius: 4,
                        color: '#7b1fa2',
                        borderColor: '#7b1fa2',
                        '&:hover': {
                          borderColor: '#7b1fa2',
                          bgcolor: 'rgba(123, 31, 162, 0.08)'
                        }
                      }}
                    >
                      {isTutor ? 'Teacher' : 'Beginner'}
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined"
                      sx={{ 
                        borderRadius: 4,
                        color: '#7b1fa2',
                        borderColor: '#7b1fa2',
                        '&:hover': {
                          borderColor: '#7b1fa2',
                          bgcolor: 'rgba(123, 31, 162, 0.08)'
                        }
                      }}
                    >
                      {isTutor ? 'Teaching 3 courses' : '3 courses'}
                    </Button>
                  </Box>
                </>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              {/* Profile action buttons - Edit/Save and Delete */}
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 2 }}>
                {editing ? (
                  // Show Save button when in edit mode
                  <Button 
                    variant="contained" 
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    sx={{ 
                      borderRadius: 6,
                      bgcolor: '#7b1fa2',
                      '&:hover': {
                        bgcolor: '#6a1b9a'
                      }
                    }}
                  >
                    Save Changes
                  </Button>
                ) : (
                  // Show Edit button when in view mode
                  <Button 
                    variant="outlined" 
                    startIcon={<EditIcon />}
                    onClick={toggleEditing}
                    sx={{ 
                      borderRadius: 6,
                      color: '#7b1fa2',
                      borderColor: '#7b1fa2',
                      '&:hover': {
                        borderColor: '#7b1fa2',
                        bgcolor: 'rgba(123, 31, 162, 0.08)'
                      }
                    }}
                  >
                    Edit Profile
                  </Button>
                )}
                <Button 
                  variant="outlined" 
                  color="error" 
                  startIcon={<DeleteIcon />}
                  onClick={handleOpenDialog}
                  sx={{ 
                    borderRadius: 6
                  }}
                >
                  Delete
                </Button>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              {/* Toggle role button for testing */}
              <Button
                variant="text"
                startIcon={isTutor ? <PersonIcon /> : <SchoolIcon />}
                onClick={() => setIsTutor(!isTutor)}
                sx={{
                  color: '#7b1fa2',
                  '&:hover': {
                    bgcolor: 'rgba(123, 31, 162, 0.08)'
                  }
                }}
              >
                Switch to {isTutor ? 'Student' : 'Tutor'} View
              </Button>
            </Box>
          </Box>
        </Card>
      </Container>

      {/* Delete Profile Confirmation Dialog */}
      <Dialog 
        open={open} 
        onClose={handleCloseDialog}
        sx={{ '& .MuiPaper-root': { borderRadius: 4 } }}
      >
        <DialogTitle>Confirm Profile Deletion</DialogTitle>
        <DialogContent>
          <Typography color="error">
            Are you sure you want to delete your profile? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar for displaying success/error messages */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={3000} 
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

export default Profile;