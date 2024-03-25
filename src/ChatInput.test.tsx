// ChatInput.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ChatInput from './components/ChatInput'; // Adjust the import path as needed

// Define your initial props based on ChatInput's expected prop types
const initialProps = {
  input: '',
  isWaiting: false,
  onInputChange: jest.fn(),
  onSendMessage: jest.fn(),
  sendAudioChunk: jest.fn(),
  onSendEmail: jest.fn(),
};

function setup(props = {}) {
  const utils = render(<ChatInput {...initialProps} {...props} />);
  const inputElement = utils.getByLabelText(/Type your message here.../i);
  const sendButton = utils.getByText(/send/i);
  const startButton = utils.getByText(/start/i);
  const stopButton = utils.getByText(/stop/i);
  const emailButton = utils.getByText(/email/i);
  return {
    inputElement,
    sendButton,
    startButton,
    stopButton,
    emailButton,
    ...utils,
  };
}

test('send button becomes active when user types in the text input box', () => {
  const { inputElement, sendButton } = setup({ input: 'Hello, world!' });
  fireEvent.change(inputElement, { target: { value: 'Hello, world!' } });
  expect(sendButton).not.toBeDisabled(); // Adjust based on how you check for button's enabled/disabled state
});

test('stop button becomes active when the start button is clicked', () => {
  const { startButton, stopButton } = setup();
  fireEvent.click(startButton);
  expect(stopButton).not.toBeDisabled(); // Adjust based on how you check for button's enabled/disabled state
});

test('email button becomes active after messages begin', () => {
  const { inputElement, sendButton, emailButton } = setup({ input: 'Hello, world!' });
  fireEvent.change(inputElement, { target: { value: 'Hello, world!' } });
  fireEvent.click(sendButton);
  expect(emailButton).not.toBeDisabled(); // Adjust based on how you check for button's enabled/disabled state
});
