// setupTests.ts
import '@testing-library/jest-dom';

class MockAudioContext {
  createOscillator() {
    // Mock implementation or empty function
  }
  // Add other methods you might use
}

// Mock for AudioContext
global.AudioContext = MockAudioContext as any;

// Define a mock for MediaRecorder including the isTypeSupported static method
const mockMediaRecorder = jest.fn().mockImplementation(() => ({
  start: jest.fn(),
  stop: jest.fn(),
  // Mock other methods as needed
}));

// Directly assign isTypeSupported to the mock function object
// TypeScript recognizes this addition as a property on the function object itself
(mockMediaRecorder as any).isTypeSupported = jest.fn(() => true);

// Assign the mock to global.MediaRecorder
global.MediaRecorder = mockMediaRecorder as any;

// Add any other global setups here (e.g., global.fetch mock)
