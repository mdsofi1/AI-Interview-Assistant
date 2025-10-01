const { useState, useEffect, useRef, useCallback } = React;

// Enhanced mock data with UI configuration
const mockQuestions = {
  easy: [
    {
      id: 1,
      question: "What is React and why is it popular for frontend development?",
      timeLimit: 20,
      difficulty: "easy"
    },
    {
      id: 2,
      question: "Explain the difference between let, const, and var in JavaScript.",
      timeLimit: 20,
      difficulty: "easy"
    }
  ],
  medium: [
    {
      id: 3,
      question: "How do React hooks work and what problem do they solve?",
      timeLimit: 60,
      difficulty: "medium"
    },
    {
      id: 4,
      question: "Explain the Node.js event loop and how it handles asynchronous operations.",
      timeLimit: 60,
      difficulty: "medium"
    }
  ],
  hard: [
    {
      id: 5,
      question: "Design a scalable architecture for a real-time chat application using React and Node.js.",
      timeLimit: 120,
      difficulty: "hard"
    },
    {
      id: 6,
      question: "How would you optimize a React application's performance for large datasets?",
      timeLimit: 120,
      difficulty: "hard"
    }
  ]
};

const sampleCandidates = [
  {
    id: "sample-1",
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1-555-0123",
    resumeFileName: "john_doe_resume.pdf",
    interviewDate: "2025-10-01T10:30:00Z",
    status: "completed",
    totalScore: 85,
    answers: [
      {
        questionId: 1,
        answer: "React is a JavaScript library for building user interfaces, particularly for web applications. It's popular because of its component-based architecture, virtual DOM for efficient updates, and strong ecosystem.",
        score: 18,
        timeSpent: 18
      },
      {
        questionId: 2,
        answer: "let and const are block-scoped while var is function-scoped. const cannot be reassigned after declaration, let can be reassigned but not redeclared in the same scope.",
        score: 16,
        timeSpent: 19
      }
    ],
    aiSummary: "Strong candidate with excellent React knowledge and good communication skills. Shows practical experience and clear thinking."
  },
  {
    id: "sample-2",
    name: "Sarah Wilson",
    email: "sarah.wilson@example.com",
    phone: "+1-555-0124",
    resumeFileName: "sarah_wilson_resume.pdf",
    interviewDate: "2025-09-30T14:15:00Z",
    status: "completed",
    totalScore: 92,
    answers: [
      {
        questionId: 3,
        answer: "React hooks allow functional components to have state and lifecycle methods. They solve the problem of complex class components and allow better code reuse through custom hooks.",
        score: 45,
        timeSpent: 55
      },
      {
        questionId: 4,
        answer: "The event loop allows Node.js to perform non-blocking I/O operations. It processes callbacks from the event queue when the call stack is empty, enabling asynchronous programming.",
        score: 48,
        timeSpent: 58
      }
    ],
    aiSummary: "Exceptional candidate with deep understanding of both frontend and backend technologies. Outstanding problem-solving abilities."
  },
  {
    id: "sample-3",
    name: "Mike Chen",
    email: "mike.chen@example.com",
    phone: "+1-555-0125",
    resumeFileName: "mike_chen_resume.pdf",
    interviewDate: "2025-09-29T11:00:00Z",
    status: "completed",
    totalScore: 78,
    answers: [
      {
        questionId: 5,
        answer: "I would use microservices architecture with React frontend, Node.js API gateway, WebSocket servers for real-time communication, Redis for message queuing, and MongoDB for data persistence.",
        score: 95,
        timeSpent: 115
      },
      {
        questionId: 6,
        answer: "Use React.memo for component memoization, implement virtual scrolling for large lists, code splitting with React.lazy, optimize bundle size, use useMemo and useCallback hooks.",
        score: 88,
        timeSpent: 108
      }
    ],
    aiSummary: "Good technical foundation with room for growth. Shows enthusiasm and willingness to learn new technologies."
  }
];

// Enhanced utility functions
const generateId = () => Math.random().toString(36).substr(2, 9);

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const calculateScore = (answer, difficulty, timeSpent, timeLimit) => {
  const baseScore = Math.min(answer.length / 10, 20);
  const keywordBonus = (answer.match(/(React|Node|JavaScript|API|component|async|function|event|loop|architecture|state|props|hooks|DOM|CSS|HTML|database|server|client|responsive|performance|optimization|security)/gi) || []).length * 3;
  const timeBonus = timeSpent < timeLimit ? (timeLimit - timeSpent) / timeLimit * 15 : 0;
  const difficultyMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 2 : 4;
  
  return Math.min(Math.round((baseScore + keywordBonus + timeBonus) * difficultyMultiplier), 100);
};

