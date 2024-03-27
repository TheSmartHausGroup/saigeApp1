// Defining the interface for a theme
export interface Theme {
  name: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  messageBubbleColor: string;
  chatInputBgColor: string;
  isImage: boolean;
}

export const colorSchemes = {
    saige: {
      name: "Saige",
      backgroundColor: 'url("https://app-pics103815-dev.s3.amazonaws.com/sAIgeImage")',
      textColor: '#FFFFFF',
      buttonColor: '#4CAF50',
      messageBubbleColor: '#0084FF',
      chatInputBgColor: '#FFFFFF',
      isImage: true,
    },
    blueGrey: {
      name: "BlueGrey",
      backgroundColor: '#607D8B',
      textColor: '#FFFFFF',
      buttonColor: '#546E7A',
      messageBubbleColor: '#455A64',
      chatInputBgColor: '#CFD8DC',
      isImage: false,
    },
    dark: {
      name: "Dark",
      backgroundColor: '#263238',
      textColor: '#ECEFF1',
      buttonColor: '#37474F',
      messageBubbleColor: '#546E7A',
      chatInputBgColor: '#455A64',
      isImage: false,
    },
    colorful: {
      name: "Colorful",
      backgroundColor: '#F44336',
      textColor: '#212121',
      buttonColor: '#FFEB3B',
      messageBubbleColor: '#4CAF50',
      chatInputBgColor: '#2196F3',
      isImage: false,
    },
    lightBlue: {
      name: "LightBlue",
      backgroundColor: '#B3E5FC',
      textColor: '#01579B',
      buttonColor: '#03A9F4',
      messageBubbleColor: '#81D4FA',
      chatInputBgColor: '#4FC3F7',
      isImage: false,
    }
  };

  export type ThemeName = keyof typeof colorSchemes;

  export const defaultTheme = colorSchemes.saige; // Default theme
