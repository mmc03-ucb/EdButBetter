import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  FormControlLabel,
  Switch,
  IconButton,
  Tooltip
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { auth } from '../../firebase/config';
import ReactMarkdown from 'react-markdown';

const categories = [
  { value: 'Questions', label: 'Questions' },
  { value: 'General', label: 'General' },
  { value: 'Announcements', label: 'Announcements' }
];

function NewThreadDialog({ open, onClose, subsection, onThreadCreated }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleClose = () => {
    setTitle('');
    setContent('');
    setCategory('General');
    setPreview('');
    setIsAnonymous(false);
    setSelectedImage(null);
    onClose();
  };

  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    setPreview(newContent);
  };

  const handleImageSelect = () => {
    // Placeholder for future image upload functionality
    console.log('Image upload functionality will be implemented later');
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        const threadData = {
          title: title.trim(),
          author: isAnonymous ? 'Anonymous' : user.displayName || 'Anonymous',
          authorAvatar: isAnonymous ? 'A' : (user.displayName?.[0] || 'A'),
          date: new Date().toLocaleString(),
          replies: 0,
          views: 0,
          category: category,
          solved: false,
          likes: 0,
          preview: content.trim(),
          subsection: subsection,
          answers: [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };

        await addDoc(collection(db, 'threads'), threadData);

        onThreadCreated?.();
        handleClose();
      }
    } catch (error) {
      console.error('Error creating thread:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>Create New Thread</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            disabled={loading}
          />
          
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.value} value={cat.value}>
                  {cat.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                disabled={loading}
              />
            }
            label="Post Anonymously"
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
              <TextField
                label="Content (Markdown supported)"
                value={content}
                onChange={handleContentChange}
                multiline
                rows={6}
                fullWidth
                disabled={loading}
              />
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Tooltip title="Upload Image">
                  <IconButton 
                    onClick={handleImageSelect}
                    disabled={loading}
                    color="primary"
                  >
                    <ImageIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            <Box sx={{ width: '50%', p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>
                Preview
              </Typography>
              <Box sx={{ 
                maxHeight: '300px', 
                overflowY: 'auto',
                '& img': { maxWidth: '100%' }
              }}>
                <ReactMarkdown>{preview}</ReactMarkdown>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={!title.trim() || !content.trim() || loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          Create Thread
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewThreadDialog; 