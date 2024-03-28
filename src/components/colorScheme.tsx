export interface Theme {
  name: string;
  backgroundColor: string; // Background color or image URL
  textColor: string; // Default text color
  buttonColor: string; // Default button background color
  userMessageBubbleColor: string; // Background color for the user's message bubbles
  userMessageTextColor: string; // Text color for the user's messages
  saigeMessageBubbleColor: string; // Background color for Saige's (or AI's) message bubbles
  saigeMessageTextColor: string; // Text color for Saige's (or AI's) messages
  chatInputBgColor: string; // Background color for the chat input area
  chatInputTextColor: string; // Text color for the chat input
  navbarBgColor: string; // Background color for the navbar
  navbarTextColor: string; // Text color for the navbar (including welcome message)
  navbarButtonColor: string; // Background color for navbar buttons (e.g., sign out)
  navbarButtonTextColor: string; // Text color for navbar buttons
  isImage: boolean; // Indicates if the background is an image
}

export const colorSchemes = {
  saige: {
    name: "Saige",
    backgroundColor: 'url("https://app-pics103815-dev.s3.amazonaws.com/sAIgeImage")',
    textColor: '#FFFFFF', // White text for contrast on darker backgrounds or images
    buttonColor: '#4CAF50', // Vibrant green for buttons, providing a pop of color
    userMessageBubbleColor: '#0084FF', // Bright blue for the user's message bubbles for easy identification
    userMessageTextColor: '#FFFFFF', // White text within the user's message bubbles for readability
    saigeMessageBubbleColor: '#FFFFFF', // White for Saige's message bubbles, contrasting with the user's
    saigeMessageTextColor: '#4E4E4E', // Dark grey text within Saige's message bubbles for readability
    chatInputBgColor: '#F4F7F6', // Light grey for the chat input area, distinguishing it from the message area
    chatInputTextColor: '#5C5C5C', // Darker grey for text within the chat input for contrast
    navbarBgColor: '#006BFF', // Bright blue for the navbar, standing out from the message area
    navbarTextColor: '#FFFFFF', // White text in the navbar for clarity
    navbarButtonColor: '#FFA500', // Orange for navbar buttons, indicating interactivity
    navbarButtonTextColor: '#FFFFFF', // White text on navbar buttons for visibility
    isImage: true,
  },
  blueGrey: {
    name: "BlueGrey",
    backgroundColor: '#607D8B', // A soothing blue-grey for the background
    textColor: '#FFFFFF', // White text for general readability
    buttonColor: '#546E7A', // Darker blue-grey for buttons, subtly different from the background
    userMessageBubbleColor: '#455A64', // Even darker blue-grey for the user's message bubbles
    userMessageTextColor: '#FFFFFF', // White text within the user's message bubbles
    saigeMessageBubbleColor: '#CFD8DC', // Light blue-grey for Saige's message bubbles, for contrast
    saigeMessageTextColor: '#37474F', // Dark text within Saige's message bubbles
    chatInputBgColor: '#B0BEC5', // Lighter blue-grey for the chat input area
    chatInputTextColor: '#263238', // Nearly black for text within the chat input
    navbarBgColor: '#78909C', // Mid-tone blue-grey for the navbar
    navbarTextColor: '#ECEFF1', // Light grey text in the navbar for contrast
    navbarButtonColor: '#90A4AE', // Light blue-grey for navbar buttons
    navbarButtonTextColor: '#263238', // Dark text on navbar buttons for readability
    isImage: false,
  },
  dark: {
    name: "Dark",
    backgroundColor: '#263238', // Deep, dark grey for a dark theme background
    textColor: '#ECEFF1', // Light grey text for contrast against the dark background
    buttonColor: '#37474F', // Slightly lighter dark grey for buttons
    userMessageBubbleColor: '#546E7A', // Blue-grey for the user's message bubbles
    userMessageTextColor: '#FFFFFF', // White text within the user's message bubbles
    saigeMessageBubbleColor: '#455A64', // Dark blue-grey for Saige's message bubbles, for differentiation
    saigeMessageTextColor: '#CFD8DC', // Light blue-grey text within Saige's message bubbles
    chatInputBgColor: '#37474F', // Matching the button color for the chat input area
    chatInputTextColor: '#ECEFF1', // Light grey text within the chat input for visibility
    navbarBgColor: '#546E7A', // Blue-grey for the navbar, slightly standing out from the main background
    navbarTextColor: '#ECEFF1', // Light grey text in the navbar for readability
    navbarButtonColor: '#455A64', // Dark blue-grey for navbar buttons, maintaining theme consistency
    navbarButtonTextColor: '#ECEFF1', // Light grey text on navbar buttons for clarity
    isImage: false,
  },
  colorful: {
    name: "Colorful",
    backgroundColor: '#F44336', // Bright red for a bold, colorful background
    textColor: '#212121', // Almost black text for stark contrast on the colorful background
    buttonColor: '#FFEB3B', // Vibrant yellow for buttons, adding to the theme's vibrancy
    userMessageBubbleColor: '#4CAF50', // Bright green for the user's message bubbles
    userMessageTextColor: '#FFFFFF', // White text within the user's message bubbles
    saigeMessageBubbleColor: '#2196F3', // Bright blue for Saige's message bubbles, contrasting with the user's
    saigeMessageTextColor: '#FFFFFF', // White text within Saige's message bubbles
    chatInputBgColor: '#FFC107', // Amber for the chat input area, keeping the colorful theme
    chatInputTextColor: '#212121', // Almost black for text within the chat input, ensuring readability
    navbarBgColor: '#673AB7', // Deep purple for the navbar, complementing the colorful theme
    navbarTextColor: '#EDE7F6', // Light purple text in the navbar for a harmonious contrast
    navbarButtonColor: '#3F51B5', // Indigo for navbar buttons, enriching the theme's color palette
    navbarButtonTextColor: '#EDE7F6', // Light purple text on navbar buttons, matching the navbar text color
    isImage: false,
  },
  lightBlue: {
    name: "LightBlue",
    backgroundColor: '#B3E5FC', // Light blue for a soft, airy background
    textColor: '#01579B', // Dark blue text for readable contrast against the light background
    buttonColor: '#03A9F4', // Brighter blue for buttons, standing out against the background
    userMessageBubbleColor: '#81D4FA', // Very light blue for the user's message bubbles, for a subtle differentiation
    userMessageTextColor: '#FFFFFF', // White text within the user's message bubbles
    saigeMessageBubbleColor: '#4FC3F7', // Slightly darker light blue for Saige's message bubbles, for visibility
    saigeMessageTextColor: '#01579B', // Dark blue text within Saige's message bubbles, matching the general text color
    chatInputBgColor: '#E1F5FE', // Very light blue, almost white, for the chat input area, enhancing readability
    chatInputTextColor: '#01579B', // Dark blue for text within the chat input, consistent with the theme's text color
    navbarBgColor: '#29B6F6', // Medium light blue for the navbar, distinguishing it from the main background
    navbarTextColor: '#FFFFFF', // White text in the navbar for clear visibility
    navbarButtonColor: '#4DD0E1', // Cyan for navbar buttons, adding another color to the theme's palette
    navbarButtonTextColor: '#01579B', // Dark blue text on navbar buttons, ensuring readability
    isImage: false,
  }
};

export type ThemeName = keyof typeof colorSchemes;

export const defaultTheme = colorSchemes.saige; // Sets Saige as the default theme
