import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ChatInput from './components/ChatInput';

function setup() {
  const utils = render(<ChatInput 
    input="" 
    isWaiting={false} 
    onInputChange={() => {}} 
    onSendMessage={() => {}} 
    sendAudioChunk={() => {}} 
    onSendEmail={() => {}} 
  />);
  const inputElement = utils.getByLabelText(/Type your message here.../i);
  const sendButton = utils.getByText(/send/i);
  const emailButton = () => utils.queryByText(/email/i); // Use a function to query dynamically after updates
  return {
    inputElement,
    sendButton,
    emailButton,
    ...utils,
  };
}

test('send button activates after user input and enables email button upon message sending', async () => {
  const { inputElement, sendButton, emailButton } = setup();

  // Simulate user input
  fireEvent.change(inputElement, { target: { value: 'Hello, World!' } });
  
  // Simulate sending a message
  fireEvent.click(sendButton);
  
  // Wait for the "Email" button to appear
  await waitFor(() => {
    expect(emailButton()).toBeInTheDocument();
  });
});
