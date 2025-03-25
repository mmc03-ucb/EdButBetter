// AIQandA.js - Component for AI-powered question answering using thread data
// This component provides a chat interface for querying thread data with conversation history

import React, { useState, useRef, useEffect } from 'react';
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
  Toolbar,
  Avatar,
  Divider
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import InfoIcon from '@mui/icons-material/Info';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import Logo from './Logo';

function AIQandA() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [threads, setThreads] = useState([]);
  const [threadsLoaded, setThreadsLoaded] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I can help answer your questions about the course based on the forum threads. What would you like to know?'
    }
  ]);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // Fetch threads on component mount
  useEffect(() => {
    fetchThreads();
  }, []);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const threadsCollection = collection(db, "threads");
      const querySnapshot = await getDocs(threadsCollection);
      
      const threadData = [];
      querySnapshot.forEach((doc) => {
        threadData.push({ 
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
      
      setThreads(threadData);
      setThreadsLoaded(true);
    } catch (err) {
      console.error('Error fetching threads:', err);
      setError('Failed to load threads. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Chat history cleared. How can I help you today?'
      }
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || !threadsLoaded) return;

    // Add user message
    const userMessage = {
      role: 'user',
      content: query.trim()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setQuery('');
    setLoading(true);
    setError(null);
    
    try {
      // Get conversation history (last 6 messages or less)
      const recentMessages = [...messages.slice(-5), userMessage];
      const conversationHistory = recentMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n\n');

      // Call the API with the query and thread data
      const response = await fetch('http://localhost:3001/api/ai-qa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          query: query.trim(),
          threads,
          conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI answer');
      }

      const data = await response.json();
      
      // Add assistant response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer
      }]);
    } catch (err) {
      console.error('Error getting AI answer:', err);
      setError('Failed to get an answer. Please try again later.');
      
      // Add error message
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.'
      }]);
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
    <Box sx={{ bgcolor: '#f5f0fa', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
          <Tooltip title="Clear conversation">
            <IconButton 
              color="inherit" 
              onClick={handleClearChat}
              sx={{ mr: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
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

      <Container maxWidth="lg" sx={{ py: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Paper sx={{ 
          p: 0, 
          mb: 0, 
          borderRadius: 2, 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          {/* Chat header */}
          <Box sx={{ 
            bgcolor: '#f7f7f9', 
            p: 2, 
            borderBottom: '1px solid rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Avatar 
              sx={{ 
                bgcolor: '#5FE3D3',
                mr: 2 
              }}
            >
              <SmartToyIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="medium">
                AI Forum Assistant
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ask me about your course materials and forum discussions
              </Typography>
            </Box>
          </Box>

          {/* Chat messages */}
          <Box sx={{ 
            p: 3, 
            flexGrow: 1, 
            bgcolor: 'white',
            overflowY: 'auto',
            maxHeight: 'calc(100vh - 240px)'
          }}>
            {messages.map((message, index) => (
              <Box 
                key={index} 
                sx={{ 
                  mb: 3,
                  display: 'flex',
                  flexDirection: message.role === 'user' ? 'row-reverse' : 'row'
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: message.role === 'user' ? '#7b1fa2' : '#5FE3D3',
                    mt: 0.5,
                    mr: message.role === 'user' ? 0 : 2,
                    ml: message.role === 'user' ? 2 : 0
                  }}
                >
                  {message.role === 'user' ? <AccountCircleIcon /> : <SmartToyIcon />}
                </Avatar>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    maxWidth: '75%',
                    borderRadius: 2,
                    bgcolor: message.role === 'user' ? '#f1e9f7' : '#f5f7f9'
                  }}
                >
                  {message.role === 'assistant' ? (
                    <Box sx={{ 
                      '& h1': { 
                        fontSize: '1.3rem', 
                        fontWeight: 600, 
                        mb: 2,
                        color: '#7b1fa2'
                      },
                      '& h2': { 
                        fontSize: '1.1rem', 
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
                        mb: 2,
                        '&:last-child': {
                          mb: 0
                        } 
                      },
                      '& code': {
                        bgcolor: '#f0f0f0',
                        p: 0.5,
                        borderRadius: 1,
                        fontFamily: 'monospace'
                      },
                      '& pre': {
                        bgcolor: '#f0f0f0',
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
                        {message.content}
                      </ReactMarkdown>
                    </Box>
                  ) : (
                    <Typography>{message.content}</Typography>
                  )}
                </Paper>
              </Box>
            ))}
            
            {loading && (
              <Box display="flex" my={3}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#5FE3D3',
                    mr: 2,
                    mt: 0.5
                  }}
                >
                  <SmartToyIcon />
                </Avatar>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    display: 'inline-flex',
                    borderRadius: 2,
                    bgcolor: '#f5f7f9'
                  }}
                >
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  <Typography>Thinking...</Typography>
                </Paper>
              </Box>
            )}
            
            {error && !loading && (
              <Box display="flex" my={3}>
                <Avatar 
                  sx={{ 
                    bgcolor: '#f44336',
                    mr: 2,
                    mt: 0.5
                  }}
                >
                  <SmartToyIcon />
                </Avatar>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    display: 'inline-flex',
                    borderRadius: 2,
                    bgcolor: '#f5f7f9'
                  }}
                >
                  <Typography color="error">{error}</Typography>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input area */}
          <Box sx={{ 
            p: 2, 
            bgcolor: '#f7f7f9',
            borderTop: '1px solid rgba(0,0,0,0.1)'
          }}>
            <form onSubmit={handleSubmit}>
              <Box display="flex" gap={1}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Ask your question..."
                  value={query}
                  onChange={handleQueryChange}
                  size="medium"
                  sx={{ 
                    "& .MuiOutlinedInput-root": {
                      bgcolor: 'white',
                      borderRadius: 3
                    }
                  }}
                />
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={loading || !query.trim() || !threadsLoaded}
                  endIcon={<SendIcon />}
                  sx={{
                    bgcolor: '#7b1fa2',
                    borderRadius: 3,
                    px: 3,
                    '&:hover': {
                      bgcolor: '#6a1b9a'
                    },
                    '&.Mui-disabled': {
                      bgcolor: 'rgba(123, 31, 162, 0.4)'
                    }
                  }}
                >
                  Send
                </Button>
              </Box>
            </form>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default AIQandA; 