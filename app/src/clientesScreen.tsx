import Icon from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, Linking, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import colors from './styles/colors';

interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
  ultimaVisita: string;
  totalGasto: number;
}

export default function ClientesScreen() {
  const { isDarkMode, primaryColor } = useTheme();
  const [busca, setBusca] = useState('');
  const [clientes, setClientes] = useState<Cliente[]>([
    {
      id: '1',
      nome: 'João Silva',
      telefone: '(11) 98765-4321',
      email: 'joao.silva@email.com',
      endereco: 'Rua das Flores, 123',
      ultimaVisita: '10/06/2023',
      totalGasto: 450.00
    },
    {
      id: '2',
      nome: 'Maria Santos',
      telefone: '(11) 91234-5678',
      email: 'maria.santos@email.com',
      endereco: 'Av. Paulista, 1000',
      ultimaVisita: '12/06/2023',
      totalGasto: 180.00
    },
    {
      id: '3',
      nome: 'Pedro Almeida',
      telefone: '(11) 99876-5432',
      email: 'pedro.almeida@email.com',
      endereco: 'Rua Augusta, 500',
      ultimaVisita: '08/06/2023',
      totalGasto: 350.00
    },
  ]);

  const clientesFiltrados = clientes.filter(item => 
    item.nome.toLowerCase().includes(busca.toLowerCase()) ||
    item.telefone.includes(busca) ||
    item.email.toLowerCase().includes(busca.toLowerCase())
  );

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const handleNovoCliente = () => {
    Alert.alert('Novo Cliente', 'Funcionalidade em desenvolvimento');
    // Aqui seria implementada a navegação para a tela de novo cliente
  };

  const handleEditarCliente = (id: string) => {
    Alert.alert('Editar Cliente', `Editar cliente ${id}`);
    // Aqui seria implementada a navegação para a tela de edição de cliente
  };

  const handleLigar = (telefone: string) => {
    Alert.alert('Ligar', `Ligando para ${telefone}`);
    // Aqui seria implementada a funcionalidade de ligação
  };

  const handleEmail = (email: string) => {
    Alert.alert('Email', `Enviando email para ${email}`);
    // Aqui seria implementada a funcionalidade de envio de email
  };

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={primaryColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: primaryColor}]}>Clientes</Text>
        <TouchableOpacity onPress={handleNovoCliente} style={styles.addButton}>
          <Icon name="add" size={24} color={primaryColor} />
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, isDarkMode && styles.searchContainerDark]}>
        <Icon name="search" size={20} color={isDarkMode ? '#E0E0E0' : colors.gray} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, isDarkMode && styles.searchInputDark]}
          placeholder="Buscar cliente..."
          placeholderTextColor={isDarkMode ? '#A0A0A0' : colors.gray}
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      <FlatList
        data={clientesFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.card, isDarkMode && styles.cardDark]}
            onPress={() => handleEditarCliente(item.id)}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.clienteName, isDarkMode && styles.textDark]}>{item.nome}</Text>
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={[styles.actionButton, isDarkMode && styles.actionButtonDark]}
                  onPress={() => handleLigar(item.telefone)}
                >
                  <Icon name="phone" size={20} color={primaryColor} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.actionButton, isDarkMode && styles.actionButtonDark]}
                  onPress={() => handleEmail(item.email)}
                >
                  <Icon name="email" size={20} color={primaryColor} />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.cardBody}>
              <Text style={[styles.info, isDarkMode && styles.textDark]}><Text style={[styles.label, isDarkMode && styles.labelDark]}>Telefone:</Text> {item.telefone}</Text>
              <Text style={[styles.info, isDarkMode && styles.textDark]}><Text style={[styles.label, isDarkMode && styles.labelDark]}>Email:</Text> {item.email}</Text>
              <Text style={[styles.info, isDarkMode && styles.textDark]}><Text style={[styles.label, isDarkMode && styles.labelDark]}>Endereço:</Text> {item.endereco}</Text>
              <View style={styles.cardFooter}>
                <Text style={[styles.info, isDarkMode && styles.textDark]}><Text style={[styles.label, isDarkMode && styles.labelDark]}>Última visita:</Text> {item.ultimaVisita}</Text>
                <Text style={[styles.totalGasto, {color: primaryColor}]}>{formatarValor(item.totalGasto)}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="search-off" size={50} color={isDarkMode ? '#A0A0A0' : colors.gray} />
            <Text style={[styles.emptyText, isDarkMode && styles.textDark]}>Nenhum cliente encontrado</Text>
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
    backgroundColor: '#1E1E1E',
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
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 20,
  },
  actionButtonDark: {
    backgroundColor: '#2A2A2A',
  },
  cardBody: {
    gap: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  label: {
    fontWeight: 'bold',
    color: colors.gray,
  },
  labelDark: {
    color: '#A0A0A0',
  },
  info: {
    fontSize: 14,
    color: '#333',
  },
  textDark: {
    color: '#E0E0E0',
  },
  totalGasto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
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