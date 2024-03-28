import React, { useState, useRef } from 'react';
import { TextField, Button, Grid, Tooltip, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import EmailIcon from '@mui/icons-material/Email';
import { Theme } from '../components/colorScheme'; // Adjust the import path as necessary

interface ChatInputProps {
  onSendMessage: (message: string, audioBlob?: Blob) => void;
  isWaiting: boolean;
  onSendEmail: () => void;
  theme: Theme; // Ensure theme is passed correctly
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isWaiting, onSendEmail, theme }) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleSendMessage = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleStartRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        let audioChunks: BlobPart[] = []; // Initialized outside of any conditional logic
  
        mediaRecorderRef.current.ondataavailable = event => {
          audioChunks.push(event.data);
        };
  
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          onSendMessage('', audioBlob);
          // No need to clear audioChunks here as it's scoped to the function
        };
  
        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Audio recording error:', error);
      }
    } else {
      console.error('Audio recording not supported in this browser.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="chatInputContainer" style={{
      backgroundColor: theme.chatInputBgColor, // Dynamically set the chat input container background
      color: theme.textColor, // Set text color dynamically
    }}>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Type your message here..."
            variant="outlined"
            multiline
            minRows={1} // Ensures it starts with a single row
            maxRows={5} // Allows expansion up to 5 rows as input grows
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault(); // Prevents the default action to avoid inserting a newline
                handleSendMessage(); // Adjust this if your function needs the event or additional parameters
              }
            }}
            disabled={isWaiting || isRecording}
          />
        </Grid>
        <Grid item>
          {/* Apply theme to buttons */}
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={handleSendMessage}
            disabled={isWaiting || isRecording || !input.trim()}
            sx={{ backgroundColor: theme.buttonColor, '&:hover': { backgroundColor: theme.buttonColor } }} // Apply theme color
          >
            Send
          </Button>
          <Button
            variant="contained"
            startIcon={isRecording ? <StopIcon /> : <MicIcon />}
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            disabled={isWaiting}
            sx={{ backgroundColor: theme.buttonColor, '&:hover': { backgroundColor: theme.buttonColor } }} // Apply theme color
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </Button>
          <Tooltip title="Email conversation">
            <Button
              variant="contained"
              startIcon={<EmailIcon />}
              onClick={onSendEmail}
              disabled={isWaiting}
              sx={{ backgroundColor: theme.buttonColor, '&:hover': { backgroundColor: theme.buttonColor } }} // Apply theme color
            >
              Email
            </Button>
          </Tooltip>
          {isWaiting && <CircularProgress />}
        </Grid>
      </Grid>
    </div>
  );
};

export default ChatInput;