// jest.setup.js

// Mock for AudioContext
class MockAudioContext {
    // Implement necessary methods as empty functions or mocks
    createOscillator() {}
    // Add more methods as needed
  }
  
  // Define the global mock
  global.AudioContext = MockAudioContext;
  