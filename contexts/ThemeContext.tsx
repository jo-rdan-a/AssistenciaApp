import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');
  const [primaryColor, setPrimaryColor] = useState('#3466F6'); // Cor padrão

  // Carrega as preferências salvas
  useEffect(() => {
    const loadThemePreferences = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme_mode');
        const savedColor = await AsyncStorage.getItem('primary_color');
        
        if (savedTheme) {
          setIsDarkMode(savedTheme === 'dark');
        }
        
        if (savedColor) {
          setPrimaryColor(savedColor);
        }
      } catch (error) {
        console.error('Erro ao carregar preferências de tema:', error);
      }
    };
    
    loadThemePreferences();
  }, []);

  // Salva as preferências quando mudam
  useEffect(() => {
    const saveThemePreferences = async () => {
      try {
        await AsyncStorage.setItem('theme_mode', isDarkMode ? 'dark' : 'light');
        await AsyncStorage.setItem('primary_color', primaryColor);
      } catch (error) {
        console.error('Erro ao salvar preferências de tema:', error);
      }
    };
    
    saveThemePreferences();
  }, [isDarkMode, primaryColor]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const value = {
    isDarkMode,
    toggleTheme,
    primaryColor,
    setPrimaryColor,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};