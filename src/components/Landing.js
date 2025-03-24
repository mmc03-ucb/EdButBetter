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
  const [currentTab, setCurrentTab] = useState(0);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All Posts');

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

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
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

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
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
      icon: <CodeIcon fontSize="small" />
    },
    { 
      id: 2, 
      name: 'Data Structures & Algorithms', 
      code: 'CSE-201',
      icon: <FolderIcon fontSize="small" />
    },
    { 
      id: 3, 
      name: 'Machine Learning Fundamentals', 
      code: 'CSE-401',
      icon: <SchoolIcon fontSize="small" />
    }
  ];

  // Discussion categories
  const categories = [
    { id: 'all', name: 'All Posts', icon: <ForumIcon fontSize="small" color="action" /> },
    { id: 'questions', name: 'Questions', icon: <QuestionAnswerIcon fontSize="small" color="primary" /> },
    { id: 'announcements', name: 'Announcements', icon: <FlagIcon fontSize="small" sx={{ color: '#f0b952' }} /> },
    { id: 'resources', name: 'Resources', icon: <BookmarkIcon fontSize="small" color="success" /> },
    { id: 'general', name: 'General', icon: <AdjustIcon fontSize="small" color="action" /> }
  ];

  // Thread data (mock)
  const threads = [
    {
      id: 1,
      title: 'How do I implement a linked list in JavaScript?',
      author: 'Michael K.',
      authorAvatar: 'M',
      date: '2 hours ago',
      replies: 8,
      views: 42,
      category: 'Questions',
      solved: true,
      likes: 12,
      preview: 'I\'m trying to create a custom linked list implementation but am having trouble with the node connection logic...'
    },
    {
      id: 2,
      title: 'Assignment 3 due date extended to next Friday',
      author: 'Prof. Williams',
      authorAvatar: 'PW',
      date: 'Yesterday',
      replies: 14,
      views: 156,
      category: 'Announcements',
      solved: false,
      likes: 32,
      preview: 'Due to multiple requests and the upcoming holiday, we\'ve decided to extend the deadline for Assignment 3...'
    },
    {
      id: 3,
      title: 'Great resource for learning graph algorithms',
      author: 'Sarah J.',
      authorAvatar: 'S',
      date: '3 days ago',
      replies: 6,
      views: 89,
      category: 'Resources',
      solved: false,
      likes: 24,
      preview: 'I found this amazing interactive visualization tool that helps understand how graph traversal algorithms work...'
    },
    {
      id: 4,
      title: 'Study group for final exam - anyone interested?',
      author: 'Alex T.',
      authorAvatar: 'A',
      date: '4 days ago',
      replies: 21,
      views: 118,
      category: 'General',
      solved: false,
      likes: 18,
      preview: 'I\'m organizing a study group for the final exam. We\'ll be meeting in the library on Tuesdays and Thursdays...'
    },
    {
      id: 5,
      title: 'Trouble understanding recursion concepts',
      author: 'Jamie L.',
      authorAvatar: 'J',
      date: '5 days ago',
      replies: 12,
      views: 72,
      category: 'Questions',
      solved: true,
      likes: 8,
      preview: 'I keep getting stuck when trying to solve recursive problems. Could someone explain the base case concept...'
    },
    {
      id: 6,
      title: 'Important: Midterm exam information',
      author: 'Prof. Williams',
      authorAvatar: 'PW',
      date: '1 week ago',
      replies: 5,
      views: 210,
      category: 'Announcements',
      solved: false,
      likes: 45,
      preview: 'The midterm exam will cover chapters 1-5 and will include both multiple-choice and coding questions...'
    }
  ];

  // Notifications (mock)
  const notifications = [
    { id: 1, text: 'Prof. Williams replied to your question', time: '30 min ago' },
    { id: 2, text: 'New announcement in CSE-301', time: '2 hours ago' },
    { id: 3, text: 'Your post was marked as solution', time: 'Yesterday' }
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress sx={{ color: '#7b1fa2' }} />
        <Typography variant="h6" marginLeft={2}>Loading...</Typography>
      </Box>
    );
  }

  // Filter threads based on selected category
  const filteredThreads = selectedCategory === 'All Posts' 
    ? threads 
    : threads.filter(thread => thread.category === selectedCategory);

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
                MY COURSES
              </Typography>
            </Box>
            
            {courses.map((course) => (
              <ListItem 
                key={course.id} 
                button 
                selected={course.id === 1}
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
        <Box sx={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
          {/* Category Sidebar */}
          <Box
            sx={{
              width: 200,
              borderRight: '1px solid rgba(0, 0, 0, 0.08)',
              bgcolor: 'white',
              pt: 2,
              pl: 2
            }}
          >
            <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>
              Forum
            </Typography>
            
            <List dense disablePadding>
              {categories.map((category) => (
                <ListItem 
                  key={category.id} 
                  button 
                  selected={selectedCategory === category.name}
                  onClick={() => handleCategorySelect(category.name)}
                  sx={{ 
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    borderTopLeftRadius: 24,
                    borderBottomLeftRadius: 24,
                    pr: 2,
                    py: 0.75,
                    '&.Mui-selected': {
                      bgcolor: 'rgba(123, 31, 162, 0.08)',
                      '&:hover': {
                        bgcolor: 'rgba(123, 31, 162, 0.12)'
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {category.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={category.name} 
                    primaryTypographyProps={{ 
                      fontWeight: selectedCategory === category.name ? 'medium' : 'regular'
                    }}
                  />
                </ListItem>
              ))}
            </List>
            
            <Divider sx={{ my: 2, mr: 2 }} />
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, mb: 1, fontWeight: 'medium' }}>
              PINNED THREADS
            </Typography>
            
            <List dense disablePadding>
              <ListItem 
                button 
                sx={{ 
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  borderTopLeftRadius: 24,
                  borderBottomLeftRadius: 24,
                  pr: 2,
                  py: 0.75
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <StarIcon fontSize="small" sx={{ color: '#f0b952' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Course Syllabus" 
                  primaryTypographyProps={{ 
                    variant: 'body2',
                    noWrap: true
                  }}
                />
              </ListItem>
              <ListItem 
                button 
                sx={{ 
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  borderTopLeftRadius: 24,
                  borderBottomLeftRadius: 24,
                  pr: 2,
                  py: 0.75
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <StarIcon fontSize="small" sx={{ color: '#f0b952' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Grading Policy" 
                  primaryTypographyProps={{ 
                    variant: 'body2',
                    noWrap: true
                  }}
                />
              </ListItem>
            </List>
          </Box>

          {/* Thread List */}
          <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2, bgcolor: '#f8f9fa' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight="medium">
                {selectedCategory}
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
            {filteredThreads.map((thread) => (
              <Paper 
                key={thread.id} 
                elevation={0}
                sx={{ 
                  mb: 1.5, 
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
            ))}
          </Box>
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
        {notifications.map(notification => (
          <MenuItem key={notification.id} sx={{ py: 1.5 }}>
            <ListItemIcon>
              <NotificationsIcon fontSize="small" sx={{ color: '#7b1fa2' }} />
            </ListItemIcon>
            <Box>
              <Typography variant="body2">
                {notification.text}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {notification.time}
              </Typography>
            </Box>
          </MenuItem>
        ))}
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