const generateAISummary = (candidate) => {
  const avgScore = candidate.totalScore;
  let performance = "needs improvement";
  let recommendation = "May need additional training and support.";
  
  if (avgScore >= 90) {
    performance = "exceptional";
    recommendation = "Outstanding candidate, highly recommended for senior positions.";
  } else if (avgScore >= 80) {
    performance = "excellent"; 
    recommendation = "Strong candidate, highly recommended for the position.";
  } else if (avgScore >= 70) {
    performance = "good";
    recommendation = "Solid candidate with good potential.";
  } else if (avgScore >= 60) {
    performance = "satisfactory";
    recommendation = "Suitable candidate with room for growth.";
  }

  return `Candidate demonstrates ${performance} technical knowledge with an overall score of ${avgScore}%. Shows understanding of core concepts and problem-solving abilities. ${recommendation}`;
};

// Enhanced notification system
const showNotification = (message, type = 'success') => {
  const notification = document.getElementById(`${type}-notification`);
  if (!notification) return;
  
  const messageEl = notification.querySelector('.notification-message');
  if (messageEl) {
    messageEl.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
      notification.classList.remove('show');
    }, 4000);
  }
};

// Enhanced loading overlay
const showLoading = (show = true, message = "Processing...") => {
  let overlay = document.getElementById('loading-overlay');
  if (!overlay && show) {
    overlay = createLoadingOverlay();
  }
  
  if (overlay) {
    const textEl = overlay.querySelector('.loading-text');
    if (textEl) textEl.textContent = message;
    
    if (show) {
      overlay.classList.add('show');
    } else {
      overlay.classList.remove('show');
    }
  }
};

const createLoadingOverlay = () => {
  const overlay = document.createElement('div');
  overlay.id = 'loading-overlay';
  overlay.className = 'loading-overlay';
  overlay.innerHTML = `
    <div class="loading-content">
      <div class="loading-spinner"></div>
      <div class="loading-text">Processing...</div>
    </div>
  `;
  document.body.appendChild(overlay);
  return overlay;
};

// Enhanced Timer Component with circular progress
const TimerComponent = ({ seconds, total, className }) => {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? ((total - seconds) / total) * circumference : 0;
  
  return React.createElement('div', { className: `timer-circle ${className}` },
    React.createElement('svg', { width: '100%', height: '100%', viewBox: '0 0 50 50' },
      React.createElement('circle', {
        className: 'timer-bg',
        cx: 25,
        cy: 25,
        r: radius,
        strokeDasharray: circumference,
        strokeDashoffset: 0
      }),
      React.createElement('circle', {
        className: 'timer-progress',
        cx: 25,
        cy: 25,
        r: radius,
        strokeDasharray: circumference,
        strokeDashoffset: circumference - progress
      })
    ),
    React.createElement('div', { 
      style: { 
        position: 'absolute', 
        inset: 0, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '12px',
        fontWeight: 'bold'
      }
    }, formatTime(seconds))
  );
};

// Enhanced File Upload Component
const FileUploadComponent = ({ onFileUpload, uploadError, isUploading }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileUpload({ target: { files } });
    }
  };

  const triggerFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return React.createElement('div', {
    className: `upload-section ${isDragOver ? 'drag-over' : ''}`,
    onDragOver: handleDragOver,
    onDragLeave: handleDragLeave,
    onDrop: handleDrop
  },
    React.createElement('div', {
      className: `upload-area ${isUploading ? 'uploading' : ''}`,
      onClick: triggerFileUpload
    },
      React.createElement('div', { 
        className: `upload-icon ${isUploading ? 'pulse' : 'bounce-on-hover'}` 
      }, isUploading ? '⏳' : '📄'),
      React.createElement('h3', { className: 'gradient-text-animated' }, 
        isUploading ? 'Processing Resume...' : 'Upload Your Resume'
      ),
      React.createElement('p', null, 
        isUploading ? 'Please wait while we extract your information' : 'Drop your PDF or DOCX file here, or click to browse'
      ),
      React.createElement('input', {
        type: 'file',
        ref: fileInputRef,
        className: 'file-input',
        accept: '.pdf,.docx',
        onChange: onFileUpload
      }),
      uploadError && React.createElement('div', { 
        className: 'error-message shake' 
      }, uploadError)
    )
  );
};

