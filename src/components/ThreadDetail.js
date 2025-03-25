// ThreadDetail.js - Displays a specific forum thread with all its answers
// This component handles fetching and displaying a thread's details, including all answers
// It also allows users to post new answers and vote on existing ones

import React, { useState, useEffect } from 'react';
// useParams - Allows accessing URL parameters from React Router
// useNavigate - Hook for programmatic navigation between routes
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, 
  Box, 
  Button, 
  Paper, 
  Divider, 
  Avatar, 
  TextField,
  CircularProgress,
  Container,
  AppBar,
  Toolbar,
  IconButton,
  Chip,
  Card,
  CardContent,
} from '@mui/material';
// Firebase imports for authentication and data fetching
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
// Material UI icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import SendIcon from '@mui/icons-material/Send';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Logo from './Logo';
// Import mockThreads for non-lab3 content
import { mockThreads } from '../data/mockData';

// Styles
const styles = {
  appBar: { bgcolor: 'white', color: 'text.primary', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  threadCard: {
    mb: 4,
    border: '1px solid rgba(0, 0, 0, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  threadHeader: {
    bgcolor: '#f8f8f8',
    px: 3,
    py: 2,
    display: 'flex',
    alignItems: 'center'
  },
  answerCard: {
    mb: 3,
    borderRadius: 2,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
  },
  acceptedAnswer: {
    border: '2px solid #4caf50',
    boxShadow: '0 2px 12px rgba(76, 175, 80, 0.15)'
  },
  tutorChip: {
    ml: 1,
    bgcolor: '#f0b952',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '0.7rem',
    height: 20
  },
  submitButton: {
    bgcolor: '#7b1fa2',
    borderRadius: 6,
    px: 3,
    '&:hover': {
      bgcolor: '#6a1b9a'
    }
  }
};

function ThreadDetail() {
  // Extract the threadId from URL parameters (/thread/:threadId)
  const { threadId } = useParams();
  // Initialize navigation for redirecting users
  const navigate = useNavigate();
  
  // State management
  const [userName, setUserName] = useState(''); // Current user's name
  const [loading, setLoading] = useState(true); // Loading state for initial data fetch
  const [thread, setThread] = useState(null); // Thread data object
  const [answers, setAnswers] = useState([]); // Array of answer objects
  const [newAnswer, setNewAnswer] = useState(''); // Content of the user's new answer
  const [isLabThree, setIsLabThree] = useState(false); // Flag to determine if thread is from lab3

  // useEffect - Run on component mount and when threadId changes
  useEffect(() => {
    // Function to fetch the current user's name from Firestore
    const fetchUserName = async (user) => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().name);
        }
      } catch (err) {
        console.error("Error fetching user data:", err.message);
      }
    };

    // Function to fetch thread details from Firestore or mockData
    const fetchThreadDetails = async () => {
      try {
        // First try to fetch from Firestore (for lab3)
        const threadDoc = await getDoc(doc(db, "threads", threadId));
        
        if (threadDoc.exists()) {
          // This is a lab3 thread from the database
          const threadData = threadDoc.data();
          setThread({
            id: threadDoc.id,
            ...threadData
          });
          setAnswers(threadData.answers || []);
          setIsLabThree(true);
        } else {
          // Not a lab3 thread, look for it in mockData
          // Find the thread in all mockData categories
          let foundThread = null;
          let threadCategory = null;
          
          // Search through all categories in mockData
          for (const category in mockThreads) {
            if (category === 'tcpThreads') continue; // Skip tcpThreads as they're for lab3
            
            const found = mockThreads[category].find(t => t.id.toString() === threadId);
            if (found) {
              foundThread = found;
              threadCategory = category;
              break;
            }
          }
          
          if (foundThread) {
            // Create default answers if none exist
            const mockAnswers = foundThread.answers || [
              {
                id: 1,
                author: 'Prof. Williams',
                authorAvatar: 'PW',
                date: '1 day ago',
                content: 'This is a sample answer to help clarify the question. Please refer to the course materials for more details.',
                isAnswer: true,
                isTutor: true,
                votes: 15
              }
            ];
            
            setThread(foundThread);
            setAnswers(mockAnswers);
          } else {
            console.error('Thread not found in mock data');
          }
        }
      } catch (err) {
        console.error("Error fetching thread details:", err);
      } finally {
        setLoading(false);
      }
    };

    // Firebase auth state listener
    // Redirects to login page if not authenticated
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchUserName(user);
      } else {
        // Redirect to login if not logged in
        navigate('/');
      }
    });

    // Load thread data
    fetchThreadDetails();

    // Cleanup the auth listener on component unmount
    return () => unsubscribe();
  }, [threadId, navigate]); // Removed fetchThreadDetails from dependencies since it's now inside useEffect

  // Handler for submitting a new answer
  const handleSubmitAnswer = async () => {
    if (!newAnswer.trim()) return;
    
    try {
      const newAnswerObj = {
        id: answers.length + 1,
        author: userName,
        authorAvatar: userName.charAt(0).toUpperCase(),
        date: 'Just now',
        content: newAnswer,
        isAnswer: false,
        votes: 0
      };
      
      if (isLabThree) {
        // Update Firestore with new answer (only for lab3 threads)
        await updateDoc(doc(db, "threads", threadId), {
          answers: [...answers, newAnswerObj]
        });
      }
      
      setAnswers([...answers, newAnswerObj]);
      setNewAnswer('');
    } catch (err) {
      console.error("Error submitting answer:", err);
    }
  };

  // Show loading spinner while data is being fetched
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress sx={{ color: '#7b1fa2' }} />
        <Typography variant="h6" marginLeft={2}>Loading...</Typography>
      </Box>
    );
  }

  // Main component render
  return (
    <Box sx={{ bgcolor: '#f5f0fa', minHeight: '100vh' }}>
      {/* Navigation Bar - Contains back button, logo, and profile link */}
      <AppBar position="static" sx={styles.appBar}>
        <Toolbar>
          <IconButton 
            edge="start" 
            color="inherit" 
            aria-label="back to threads"
            onClick={() => navigate('/landing')}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Logo size="small" />
          <Box sx={{ flexGrow: 1 }} />
          <Button 
            variant="text"
            startIcon={<AccountCircleIcon />}
            onClick={() => navigate('/profile')}
            sx={{ color: '#7b1fa2', fontWeight: 'medium' }}
          >
            {userName}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Thread Question Card - Shows the original question with details */}
        <Paper 
          elevation={0}
          sx={styles.threadCard}
        >
          {/* Thread header with author info and category */}
          <Box sx={styles.threadHeader}>
            <Avatar sx={{ width: 48, height: 48, bgcolor: '#7b1fa2', mr: 2 }}>
              {thread?.authorAvatar}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="medium">
                {thread?.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Asked by {thread?.author} • {thread?.date}
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Chip 
              label={thread?.category} 
              size="medium" 
              sx={{ 
                bgcolor: thread?.category === 'Questions' ? 'rgba(25, 118, 210, 0.1)' : 
                  thread?.category === 'Announcements' ? 'rgba(240, 185, 82, 0.1)' :
                  'rgba(0, 0, 0, 0.06)',
                color: thread?.category === 'Questions' ? 'primary.main' : 
                  thread?.category === 'Announcements' ? '#d68f00' : 
                  'text.secondary',
                fontWeight: 'medium',
                px: 1
              }} 
            />
          </Box>
          <Divider />
          {/* Thread content/body */}
          <Box sx={{ p: 3 }}>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
              {thread?.preview}
            </Typography>
          </Box>
          <Divider />
          {/* Thread interactions (upvote, bookmark, view count) */}
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
            <Button 
              startIcon={<ThumbUpIcon />} 
              size="small"
              sx={{ mr: 1, color: 'text.secondary' }}
            >
              Upvote ({thread?.likes || 0})
            </Button>
            <Button 
              startIcon={<BookmarkIcon />} 
              size="small"
              sx={{ mr: 1, color: 'text.secondary' }}
            >
              Bookmark
            </Button>
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant="body2" color="text.secondary">
              {thread?.views || 0} views • {answers.length} answers
            </Typography>
          </Box>
        </Paper>

        {/* Answer count and sort options */}
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Typography variant="h6" fontWeight="medium">
            {answers.length} Answers
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button 
            variant="text"
            sx={{ color: '#7b1fa2' }}
          >
            Sort by Votes
          </Button>
        </Box>

        {/* Answer Cards - Loop through and display all answers */}
        {answers.map((answer) => (
          <Card 
            key={answer.id} 
            elevation={0}
            sx={{ ...styles.answerCard, ...(answer.isAnswer ? styles.acceptedAnswer : {}) }}
          >
            <CardContent>
              {/* Answer author information */}
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: answer.author === 'Prof. Williams' ? '#f0b952' : '#7b1fa2', mr: 2 }}>
                  {answer.authorAvatar}
                </Avatar>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {answer.author}
                    </Typography>
                    {/* Show TUTOR badge for tutors */}
                    {answer.isTutor && (
                      <Chip 
                        label="TUTOR" 
                        size="small" 
                        sx={styles.tutorChip} 
                      />
                    )}
                    {/* Show "Accepted Answer" badge if isAnswer is true */}
                    {answer.isAnswer && (
                      <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                        <CheckCircleIcon color="success" fontSize="small" />
                        <Typography variant="body2" color="success.main" sx={{ ml: 0.5, fontWeight: 'medium' }}>
                          Accepted Answer
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Answered {answer.date}
                  </Typography>
                </Box>
              </Box>
              
              {/* Answer content - whitespace preserved for code formatting */}
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
                {answer.content}
              </Typography>
              
              {/* Voting buttons for the answer */}
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Button 
                  startIcon={<ThumbUpIcon />} 
                  size="small"
                  sx={{ mr: 1, color: 'text.secondary' }}
                >
                  {answer.votes}
                </Button>
                <Button 
                  startIcon={<ThumbDownIcon />} 
                  size="small"
                  sx={{ color: 'text.secondary' }}
                >
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}

        {/* Add your answer section - text area and submit button */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" fontWeight="medium" gutterBottom>
            Your Answer
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={6}
            placeholder="Write your answer here... You can use markdown for code blocks."
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'white'
              }
            }}
          />
          <Button 
            variant="contained" 
            endIcon={<SendIcon />}
            onClick={handleSubmitAnswer}
            sx={styles.submitButton}
          >
            Post Your Answer
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default ThreadDetail; 