export const theme = {
  colors: {
    primary: '#7b1fa2',
    secondary: '#f0b952',
    hover: 'rgba(123, 31, 162, 0.08)',
    category: {
      questions: {
        bg: 'rgba(25, 118, 210, 0.1)',
        text: 'primary.main'
      },
      announcements: {
        bg: 'rgba(240, 185, 82, 0.1)',
        text: '#d68f00'
      },
      resources: {
        bg: 'rgba(123, 31, 162, 0.1)',
        text: '#7b1fa2'
      }
    }
  }
};

export const buttonStyles = {
  outlined: {
    color: theme.colors.primary,
    borderColor: theme.colors.primary,
    '&:hover': {
      borderColor: theme.colors.primary,
      bgcolor: theme.colors.hover
    }
  },
  contained: {
    bgcolor: theme.colors.primary,
    borderRadius: 6,
    '&:hover': {
      bgcolor: '#6a1b9a'
    }
  }
};

export const paperStyles = {
  thread: {
    mb: 2,
    border: '1px solid rgba(0, 0, 0, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
    transition: 'all 0.2s',
    cursor: 'pointer',
    '&:hover': {
      borderColor: 'rgba(0, 0, 0, 0.15)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }
  }
};

export const getCategoryChipStyles = (category) => ({
  mr: 1.5,
  bgcolor: theme.colors.category[category.toLowerCase()]?.bg || 'rgba(0, 0, 0, 0.06)',
  color: theme.colors.category[category.toLowerCase()]?.text || 'text.secondary',
  fontWeight: 'medium'
});

export const getAvatarColor = (id) => id % 2 ? theme.colors.primary : theme.colors.secondary; 