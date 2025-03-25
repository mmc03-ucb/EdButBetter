export const mockThreads = {
  // Assignment 1 threads
  assignment1: [
    {
      id: 1,
      title: 'How do I deploy React app for Assignment 1?',
      author: 'Michael K.',
      authorAvatar: 'M',
      date: '2 hours ago',
      replies: 8,
      views: 42,
      category: 'Questions',
      solved: true,
      likes: 12,
      preview: 'I\'m trying to deploy my React app to Vercel but getting build errors. The assignment requires deployment, can anyone help?'
    },
    {
      id: 3,
      title: 'Useful resources for CSS Grid in Assignment 1',
      author: 'Sarah J.',
      authorAvatar: 'S',
      date: '3 days ago',
      replies: 6,
      views: 89,
      category: 'Resources',
      solved: false,
      likes: 24,
      preview: 'I found this amazing interactive CSS Grid tutorial that really helped me complete part 3 of Assignment 1...'
    },
    {
      id: 6,
      title: 'Important: Assignment 1 grading criteria',
      author: 'Prof. Williams',
      authorAvatar: 'PW',
      date: '1 week ago',
      replies: 5,
      views: 210,
      category: 'Announcements',
      solved: false,
      likes: 45,
      preview: 'The grading criteria for Assignment 1 will focus on code quality, responsive design, and proper implementation of React components...'
    }
  ],
  // Lab 1 threads
  lab1: [
    {
      id: 7,
      title: 'Lab 1: Setting up your development environment',
      author: 'Prof. Williams',
      authorAvatar: 'PW',
      date: '2 weeks ago',
      replies: 12,
      views: 189,
      category: 'Announcements',
      solved: false,
      likes: 28,
      preview: 'This lab will walk you through setting up Node.js, React, and other tools needed for the course...'
    },
    {
      id: 8,
      title: 'Getting VSCode extensions for Lab 1',
      author: 'Alex T.',
      authorAvatar: 'A',
      date: '10 days ago',
      replies: 7,
      views: 65,
      category: 'Questions',
      solved: true,
      likes: 15,
      preview: 'Which VSCode extensions are recommended for React development? The lab instructions mention a few but I\'m wondering if there are others.'
    }
  ],
  // Lab 2 threads
  lab2: [
    {
      id: 2,
      title: 'Lab 2 deadline extended to next Friday',
      author: 'Prof. Williams',
      authorAvatar: 'PW',
      date: 'Yesterday',
      replies: 14,
      views: 156,
      category: 'Announcements',
      solved: false,
      likes: 32,
      preview: 'Due to multiple requests and the upcoming holiday, we\'ve decided to extend the deadline for Lab 2 submission...'
    },
    {
      id: 5,
      title: 'Trouble understanding React Hooks in Lab 2',
      author: 'Jamie L.',
      authorAvatar: 'J',
      date: '5 days ago',
      replies: 12,
      views: 72,
      category: 'Questions',
      solved: true,
      likes: 8,
      preview: 'I\'m struggling with implementing useEffect with dependencies for the lab exercise. Could someone explain the concept?'
    }
  ],
  // Lab 3 threads
  lab3: [
    {
      id: 4,
      title: 'Study group for Lab 3 - anyone interested?',
      author: 'Alex T.',
      authorAvatar: 'A',
      date: '4 days ago',
      replies: 21,
      views: 118,
      category: 'General',
      solved: false,
      likes: 18,
      preview: 'I\'m organizing a study group for Lab 3. We\'ll be meeting in the library on Tuesday at 5pm...'
    },
    {
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
      preview: 'I\'m having trouble with nested routes in the Lab 3 exercises. Has anyone figured out how to properly implement them?'
    }
  ],
  // General threads
  general: [
    {
      id: 10,
      title: 'Course Syllabus Updates',
      author: 'Prof. Williams',
      authorAvatar: 'PW',
      date: '1 week ago',
      replies: 3,
      views: 210,
      category: 'Announcements',
      solved: false,
      likes: 25,
      preview: 'I\'ve made some updates to the course syllabus including adjustments to the grading scale. Please review...'
    },
    {
      id: 11,
      title: 'Recommended JavaScript books?',
      author: 'Taylor R.',
      authorAvatar: 'T',
      date: '5 days ago',
      replies: 8,
      views: 62,
      category: 'Questions',
      solved: true,
      likes: 12,
      preview: 'I\'m looking for good JavaScript books to supplement the course material. Any recommendations?'
    }
  ],
  // TCP-specific threads for Lab 3
  tcpThreads: [
    {
      title: "Important: Lab 3 Assignment Specification Update",
      author: "Prof. Smith",
      authorAvatar: "PS",
      date: "1 day ago",
      replies: 8,
      views: 245,
      category: "Announcements",
      solved: true,
      likes: 15,
      preview: "I need to inform you about some important changes to the Lab 3 assignment specification:\n\n1. The TCP implementation now requires implementing both the sender and receiver sides, not just the sender as previously specified.\n2. The window size implementation has been updated to use a dynamic window size based on network conditions.\n3. The deadline has been extended by one week to accommodate these changes.\n\nPlease review the updated specification document in the course materials. If you have any questions about the changes, feel free to ask in the discussion forum.",
      subsection: "lab3",
      answers: [
        {
          author: "Prof. Smith",
          authorAvatar: "PS",
          content: "I'll be holding an extra office hour tomorrow at 2 PM to discuss these changes in detail. Please join if you have any questions about the updated requirements.",
          likes: 12,
          isTutor: true,
          isAnswer: true,
        },
        {
          author: "Student A",
          authorAvatar: "SA",
          content: "Thank you for the clarification. Will the lab resources be updated to reflect these changes as well?",
          likes: 5,
          isTutor: false,
          isAnswer: false,
        },
      ],
    },
    {
      title: "Understanding TCP Handshake Process",
      author: "Prof. Smith",
      authorAvatar: "PS",
      date: "2 days ago",
      replies: 12,
      views: 156,
      category: "Questions",
      solved: true,
      likes: 24,
      preview: "Can someone explain the three-way handshake process in TCP? I'm having trouble understanding the sequence of SYN and ACK packets.",
      subsection: "lab3",
      answers: [
        {
          author: "Prof. Smith",
          authorAvatar: "PS",
          content: "The three-way handshake consists of three steps:\n1. Client sends SYN (sequence number = x)\n2. Server responds with SYN-ACK (sequence number = y, acknowledgment = x+1)\n3. Client sends ACK (acknowledgment = y+1)",
          likes: 15,
          isTutor: true,
          isAnswer: true,
        },
        {
          author: "Student A",
          authorAvatar: "SA",
          content: "I found this diagram helpful: [TCP Handshake Diagram]",
          likes: 8,
          isTutor: false,
          isAnswer: false,
        },
      ],
    },
    {
      title: "TCP vs UDP: When to use which?",
      author: "Student B",
      authorAvatar: "SB",
      date: "1 day ago",
      replies: 8,
      views: 89,
      category: "Questions",
      solved: false,
      likes: 12,
      preview: "In what scenarios should we use TCP over UDP and vice versa? I'm working on the lab exercise and need to choose between them.",
      subsection: "lab3",
      answers: [
        {
          author: "Prof. Smith",
          authorAvatar: "PS",
          content: "TCP is best for reliable data transfer, ordered data delivery, flow control, and congestion control.\nUDP is better for real-time applications and when some packet loss is acceptable.",
          likes: 20,
          isTutor: true,
          isAnswer: true,
        },
      ],
    },
    {
      title: "TCP Window Size and Flow Control",
      author: "Student C",
      authorAvatar: "SC",
      date: "3 days ago",
      replies: 15,
      views: 234,
      category: "Questions",
      solved: true,
      likes: 18,
      preview: "How does TCP window size affect flow control? I'm trying to implement this in the lab exercise.",
      subsection: "lab3",
      answers: [
        {
          author: "Prof. Smith",
          authorAvatar: "PS",
          content: "The window size determines how many bytes can be sent before receiving an acknowledgment. It helps prevent overwhelming the receiver and manages network congestion.",
          likes: 25,
          isTutor: true,
          isAnswer: true,
        },
        {
          author: "Student D",
          authorAvatar: "SD",
          content: "I implemented a sliding window algorithm in my lab. Here's the key part: [code snippet]",
          likes: 10,
          isTutor: false,
          isAnswer: false,
        },
      ],
    },
  ]
}; 