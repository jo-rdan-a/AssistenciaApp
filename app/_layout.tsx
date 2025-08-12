import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { ThemeProvider } from '../contexts/ThemeContext';

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="src/adminDashboard" />
        <Stack.Screen name="src/loginScreen" />
        <Stack.Screen name="src/cadastroScreen" />
        <Stack.Screen name="src/recuperarSenhaScreen" />
        <Stack.Screen name="src/agendamentoScreen" />
        <Stack.Screen name="src/entradaScreen" />
        <Stack.Screen name="src/saidaScreen" />
        <Stack.Screen name="src/atendimentoScreen" />
        <Stack.Screen name="src/orcamentoScreen" />
        <Stack.Screen name="src/clientesScreen" />
        <Stack.Screen name="src/perfilScreen" />
        <Stack.Screen name="src/configuracoesScreen" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
