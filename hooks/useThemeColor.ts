/**
 * Hook personalizado para obter cores com base no tema atual e na cor primária personalizada
 */

import { Colors, generateColors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useTheme } from '@/contexts/ThemeContext';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const systemTheme = useColorScheme() ?? 'light';
  const { isDarkMode, primaryColor } = useTheme();
  
  // Determina o tema atual com base na preferência do usuário ou no tema do sistema
  const theme = isDarkMode ? 'dark' : 'light';
  
  // Gera as cores com base na cor primária personalizada
  const themeColors = generateColors(primaryColor);
  
  // Verifica se há uma cor específica nos props
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return themeColors[theme][colorName];
  }
}
