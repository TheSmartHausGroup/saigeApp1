import React, { useState, useRef } from 'react'; // Imports React, useState hook for state management, useRef hook for accessing DOM elements.
import { TextField, Button, Grid, Tooltip, CircularProgress } from '@mui/material'; // Imports components from Material-UI for UI design.
import SendIcon from '@mui/icons-material/Send'; // Import send icon for the send button.
import MicIcon from '@mui/icons-material/Mic'; // Import microphone icon for the start recording button.
import StopIcon from '@mui/icons-material/Stop'; // Import stop icon for the stop recording button.
import EmailIcon from '@mui/icons-material/Email'; // Import email icon for the email button.
import { Theme } from '../components/colorScheme'; // Adjust the import path as necessary to import the Theme interface for theme styling.

// Defines the props for ChatInput component, including functions for sending messages and emails, a boolean indicating if the app is waiting for an operation to complete, and the theme for styling.
interface ChatInputProps {
  onSendMessage: (message: string, audioBlob?: Blob) => void; // Function to call when a message or audio is sent.
  isWaiting: boolean; // Indicates if the app is waiting for an operation (like sending a message) to complete.
  onSendEmail: () => void; // Function to call when sending an email.
  theme: Theme; // Theme object for applying styles.
}

// Functional component definition accepting props defined in ChatInputProps.
const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isWaiting, onSendEmail, theme }) => {
  const [input, setInput] = useState(''); // State for storing the input field's text value.
  const [isRecording, setIsRecording] = useState(false); // State to track whether audio recording is in progress.
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); // Ref for accessing the MediaRecorder instance.

  // Handler function for sending the message. Clears the input field upon sending.
  const handleSendMessage = () => {
    if (input.trim()) { // Checks if the input is not just whitespace.
      onSendMessage(input); // Calls the onSendMessage prop function with the input text.
      setInput(''); // Resets the input field to empty.
    }
  };

  // Handler function for starting the audio recording.
  const handleStartRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) { // Checks if the browser supports audio recording.
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); // Requests access to the microphone.
        mediaRecorderRef.current = new MediaRecorder(stream); // Creates a new MediaRecorder instance with the audio stream.
        let audioChunks: BlobPart[] = []; // Initializes an array to store audio chunks.

        mediaRecorderRef.current.ondataavailable = event => {
          audioChunks.push(event.data); // Collects audio data chunks as they become available.
        };
  
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' }); // Creates a Blob from the audio chunks when recording stops.
          onSendMessage('', audioBlob); // Calls the onSendMessage prop function with the audio blob.
        };
  
        mediaRecorderRef.current.start(); // Starts recording.
        setIsRecording(true); // Sets isRecording state to true.
      } catch (error) {
        console.error('Audio recording error:', error); // Logs any errors that occur during recording setup.
      }
    } else {
      console.error('Audio recording not supported in this browser.'); // Logs if audio recording is not supported.
    }
  };

  // Handler function for stopping the audio recording.
  const handleStopRecording = () => {
    if (mediaRecorderRef.current) { // Checks if there is a MediaRecorder instance.
      mediaRecorderRef.current.stop(); // Stops the recording.
      setIsRecording(false); // Sets isRecording state to false.
    }
  };

  // JSX for the chat input UI.
  return (
    <div className="chatInputContainer" style={{
      backgroundColor: theme.chatInputBgColor, // Applies the background color from the theme to the chat input container.
      color: theme.textColor, // Applies the text color from the theme.
    }}>
      <Grid container spacing={2} justifyContent="center" alignItems="center"> {/* Uses Material-UI Grid for layout. */}
        <Grid item xs={12}>
          <TextField
            fullWidth // Makes the TextField take up the full width of its container.
            label="Type your message here..." // Placeholder text for the input field.
            variant="outlined" // Style of the TextField border.
            multiline // Allows multiple lines of input.
            minRows={1} // Starts with a single row of input.
            maxRows={5} // Allows the input field to expand up to 5 rows as more text is entered.
            value={input} // Binds the input state to the TextField value.
            onChange={(e) => setInput(e.target.value)} // Updates the input state as the user types.
            onKeyDown={(e) => { // Triggers when a key is pressed in the input field.
              if (e.key === 'Enter' && !e.shiftKey) { // Checks if the Enter key is pressed without the Shift key.
                e.preventDefault(); // Prevents the default Enter key action (submitting a form or inserting a newline).
                handleSendMessage(); // Calls the handleSendMessage function.
              }
            }}
            disabled={isWaiting || isRecording} // Disables the input field if the app is waiting or recording.
          />
        </Grid>
        <Grid item>
          {/* Send button with an icon. Disabled if the app is waiting, recording, or the input is empty. */}
          <Button
            variant="contained" // Filled button style.
            startIcon={<SendIcon />} // Icon displayed at the start of the button.
            onClick={handleSendMessage} // Calls the handleSendMessage function when clicked.
            disabled={isWaiting || isRecording || !input.trim()} // Disables the button based on the specified conditions.
            sx={{ backgroundColor: theme.buttonColor, '&:hover': { backgroundColor: theme.buttonColor } }} // Applies the button color from the theme and ensures it remains the same on hover.
          >
            Send
          </Button>
          {/* Button to start or stop recording, with the icon and action changing based on whether recording is in progress. */}
          <Button
            variant="contained" // Filled button style.
            startIcon={isRecording ? <StopIcon /> : <MicIcon />} // Changes the icon based on the isRecording state.
            onClick={isRecording ? handleStopRecording : handleStartRecording} // Toggles between starting and stopping recording.
            disabled={isWaiting} // Disables the button if the app is waiting for an operation to complete.
            sx={{ backgroundColor: theme.buttonColor, '&:hover': { backgroundColor: theme.buttonColor } }} // Applies the button color from the theme.
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'} {/*} Changes the button text based on the isRecording state.*/}
          </Button>
          {/* Tooltip wrapping an Email button, providing additional information on hover. */}
          <Tooltip title="Email conversation">
            <Button
              variant="contained" // Filled button style.
              startIcon={<EmailIcon />} // Email icon displayed at the start of the button.
              onClick={onSendEmail} // Calls the onSendEmail prop function when clicked.
              disabled={isWaiting} // Disables the button if the app is waiting for an operation to complete.
              sx={{ backgroundColor: theme.buttonColor, '&:hover': { backgroundColor: theme.buttonColor } }} // Applies the button color from the theme.
            >
              Email
            </Button>
          </Tooltip>
          {isWaiting && <CircularProgress />} {/* Shows a loading spinner if the app is waiting for an operation to complete. */}
        </Grid>
      </Grid>
    </div>
  );
};

export default ChatInput; // Exports the ChatInput component for use in other parts of the app.
