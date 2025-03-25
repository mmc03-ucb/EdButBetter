import React, { useState } from 'react';
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Box,
  Paper,
  IconButton,
  Avatar,
  Tooltip,
  Badge,
  Menu,
  MenuItem,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItemIcon,
  ListItemText,
  InputBase,
  useMediaQuery,
  useTheme,
  SwipeableDrawer,
  List,
  ListItemButton,
  Collapse
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Delete as DeleteIcon,
  SmartToy as SmartToyIcon,
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
  Assignment as AssignmentIcon,
  Science as ScienceIcon,
  Code as CodeIcon,
  MenuBook as MenuBookIcon
} from '@mui/icons-material';
import { auth, db } from '../../firebase/config';
import { signOut, deleteUser } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { buttonStyles } from '../../styles/commonStyles';
import Logo from '../Logo';
import RantButton from './RantButton';

// Course subsections data
const courseSubsections = [
  { id: 'assignment1', name: 'Assignment 1', icon: <AssignmentIcon fontSize="small" /> },
  { id: 'lab1', name: 'Lab 1', icon: <MenuBookIcon fontSize="small" /> },
  { id: 'lab2', name: 'Lab 2', icon: <MenuBookIcon fontSize="small" /> },
  { id: 'lab3', name: 'Lab 3', icon: <MenuBookIcon fontSize="small" /> },
  { id: 'general', name: 'General', icon: <ScienceIcon fontSize="small" /> },
];

function AppBar({ userName, selectedSubsection, onSubsectionSelect }) {
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [courseExpanded, setCourseExpanded] = useState(true);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  const toggleMobileMenu = (open) => () => {
    setMobileMenuOpen(open);
  };

  const toggleCourseExpanded = () => {
    setCourseExpanded(!courseExpanded);
  };

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

  const handleNavigate = (path) => {
    window.location.href = path;
    setMobileMenuOpen(false);
  };

  const handleSubsectionSelect = (subsectionId) => {
    if (onSubsectionSelect) {
      onSubsectionSelect(subsectionId);
      setMobileMenuOpen(false);
    }
  };

  return (
    <MuiAppBar 
      position="static" 
      color="default" 
      elevation={0}
      sx={{ 
        bgcolor: 'white', 
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)'
      }}
    >
      <Toolbar sx={{ flexWrap: 'wrap' }}>
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleMobileMenu(true)}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {isMobile ? (
          <Logo size="small" showText={false} />
        ) : (
          <Typography variant="h6" component="div" fontWeight="bold" sx={{ color: '#7b1fa2', flexGrow: isMobile ? 1 : 0 }}>
            CSE-301: Web Development Fundamentals
          </Typography>
        )}
        
        <Box sx={{ flexGrow: 1 }} />
        
        {!isMobile && (
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
              style={{ 
                border: 'none',
                background: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '0.875rem'
              }}
            />
          </Paper>
        )}
        
        {!isMobile && (
          <Tooltip title="AI Assistant">
            <Button
              startIcon={<SmartToyIcon />}
              variant="outlined"
              size="small"
              onClick={() => { window.location.href = '/ai-qa'; }}
              sx={{
                borderRadius: 2,
                mr: 1,
                borderColor: '#7b1fa2',
                color: '#7b1fa2',
                '&:hover': {
                  borderColor: '#6a1b9a',
                  bgcolor: 'rgba(123, 31, 162, 0.04)'
                }
              }}
            >
              AI Assistant
            </Button>
          </Tooltip>
        )}
        
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
        <RantButton />
      </Toolbar>

      {/* Mobile Navigation Drawer */}
      <SwipeableDrawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu(false)}
        onOpen={toggleMobileMenu(true)}
      >
        <Box sx={{ width: 250, pt: 2, pb: 3 }} role="presentation">
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
            <Logo size="medium" />
          </Box>
          <Divider sx={{ mb: 2 }} />
          <List>
            <MenuItem onClick={() => handleNavigate('/landing')}>
              <ListItemText primary="Home" />
            </MenuItem>

            {/* Course and subsections in mobile menu */}
            <ListItemButton onClick={toggleCourseExpanded} sx={{ pl: 2 }}>
              <ListItemIcon>
                <CodeIcon fontSize="small" color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="CSE-301" 
                secondary="Web Development Fundamentals"
                primaryTypographyProps={{ fontWeight: 'medium' }}
                secondaryTypographyProps={{ fontSize: '0.8rem' }}
              />
              {courseExpanded ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            
            <Collapse in={courseExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {courseSubsections.map((subsection) => (
                  <ListItemButton 
                    key={subsection.id}
                    onClick={() => handleSubsectionSelect(subsection.id)} 
                    sx={{ pl: 4 }}
                    selected={selectedSubsection === subsection.id}
                  >
                    <ListItemIcon sx={{ color: '#7b1fa2' }}>
                      {subsection.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={subsection.name} 
                      sx={{ color: '#7b1fa2' }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>

            <MenuItem onClick={() => handleNavigate('/ai-qa')}>
              <ListItemIcon>
                <SmartToyIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="AI Assistant" />
            </MenuItem>
            <MenuItem onClick={() => handleNavigate('/profile')}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </MenuItem>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </MenuItem>
          </List>
        </Box>
      </SwipeableDrawer>

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
        <MenuItem onClick={() => setDeleteDialogOpen(true)} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete Account</ListItemText>
        </MenuItem>
      </Menu>
      
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
        <Divider />
        <Box sx={{ p: 1, textAlign: 'center' }}>
          <Button size="small" sx={{ color: '#7b1fa2' }}>
            View All
          </Button>
        </Box>
      </Menu>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography color="error">
            Are you sure you want to delete your profile and all associated data? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">Cancel</Button>
          <Button 
            onClick={handleDeleteUser}
            startIcon={<DeleteIcon />}
            color="error"
            sx={{ ...buttonStyles.outlined, color: 'error.main', borderColor: 'error.main' }}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </MuiAppBar>
  );
}

export default AppBar; 