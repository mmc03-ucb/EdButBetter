// Landing.js - Main forum interface showing course content and discussions
// This component displays the main educational forum interface with navigation, thread listings
// and allows users to select different subsections of the course

import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, useMediaQuery, useTheme } from '@mui/material';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Sidebar from './landing/Sidebar';
import AppBar from './landing/AppBar';
import ThreadList from './landing/ThreadList';
import { mockThreads } from '../data/mockData';
import Insights from './Insights';

function Landing() {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedSubsection, setSelectedSubsection] = useState('assignment1');
  const [showInsights, setShowInsights] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
      <Sidebar 
        selectedSubsection={selectedSubsection}
        onSubsectionSelect={setSelectedSubsection}
      />
      
      <Box sx={{ flexGrow: 1, bgcolor: '#f8f9fa', display: 'flex', flexDirection: 'column' }}>
        <AppBar 
          userName={userName} 
          selectedSubsection={selectedSubsection}
          onSubsectionSelect={setSelectedSubsection}
        />
        
        <Box sx={{ 
          flexGrow: 1, 
          overflow: 'auto', 
          p: isMobile ? 1.5 : 3, 
          bgcolor: '#f8f9fa' 
        }}>
          {showInsights ? (
            <Insights 
              subsection={selectedSubsection} 
              onBack={() => setShowInsights(false)} 
            />
          ) : (
            <ThreadList 
              subsection={selectedSubsection}
              onShowInsights={() => setShowInsights(true)}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Landing;