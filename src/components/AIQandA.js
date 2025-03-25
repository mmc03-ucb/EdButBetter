// AIQandA.js - Component for AI-powered question answering using thread data
// This component provides a natural language interface for querying thread data

import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  IconButton,
  Tooltip,
  Container,
  AppBar,
  Toolbar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import InfoIcon from '@mui/icons-material/Info';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import Logo from './Logo';

function AIQandA() {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      // Fetch all threads from Firestore
      const threadsCollection = collection(db, "threads");
      const querySnapshot = await getDocs(threadsCollection);
      
      const threads = [];
      querySnapshot.forEach((doc) => {
        threads.push({ 
          id: doc.id, 
          ...doc.data(),
          // Format answers for better context
          answers: doc.data().answers?.map(answer => ({
            author: answer.author,
            content: answer.content,
            isTutor: answer.isTutor,
            isAnswer: answer.isAnswer
          })) || []
        });
      });

      // Call the API with the query and thread data
      const response = await fetch('http://localhost:3001/api/ai-qa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: query.trim(),
          threads 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI answer');
      }

      const data = await response.json();
      setAnswer(data.answer);
    } catch (err) {
      console.error('Error getting AI answer:', err);
      setError('Failed to get an answer. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkClick = (event) => {
    const href = event.target.getAttribute('href');
    if (href && href.startsWith('thread/')) {
      event.preventDefault();
      const threadId = href.split('thread/')[1];
      navigate(`/thread/${threadId}`);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f5f0fa', minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <Toolbar>
          <IconButton 
            edge="start" 
            color="inherit" 
            aria-label="back to landing"
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
            Profile
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <SmartToyIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
            <Typography variant="h5" fontWeight="medium">
              AI Forum Assistant
            </Typography>
            <Tooltip title="Ask me any question about the forum threads. I'll find the relevant information for you.">
              <IconButton size="small" sx={{ ml: 1 }}>
                <InfoIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Typography variant="body2" color="text.secondary" mb={3}>
            Ask a question and I'll find answers from the discussion threads
          </Typography>

          <form onSubmit={handleSubmit}>
            <Box display="flex" gap={1}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Ask about course topics, assignments, or discussions..."
                value={query}
                onChange={handleQueryChange}
                size="medium"
                sx={{ mb: 2 }}
              />
              <Button 
                type="submit" 
                variant="contained" 
                disabled={loading || !query.trim()}
                endIcon={<SendIcon />}
                sx={{
                  bgcolor: '#7b1fa2',
                  '&:hover': {
                    bgcolor: '#6a1b9a'
                  }
                }}
              >
                Ask
              </Button>
            </Box>
          </form>

          {loading && (
            <Box display="flex" justifyContent="center" my={3}>
              <CircularProgress size={30} />
            </Box>
          )}

          {error && (
            <Typography color="error" mt={2}>
              {error}
            </Typography>
          )}

          {answer && !loading && (
            <Box mt={3} p={2} bgcolor="#f8f9fa" borderRadius={1}>
              <Box sx={{ 
                '& h1': { 
                  fontSize: '1.5rem', 
                  fontWeight: 600, 
                  mb: 2,
                  color: '#7b1fa2'
                },
                '& h2': { 
                  fontSize: '1.25rem', 
                  fontWeight: 600, 
                  mb: 2,
                  color: '#7b1fa2'
                },
                '& ul, & ol': { 
                  pl: 3, 
                  mb: 2 
                },
                '& li': { 
                  mb: 1 
                },
                '& p': { 
                  mb: 2 
                },
                '& code': {
                  bgcolor: '#f5f5f5',
                  p: 0.5,
                  borderRadius: 1,
                  fontFamily: 'monospace'
                },
                '& pre': {
                  bgcolor: '#f5f5f5',
                  p: 2,
                  borderRadius: 1,
                  overflow: 'auto',
                  mb: 2
                },
                '& a': {
                  color: '#7b1fa2',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }
              }}>
                <ReactMarkdown 
                  components={{
                    a: ({ node, ...props }) => (
                      <a {...props} onClick={handleLinkClick} />
                    )
                  }}
                >
                  {answer}
                </ReactMarkdown>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

export default AIQandA; 