// Enhanced Message Component
const MessageComponent = ({ message, isLast }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const getAvatar = (sender) => {
    if (sender === 'ai') return '🤖';
    if (sender === 'user') return '👤';
    return '💬';
  };

  return React.createElement('div', {
    className: `message ${message.sender} ${isVisible ? 'visible' : ''}`,
    style: { 
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  },
    React.createElement('div', { 
      className: `message-avatar glow` 
    }, getAvatar(message.sender)),
    React.createElement('div', { className: 'message-bubble' }, message.content)
  );
};

// Main App Component
function App() {
  const [activeTab, setActiveTab] = useState('interviewee');
  const [candidates, setCandidates] = useState([]);
  const [currentInterview, setCurrentInterview] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('score');
  
  // Interview states
  const [interviewStage, setInterviewStage] = useState('upload');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [candidateInfo, setCandidateInfo] = useState({ name: '', email: '', phone: '' });
  const [uploadError, setUploadError] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const timerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);

  // Get all questions in order
  const allQuestions = [...mockQuestions.easy, ...mockQuestions.medium, ...mockQuestions.hard];

  // Initialize data and floating particles
  useEffect(() => {
    // Create floating particles
    const createParticles = () => {
      const particles = document.createElement('div');
      particles.className = 'particles';
      for (let i = 0; i < 4; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particles.appendChild(particle);
      }
      document.body.appendChild(particles);
    };

    createParticles();

    const savedCandidates = localStorage.getItem('interviewCandidates');
    const savedCurrentInterview = localStorage.getItem('currentInterview');
    
    if (savedCandidates) {
      const parsed = JSON.parse(savedCandidates);
      setCandidates([...sampleCandidates, ...parsed]);
    } else {
      setCandidates(sampleCandidates);
    }

    if (savedCurrentInterview) {
      const interview = JSON.parse(savedCurrentInterview);
      showWelcomeBackModal(interview);
    }

    return () => {
      // Cleanup particles
      const particles = document.querySelector('.particles');
      if (particles) particles.remove();
    };
  }, []);

  // Enhanced timer effect
  useEffect(() => {
    if (isTimerRunning && timer > 0) {
      timerRef.current = setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    } else if (isTimerRunning && timer === 0 && interviewStage === 'interview') {
      handleAutoSubmit();
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timer, isTimerRunning, interviewStage]);

  // Auto scroll to bottom of messages with smooth animation
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'end',
        inline: 'nearest'
      });
    }
  }, [messages]);

  // Focus input when appropriate
  useEffect(() => {
    if ((interviewStage === 'interview' || interviewStage === 'info-collection') && chatInputRef.current) {
      chatInputRef.current.focus();
    }
  }, [interviewStage, currentQuestionIndex]);

  const showWelcomeBackModal = (interview) => {
    const modal = document.getElementById('welcome-modal');
    if (modal) {
      modal.classList.remove('hidden');
      
      const continueBtn = document.getElementById('continue-btn');
      const startNewBtn = document.getElementById('start-new-btn');
      
      if (continueBtn) {
        continueBtn.onclick = () => {
          setCurrentInterview(interview);
          setCandidateInfo(interview.candidateInfo);
          setCurrentQuestionIndex(interview.currentQuestionIndex);
          setMessages(interview.messages);
          setInterviewStage(interview.stage);
          if (interview.stage === 'interview') {
            startQuestionTimer();
          }
          modal.classList.add('hidden');
          showNotification('Interview resumed successfully! 🎯', 'success');
        };
      }
      
      if (startNewBtn) {
        startNewBtn.onclick = () => {
          localStorage.removeItem('currentInterview');
          modal.classList.add('hidden');
          showNotification('Starting fresh interview session ✨', 'success');
        };
      }
    }
  };

  const saveInterviewProgress = useCallback(() => {
    if (currentInterview) {
      const progress = {
        ...currentInterview,
        candidateInfo,
        currentQuestionIndex,
        messages,
        stage: interviewStage,
        timestamp: Date.now()
      };
      localStorage.setItem('currentInterview', JSON.stringify(progress));
    }
  }, [currentInterview, candidateInfo, currentQuestionIndex, messages, interviewStage]);

  useEffect(() => {
    if (interviewStage !== 'upload' && interviewStage !== 'complete') {
      saveInterviewProgress();
    }
  }, [saveInterviewProgress, interviewStage]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    setUploadError('');

    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Please upload a PDF or DOCX file only.');
      showNotification('Invalid file type. Please upload PDF or DOCX only.', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB.');
      showNotification('File too large. Please upload a file smaller than 5MB.', 'error');
      return;
    }

    setIsUploading(true);
    showLoading(true, 'Analyzing your resume...');

    // Simulate resume processing with realistic delay
    setTimeout(() => {
      const extractedInfo = {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1-555-0456'
      };

      setCandidateInfo(extractedInfo);
      setCurrentInterview({
        id: generateId(),
        resumeFileName: file.name,
        startTime: Date.now(),
        answers: []
      });

      setIsUploading(false);
      showLoading(false);
      setInterviewStage('info-collection');
      
      setTimeout(() => {
        addMessage('ai', `🎉 Perfect! I've successfully analyzed your resume. Let me confirm the information I extracted:`);
        setTimeout(() => {
          addMessage('ai', `👤 **Name:** ${extractedInfo.name}`);
          setTimeout(() => {
            addMessage('ai', `📧 **Email:** ${extractedInfo.email}`);
            setTimeout(() => {
              addMessage('ai', `📱 **Phone:** ${extractedInfo.phone}`);
              setTimeout(() => {
                addMessage('ai', `Please confirm if this information is correct, or update any fields that need changes. Once confirmed, we'll begin your technical interview! 🚀`);
              }, 800);
            }, 600);
          }, 400);
        }, 500);
      }, 1000);
      
      showNotification('Resume processed successfully! 🎯', 'success');
    }, 3000);
  };

  const addMessage = (sender, content) => {
    const newMessage = {
      id: generateId(),
      sender,
      content,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const simulateTyping = (callback, delay = 1500) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  };

  const handleInfoCollection = () => {
    if (!candidateInfo.name || !candidateInfo.email || !candidateInfo.phone) {
      addMessage('ai', '⚠️ Please provide all required information: name, email, and phone number.');
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(candidateInfo.email)) {
      addMessage('ai', '❌ Please enter a valid email address.');
      showNotification('Please enter a valid email address', 'error');
      return;
    }

    addMessage('user', `✅ **Confirmed Information:**\n👤 ${candidateInfo.name}\n📧 ${candidateInfo.email}\n📱 ${candidateInfo.phone}`);
    
    simulateTyping(() => {
      addMessage('ai', '🎯 Perfect! Your information has been confirmed. Now let\'s begin your technical interview.');
      simulateTyping(() => {
        addMessage('ai', '📋 **Interview Structure:**\n• 2 Easy questions (20 seconds each)\n• 2 Medium questions (60 seconds each)\n• 2 Hard questions (120 seconds each)');
        simulateTyping(() => {
          addMessage('ai', '💡 **Tips:**\n• Be concise and clear\n• Focus on key concepts\n• Use examples when possible');
          simulateTyping(() => {
            addMessage('ai', '🚀 Ready to showcase your skills? Let\'s begin!');
            setTimeout(() => {
              startInterview();
            }, 2000);
          }, 1200);
        }, 1500);
      }, 2000);
    });
    
    showNotification('Information confirmed! Starting interview...', 'success');
  };

  const startInterview = () => {
    setInterviewStage('interview');
    setCurrentQuestionIndex(0);
    simulateTyping(() => {
      askQuestion(0);
    }, 1000);
  };

  const askQuestion = (questionIndex) => {
    const question = allQuestions[questionIndex];
    const difficultyEmoji = question.difficulty === 'easy' ? '🟢' : question.difficulty === 'medium' ? '🟡' : '🔴';
    
    addMessage('ai', `${difficultyEmoji} **Question ${questionIndex + 1}/6** (${question.difficulty.toUpperCase()} - ${question.timeLimit}s)\n\n${question.question}`);
    setTimer(question.timeLimit);
    setTotalTime(question.timeLimit);
    setIsTimerRunning(true);
    
    if (chatInputRef.current) {
      chatInputRef.current.focus();
    }
  };

  const startQuestionTimer = () => {
    if (currentQuestionIndex < allQuestions.length) {
      const question = allQuestions[currentQuestionIndex];
      setTimer(question.timeLimit);
      setTotalTime(question.timeLimit);
      setIsTimerRunning(true);
    }
  };

  const handleSubmitAnswer = () => {
    if (!inputValue.trim()) {
      showNotification('Please enter your answer before submitting', 'error');
      return;
    }

    const question = allQuestions[currentQuestionIndex];
    const timeSpent = question.timeLimit - timer;
    const score = calculateScore(inputValue, question.difficulty, timeSpent, question.timeLimit);

    addMessage('user', inputValue);
    
    // Save answer
    const newAnswer = {
      questionId: question.id,
      answer: inputValue,
      score,
      timeSpent
    };

    setCurrentInterview(prev => ({
      ...prev,
      answers: [...prev.answers, newAnswer]
    }));

    setInputValue('');
    setIsTimerRunning(false);

    // Provide encouraging feedback
    const encouragement = score >= 80 ? '🌟 Excellent answer!' : 
                         score >= 60 ? '👍 Good response!' : 
                         score >= 40 ? '👌 Not bad!' : '💪 Keep going!';

    simulateTyping(() => {
      addMessage('ai', `${encouragement} Moving to the next question...`);
      
      // Move to next question or complete
      if (currentQuestionIndex < allQuestions.length - 1) {
        setTimeout(() => {
          setCurrentQuestionIndex(prev => prev + 1);
          simulateTyping(() => {
            askQuestion(currentQuestionIndex + 1);
          }, 800);
        }, 1500);
      } else {
        setTimeout(() => {
          completeInterview();
        }, 1500);
      }
    }, 1000);
  };

  const handleAutoSubmit = () => {
    if (inputValue.trim()) {
      handleSubmitAnswer();
    } else {
      addMessage('user', '⏰ *No answer provided - time expired*');
      
      const question = allQuestions[currentQuestionIndex];
      const newAnswer = {
        questionId: question.id,
        answer: 'No answer provided',
        score: 0,
        timeSpent: question.timeLimit
      };

      setCurrentInterview(prev => ({
        ...prev,
        answers: [...prev.answers, newAnswer]
      }));

      setIsTimerRunning(false);

      simulateTyping(() => {
        addMessage('ai', '⏰ Time\'s up! Don\'t worry, let\'s continue with the next question.');
        
        if (currentQuestionIndex < allQuestions.length - 1) {
          setTimeout(() => {
            setCurrentQuestionIndex(prev => prev + 1);
            simulateTyping(() => {
              askQuestion(currentQuestionIndex + 1);
            }, 800);
          }, 1500);
        } else {
          setTimeout(() => {
            completeInterview();
          }, 1500);
        }
      }, 1200);
    }
  };

  const completeInterview = () => {
    setInterviewStage('complete');
    setIsTimerRunning(false);
    
    // Calculate final score
    const totalScore = Math.round(
      currentInterview.answers.reduce((sum, answer) => sum + answer.score, 0) / 
      allQuestions.length
    );

    const completedCandidate = {
      id: currentInterview.id,
      ...candidateInfo,
      resumeFileName: currentInterview.resumeFileName,
      interviewDate: new Date().toISOString(),
      status: 'completed',
      totalScore,
      answers: currentInterview.answers,
      aiSummary: generateAISummary({ ...candidateInfo, totalScore }),
      totalTime: Math.round((Date.now() - currentInterview.startTime) / 1000)
    };

    // Save to candidates list
    setCandidates(prev => [completedCandidate, ...prev.filter(c => !sampleCandidates.includes(c))]);
    
    // Update localStorage
    const savedCandidates = JSON.parse(localStorage.getItem('interviewCandidates') || '[]');
    savedCandidates.unshift(completedCandidate);
    localStorage.setItem('interviewCandidates', JSON.stringify(savedCandidates));
    
    // Clear current interview
    localStorage.removeItem('currentInterview');
    
    simulateTyping(() => {
      const scoreEmoji = totalScore >= 80 ? '🎉' : totalScore >= 60 ? '👏' : '💪';
      addMessage('ai', `${scoreEmoji} **Interview Complete!** Your final score is **${totalScore}%**`);
      simulateTyping(() => {
        addMessage('ai', `📊 **Performance Analysis:**\n${completedCandidate.aiSummary}`);
        simulateTyping(() => {
          addMessage('ai', '🙏 Thank you for your time! The interviewer will review your responses and get back to you soon. Best of luck! ✨');
        }, 2000);
      }, 2500);
    }, 1500);
    
    showNotification(`Interview completed! Final score: ${totalScore}% 🎯`, 'success');
  };

  const resetInterview = () => {
    // Show confirmation modal
    const modal = document.getElementById('reset-modal');
    if (modal) {
      modal.classList.remove('hidden');
      
      const confirmBtn = document.getElementById('confirm-reset-btn');
      const cancelBtn = document.getElementById('cancel-reset-btn');
      const closeBtn = document.getElementById('close-reset-modal');
      
      if (confirmBtn) {
        confirmBtn.onclick = () => {
          setInterviewStage('upload');
          setCurrentQuestionIndex(0);
          setTimer(0);
          setTotalTime(0);
          setIsTimerRunning(false);
          setMessages([]);
          setInputValue('');
          setCandidateInfo({ name: '', email: '', phone: '' });
          setCurrentInterview(null);
          setUploadError('');
          setIsUploading(false);
          localStorage.removeItem('currentInterview');
          modal.classList.add('hidden');
          showNotification('New interview session started! 🚀', 'success');
        };
      }
      
      if (cancelBtn) {
        cancelBtn.onclick = () => {
          modal.classList.add('hidden');
        };
      }
      
      if (closeBtn) {
        closeBtn.onclick = () => {
          modal.classList.add('hidden');
        };
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (interviewStage === 'interview') {
        handleSubmitAnswer();
      } else if (interviewStage === 'info-collection') {
        handleInfoCollection();
      }
    }
  };

  const showCandidateDetails = (candidate) => {
    setSelectedCandidate(candidate);
    const modal = document.getElementById('candidate-modal');
    if (modal) {
      modal.classList.remove('hidden');

      const closeBtn = document.getElementById('close-candidate-modal');
      if (closeBtn) {
        closeBtn.onclick = () => {
          modal.classList.add('hidden');
          setSelectedCandidate(null);
        };
      }

      modal.onclick = (e) => {
        if (e.target === modal) {
          modal.classList.add('hidden');
          setSelectedCandidate(null);
        }
      };
    }
  };

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (sortBy === 'score') return b.totalScore - a.totalScore;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'date') return new Date(b.interviewDate) - new Date(a.interviewDate);
    return 0;
  });

  const getScoreClass = (score) => {
    if (score >= 80) return 'score-excellent';
    if (score >= 70) return 'score-good';
    if (score >= 60) return 'score-average';
    return 'score-poor';
  };

  const getTimerClass = () => {
    if (timer <= 5) return 'timer critical';
    if (timer <= 10) return 'timer warning';
    return 'timer';
  };

  return React.createElement('div', { className: 'app' },
    // Header
    React.createElement('header', { className: 'header' },
      React.createElement('div', { className: 'header-content' },
        React.createElement('h1', { className: 'logo gradient-text-animated' }, 
          '🚀 AI Interview Assistant'
        ),
        React.createElement('div', { className: 'tabs' },
          React.createElement('button', {
            className: `tab ${activeTab === 'interviewee' ? 'active' : ''}`,
            onClick: () => {
              setActiveTab('interviewee');
              showNotification('Switched to Interviewee view', 'success');
            }
          }, '👤 Interviewee'),
          React.createElement('button', {
            className: `tab ${activeTab === 'interviewer' ? 'active' : ''}`,
            onClick: () => {
              setActiveTab('interviewer');
              showNotification('Switched to Interviewer dashboard', 'success');
            }
          }, '👨‍💼 Interviewer')
        )
      )
    ),

    // Main Content
    React.createElement('main', { className: 'main-content' },
      activeTab === 'interviewee' ? (
        // Interviewee Tab
        React.createElement('div', { className: 'interview-container' },
          interviewStage === 'upload' ? (
            React.createElement(FileUploadComponent, {
              onFileUpload: handleFileUpload,
              uploadError,
              isUploading
            })
          ) : (
            // Chat Interface
            React.createElement('div', { className: 'chat-container' },
              React.createElement('div', { className: 'chat-header' },
                interviewStage === 'interview' && React.createElement('div', { className: 'interview-progress' },
                  `Question ${currentQuestionIndex + 1}/6 • ${allQuestions[currentQuestionIndex]?.difficulty.toUpperCase()}`
                ),
                interviewStage === 'interview' && React.createElement('div', { className: getTimerClass() },
                  React.createElement(TimerComponent, {
                    seconds: timer,
                    total: totalTime,
                    className: getTimerClass()
                  })
                )
              ),
              React.createElement('div', { className: 'chat-messages' },
                messages.map((message, index) =>
                  React.createElement(MessageComponent, {
                    key: message.id,
                    message,
                    isLast: index === messages.length - 1
                  })
                ),
                isTyping && React.createElement('div', { className: 'message ai' },
                  React.createElement('div', { className: 'message-avatar glow' }, '🤖'),
                  React.createElement('div', { className: 'message-bubble' },
                    React.createElement('div', { className: 'typing-indicator' },
                      React.createElement('div', { className: 'typing-dot' }),
                      React.createElement('div', { className: 'typing-dot' }),
                      React.createElement('div', { className: 'typing-dot' })
                    )
                  )
                ),
                React.createElement('div', { ref: messagesEndRef })
              ),
              (interviewStage === 'info-collection' || interviewStage === 'interview') && 
              React.createElement('div', { className: 'chat-input-area' },
                interviewStage === 'info-collection' && (
                  React.createElement('div', { className: 'form-row' },
                    React.createElement('div', { className: 'form-group' },
                      React.createElement('input', {
                        type: 'text',
                        className: 'form-control',
                        placeholder: '👤 Full Name',
                        value: candidateInfo.name,
                        onChange: (e) => setCandidateInfo(prev => ({ ...prev, name: e.target.value }))
                      })
                    ),
                    React.createElement('div', { className: 'form-group' },
                      React.createElement('input', {
                        type: 'email',
                        className: 'form-control',
                        placeholder: '📧 Email Address',
                        value: candidateInfo.email,
                        onChange: (e) => setCandidateInfo(prev => ({ ...prev, email: e.target.value }))
                      })
                    ),
                    React.createElement('div', { className: 'form-group' },
                      React.createElement('input', {
                        type: 'tel',
                        className: 'form-control',
                        placeholder: '📱 Phone Number',
                        value: candidateInfo.phone,
                        onChange: (e) => setCandidateInfo(prev => ({ ...prev, phone: e.target.value }))
                      })
                    )
                  )
                ),
                React.createElement('div', { className: 'input-row' },
                  React.createElement('textarea', {
                    ref: chatInputRef,
                    className: 'chat-input form-control',
                    placeholder: interviewStage === 'info-collection' ? 
                      '✅ Confirm your information or make corrections...' : 
                      '💭 Type your answer here... (Press Enter to submit)',
                    value: inputValue,
                    onChange: (e) => setInputValue(e.target.value),
                    onKeyPress: handleKeyPress
                  }),
                  React.createElement('button', {
                    className: 'btn btn--primary send-btn bounce-on-hover',
                    onClick: interviewStage === 'interview' ? handleSubmitAnswer : handleInfoCollection,
                    disabled: !inputValue.trim()
                  }, interviewStage === 'interview' ? '🚀 Submit' : '✅ Confirm')
                )
              ),
              interviewStage === 'complete' && React.createElement('div', { className: 'interview-complete' },
                React.createElement('h2', null, '🎉 Interview Complete!'),
                React.createElement('div', { className: 'score-display' },
                  currentInterview && Math.round(
                    currentInterview.answers.reduce((sum, answer) => sum + answer.score, 0) / allQuestions.length
                  ), '%'
                ),
                React.createElement('p', { className: 'gradient-text-animated' }, 
                  'Congratulations on completing your technical interview!'
                ),
                React.createElement('button', {
                  className: 'btn btn--primary bounce-on-hover',
                  onClick: resetInterview
                }, '🔄 Start New Interview')
              )
            )
          )
        )
      ) : (
        // Interviewer Tab
        React.createElement('div', null,
          React.createElement('div', { className: 'dashboard-header' },
            React.createElement('h2', { className: 'gradient-text-animated' }, '👨‍💼 Candidate Dashboard'),
            React.createElement('div', { className: 'search-controls' },
              React.createElement('input', {
                type: 'text',
                className: 'form-control',
                placeholder: '🔍 Search candidates...',
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value)
              }),
              React.createElement('select', {
                className: 'form-control',
                value: sortBy,
                onChange: (e) => setSortBy(e.target.value)
              },
                React.createElement('option', { value: 'score' }, '📊 Sort by Score'),
                React.createElement('option', { value: 'name' }, '👤 Sort by Name'),
                React.createElement('option', { value: 'date' }, '📅 Sort by Date')
              )
            )
          ),
          React.createElement('div', { className: 'candidates-table' },
            sortedCandidates.length > 0 ? (
              React.createElement('table', { className: 'table' },
                React.createElement('thead', null,
                  React.createElement('tr', null,
                    React.createElement('th', null, '👤 Name'),
                    React.createElement('th', null, '📧 Email'),
                    React.createElement('th', null, '📊 Score'),
                    React.createElement('th', null, '📈 Status'),
                    React.createElement('th', null, '📅 Date')
                  )
                ),
                React.createElement('tbody', null,
                  sortedCandidates.map(candidate =>
                    React.createElement('tr', {
                      key: candidate.id,
                      onClick: () => showCandidateDetails(candidate),
                      className: 'bounce-on-hover'
                    },
                      React.createElement('td', null, 
                        React.createElement('strong', null, candidate.name)
                      ),
                      React.createElement('td', null, candidate.email),
                      React.createElement('td', null,
                        React.createElement('div', {
                          className: `score-badge ${getScoreClass(candidate.totalScore)}`
                        }, candidate.totalScore)
                      ),
                      React.createElement('td', null,
                        React.createElement('span', {
                          className: `status ${candidate.status === 'completed' ? 'status--success' : 'status--info'}`
                        }, candidate.status === 'completed' ? '✅ Completed' : '⏳ In Progress')
                      ),
                      React.createElement('td', null, new Date(candidate.interviewDate).toLocaleDateString())
                    )
                  )
                )
              )
            ) : (
              React.createElement('div', { className: 'empty-state' },
                React.createElement('h3', null, 'No candidates found'),
                React.createElement('p', null, 'Start conducting interviews to see candidate results here!')
              )
            )
          )
        )
      )
    ),

    // Candidate Detail Modal Content
    selectedCandidate && ReactDOM.createPortal(
      React.createElement('div', { className: 'modal-body' },
        React.createElement('div', { className: 'candidate-profile' },
          React.createElement('div', { className: 'profile-item' },
            React.createElement('div', { className: 'profile-label' }, '👤 Name'),
            React.createElement('div', { className: 'profile-value' }, selectedCandidate.name)
          ),
          React.createElement('div', { className: 'profile-item' },
            React.createElement('div', { className: 'profile-label' }, '📧 Email'),
            React.createElement('div', { className: 'profile-value' }, selectedCandidate.email)
          ),
          React.createElement('div', { className: 'profile-item' },
            React.createElement('div', { className: 'profile-label' }, '📱 Phone'),
            React.createElement('div', { className: 'profile-value' }, selectedCandidate.phone || 'N/A')
          ),
          React.createElement('div', { className: 'profile-item' },
            React.createElement('div', { className: 'profile-label' }, '📊 Final Score'),
            React.createElement('div', { className: 'profile-value' }, `${selectedCandidate.totalScore}%`)
          ),
          React.createElement('div', { className: 'profile-item' },
            React.createElement('div', { className: 'profile-label' }, '📅 Interview Date'),
            React.createElement('div', { className: 'profile-value' }, new Date(selectedCandidate.interviewDate).toLocaleDateString())
          ),
          React.createElement('div', { className: 'profile-item' },
            React.createElement('div', { className: 'profile-label' }, '⏱️ Total Time'),
            React.createElement('div', { className: 'profile-value' }, selectedCandidate.totalTime ? `${Math.floor(selectedCandidate.totalTime / 60)}m ${selectedCandidate.totalTime % 60}s` : 'N/A')
          )
        ),
        React.createElement('h4', null, '🤖 AI Performance Analysis'),
        React.createElement('div', { className: 'summary-card' },
          React.createElement('p', null, selectedCandidate.aiSummary)
        ),
        React.createElement('h4', null, '📝 Interview Questions & Responses'),
        selectedCandidate.answers && selectedCandidate.answers.length > 0 ? 
        selectedCandidate.answers.map((answer, index) => {
          const question = allQuestions.find(q => q.id === answer.questionId);
          const difficultyEmoji = question?.difficulty === 'easy' ? '🟢' : 
                                 question?.difficulty === 'medium' ? '🟡' : '🔴';
          return React.createElement('div', {
            key: answer.questionId,
            className: 'question-answer-pair'
          },
            React.createElement('div', { className: 'question-header' },
              React.createElement('div', { className: 'question-text' },
                `${difficultyEmoji} Q${index + 1}: ${question ? question.question : 'Question not found'}`
              ),
              React.createElement('div', { className: 'question-meta' },
                React.createElement('span', null, `${answer.score}%`),
                React.createElement('span', null, `${answer.timeSpent}s`)
              )
            ),
            React.createElement('div', { className: 'answer-text' }, 
              answer.answer === 'No answer provided' ? 
              React.createElement('em', { style: { color: '#888' } }, '⏰ No answer provided (time expired)') :
              answer.answer
            )
          );
        }) : React.createElement('div', { className: 'empty-state' },
          React.createElement('p', null, '📝 No detailed responses available for this candidate.')
        )
      ),
      document.getElementById('candidate-details')
    )
  );
}

// Render the app
ReactDOM.render(React.createElement(App), document.getElementById('root'));