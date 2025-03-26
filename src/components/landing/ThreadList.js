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
import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { mockThreads } from '../../data/mockData';
import { buttonStyles, paperStyles, getCategoryChipStyles, getAvatarColor } from '../../styles/commonStyles';
import { useCache } from '../../context/CacheContext';
import NewThreadDialog from './NewThreadDialog';

function ThreadList({ subsection, onShowInsights }) {
  const [uploading, setUploading] = useState(false);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newThreadDialogOpen, setNewThreadDialogOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { cacheThreadList, getCachedThreadList, invalidateThreadList } = useCache();

  const fetchThreads = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check cache first
      const cachedData = getCachedThreadList(subsection);
      if (cachedData) {
        setThreads(cachedData);
        setLoading(false);
        return;
      }

      let fetchedThreads = [];

      if (subsection === 'rant') {
        // Set up real-time listener for rants
        const rantsQuery = query(collection(db, 'rants'), orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(rantsQuery, (snapshot) => {
          const fetchedThreads = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date?.toDate().toLocaleString() || 'Just now'
          }));
          
          // Cache the fetched data
          cacheThreadList(subsection, fetchedThreads);
          setThreads(fetchedThreads);
          setLoading(false);
        }, (error) => {
          console.error('Error fetching rants:', error);
          setError('Failed to load rants. Please try again later.');
          setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
      } else if (subsection === 'lab3') {
        // Fetch lab3 threads from Firestore
        const threadsCollection = collection(db, "threads");
        const q = query(threadsCollection, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        fetchedThreads = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.date || data.createdAt?.toDate().toLocaleString() || 'Just now',
            createdAt: data.createdAt?.toDate().toLocaleDateString(),
            updatedAt: data.updatedAt?.toDate().toLocaleDateString()
          };
        });
        
        cacheThreadList(subsection, fetchedThreads);
        setThreads(fetchedThreads);
        setLoading(false);
      } else {
        // For other sections, use mock data
        fetchedThreads = mockThreads[subsection] || [];
        cacheThreadList(subsection, fetchedThreads);
        setThreads(fetchedThreads);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error fetching threads:', err);
      setError('Failed to load threads. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, [subsection, cacheThreadList, getCachedThreadList]);

  const handleThreadClick = (threadId) => {
    window.location.href = `/thread/${threadId}`;
  };

  const uploadMockTCPThreads = async () => {
    setUploading(true);
    try {
      const threadsCollection = collection(db, "threads");
      const tcpThreads = mockThreads.tcpThreads;

      // First, get all existing threads to check for duplicates
      const existingThreadsSnapshot = await getDocs(threadsCollection);
      const existingThreadTitles = existingThreadsSnapshot.docs.map(doc => doc.data().title);
      
      // Filter out any threads that already exist (by title)
      const newThreadsToAdd = tcpThreads.filter(thread => !existingThreadTitles.includes(thread.title));
      
      if (newThreadsToAdd.length === 0) {
        alert("No new threads to add. All demo threads already exist in the database.");
        setUploading(false);
        return;
      }

      // Add only new threads
      for (const thread of newThreadsToAdd) {
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
      
      alert(`${newThreadsToAdd.length} mock TCP threads uploaded successfully!`);
      fetchThreads();
    } catch (err) {
      console.error("Error uploading mock data:", err);
      alert(`Error uploading mock data: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleNewThread = () => {
    setNewThreadDialogOpen(true);
  };

  const handleThreadCreated = () => {
    invalidateThreadList(subsection);
    fetchThreads();
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
           subsection === 'rant' ? 'Rants' :
           'General Discussions'}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {subsection === 'lab3' && (
            <Button
              variant="outlined"
              startIcon={isMobile ? null : <LightbulbIcon />}
              onClick={onShowInsights}
              size={isMobile ? "small" : "medium"}
              sx={{ ...buttonStyles.outlined }}
            >
              {isMobile ? 'Insights' : 'What\'s Happening?'}
            </Button>
          )}
          {subsection !== 'rant' && (
            isMobile ? (
              <IconButton 
                color="primary" 
                aria-label="new thread"
                onClick={handleNewThread}
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
                onClick={handleNewThread}
                sx={{ ...buttonStyles.contained }}
              >
                New Thread
              </Button>
            )
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

      <NewThreadDialog
        open={newThreadDialogOpen}
        onClose={() => setNewThreadDialogOpen(false)}
        subsection={subsection}
        onThreadCreated={handleThreadCreated}
      />
    </>
  );
}

export default ThreadList; 