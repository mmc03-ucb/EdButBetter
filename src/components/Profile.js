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
  Chip,
  useMediaQuery,
  useTheme
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

// Styles
const styles = {
  appBar: { bgcolor: 'white', color: 'text.primary', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  logoutButton: {
    borderRadius: 30,
    mr: 1,
    borderColor: 'transparent',
    '&:hover': {
      borderColor: 'transparent',
      bgcolor: 'rgba(211, 47, 47, 0.08)'
    }
  },
  profileCard: {
    borderRadius: 4,
    overflow: 'hidden',
    boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
    width: '100%'
  },
  headerBanner: {
    bgcolor: '#7b1fa2',
    height: 100,
    width: '100%',
    position: 'relative',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    p: 2
  },
  roleChip: {
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
  },
  avatar: {
    width: 100,
    height: 100,
    border: '4px solid white',
    fontSize: '2.5rem',
    fontWeight: 'bold'
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 3,
      '&.Mui-focused fieldset': {
        borderColor: '#7b1fa2',
      },
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#7b1fa2',
    }
  }
};

// Profile Card Component
const ProfileCard = ({ 
  name, 
  email, 
  isTutor, 
  editing, 
  onEdit, 
  onSave, 
  onDelete, 
  onRoleToggle,
  setName,
  setEmail,
  isMobile
}) => (
  <Card sx={styles.profileCard}>
    <Box sx={styles.headerBanner}>
      <Chip
        icon={isTutor ? <SchoolIcon sx={{ fontSize: isMobile ? 24 : 28 }} /> : <AccountCircleIcon sx={{ fontSize: isMobile ? 24 : 28 }} />}
        label={isTutor ? "Tutor" : "Student"}
        sx={{
          ...styles.roleChip,
          fontSize: isMobile ? '0.9rem' : '1.1rem',
          minWidth: isMobile ? '120px' : '140px',
          '& .MuiChip-label': {
            padding: '4px 8px',
            fontSize: isMobile ? '0.9rem' : '1.1rem'
          }
        }}
      />
    </Box>
    
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', mt: -5 }}>
      <Avatar sx={{ 
        ...styles.avatar, 
        bgcolor: isTutor ? '#f0b952' : '#7b1fa2',
        width: isMobile ? 80 : 100,
        height: isMobile ? 80 : 100,
        fontSize: isMobile ? '2rem' : '2.5rem'
      }}>
        {name.charAt(0).toUpperCase()}
      </Avatar>
      
      <Box sx={{ p: isMobile ? 2 : 3, width: '100%', textAlign: 'center' }}>
        {editing ? (
          <>
            <TextField 
              fullWidth 
              margin="normal" 
              label="Name" 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              sx={styles.textField}
            />
            <TextField 
              fullWidth 
              margin="normal" 
              label="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              sx={styles.textField}
            />
          </>
        ) : (
          <>
            <Typography variant={isMobile ? "h6" : "h5"} fontWeight="bold" gutterBottom>{name}</Typography>
            <Typography variant="body1" color="text.secondary" gutterBottom>{email}</Typography>
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              mt: 1, 
              mb: 2, 
              justifyContent: 'center', 
              flexWrap: 'wrap' 
            }}>
              <Button size="small" variant="outlined" sx={{ borderRadius: 4, color: '#7b1fa2', borderColor: '#7b1fa2' }}>
                {isTutor ? 'Teacher' : 'Beginner'}
              </Button>
              <Button size="small" variant="outlined" sx={{ borderRadius: 4, color: '#7b1fa2', borderColor: '#7b1fa2' }}>
                {isTutor ? 'Teaching 3 courses' : '3 courses'}
              </Button>
            </Box>
          </>
        )}
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ 
          mt: 2, 
          display: 'flex', 
          justifyContent: 'center', 
          gap: isMobile ? 1 : 2,
          flexDirection: isMobile ? 'column' : 'row' 
        }}>
          {editing ? (
            <Button 
              variant="contained" 
              startIcon={<SaveIcon />}
              onClick={onSave}
              sx={{ borderRadius: 6, bgcolor: '#7b1fa2', '&:hover': { bgcolor: '#6a1b9a' } }}
            >
              Save Changes
            </Button>
          ) : (
            <Button 
              variant="outlined" 
              startIcon={<EditIcon />}
              onClick={onEdit}
              sx={{ borderRadius: 6, color: '#7b1fa2', borderColor: '#7b1fa2' }}
            >
              Edit Profile
            </Button>
          )}
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={<DeleteIcon />}
            onClick={onDelete}
            sx={{ borderRadius: 6 }}
          >
            Delete
          </Button>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Button
          variant="text"
          startIcon={isTutor ? <PersonIcon /> : <SchoolIcon />}
          onClick={onRoleToggle}
          sx={{ color: '#7b1fa2', '&:hover': { bgcolor: 'rgba(123, 31, 162, 0.08)' } }}
        >
          Switch to {isTutor ? 'Student' : 'Tutor'} View
        </Button>
      </Box>
    </Box>
  </Card>
);

function Profile() {
  // State variables for user data and UI control
  const [name, setName] = useState(''); // User's display name
  const [email, setEmail] = useState(''); // User's email address
  const [loading, setLoading] = useState(true); // Controls loading indicator
  const [open, setOpen] = useState(false); // Controls delete confirmation dialog
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' }); // Controls notification display
  const [editing, setEditing] = useState(false); // Whether user is in edit mode
  const [isTutor, setIsTutor] = useState(false); // Whether user is a tutor or student
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
        showSnackbar("Failed to load profile data.", "error");
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
      showSnackbar("Name and email cannot be empty.", "warning");
      return;
    }

    try {
      // Update user data in Firestore
      const user = auth.currentUser;
      await updateDoc(doc(db, 'users', user.uid), { name, email });
      
      // Show success message and exit edit mode
      showSnackbar("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      showSnackbar("Error updating profile.", "error");
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
      showSnackbar("Error deleting profile.", "error");
    }
  };

  // Handler for user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (err) {
      showSnackbar("Error during logout.", "error");
    }
  };

  // Dialog and UI control handlers
  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);
  const handleConfirmDelete = async () => { await handleDelete(); handleCloseDialog(); };
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });
  const toggleEditing = () => setEditing(!editing);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

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
      <AppBar position="static" sx={styles.appBar}>
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
          {!isMobile && <Logo size="medium" />}
          <Box sx={{ flexGrow: 1 }} />
          <Button 
            variant="outlined" 
            color="error" 
            startIcon={isMobile ? null : <LogoutIcon />}
            onClick={handleLogout}
            sx={styles.logoutButton}
          >
            {isMobile ? <LogoutIcon /> : 'Logout'}
          </Button>
        </Toolbar>
      </AppBar>

      {/* Centered Profile Card */}
      <Container 
        maxWidth="sm" 
        sx={{ 
          mt: isMobile ? 2 : 5, 
          mb: isMobile ? 4 : 8, 
          px: isMobile ? 2 : 3,
          display: 'flex', 
          justifyContent: 'center' 
        }}
      >
        <ProfileCard
          name={name}
          email={email}
          isTutor={isTutor}
          editing={editing}
          onEdit={toggleEditing}
          onSave={handleSave}
          onDelete={handleOpenDialog}
          onRoleToggle={() => setIsTutor(!isTutor)}
          setName={setName}
          setEmail={setEmail}
          isMobile={isMobile}
        />
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
        open={snackbar.open} 
        autoHideDuration={3000} 
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

export default Profile;