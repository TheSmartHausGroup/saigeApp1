// ChatInput.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import ChatInput from './components/ChatInput';

// Mock the MediaRecorder's instance methods and include static isTypeSupported
class MockMediaRecorder {
  start = jest.fn();
  stop = jest.fn();
  addEventListener = jest.fn();
  removeEventListener = jest.fn();
  static isTypeSupported = jest.fn().mockReturnValue(true);
}

beforeAll(() => {
  // Mock getUserMedia
  Object.defineProperty(global.navigator, 'mediaDevices', {
    value: {
      getUserMedia: jest.fn().mockResolvedValue({
        getTracks: () => [{ stop: jest.fn() }],
      }),
    },
    writable: true,
  });

  // Assign our MockMediaRecorder class as a replacement for the global MediaRecorder
  global.MediaRecorder = MockMediaRecorder as any;
});

afterEach(() => {
  jest.clearAllMocks();
});

test('sends a text message when the send button is clicked', () => {
  const sendAudioChunk = jest.fn();
  const onSendMessage = jest.fn();
  const onSendEmail = jest.fn();

  const { getByText } = render(
    <ChatInput
      input="Hello, world!"
      isWaiting={false}
      onInputChange={() => {}}
      onSendMessage={onSendMessage}
      sendAudioChunk={sendAudioChunk}
      onSendEmail={onSendEmail}
    />
  );

  fireEvent.click(getByText(/send/i));
  expect(onSendMessage).toHaveBeenCalled();
});

test('starts recording when the start button is clicked', async () => {
  const sendAudioChunk = jest.fn();
  const onSendMessage = jest.fn();
  const onSendEmail = jest.fn();

  const { getByText } = render(
    <ChatInput
      input=""
      isWaiting={false}
      onInputChange={() => {}}
      onSendMessage={onSendMessage}
      sendAudioChunk={sendAudioChunk}
      onSendEmail={onSendEmail}
    />
  );

  fireEvent.click(getByText(/start/i));

  await waitFor(() => expect(MockMediaRecorder.prototype.start).toHaveBeenCalled());
});

test('stops recording when the stop button is clicked', async () => {
  const sendAudioChunk = jest.fn();
  const onSendMessage = jest.fn();
  const onSendEmail = jest.fn();

  const { getByText } = render(
    <ChatInput
      input=""
      isWaiting={false}
      onInputChange={() => {}}
      onSendMessage={onSendMessage}
      sendAudioChunk={sendAudioChunk}
      onSendEmail={onSendEmail}
    />
  );

  // Assuming recording has been started here
  fireEvent.click(getByText(/start/i));
  fireEvent.click(getByText(/stop/i));

  await waitFor(() => expect(MockMediaRecorder.prototype.stop).toHaveBeenCalled());
});

test('sends email when the email button is clicked', () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true });

  const sendAudioChunk = jest.fn();
  const onSendMessage = jest.fn();
  const onSendEmail = jest.fn();

  const { getByText } = render(
    <ChatInput
      input=""
      isWaiting={false}
      onInputChange={() => {}}
      onSendMessage={onSendMessage}
      sendAudioChunk={sendAudioChunk}
      onSendEmail={onSendEmail}
    />
  );

  fireEvent.click(getByText(/email/i));
  expect(onSendEmail).toHaveBeenCalled();
});
