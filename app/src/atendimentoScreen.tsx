import Icon from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import colors from './styles/colors';

interface Atendimento {
  id: string;
  cliente: string;
  equipamento: string;
  problema: string;
  status: 'Aguardando' | 'Em andamento' | 'Concluído';
  data: string;
  tecnico: string;
}

export default function AtendimentoScreen() {
  const { isDarkMode, primaryColor } = useTheme();
  const [busca, setBusca] = useState('');
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([
    {
      id: '1',
      cliente: 'João Silva',
      equipamento: 'Notebook Dell',
      problema: 'Não liga',
      status: 'Em andamento',
      data: '10/06/2023',
      tecnico: 'Eduardo Oliveira'
    },
    {
      id: '2',
      cliente: 'Maria Santos',
      equipamento: 'Impressora HP',
      problema: 'Papel enroscando',
      status: 'Aguardando',
      data: '12/06/2023',
      tecnico: 'Alex'
    },
    {
      id: '3',
      cliente: 'Pedro Almeida',
      equipamento: 'Smartphone Samsung',
      problema: 'Tela quebrada',
      status: 'Concluído',
      data: '08/06/2023',
      tecnico: 'Eduardo Oliveira'
    },
  ]);

  const atendimentosFiltrados = atendimentos.filter(item => 
    item.cliente.toLowerCase().includes(busca.toLowerCase()) ||
    item.equipamento.toLowerCase().includes(busca.toLowerCase()) ||
    item.problema.toLowerCase().includes(busca.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Aguardando': return '#FFA500';
      case 'Em andamento': return '#3466F6';
      case 'Concluído': return '#4CAF50';
      default: return colors.gray;
    }
  };

  const handleNovoAtendimento = () => {
    Alert.alert('Novo Atendimento', 'Funcionalidade em desenvolvimento');
    // Aqui seria implementada a navegação para a tela de novo atendimento
  };

  const handleEditarAtendimento = (id: string) => {
    Alert.alert('Editar Atendimento', `Editar atendimento ${id}`);
    // Aqui seria implementada a navegação para a tela de edição de atendimento
  };

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={primaryColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: primaryColor}]}>Atendimentos</Text>
        <TouchableOpacity onPress={handleNovoAtendimento} style={styles.addButton}>
          <Icon name="add" size={24} color={primaryColor} />
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, isDarkMode && styles.searchContainerDark]}>
        <Icon name="search" size={20} color={isDarkMode ? '#999' : colors.gray} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, isDarkMode && styles.searchInputDark]}
          placeholder="Buscar atendimento"
          placeholderTextColor={isDarkMode ? '#999' : colors.gray}
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      <FlatList
        data={atendimentosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.card, isDarkMode && styles.cardDark]}
            onPress={() => handleEditarAtendimento(item.id)}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.clienteName, isDarkMode && styles.textDark]}>{item.cliente}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <View style={styles.cardBody}>
              <Text style={[styles.equipamento, isDarkMode && styles.textDark]}><Text style={[styles.label, isDarkMode && styles.labelDark]}>Equipamento:</Text> {item.equipamento}</Text>
              <Text style={[styles.problema, isDarkMode && styles.textDark]}><Text style={[styles.label, isDarkMode && styles.labelDark]}>Problema:</Text> {item.problema}</Text>
              <Text style={[styles.data, isDarkMode && styles.textDark]}><Text style={[styles.label, isDarkMode && styles.labelDark]}>Data:</Text> {item.data}</Text>
              <Text style={[styles.tecnico, isDarkMode && styles.textDark]}><Text style={[styles.label, isDarkMode && styles.labelDark]}>Técnico:</Text> {item.tecnico}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="search-off" size={50} color={isDarkMode ? '#999' : colors.gray} />
            <Text style={[styles.emptyText, isDarkMode && styles.textDark]}>Nenhum atendimento encontrado</Text>
          </View>
        }
      />
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
    backgroundColor: '#1E1E1E',
    shadowColor: '#000',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  addButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
  },
  searchContainerDark: {
    backgroundColor: '#2C2C2C',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  searchInputDark: {
    color: '#E0E0E0',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardDark: {
    backgroundColor: '#1E1E1E',
    shadowColor: '#000',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  clienteName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardBody: {
    gap: 4,
  },
  label: {
    fontWeight: 'bold',
    color: colors.gray,
  },
  labelDark: {
    color: '#999',
  },
  equipamento: {
    fontSize: 14,
    color: '#333',
  },
  problema: {
    fontSize: 14,
    color: '#333',
  },
  data: {
    fontSize: 14,
    color: '#333',
  },
  tecnico: {
    fontSize: 14,
    color: '#333',
  },
  textDark: {
    color: '#E0E0E0',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
  },
});