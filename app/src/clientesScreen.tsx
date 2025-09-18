import Icon from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Cliente, useData } from '../../contexts/DataContext';
import { useTheme } from '../../contexts/ThemeContext';
import colors from './styles/colors';


export default function ClientesScreen() {
  const { isDarkMode, primaryColor } = useTheme();
  const { clientes, addCliente, updateCliente, deleteCliente, loading, error } = useData();
  const [busca, setBusca] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    endereco: ''
  });

  const clientesFiltrados = clientes.filter(item => 
    item.nome.toLowerCase().includes(busca.toLowerCase()) ||
    item.telefone.includes(busca) ||
    item.email.toLowerCase().includes(busca.toLowerCase())
  );

  const handleNovoCliente = () => {
    setEditingCliente(null);
    setFormData({ nome: '', telefone: '', email: '', endereco: '' });
    setModalVisible(true);
  };

  const handleEditarCliente = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nome: cliente.nome,
      telefone: cliente.telefone,
      email: cliente.email,
      endereco: cliente.endereco
    });
    setModalVisible(true);
  };

  const handleSalvarCliente = async () => {
    if (!formData.nome || !formData.telefone || !formData.email) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      if (editingCliente) {
        await updateCliente(editingCliente.id, formData);
        Alert.alert('Sucesso', 'Cliente atualizado com sucesso!');
      } else {
        await addCliente(formData);
        Alert.alert('Sucesso', 'Cliente cadastrado com sucesso!');
      }
      
      setModalVisible(false);
      setFormData({ nome: '', telefone: '', email: '', endereco: '' });
    } catch (err) {
      Alert.alert('Erro', err instanceof Error ? err.message : 'Erro ao salvar cliente');
    }
  };

  const handleExcluirCliente = (cliente: Cliente) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir o cliente ${cliente.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCliente(cliente.id);
              Alert.alert('Sucesso', 'Cliente excluído com sucesso!');
            } catch (err) {
              Alert.alert('Erro', err instanceof Error ? err.message : 'Erro ao excluir cliente');
            }
          }
        }
      ]
    );
  };

  const handleLigar = (telefone: string) => {
    Alert.alert('Ligar', `Ligando para ${telefone}`);
    // Aqui seria implementada a funcionalidade de ligação
  };

  const handleEmail = (email: string) => {
    Alert.alert('Email', `Enviando email para ${email}`);
    // Aqui seria implementada a funcionalidade de envio de email
  };

    

  if (loading) {
    return (
      <View style={[styles.container, isDarkMode && styles.containerDark, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={primaryColor} />
        <Text style={[styles.loadingText, isDarkMode && styles.textDark]}>Carregando clientes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, isDarkMode && styles.containerDark, styles.errorContainer]}>
        <Icon name="error" size={50} color="#FF4444" />
        <Text style={[styles.errorText, isDarkMode && styles.textDark]}>{error}</Text>
        <TouchableOpacity style={[styles.retryButton, { backgroundColor: primaryColor }]} onPress={() => window.location.reload()}>
          <Text style={styles.retryButtonText}>Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={primaryColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: primaryColor}]}>Clientes</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={handleNovoCliente} style={styles.addButton}>
            <Icon name="add" size={24} color={primaryColor} />
          </TouchableOpacity>
        </View>
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
          onPress={() => handleEditarCliente(item)}
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
              <TouchableOpacity 
                style={[styles.actionButton, isDarkMode && styles.actionButtonDark]}
                onPress={() => handleExcluirCliente(item)}
              >
                <Icon name="delete" size={20} color="#FF4444" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.cardBody}>
            <Text style={[styles.info, isDarkMode && styles.textDark]}><Text style={[styles.label, isDarkMode && styles.labelDark]}>Telefone:</Text> {item.telefone}</Text>
            <Text style={[styles.info, isDarkMode && styles.textDark]}><Text style={[styles.label, isDarkMode && styles.labelDark]}>Email:</Text> {item.email}</Text>
            <Text style={[styles.info, isDarkMode && styles.textDark]}><Text style={[styles.label, isDarkMode && styles.labelDark]}>Endereço:</Text> {item.endereco}</Text>
            <View style={styles.cardFooter}>
              <Text style={[styles.info, isDarkMode && styles.textDark]}><Text style={[styles.label, isDarkMode && styles.labelDark]}>Cadastrado em:</Text> {item.dataCadastro}</Text>
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

      {/* Modal de Cadastro/Edição */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode && styles.modalContentDark]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDarkMode && styles.textDark]}>
                {editingCliente ? 'Editar Cliente' : 'Novo Cliente'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color={isDarkMode ? '#E0E0E0' : '#333'} />
              </TouchableOpacity>
            </View>

            <TextInput
              style={[styles.modalInput, isDarkMode && styles.modalInputDark]}
              placeholder="Nome completo"
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              value={formData.nome}
              onChangeText={(text) => setFormData({...formData, nome: text})}
            />

            <TextInput
              style={[styles.modalInput, isDarkMode && styles.modalInputDark]}
              placeholder="Telefone"
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              value={formData.telefone}
              onChangeText={(text) => setFormData({...formData, telefone: text})}
              keyboardType="phone-pad"
            />

            <TextInput
              style={[styles.modalInput, isDarkMode && styles.modalInputDark]}
              placeholder="Email"
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              keyboardType="email-address"
            />

            <TextInput
              style={[styles.modalInput, isDarkMode && styles.modalInputDark]}
              placeholder="Endereço"
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              value={formData.endereco}
              onChangeText={(text) => setFormData({...formData, endereco: text})}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton, { backgroundColor: primaryColor }]}
                onPress={handleSalvarCliente}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addButton: {
    padding: 8,
  },
  testButton: {
    padding: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
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
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalContentDark: {
    backgroundColor: '#1E1E1E',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  modalInput: {
    height: 50,
    borderColor: colors.lightGray,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: colors.lightGray,
    color: '#333',
  },
  modalInputDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#444',
    color: '#E0E0E0',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: colors.lightGray,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  cancelButtonText: {
    color: colors.gray,
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Loading e Error styles
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.gray,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#FF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});