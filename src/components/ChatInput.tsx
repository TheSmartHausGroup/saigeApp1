import React, { useState, useRef } from 'react';
import { TextField, Button, Grid, Tooltip, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import EmailIcon from '@mui/icons-material/Email';

interface ChatInputProps {
  onSendMessage: (message: string, audioBlob?: Blob) => void;
  isWaiting: boolean;
  onSendEmail: () => void; // Add this line
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isWaiting }) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleSendMessage = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const startRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        let audioChunks: BlobPart[] = [];

        mediaRecorderRef.current.ondataavailable = (e) => {
          audioChunks.push(e.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          onSendMessage('', audioBlob); // Changed undefined to '' for the message argument
          audioChunks = [];
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

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="chatInputContainer">
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="What do you want to do today..."
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
            disabled={isWaiting || isRecording}
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<SendIcon />}
            onClick={handleSendMessage}
            disabled={isWaiting || isRecording || !input.trim()}
          >
            Send
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={isRecording ? <StopIcon /> : <MicIcon />}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isWaiting}
          >
            {isRecording ? 'Stop Talking' : 'Talk to me'}
          </Button>
          <Tooltip title="Email conversation">
            <span>
              <Button variant="contained" startIcon={<EmailIcon />} disabled={true}>
                Email
              </Button>
            </span>
          </Tooltip>
          {isWaiting && <CircularProgress />}
        </Grid>
      </Grid>
    </div>
  );
};

export default ChatInput;
