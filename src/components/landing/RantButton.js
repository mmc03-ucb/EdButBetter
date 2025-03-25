import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  Typography,
  CircularProgress,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { RecordVoiceOver as RecordVoiceOverIcon } from '@mui/icons-material';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { auth } from '../../firebase/config';
import { useCache } from '../../context/CacheContext';

function RantButton() {
  const [open, setOpen] = useState(false);
  const [rant, setRant] = useState('');
  const [convertedRant, setConvertedRant] = useState('');
  const [loading, setLoading] = useState(false);
  const { invalidateThreadList } = useCache();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setRant('');
    setConvertedRant('');
  };

  const convertToEmoji = async (text) => {
    try {
      const response = await fetch('http://localhost:3001/api/convert-to-emoji', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to convert text to emoji');
      }

      const data = await response.json();
      return data.emojiText;
    } catch (error) {
      console.error('Error converting to emoji:', error);
      return text; // Return original text if conversion fails
    }
  };

  const handleSubmit = async () => {
    if (!rant.trim()) return;

    setLoading(true);
    try {
      const emojiText = await convertToEmoji(rant);
      setConvertedRant(emojiText);

      // Add rant to Firestore in a separate collection
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, 'rants'), {
          title: 'Rant',
          preview: emojiText,
          author: user.displayName || 'Anonymous',
          authorAvatar: user.displayName?.[0] || 'A',
          date: serverTimestamp(),
          category: 'Rant',
          replies: 0,
          views: 0,
          likes: 0,
          subsection: 'rant'
        });

        // Invalidate the rant section cache to trigger a refresh
        invalidateThreadList('rant');
      }

      handleClose();
    } catch (error) {
      console.error('Error posting rant:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<RecordVoiceOverIcon />}
        onClick={handleOpen}
        sx={{
          borderRadius: 2,
          mr: 1,
          borderColor: '#7b1fa2',
          color: '#7b1fa2',
          height: '36px',
          minWidth: isMobile ? '36px' : 'auto',
          padding: isMobile ? '0 8px' : '0 16px',
          '&:hover': {
            borderColor: '#6a1b9a',
            bgcolor: 'rgba(123, 31, 162, 0.04)'
          }
        }}
      >
        {!isMobile && 'Rant'}
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Share Your Rant</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Your Rant"
            fullWidth
            multiline
            rows={4}
            value={rant}
            onChange={(e) => setRant(e.target.value)}
            disabled={loading}
          />
          {convertedRant && (
            <Box mt={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Your rant will be converted to:
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                {convertedRant}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!rant.trim() || loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            Post Rant
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default RantButton; 