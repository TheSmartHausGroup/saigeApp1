// Import statements to include necessary libraries and components.
import React, { useState, useRef } from 'react'; // React library hooks for managing state and references.
import { TextField, Button, Grid, Tooltip, CircularProgress } from '@mui/material'; // UI components from Material UI.
import SendIcon from '@mui/icons-material/Send'; // Icon for the send message button.
import MicIcon from '@mui/icons-material/Mic'; // Icon for the start recording button.
import StopIcon from '@mui/icons-material/Stop'; // Icon for the stop recording button.
import EmailIcon from '@mui/icons-material/Email'; // Icon for the email button.
import { Theme } from '../components/colorScheme'; // Theme interface for applying custom styles.

// Defining the props that the ChatInput component will accept.
interface ChatInputProps {
  onSendMessage: (message: string, audioBlob?: Blob) => void; // Function to handle text message sending.
  onSendAudioChunk: (audioChunk: Blob) => void; // Function to handle sending audio chunks as they are recorded.
  isWaiting: boolean; // Indicates whether the app is currently processing a request.
  onSendEmail: () => void; // Function to handle sending the conversation via email.
  theme: Theme; // Theme object for styling components according to a selected theme.
}

// The ChatInput functional component definition.
const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, onSendAudioChunk, isWaiting, onSendEmail, theme }) => {
  const [input, setInput] = useState(''); // State for storing the current value of the text input.
  const [isRecording, setIsRecording] = useState(false); // State to track whether audio recording is in progress.
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); // Ref to hold the MediaRecorder instance for audio recording.

  // Function to handle sending a text message.
  const handleSendMessage = () => {
    if (input.trim()) { // Checks if the input is not empty or whitespace.
      onSendMessage(input); // Calls the onSendMessage function with the input text.
      setInput(''); // Resets the text input to be empty after sending.
    }
  };

  // Function to initiate audio recording.
  const handleStartRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) { // Checks if the browser supports audio recording.
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); // Requests access to the user's microphone.
        mediaRecorderRef.current = new MediaRecorder(stream); // Creates a new MediaRecorder object with the obtained audio stream.

        // Event handler for when audio data is available.
        mediaRecorderRef.current.ondataavailable = event => {
          if (event.data.size > 0) {
            onSendAudioChunk(event.data); // Sends each audio chunk to the onSendAudioChunk function.
          }
        };

        mediaRecorderRef.current.start(250); // Starts recording, with a timeslice of 250ms to ensure chunks are emitted regularly.

        setIsRecording(true); // Sets the recording state to true, indicating recording has started.
      } catch (error) {
        console.error('Audio recording error:', error); // Logs any errors that occur during recording setup.
      }
    } else {
      console.error('Audio recording not supported in this browser.'); // Logs if audio recording is not supported in the user's browser.
    }
  };

  // Function to stop audio recording.
  const handleStopRecording = () => {
    if (mediaRecorderRef.current) { // Checks if there is an existing MediaRecorder instance.
      mediaRecorderRef.current.stop(); // Stops the recording.
      setIsRecording(false); // Sets the recording state to false, indicating recording has stopped.
    }
  };

  // JSX to render the chat input UI.
  return (
    <div className="chatInputContainer" style={{ backgroundColor: theme.chatInputBgColor, color: theme.textColor }}>
      {/* Grid container for layout. */}
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        {/* Grid item for the text input field. */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Type your message here..."
            variant="outlined"
            multiline
            minRows={1}
            maxRows={5}
            value={input}
            onChange={(e) => setInput(e.target.value)} // Updates the input state as the user types.
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { // Triggers send on Enter key (excluding when Shift is held for newlines).
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isWaiting || isRecording} // Disables the text field when waiting for a response or during recording.
            className="chat-text-input"
            InputProps={{
              style: {
                height: '40px', 
                padding: '5px 10px',
              },
            }}
          />
        </Grid>
        {/* Grid item for action buttons (send, record, email). */}
        <Grid item>
          <Button variant="contained" startIcon={<SendIcon />} onClick={handleSendMessage} disabled={isWaiting || isRecording || !input.trim()}>Send</Button>
          <Button variant="contained" startIcon={isRecording ? <StopIcon /> : <MicIcon />} onClick={isRecording ? handleStopRecording : handleStartRecording} disabled={isWaiting}> {isRecording ? 'Stop' : 'Start'} </Button>
          <Tooltip title="Email conversation">
            <Button variant="contained" startIcon={<EmailIcon />} onClick={onSendEmail} disabled={isWaiting}>Email</Button>
          </Tooltip>
          {isWaiting && <CircularProgress />} {/* Shows a loading spinner if waiting for a process to complete. */}
        </Grid>
      </Grid>
    </div>
  );
};

export default ChatInput; // Exports the ChatInput component for use in other parts of the app.
