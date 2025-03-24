// Profile.js - User profile management component
// This component handles displaying and editing user profile information
// It includes tabs for courses, activity, and account settings

import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  TextField, 
  Paper, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  CircularProgress, 
  Snackbar, 
  Alert, 
  Container,
  Grid,
  Avatar,
  IconButton,
  Divider,
  AppBar,
  Toolbar,
  Card,
  CardContent,
  Tab, 
  Tabs
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
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import ForumIcon from '@mui/icons-material/Forum';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Profile() {
  // State variables for user data and UI control
  const [name, setName] = useState(''); // User's display name
  const [email, setEmail] = useState(''); // User's email address
  const [loading, setLoading] = useState(true); // Controls loading indicator
  const [open, setOpen] = useState(false); // Controls delete confirmation dialog
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Controls notification display
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Message for notifications
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // Type of notification (success, error, etc)
  const [editing, setEditing] = useState(false); // Whether user is in edit mode
  const [tabValue, setTabValue] = useState(0); // Currently selected tab index

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

  // Logo component - Reusable branded header element
  const Logo = () => (
    <Box display="flex" alignItems="center">
      <Box
        component="div"
        sx={{
          bgcolor: '#7b1fa2',
          borderRadius: '50%',
          width: 40,
          height: 40,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mr: 1
        }}
      >
        <Typography variant="h6" sx={{ color: '#f0e8d6', fontWeight: 'bold' }}>S</Typography>
      </Box>
      <Typography 
        variant="h5" 
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

  // Handler for tab selection changes
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Dialog and UI control handlers
  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);
  const handleConfirmDelete = async () => { await handleDelete(); handleCloseDialog(); };
  const handleSnackbarClose = () => setSnackbarOpen(false);
  const toggleEditing = () => setEditing(!editing);

  // Mock data for the courses tab - In a real app, this would come from database
  const enrolledCourses = [
    { id: 1, title: 'Introduction to Machine Learning', progress: 65 },
    { id: 2, title: 'Web Development Fundamentals', progress: 90 },
    { id: 3, title: 'Data Structures and Algorithms', progress: 30 }
  ];

  // Mock data for the activity tab - In a real app, this would come from database
  const recentActivity = [
    { id: 1, type: 'post', title: 'How to optimize neural networks?', date: '2 days ago' },
    { id: 2, type: 'reply', title: 'Re: Best books for beginners', date: '4 days ago' },
    { id: 3, type: 'course', title: 'Completed "JavaScript Basics" module', date: '1 week ago' }
  ];

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
          <Logo />
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

      {/* Main Content Area - Grid layout with profile card and tabbed content */}
      <Container maxWidth="lg" sx={{ mt: 5, mb: 8 }}>
        <Grid container spacing={4}>
          {/* Left Side: Profile Summary Card - Shows user info and edit controls */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              borderRadius: 4, 
              overflow: 'hidden', 
              boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
              height: '100%'
            }}>
              {/* Purple header banner */}
              <Box sx={{ 
                bgcolor: '#7b1fa2', 
                height: 100, 
                width: '100%', 
                position: 'relative' 
              }} />
              
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
                    bgcolor: '#f0b952',
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
                          Beginner
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
                          3 courses
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
                </Box>
              </Box>
            </Card>
          </Grid>
          
          {/* Right Side: Tabbed Content Area - Courses, Activity, Account tabs */}
          <Grid item xs={12} md={8}>
            <Card sx={{ 
              borderRadius: 4, 
              overflow: 'hidden', 
              boxShadow: '0 6px 18px rgba(0,0,0,0.08)'
            }}>
              {/* Tab Navigation */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                  value={tabValue} 
                  onChange={handleTabChange} 
                  sx={{
                    '& .MuiTab-root': { 
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '1rem'
                    },
                    '& .Mui-selected': {
                      color: '#7b1fa2',
                    },
                    '& .MuiTabs-indicator': {
                      backgroundColor: '#7b1fa2',
                    },
                  }}
                >
                  <Tab icon={<MenuBookIcon />} iconPosition="start" label="My Courses" />
                  <Tab icon={<ForumIcon />} iconPosition="start" label="Activity" />
                  <Tab icon={<AccountCircleIcon />} iconPosition="start" label="Account" />
                </Tabs>
              </Box>
              
              {/* Courses Tab Content - Shows enrolled courses and progress */}
              {tabValue === 0 && (
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Enrolled Courses
                  </Typography>
                  
                  {/* Course list with progress bars */}
                  {enrolledCourses.map((course) => (
                    <Card 
                      key={course.id} 
                      variant="outlined" 
                      sx={{ 
                        mb: 2, 
                        borderRadius: 3,
                        borderColor: '#e0e0e0'
                      }}
                    >
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="medium">
                              {course.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Progress: {course.progress}%
                            </Typography>
                          </Box>
                          <Button 
                            variant="contained" 
                            size="small"
                            sx={{ 
                              bgcolor: '#7b1fa2',
                              borderRadius: 6,
                              '&:hover': {
                                bgcolor: '#6a1b9a'
                              }
                            }}
                          >
                            Continue
                          </Button>
                        </Box>
                        {/* Progress bar */}
                        <Box 
                          sx={{ 
                            mt: 2, 
                            height: 8, 
                            bgcolor: '#f0f0f0', 
                            borderRadius: 4,
                            overflow: 'hidden'
                          }}
                        >
                          <Box 
                            sx={{ 
                              height: '100%', 
                              bgcolor: '#7b1fa2', 
                              width: `${course.progress}%`
                            }} 
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Browse more courses button */}
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Button 
                      variant="outlined"
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
                      Browse More Courses
                    </Button>
                  </Box>
                </CardContent>
              )}
              
              {/* Activity Tab Content - Shows recent user activity */}
              {tabValue === 1 && (
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Recent Activity
                  </Typography>
                  
                  {/* Activity list */}
                  {recentActivity.map((activity) => (
                    <Box 
                      key={activity.id} 
                      sx={{ 
                        mb: 2, 
                        pb: 2,
                        borderBottom: '1px solid #f0f0f0'
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle1">
                          {activity.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {activity.date}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {activity.type === 'post' && 'You created a new post'}
                        {activity.type === 'reply' && 'You replied to a discussion'}
                        {activity.type === 'course' && 'Course progress updated'}
                      </Typography>
                    </Box>
                  ))}
                </CardContent>
              )}
              
              {/* Account Tab Content - Account settings form */}
              {tabValue === 2 && (
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Account Settings
                  </Typography>
                  
                  {/* Account settings form */}
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField 
                        fullWidth 
                        label="Display Name" 
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
                    </Grid>
                    <Grid item xs={12}>
                      <TextField 
                        fullWidth 
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
                    </Grid>
                    <Grid item xs={12}>
                      <TextField 
                        fullWidth 
                        label="New Password" 
                        type="password"
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
                    </Grid>
                    <Grid item xs={12}>
                      <Button 
                        variant="contained" 
                        fullWidth
                        sx={{ 
                          borderRadius: 6,
                          bgcolor: '#7b1fa2',
                          '&:hover': {
                            bgcolor: '#6a1b9a'
                          },
                          mt: 2
                        }}
                      >
                        Save Changes
                      </Button>
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 4 }} />
                  
                  {/* Danger Zone - Account deletion section */}
                  <Typography variant="h6" color="error" sx={{ mb: 2 }}>
                    Danger Zone
                  </Typography>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    fullWidth
                    onClick={handleOpenDialog}
                    startIcon={<DeleteIcon />}
                    sx={{ 
                      borderRadius: 6
                    }}
                  >
                    Delete My Account
                  </Button>
                </CardContent>
              )}
            </Card>
          </Grid>
        </Grid>
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