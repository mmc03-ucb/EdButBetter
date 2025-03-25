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
  InputBase
} from '@mui/material';
import {
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Delete as DeleteIcon,
  SmartToy as SmartToyIcon
} from '@mui/icons-material';
import { auth, db } from '../../firebase/config';
import { signOut, deleteUser } from 'firebase/auth';
import { deleteDoc, doc } from 'firebase/firestore';
import { buttonStyles } from '../../styles/commonStyles';

function AppBar({ userName }) {
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);
  const [notificationsMenuAnchor, setNotificationsMenuAnchor] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
      <Toolbar>
        <Typography variant="h6" component="div" fontWeight="bold" sx={{ color: '#7b1fa2' }}>
          CSE-301: Web Development Bootcamp
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        
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
      </Toolbar>

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