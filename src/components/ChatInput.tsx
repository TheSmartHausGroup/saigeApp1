import React, { useState, useRef, useEffect } from 'react';
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
  onSendEmail: () => void;
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
  const silenceDetectorRef = useRef<NodeJS.Timeout | null>(null);

  const handleSendMessage = () => {
    if (!isWaiting && input.trim()) {
      onSendMessage();
      setChatInitiated(true);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      let audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        sendAudioChunk(audioBlob);
        audioChunks = [];
      };

      mediaRecorder.start();

      // Detect silence
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      const bufferLength = analyser.fftSize;
      const dataArray = new Uint8Array(bufferLength);

      const checkSilence = () => {
        analyser.getByteTimeDomainData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          const x = dataArray[i] / 128.0 - 1.0;
          sum += x * x;
        }
        const rms = Math.sqrt(sum / bufferLength);
        if (rms < 0.01) { // Threshold for silence
          if (silenceDetectorRef.current === null) {
            silenceDetectorRef.current = setTimeout(() => {
              mediaRecorder.stop();
              audioContext.close();
              setRecording(false);
            }, 3000); // Stop after 3 seconds of silence
          }
        } else {
          clearTimeout(silenceDetectorRef.current!);
          silenceDetectorRef.current = null;
        }
      };

      const intervalId = setInterval(checkSilence, 100); // Check every 100ms

      mediaRecorder.onstop = () => {
        clearInterval(intervalId);
        if (silenceDetectorRef.current) {
          clearTimeout(silenceDetectorRef.current);
        }
        audioContext.close();
      };

      setRecording(true);
      setChatInitiated(true);
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

  // Cleanup effect to ensure no leaks
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && recording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [recording]);

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
