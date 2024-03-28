import React, { useState, useRef, useEffect } from 'react';
import { TextField, Button, Grid, Tooltip, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import EmailIcon from '@mui/icons-material/Email';
import { Theme } from '../components/colorScheme';

const silenceThreshold = 0.02; // Threshold for considering silence, adjust as needed
const silenceTime = 3000; // 3 seconds of silence before stopping

interface ChatInputProps {
  onSendMessage: (message: string, audioBlob?: Blob) => void;
  onSendAudioChunk: (audioChunk: Blob) => void;
  isWaiting: boolean;
  onSendEmail: () => void;
  theme: Theme;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onSendAudioChunk, isWaiting, onSendEmail, theme }) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const silenceDetectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clean up on component unmount
    return () => {
      if (silenceDetectionTimeoutRef.current) {
        clearTimeout(silenceDetectionTimeoutRef.current);
      }
    };
  }, []);

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
        audioContextRef.current = new AudioContext();

        const source = audioContextRef.current.createMediaStreamSource(stream);
        const processor = audioContextRef.current.createScriptProcessor(512, 1, 1);

        source.connect(processor);
        processor.connect(audioContextRef.current.destination);

        processor.onaudioprocess = (event) => {
          const input = event.inputBuffer.getChannelData(0);
          let sum = 0.0;

          for (let i = 0; i < input.length; ++i) {
            sum += input[i] * input[i];
          }
          const volume = Math.sqrt(sum / input.length);

          if (volume < silenceThreshold) {
            if (!silenceDetectionTimeoutRef.current) {
              silenceDetectionTimeoutRef.current = setTimeout(() => {
                handleStopRecording();
              }, silenceTime);
            }
          } else {
            if (silenceDetectionTimeoutRef.current) {
              clearTimeout(silenceDetectionTimeoutRef.current);
              silenceDetectionTimeoutRef.current = null;
            }
          }
        };

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            onSendAudioChunk(event.data);
          }
        };

        mediaRecorderRef.current.start(250);
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

      if (silenceDetectionTimeoutRef.current) {
        clearTimeout(silenceDetectionTimeoutRef.current);
        silenceDetectionTimeoutRef.current = null;
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    }
  };

  return (
    <div className="chatInputContainer" style={{ backgroundColor: theme.chatInputBgColor, color: theme.textColor }}>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Type your message here..."
            variant="outlined"
            multiline
            minRows={1}
            maxRows={5}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isWaiting || isRecording}
            className="chat-text-input"
            InputProps={{
              style: {
                height: '40px', 
                padding: '5px 10px',
              },
            }}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" startIcon={<SendIcon />} onClick={handleSendMessage} disabled={isWaiting || isRecording || !input.trim()}>Send</Button>
          <Button variant="contained" startIcon={isRecording ? <StopIcon /> : <MicIcon />} onClick={isRecording ? handleStopRecording : handleStartRecording} disabled={isWaiting}> {isRecording ? 'Stop' : 'Start'} </Button>
          <Tooltip title="Email conversation">
            <Button variant="contained" startIcon={<EmailIcon />} onClick={onSendEmail} disabled={isWaiting}>Email</Button>
          </Tooltip>
          {isWaiting && <CircularProgress />}
        </Grid>
      </Grid>
    </div>
  );
};

export default ChatInput;
