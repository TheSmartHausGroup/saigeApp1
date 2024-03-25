// setupTests.ts
import '@testing-library/jest-dom';

class MockAudioContext {
    createOscillator() {
      // Mock implementation or empty function
    }
    createMediaStreamSource() {
      // Mock implementation or return a dummy object as needed
      return {};
    }
    createAnalyser() {
      // Mock implementation for createAnalyser
      return {
        // Add mock implementations for any methods you use on the analyser
        fftSize: 2048,
        getByteTimeDomainData: jest.fn(),
        // Continue mocking as necessary
      };
    }
  }
  
// Mock for AudioContext
global.AudioContext = MockAudioContext as any;

// Define a mock for MediaRecorder including the isTypeSupported static method
const mockMediaRecorder = jest.fn().mockImplementation(() => ({
    start: jest.fn(() => console.log("start called")),
    stop: jest.fn(() => console.log("stop called")),
  }));
  

// Directly assign isTypeSupported to the mock function object
(mockMediaRecorder as any).isTypeSupported = jest.fn(() => true);

// Assign the mock to global.MediaRecorder
global.MediaRecorder = mockMediaRecorder as any;

// Add any other global setups here (e.g., global.fetch mock)
