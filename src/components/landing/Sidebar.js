import React from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Typography, 
  Divider,
  ListItemButton,
  Collapse,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { 
  Home as HomeIcon, 
  Settings as SettingsIcon, 
  Logout as LogoutIcon,
  Assignment as AssignmentIcon,
  Science as ScienceIcon,
  Code as CodeIcon,
  MenuBook as MenuBookIcon,
  ExpandLess,
  ExpandMore
} from '@mui/icons-material';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';
import Logo from '../Logo';
import { theme as appTheme } from '../../styles/commonStyles';

const drawerWidth = 240;

const courses = [
  { 
    id: 1, 
    name: 'Web Development Fundamentals', 
    code: 'CSE-301',
    icon: <CodeIcon fontSize="small" />,
    expanded: true,
    subsections: [
      { id: 'assignment1', name: 'Assignment 1', icon: <AssignmentIcon fontSize="small" /> },
      { id: 'lab1', name: 'Lab 1', icon: <MenuBookIcon fontSize="small" /> },
      { id: 'lab2', name: 'Lab 2', icon: <MenuBookIcon fontSize="small" /> },
      { id: 'lab3', name: 'Lab 3', icon: <MenuBookIcon fontSize="small" /> },
      { id: 'general', name: 'General', icon: <ScienceIcon fontSize="small" /> },
      { id: 'rant', name: 'Rant', icon: <ScienceIcon fontSize="small" /> },
    ]
  }
];

function Sidebar({ selectedSubsection, onSubsectionSelect }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.href = '/';
    } catch (err) {
      console.error("Error during logout:", err.message);
    }
  };

  // On mobile, don't render the sidebar
  if (isMobile) {
    return null;
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        display: { xs: 'none', md: 'block' }, // Hide on mobile, show on desktop
        [`& .MuiDrawer-paper`]: { 
          width: drawerWidth, 
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.08)',
          bgcolor: 'white'
        },
      }}
    >
      <Toolbar sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
        <Logo size="small" />
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
              
              <List component="div" disablePadding dense>
                {course.subsections.map((subsection) => (
                  <ListItemButton
                    key={subsection.id}
                    onClick={() => onSubsectionSelect(subsection.id)}
                    sx={{
                      borderRadius: 1,
                      mb: 0.5,
                      '&:hover': {
                        bgcolor: appTheme.colors.hover
                      }
                    }}
                  >
                    <ListItemIcon sx={{ color: appTheme.colors.primary }}>
                      {subsection.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={subsection.name}
                      sx={{ 
                        color: appTheme.colors.primary,
                        '& .MuiTypography-root': { fontWeight: 'medium' }
                      }}
                    />
                  </ListItemButton>
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
  );
}

export default Sidebar; 