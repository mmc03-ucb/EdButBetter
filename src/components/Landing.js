import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  CircularProgress,
  AppBar,
  Toolbar,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Avatar,
  Chip,
  Divider,
  Paper,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Drawer,
  Tabs,
  Tab,
  Badge,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import { auth, db } from '../firebase/config';
import { signOut, deleteUser, onAuthStateChanged } from 'firebase/auth';
import { doc, deleteDoc, getDoc } from 'firebase/firestore';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SchoolIcon from '@mui/icons-material/School';
import ForumIcon from '@mui/icons-material/Forum';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupIcon from '@mui/icons-material/Group';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FlagIcon from '@mui/icons-material/Flag';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AdjustIcon from '@mui/icons-material/Adjust';
import FolderIcon from '@mui/icons-material/Folder';
import CodeIcon from '@mui/icons-material/Code';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import SettingsIcon from '@mui/icons-material/Settings';
import StarIcon from '@mui/icons-material/Star';
import NotificationsIcon from '@mui/icons-material/Notifications';
import PeopleIcon from '@mui/icons-material/People';

function Landing() {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState(null);
  const [selectedSubsection, setSelectedSubsection] = useState('assignment1');

  const drawerWidth = 240;

  useEffect(() => {
    const fetchUserName = async (user) => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
        }
      } catch (err) {
        console.error("Error fetching user data:", err.message);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserName(user);
      } else {
        window.location.href = '/';
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (err) {
      console.error("Error during logout:", err.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const user = auth.currentUser;
      await deleteDoc(doc(db, 'users', user.uid));
      await deleteDoc(doc(db, 'user_data', user.uid));
      await deleteUser(user);
      window.location.href = '/';
    } catch (err) {
      console.error("Error during profile deletion:", err.message);
    }
  };

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleConfirmDelete = async () => {
    await handleDeleteUser();
    handleCloseDialog();
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleNotificationsMenuOpen = (event) => {
    setNotificationsMenuAnchor(event.currentTarget);
  };

  const handleNotificationsMenuClose = () => {
    setNotificationsMenuAnchor(null);
  };

  const handleSubsectionSelect = (subsectionId) => {
    setSelectedSubsection(subsectionId);
  };

  // Logo component in the style of the image
  const Logo = () => (
    <Box display="flex" alignItems="center">
      <Box
        component="div"
        sx={{
          bgcolor: '#7b1fa2',
          borderRadius: '50%',
          width: 36,
          height: 36,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mr: 1
        }}
      >
        <Typography variant="h6" sx={{ color: '#f0e8d6', fontWeight: 'bold', fontSize: '1rem' }}>S</Typography>
      </Box>
      <Typography 
        variant="h6" 
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

  // Course navigation items
  const courses = [
    { 
      id: 1, 
      name: 'Web Development Bootcamp', 
      code: 'CSE-301',
      icon: <CodeIcon fontSize="small" />,
      expanded: true, // Start with the subsections expanded
      subsections: [
        { id: 'assignment1', name: 'Assignment 1', icon: <AssignmentIcon fontSize="small" /> },
        { id: 'lab1', name: 'Lab 1', icon: <MenuBookIcon fontSize="small" /> },
        { id: 'lab2', name: 'Lab 2', icon: <MenuBookIcon fontSize="small" /> },
        { id: 'lab3', name: 'Lab 3', icon: <MenuBookIcon fontSize="small" /> },
        { id: 'general', name: 'General', icon: <AdjustIcon fontSize="small" /> },
      ]
    }
  ];

  // Thread data by subsection (mock)
  const threadsBySubsection = {
    assignment1: [
      {
        id: 1,
        title: 'How do I deploy React app for Assignment 1?',
        author: 'Michael K.',
        authorAvatar: 'M',
        date: '2 hours ago',
        replies: 8,
        views: 42,
        category: 'Questions',
        solved: true,
        likes: 12,
        preview: 'I\'m trying to deploy my React app to Vercel but getting build errors. The assignment requires deployment, can anyone help?'
      },
      {
        id: 3,
        title: 'Useful resources for CSS Grid in Assignment 1',
        author: 'Sarah J.',
        authorAvatar: 'S',
        date: '3 days ago',
        replies: 6,
        views: 89,
        category: 'Resources',
        solved: false,
        likes: 24,
        preview: 'I found this amazing interactive CSS Grid tutorial that really helped me complete part 3 of Assignment 1...'
      },
      {
        id: 6,
        title: 'Important: Assignment 1 grading criteria',
        author: 'Prof. Williams',
        authorAvatar: 'PW',
        date: '1 week ago',
        replies: 5,
        views: 210,
        category: 'Announcements',
        solved: false,
        likes: 45,
        preview: 'The grading criteria for Assignment 1 will focus on code quality, responsive design, and proper implementation of React components...'
      }
    ],
    lab1: [
      {
        id: 7,
        title: 'Lab 1: Setting up your development environment',
        author: 'Prof. Williams',
        authorAvatar: 'PW',
        date: '2 weeks ago',
        replies: 12,
        views: 189,
        category: 'Announcements',
        solved: false,
        likes: 28,
        preview: 'This lab will walk you through setting up Node.js, React, and other tools needed for the course...'
      },
      {
        id: 8,
        title: 'Getting VSCode extensions for Lab 1',
        author: 'Alex T.',
        authorAvatar: 'A',
        date: '10 days ago',
        replies: 7,
        views: 65,
        category: 'Questions',
        solved: true,
        likes: 15,
        preview: 'Which VSCode extensions are recommended for React development? The lab instructions mention a few but I\'m wondering if there are others.'
      }
    ],
    lab2: [
      {
        id: 2,
        title: 'Lab 2 deadline extended to next Friday',
        author: 'Prof. Williams',
        authorAvatar: 'PW',
        date: 'Yesterday',
        replies: 14,
        views: 156,
        category: 'Announcements',
        solved: false,
        likes: 32,
        preview: 'Due to multiple requests and the upcoming holiday, we\'ve decided to extend the deadline for Lab 2 submission...'
      },
      {
        id: 5,
        title: 'Trouble understanding React Hooks in Lab 2',
        author: 'Jamie L.',
        authorAvatar: 'J',
        date: '5 days ago',
        replies: 12,
        views: 72,
        category: 'Questions',
        solved: true,
        likes: 8,
        preview: 'I\'m struggling with implementing useEffect with dependencies for the lab exercise. Could someone explain the concept?'
      }
    ],
    lab3: [
      {
        id: 4,
        title: 'Study group for Lab 3 - anyone interested?',
        author: 'Alex T.',
        authorAvatar: 'A',
        date: '4 days ago',
        replies: 21,
        views: 118,
        category: 'General',
        solved: false,
        likes: 18,
        preview: 'I\'m organizing a study group for Lab 3. We\'ll be meeting in the library on Tuesday at 5pm...'
      },
      {
        id: 9,
        title: 'Lab 3 exercise on React Router is confusing',
        author: 'Dana P.',
        authorAvatar: 'D',
        date: '3 days ago',
        replies: 9,
        views: 87,
        category: 'Questions',
        solved: false,
        likes: 5,
        preview: 'I\'m having trouble with nested routes in the Lab 3 exercises. Has anyone figured out how to properly implement them?'
      }
    ],
    general: [
      {
        id: 10,
        title: 'Course Syllabus Updates',
        author: 'Prof. Williams',
        authorAvatar: 'PW',
        date: '1 week ago',
        replies: 3,
        views: 210,
        category: 'Announcements',
        solved: false,
        likes: 25,
        preview: 'I\'ve made some updates to the course syllabus including adjustments to the grading scale. Please review...'
      },
      {
        id: 11,
        title: 'Recommended JavaScript books?',
        author: 'Taylor R.',
        authorAvatar: 'T',
        date: '5 days ago',
        replies: 8,
        views: 62,
        category: 'Questions',
        solved: true,
        likes: 12,
        preview: 'I\'m looking for good JavaScript books to supplement the course material. Any recommendations?'
      }
    ]
  };

  // Get threads based on selected subsection
  const currentThreads = threadsBySubsection[selectedSubsection] || [];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress sx={{ color: '#7b1fa2' }} />
        <Typography variant="h6" marginLeft={2}>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left Sidebar - Course Navigation */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box',
            borderRight: '1px solid rgba(0, 0, 0, 0.08)',
            bgcolor: 'white'
          },
        }}
      >
        <Toolbar sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
          <Logo />
        </Toolbar>
        <Box sx={{ overflow: 'auto', p: 1 }}>
          <List dense>
            <ListItem button sx={{ borderRadius: 2, mb: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <HomeIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: 'medium' }} />
            </ListItem>
            
            <Box sx={{ px: 2, mt: 2, mb: 1 }}>
              <Typography variant="body2" color="text.secondary" fontWeight="medium">
                MY COURSE
              </Typography>
            </Box>
            
            {courses.map((course) => (
              <React.Fragment key={course.id}>
                <ListItem 
                  button 
                  selected={true}
                  sx={{ 
                    borderRadius: 2, 
                    mb: 0.5,
                    '&.Mui-selected': {
                      bgcolor: 'rgba(123, 31, 162, 0.08)',
                      '&:hover': {
                        bgcolor: 'rgba(123, 31, 162, 0.12)'
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {course.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={course.code} 
                    secondary={course.name}
                    primaryTypographyProps={{ 
                      fontWeight: 'medium',
                      variant: 'body2',
                      noWrap: true
                    }}
                    secondaryTypographyProps={{
                      variant: 'body2',
                      noWrap: true,
                      sx: { 
                        mt: 0,
                        opacity: 0.8
                      }
                    }}
                  />
                </ListItem>
                
                {/* Course subsections */}
                <List component="div" disablePadding dense>
                  {course.subsections.map((subsection) => (
                    <ListItem 
                      key={subsection.id} 
                      button 
                      selected={selectedSubsection === subsection.id}
                      onClick={() => handleSubsectionSelect(subsection.id)}
                      sx={{ 
                        pl: 4, 
                        borderRadius: 2,
                        mb: 0.5,
                        '&.Mui-selected': {
                          bgcolor: 'rgba(123, 31, 162, 0.08)',
                          '&:hover': {
                            bgcolor: 'rgba(123, 31, 162, 0.12)'
                          }
                        },
                        '&:hover': {
                          bgcolor: 'rgba(123, 31, 162, 0.04)'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        {subsection.icon}
                      </ListItemIcon>
                      <ListItemText 
                        primary={subsection.name} 
                        primaryTypographyProps={{ 
                          variant: 'body2',
                          fontWeight: selectedSubsection === subsection.id ? 'medium' : 'regular',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </React.Fragment>
            ))}
            
            <Divider sx={{ my: 2 }} />
            
            <ListItem button sx={{ borderRadius: 2, mb: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Settings" primaryTypographyProps={{ fontWeight: 'medium' }} />
            </ListItem>
            
            <ListItem button sx={{ borderRadius: 2, mb: 1 }} onClick={handleLogout}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 'medium' }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, bgcolor: '#f8f9fa', display: 'flex', flexDirection: 'column' }}>
        {/* Top App Bar */}
        <AppBar 
          position="static" 
          color="default" 
          elevation={0}
          sx={{ 
            bgcolor: 'white', 
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
          }}
        >
          <Toolbar>
            <Typography variant="h6" component="div" fontWeight="bold" sx={{ color: '#7b1fa2' }}>
              CSE-301: Web Development Bootcamp
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            
            {/* Search Bar */}
            <Paper
              component="form"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                height: 36,
                width: 240,
                px: 1,
                mx: 1,
                borderRadius: 3,
                bgcolor: '#f1f3f4'
              }}
            >
              <SearchIcon sx={{ color: 'text.secondary', fontSize: '1.2rem', mr: 1 }} />
              <InputBase
                placeholder="Search discussions..."
                inputProps={{ 'aria-label': 'search discussions' }}
                sx={{ fontSize: '0.875rem' }}
              />
            </Paper>
            
            {/* Notification Icon */}
            <Tooltip title="Notifications">
              <IconButton 
                onClick={handleNotificationsMenuOpen}
                size="small"
                color="inherit"
              >
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            {/* User Avatar */}
            <Tooltip title="Account">
              <IconButton 
                onClick={handleUserMenuOpen}
                size="small"
                sx={{ ml: 1 }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: '#7b1fa2' }}>
                  {userName.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        {/* Main Content Area */}
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 3, bgcolor: '#f8f9fa' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight="medium">
              {courses[0].subsections.find(s => s.id === selectedSubsection)?.name || 'Discussions'}
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<ForumIcon />}
              sx={{ 
                bgcolor: '#7b1fa2',
                borderRadius: 6,
                px: 2,
                '&:hover': {
                  bgcolor: '#6a1b9a'
                }
              }}
            >
              New Thread
            </Button>
          </Box>
          
          {/* Thread Cards */}
          {currentThreads.length > 0 ? (
            currentThreads.map((thread) => (
              <Paper 
                key={thread.id} 
                elevation={0}
                sx={{ 
                  mb: 2, 
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  borderRadius: 2,
                  overflow: 'hidden',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'rgba(0, 0, 0, 0.15)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }
                }}
              >
                <Box sx={{ display: 'flex', p: 2 }}>
                  {/* Left - Avatar */}
                  <Avatar sx={{ width: 40, height: 40, bgcolor: thread.id % 2 ? '#7b1fa2' : '#f0b952' }}>
                    {thread.authorAvatar}
                  </Avatar>
                  
                  {/* Middle - Thread Content */}
                  <Box sx={{ ml: 2, flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {thread.title}
                      </Typography>
                      {thread.solved && (
                        <CheckCircleIcon 
                          fontSize="small" 
                          color="success" 
                          sx={{ ml: 1 }}
                        />
                      )}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, opacity: 0.85 }}>
                      {thread.preview}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip 
                        label={thread.category} 
                        size="small" 
                        sx={{ 
                          mr: 1.5, 
                          bgcolor: thread.category === 'Questions' ? 'rgba(25, 118, 210, 0.1)' : 
                                  thread.category === 'Announcements' ? 'rgba(240, 185, 82, 0.1)' :
                                  thread.category === 'Resources' ? 'rgba(123, 31, 162, 0.1)' : 
                                  'rgba(0, 0, 0, 0.06)',
                          color: thread.category === 'Questions' ? 'primary.main' : 
                                thread.category === 'Announcements' ? '#d68f00' :
                                thread.category === 'Resources' ? '#7b1fa2' : 
                                'text.secondary',
                          fontWeight: 'medium'
                        }} 
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                        by {thread.author} · {thread.date}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mr: 1.5 }}>
                        <QuestionAnswerIcon sx={{ fontSize: 14, mr: 0.5 }} /> {thread.replies}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mr: 1.5 }}>
                        <TrendingUpIcon sx={{ fontSize: 14, mr: 0.5 }} /> {thread.views}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <ThumbUpIcon sx={{ fontSize: 14, mr: 0.5 }} /> {thread.likes}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
            ))
          ) : (
            <Box sx={{ textAlign: 'center', py: 5 }}>
              <Typography variant="body1" color="text.secondary">
                No discussions found for this topic.
              </Typography>
              <Button 
                variant="outlined" 
                startIcon={<ForumIcon />}
                sx={{ 
                  mt: 2,
                  borderRadius: 6,
                  color: '#7b1fa2',
                  borderColor: '#7b1fa2',
                  '&:hover': {
                    borderColor: '#7b1fa2',
                    bgcolor: 'rgba(123, 31, 162, 0.08)'
                  }
                }}
              >
                Start a New Discussion
              </Button>
            </Box>
          )}
        </Box>
      </Box>
      
      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => { window.location.href = '/profile'; }}>
          <ListItemIcon>
            <AccountCircleIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleOpenDialog} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Account</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsMenuAnchor}
        open={Boolean(notificationsMenuAnchor)}
        onClose={handleNotificationsMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          sx: { width: 320, maxWidth: '100%' }
        }}
      >
        <Box sx={{ p: 1, pb: 0 }}>
          <Typography variant="subtitle1" fontWeight="medium">
            Notifications
          </Typography>
        </Box>
        {/* Notifications content */}
        <Divider />
        <Box sx={{ p: 1, textAlign: 'center' }}>
          <Button size="small" sx={{ color: '#7b1fa2' }}>
            View All
          </Button>
        </Box>
      </Menu>

      {/* Delete Profile Dialog */}
      <Dialog open={open} onClose={handleCloseDialog} sx={{ '& .MuiPaper-root': { borderRadius: 4 } }}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography color="error">
            Are you sure you want to delete your profile and all associated data? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Landing;
