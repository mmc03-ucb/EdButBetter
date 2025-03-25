import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Avatar,
  Chip,
  CircularProgress,
  useMediaQuery,
  useTheme,
  IconButton
} from '@mui/material';
import {
  Forum as ForumIcon,
  Lightbulb as LightbulbIcon,
  Upload as UploadIcon,
  CheckCircle as CheckCircleIcon,
  QuestionAnswer as QuestionAnswerIcon,
  TrendingUp as TrendingUpIcon,
  ThumbUp as ThumbUpIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { mockThreads } from '../../data/mockData';
import { buttonStyles, paperStyles, getCategoryChipStyles, getAvatarColor } from '../../styles/commonStyles';
import { useCache } from '../../context/CacheContext';

function ThreadList({ subsection, onShowInsights }) {
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [threads, setThreads] = useState([]);
  const { cacheThreadList, getCachedThreadList, invalidateThreadList } = useCache();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (subsection === 'lab3') {
      fetchThreads();
    } else {
      setThreads(mockThreads[subsection] || []);
    }
  }, [subsection]);

  const fetchThreads = async () => {
    setLoading(true);
    try {
      const cachedThreadList = getCachedThreadList('lab3');
      
      if (cachedThreadList) {
        setThreads(cachedThreadList);
        setLoading(false);
        return;
      }
      
      const threadsCollection = collection(db, "threads");
      const q = query(threadsCollection, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      
      const fetchedThreads = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toLocaleDateString(),
        updatedAt: doc.data().updatedAt?.toDate().toLocaleDateString()
      }));
      
      cacheThreadList('lab3', fetchedThreads);
      
      setThreads(fetchedThreads);
    } catch (err) {
      console.error("Error fetching threads:", err);
      alert(`Error fetching threads: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleThreadClick = (threadId) => {
    window.location.href = `/thread/${threadId}`;
  };

  const uploadMockTCPThreads = async () => {
    setUploading(true);
    try {
      const threadsCollection = collection(db, "threads");
      const tcpThreads = mockThreads.tcpThreads;

      for (const thread of tcpThreads) {
        await addDoc(threadsCollection, {
          ...thread,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          answers: thread.answers.map(answer => ({
            ...answer,
            timestamp: new Date().toISOString(),
          })),
        });
      }

      invalidateThreadList('lab3');
      
      alert("Mock TCP threads uploaded successfully!");
      fetchThreads();
    } catch (err) {
      console.error("Error uploading mock data:", err);
      alert(`Error uploading mock data: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'flex-start' : 'center', 
        mb: 3 
      }}>
        <Typography variant="h6" fontWeight="medium" sx={{ mb: isMobile ? 2 : 0 }}>
          {subsection === 'assignment1' ? 'Assignment 1' :
           subsection === 'lab1' ? 'Lab 1' :
           subsection === 'lab2' ? 'Lab 2' :
           subsection === 'lab3' ? 'Lab 3' :
           'General Discussions'}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {subsection === 'lab3' && (
            <>
              <Button 
                variant="outlined" 
                startIcon={isMobile ? null : <UploadIcon />}
                onClick={uploadMockTCPThreads}
                disabled={uploading}
                size={isMobile ? "small" : "medium"}
                sx={{ ...buttonStyles.outlined }}
              >
                {uploading ? <CircularProgress size={24} /> : (isMobile ? 'Demo' : 'Demo Threads')}
              </Button>
              <Button
                variant="outlined"
                startIcon={isMobile ? null : <LightbulbIcon />}
                onClick={onShowInsights}
                size={isMobile ? "small" : "medium"}
                sx={{ ...buttonStyles.outlined }}
              >
                {isMobile ? 'Insights' : 'What\'s Happening?'}
              </Button>
            </>
          )}
          {isMobile ? (
            <IconButton 
              color="primary" 
              aria-label="new thread"
              sx={{ 
                bgcolor: '#7b1fa2', 
                color: 'white',
                '&:hover': { bgcolor: '#6a1b9a' }
              }}
            >
              <AddIcon />
            </IconButton>
          ) : (
            <Button 
              variant="contained" 
              startIcon={<ForumIcon />}
              sx={{ ...buttonStyles.contained }}
            >
              New Thread
            </Button>
          )}
        </Box>
      </Box>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : threads.length > 0 ? (
        threads.map((thread) => (
          <Paper 
            key={thread.id} 
            elevation={0}
            onClick={() => handleThreadClick(thread.id)}
            sx={paperStyles.thread}
          >
            <Box sx={{ display: 'flex', p: isMobile ? 1.5 : 2 }}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: getAvatarColor(thread.id) }}>
                {thread.authorAvatar}
              </Avatar>
              
              <Box sx={{ ml: 2, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Typography 
                    variant={isMobile ? "body1" : "subtitle1"} 
                    fontWeight="medium"
                    sx={{ 
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
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
                
                {!isMobile && (
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 1, 
                      opacity: 0.85,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {thread.preview}
                  </Typography>
                )}
                
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 0.5
                }}>
                  <Chip 
                    label={thread.category} 
                    size="small" 
                    sx={getCategoryChipStyles(thread.category)}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mr: isMobile ? 1 : 2 }}>
                    {isMobile ? `${thread.author.split(' ')[0]}` : `by ${thread.author}`} · {thread.date}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: isMobile ? 1 : 1.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <QuestionAnswerIcon sx={{ fontSize: 14, mr: 0.5 }} /> {thread.replies}
                    </Typography>
                    {!isMobile && (
                      <>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                          <TrendingUpIcon sx={{ fontSize: 14, mr: 0.5 }} /> {thread.views}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                          <ThumbUpIcon sx={{ fontSize: 14, mr: 0.5 }} /> {thread.likes}
                        </Typography>
                      </>
                    )}
                  </Box>
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
    </>
  );
}

export default ThreadList; 