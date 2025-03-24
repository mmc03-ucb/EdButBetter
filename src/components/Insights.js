import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Button,
} from '@mui/material';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import ReactMarkdown from 'react-markdown';
import { useNavigate } from 'react-router-dom';

function Insights({ subsection, onBack }) {
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAISummary] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAndSummarizeThreads();
  }, [subsection]);

  const fetchAndSummarizeThreads = async () => {
    try {
      setLoading(true);
      const threadsCollection = collection(db, "threads");
      const q = query(threadsCollection, where("subsection", "==", subsection));
      const querySnapshot = await getDocs(q);
      
      const threads = [];
      querySnapshot.forEach((doc) => {
        threads.push({ id: doc.id, ...doc.data() });
      });

      // Generate AI summary using Gemini
      await generateAISummary(threads);
    } catch (err) {
      console.error("Error fetching threads:", err);
      setError("Failed to fetch threads");
    } finally {
      setLoading(false);
    }
  };

  const generateAISummary = async (threads) => {
    try {
      // Format threads data for Gemini
      const formattedData = threads.map(thread => ({
        id: thread.id,
        title: thread.title,
        category: thread.category,
        content: thread.preview,
        answers: thread.answers?.map(answer => ({
          author: answer.author,
          content: answer.content,
          isTutor: answer.isTutor,
          isAnswer: answer.isAnswer
        })) || []
      }));

      // Call Gemini API
      const response = await fetch('http://localhost:3001/api/gemini-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ threads: formattedData }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate AI summary');
      }

      const data = await response.json();
      setAISummary(data.summary);
    } catch (err) {
      console.error('Error generating AI summary:', err);
      setAISummary('Failed to generate AI summary. Please try again later.');
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Back button */}
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={{ mb: 2 }}
      >
        Back to Discussions
      </Button>

      {/* AI Insights */}
      <Paper sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" mb={3}>
          <LightbulbIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h5" fontWeight="medium">
            What's Happening?
          </Typography>
        </Box>
        
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
            {aiSummary}
          </ReactMarkdown>
        </Box>
      </Paper>
    </Box>
  );
}

export default Insights; 