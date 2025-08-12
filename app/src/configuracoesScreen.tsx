import Icon from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import colors from './styles/colors';

// Cores disponíveis para personalização
const coresPrimarias = [
  { nome: 'Azul', valor: '#3466F6' },
  { nome: 'Verde', valor: '#4CAF50' },
  { nome: 'Vermelho', valor: '#F44336' },
  { nome: 'Roxo', valor: '#9C27B0' },
  { nome: 'Laranja', valor: '#FF9800' },
  { nome: 'Rosa', valor: '#E91E63' },
];

export default function ConfiguracoesScreen() {
  const systemColorScheme = useColorScheme();
  const { isDarkMode, toggleTheme, primaryColor, setPrimaryColor } = useTheme();
  const [notificacoesAtivadas, setNotificacoesAtivadas] = useState(true);

  // Alterna entre tema claro e escuro usando o contexto
  const alternarTema = () => {
    toggleTheme();
    Alert.alert('Tema alterado', `Tema ${!isDarkMode ? 'escuro' : 'claro'} ativado`);
  };

  // Altera a cor primária usando o contexto
  const alterarCorPrimaria = (novaCor: string) => {
    setPrimaryColor(novaCor);
    Alert.alert('Cor alterada', 'Cor primária alterada com sucesso');
  };

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={primaryColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: primaryColor }, isDarkMode && styles.textDark]}>Configurações</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView>
        <View style={[styles.section, isDarkMode && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>Aparência</Text>
          
          <View style={[styles.optionRow, isDarkMode && styles.optionRowDark]}>
            <View style={styles.optionInfo}>
              <Icon name="dark-mode" size={24} color={primaryColor} style={styles.optionIcon} />
              <Text style={[styles.optionText, isDarkMode && styles.textDark]}>Tema Escuro</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={alternarTema}
              trackColor={{ false: '#767577', true: `${primaryColor}80` }}
              thumbColor={isDarkMode ? primaryColor : '#f4f3f4'}
            />
          </View>

          <Text style={[styles.colorTitle, isDarkMode && styles.textDark]}>Cor Primária</Text>
          <View style={styles.colorsContainer}>
            {coresPrimarias.map((cor) => (
              <TouchableOpacity
                key={cor.valor}
                style={[
                  styles.colorOption,
                  { backgroundColor: cor.valor },
                  primaryColor === cor.valor && styles.selectedColor,
                ]}
                onPress={() => alterarCorPrimaria(cor.valor)}
              >
                {primaryColor === cor.valor && (
                  <Icon name="check" size={16} color="white" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.section, isDarkMode && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>Notificações</Text>
          
          <View style={[styles.optionRow, isDarkMode && styles.optionRowDark]}>
            <View style={styles.optionInfo}>
              <Icon name="notifications" size={24} color={primaryColor} style={styles.optionIcon} />
              <Text style={[styles.optionText, isDarkMode && styles.textDark]}>Notificações Push</Text>
            </View>
            <Switch
              value={notificacoesAtivadas}
              onValueChange={setNotificacoesAtivadas}
              trackColor={{ false: '#767577', true: `${primaryColor}80` }}
              thumbColor={notificacoesAtivadas ? primaryColor : '#f4f3f4'}
            />
          </View>
        </View>

        <View style={[styles.section, isDarkMode && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>Sobre</Text>
          
          <TouchableOpacity style={[styles.aboutOption, isDarkMode && styles.aboutOptionDark]}>
            <Icon name="info" size={24} color={primaryColor} style={styles.optionIcon} />
            <Text style={[styles.optionText, isDarkMode && styles.textDark]}>Versão do Aplicativo</Text>
            <Text style={[styles.versionText, isDarkMode && styles.versionTextDark]}>1.0.0</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.aboutOption, isDarkMode && styles.aboutOptionDark]}>
            <Icon name="description" size={24} color={primaryColor} style={styles.optionIcon} />
            <Text style={[styles.optionText, isDarkMode && styles.textDark]}>Termos de Uso</Text>
            <Icon name="chevron-right" size={24} color={isDarkMode ? '#aaa' : colors.gray} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.aboutOption, isDarkMode && styles.aboutOptionDark]}>
            <Icon name="privacy-tip" size={24} color={primaryColor} style={styles.optionIcon} />
            <Text style={[styles.optionText, isDarkMode && styles.textDark]}>Política de Privacidade</Text>
            <Icon name="chevron-right" size={24} color={isDarkMode ? '#aaa' : colors.gray} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: colors.white,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerDark: {
    backgroundColor: '#1e1e1e',
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: 8,
    margin: 16,
    marginBottom: 8,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionDark: {
    backgroundColor: '#1e1e1e',
    shadowOpacity: 0.3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  optionRowDark: {
    borderBottomColor: '#333',
  },
  optionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  textDark: {
    color: '#f5f5f5',
  },
  colorTitle: {
    fontSize: 16,
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
  },
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: '#333',
  },
  aboutOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  aboutOptionDark: {
    borderBottomColor: '#333',
  },
  versionText: {
    marginLeft: 'auto',
    fontSize: 14,
    color: colors.gray,
  },
  versionTextDark: {
    color: '#aaa',
  },
});