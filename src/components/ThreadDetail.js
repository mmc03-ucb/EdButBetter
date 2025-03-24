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
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
// Material UI icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import SendIcon from '@mui/icons-material/Send';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

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

  // Logo component - Reusable branded header element
  const Logo = () => (
    <Box display="flex" alignItems="center">
      <Box
        component="div"
        sx={{
          bgcolor: '#7b1fa2', // Purple background color
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

    // Load thread data (currently using mock data)
    fetchThreadDetails();

    // Cleanup the auth listener on component unmount
    return () => unsubscribe();
  }, [threadId, navigate]); // Re-run if threadId or navigate changes

  // Function to fetch thread details from Firestore
  const fetchThreadDetails = async () => {
    try {
      // First, try to fetch from Firestore
      const threadDoc = await getDoc(doc(db, "threads", threadId));
      
      if (threadDoc.exists()) {
        const threadData = threadDoc.data();
        setThread({
          id: threadDoc.id,
          ...threadData
        });
        setAnswers(threadData.answers || []);
        setLoading(false);
        return;
      }

      // If not found in Firestore, use mock data
      // Mock thread data for Lab 3 React Router thread (ID: 9)
      const mockThread = {
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
        content: `I'm having a lot of trouble with the Lab 3 exercise on React Router. The nested routes part is particularly confusing.

Here's what I'm trying to do:
1. Set up a main route for my app
2. Create nested routes for different sections
3. Implement URL parameters for dynamic content

But I keep getting errors like "Cannot read property 'path' of undefined" and my routes aren't rendering correctly. Has anyone figured out the correct way to set up nested routes with React Router v6?

I've looked at the documentation but it seems different from what was covered in the lecture. Any help would be appreciated!`,
      };

      // Mock answers specifically about React Router
      const mockAnswers = [
        {
          id: 1,
          author: 'Prof. Williams',
          authorAvatar: 'PW',
          date: '2 days ago',
          content: `Great question, Dana. React Router v6 has some significant changes from v5 that might be causing confusion.

For nested routes in React Router v6, you need to:

1. Use the Outlet component from react-router-dom
2. Define child routes inside the parent route

Here's a basic example:

\`\`\`jsx
<Routes>
  <Route path="/" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="about" element={<About />} />
    <Route path="users/:userId" element={<UserProfile />} />
  </Route>
</Routes>
\`\`\`

In your Layout component, use \`<Outlet />\` where you want the child routes to render.

The most common mistake is forgetting the Outlet component. I'll post a complete example in the lab resources section later today.`,
          isAnswer: true,
          votes: 24
        },
        {
          id: 2,
          author: 'Gabrielle Steiner',
          authorAvatar: 'G',
          date: '2 days ago',
          content: `I had the same issue! The key things that helped me:

1. Make sure you're using the correct imports:
\`\`\`jsx
import { BrowserRouter, Routes, Route, Outlet, Link, useParams } from 'react-router-dom';
\`\`\`

2. For nested routes, your parent component needs to render an Outlet:
\`\`\`jsx
function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <nav>
        <Link to="stats">Stats</Link>
        <Link to="settings">Settings</Link>
      </nav>
      <Outlet /> // This is where your nested routes appear
    </div>
  );
}
\`\`\`

3. URL params are accessed with the useParams hook:
\`\`\`jsx
function UserProfile() {
  const { userId } = useParams();
  return <h2>User: {userId}</h2>;
}
\`\`\`

Hope this helps! Happy to share my working code if you're still stuck.`,
          isAnswer: false,
          votes: 18
        },
        {
          id: 3,
          author: 'Michael K.',
          authorAvatar: 'M',
          date: '2 days ago',
          content: `Another thing to check is your Route paths. In React Router v6, you don't need to repeat the parent path in the child paths.

Wrong:
\`\`\`jsx
<Route path="/dashboard" element={<Dashboard />}>
  <Route path="/dashboard/stats" element={<Stats />} />
</Route>
\`\`\`

Correct:
\`\`\`jsx
<Route path="/dashboard" element={<Dashboard />}>
  <Route path="stats" element={<Stats />} />
</Route>
\`\`\`

Also, for index routes (the default child route), use the index prop:
\`\`\`jsx
<Route path="/dashboard" element={<Dashboard />}>
  <Route index element={<Overview />} />
  <Route path="stats" element={<Stats />} />
</Route>
\`\`\`

This was really tricky for me too!`,
          isAnswer: false,
          votes: 15
        }
      ];

      setThread(mockThread);
      setAnswers(mockAnswers);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching thread details:", err);
      setLoading(false);
    }
  };

  // Handler for submitting a new answer
  const handleSubmitAnswer = () => {
    if (!newAnswer.trim()) return; // Don't submit empty answers
    
    // In a real app, you would save this answer to the database
    // Create a new answer object with the current user's data
    const newAnswerObj = {
      id: answers.length + 1,
      author: userName,
      authorAvatar: userName.charAt(0).toUpperCase(),
      date: 'Just now',
      content: newAnswer,
      isAnswer: false,
      votes: 0
    };
    
    // Add the new answer to the list and clear the input
    setAnswers([...answers, newAnswerObj]);
    setNewAnswer('');
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
      <AppBar position="static" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
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
          <Logo />
          <Box sx={{ flexGrow: 1 }} />
          <Button 
            variant="text"
            startIcon={<AccountCircleIcon />}
            onClick={() => navigate('/profile')}
            sx={{ 
              color: '#7b1fa2',
              fontWeight: 'medium'
            }}
          >
            {userName}
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Thread Question Card - Shows the original question with details */}
        <Paper 
          elevation={0}
          sx={{ 
            mb: 4, 
            border: '1px solid rgba(0, 0, 0, 0.08)',
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
          }}
        >
          {/* Thread header with author info and category */}
          <Box sx={{ bgcolor: '#f8f8f8', px: 3, py: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 48, height: 48, bgcolor: '#7b1fa2', mr: 2 }}>
              {thread.authorAvatar}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="medium">
                {thread.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Asked by {thread.author} • {thread.date}
              </Typography>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Chip 
              label={thread.category} 
              size="medium" 
              sx={{ 
                bgcolor: thread.category === 'Questions' ? 'rgba(25, 118, 210, 0.1)' : 
                  thread.category === 'Announcements' ? 'rgba(240, 185, 82, 0.1)' :
                  'rgba(0, 0, 0, 0.06)',
                color: thread.category === 'Questions' ? 'primary.main' : 
                  thread.category === 'Announcements' ? '#d68f00' : 
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
              {thread.preview || thread.content}
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
              Upvote ({thread.likes})
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
              {thread.views} views • {thread.replies} answers
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
            sx={{ 
              mb: 3, 
              // Special styling for accepted answers (green border)
              border: answer.isAnswer ? '2px solid #4caf50' : '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: 2,
              boxShadow: answer.isAnswer ? '0 2px 12px rgba(76, 175, 80, 0.15)' : '0 2px 8px rgba(0,0,0,0.05)'
            }}
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
                        sx={{ 
                          ml: 1,
                          bgcolor: '#f0b952',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '0.7rem',
                          height: 20
                        }} 
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
            sx={{ 
              bgcolor: '#7b1fa2',
              borderRadius: 6,
              px: 3,
              '&:hover': {
                bgcolor: '#6a1b9a'
              }
            }}
          >
            Post Your Answer
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default ThreadDetail; 