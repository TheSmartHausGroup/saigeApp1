import React, { useState, useRef } from 'react';
import { Grid, TextField, Button, CircularProgress, Tooltip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import EmailIcon from '@mui/icons-material/Email';

interface ChatInputProps {
  input: string;
  isWaiting: boolean;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
  sendAudioChunk: (audioBlob: Blob) => void;
  onSendEmail: () => void; // Function to handle sending the conversation via email
}

const ChatInput: React.FC<ChatInputProps> = ({
  input,
  isWaiting,
  onInputChange,
  onSendMessage,
  sendAudioChunk,
  onSendEmail,
}) => {
  const [recording, setRecording] = useState(false);
  const [chatInitiated, setChatInitiated] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleSendMessage = () => {
    if (!isWaiting && input.trim()) {
      onSendMessage(); // Calls the onSendMessage function passed as a prop
      setChatInitiated(true); // Mark the chat as initiated once a message is sent
      // No need to call setInput("") here as it should be handled in Chat component
    }
  };


  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          sendAudioChunk(event.data);
        }
      };
      mediaRecorderRef.current.start(1000); // Emit audio chunks every 1 second
      setRecording(true);
      setChatInitiated(true); // Also mark the chat as initiated when recording starts
    } catch (err) {
      console.error('Error starting audio recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  
  // Reset input field state function omitted for brevity

  return (
    <div className="chatInputContainer">
      <Grid container direction="column" spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12} style={{ width: '75%' }}>
          <TextField
            fullWidth
            label="Type your message here..."
            variant="outlined"
            value={input}
            onChange={onInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            sx={{ '& .MuiInputBase-input': { backgroundColor: '#eaeaea' } }}
          />
        </Grid>
          <Grid item container spacing={1} justifyContent="center" alignItems="center">
            <Tooltip title="Send your message">
                <span> {/* Tooltip children need to be able to hold a ref */}
                <Button 
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={handleSendMessage} 
                    disabled={isWaiting || !input.trim() || recording}
                    sx={{
                    color: 'white',
                    backgroundColor: isWaiting || !input.trim() || recording ? '#bdbdbd' : '#1976d2',
                    '&:disabled': {
                        border: '1px solid #cccccc', // Slight border for disabled state
                    },
                    }}>
                    Send
                </Button>
                </span>
            </Tooltip>
            <Tooltip title="Start recording">
                <span>
                <Button 
                    variant="contained" 
                    startIcon={<MicIcon />}
                    onClick={startRecording} 
                    disabled={recording || isWaiting}
                    sx={{
                    color: 'white',
                    backgroundColor: recording || isWaiting ? '#bdbdbd' : '#1976d2',
                    '&:disabled': {
                        border: '1px solid #cccccc',
                    },
                    }}>
                    Start
                </Button>
                </span>
            </Tooltip>
            <Tooltip title="Stop recording">
                <span>
                <Button 
                    variant="contained" 
                    startIcon={<StopIcon />}
                    onClick={stopRecording} 
                    disabled={!recording || isWaiting}
                    sx={{
                    color: 'white',
                    backgroundColor: !recording || isWaiting ? '#bdbdbd' : '#1976d2',
                    '&:disabled': {
                        border: '1px solid #cccccc',
                    },
                    }}>
                    Stop
                </Button>
                </span>
            </Tooltip>
            {chatInitiated && (
                <Tooltip title="Email conversation">
                    <span> {/* Ensure Tooltip works for disabled buttons */}
                        <Button 
                        variant="contained" 
                        startIcon={<EmailIcon />}
                        onClick={onSendEmail} 
                        disabled={isWaiting || recording}
                        sx={{
                            color: 'white',
                            backgroundColor: isWaiting || recording ? '#bdbdbd' : '#4caf50', // Use a distinct color when active
                            '&:disabled': {
                            opacity: 0.5, // Make disabled state clearer
                            border: '1px dashed #cccccc', // Use dashed border for differentiation
                            },
                            transition: 'background-color 0.3s ease', // Smooth transition for background color
                        }}>
                        Email
                        </Button>
                    </span>
                    </Tooltip>
            )}
            {isWaiting && <CircularProgress />}
            </Grid>
      </Grid>
    </div>
  );
};

export default ChatInput;
