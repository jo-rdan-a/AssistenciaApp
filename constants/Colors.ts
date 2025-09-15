/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * The primary color can be customized by the user through the ThemeContext.
 */

// Função para gerar as cores do tema com base na cor primária
export const generateColors = (primaryColor: string) => {
  return {
    light: {
      text: '#11181C',
      background: '#fff',
      tint: primaryColor,
      primary: primaryColor,
      icon: '#687076',
      tabIconDefault: '#687076',
      tabIconSelected: primaryColor,
      gray: '#8C9AB0',
      lightGray: '#F3F3F3',
      white: '#FFFFFF',
    },
    dark: {
      text: '#ECEDEE',
      background: '#151718',
      tint: '#fff',
      primary: primaryColor,
      icon: '#9BA1A6',
      tabIconDefault: '#9BA1A6',
      tabIconSelected: '#fff',
      gray: '#8C9AB0',
      lightGray: '#2A2D2E',
      white: '#1E1E1E',
    },
  };
};

// Cores padrão (serão substituídas pelo ThemeContext)
export const Colors = generateColors('#3466F6');
