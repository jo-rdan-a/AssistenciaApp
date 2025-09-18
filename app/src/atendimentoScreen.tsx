import Icon from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Atendimento, Cliente, Equipamento, useData } from '../../contexts/DataContext';
import { useTheme } from '../../contexts/ThemeContext';
import colors from './styles/colors';


export default function AtendimentoScreen() {
  const { isDarkMode, primaryColor } = useTheme();
  const { clientes, equipamentos, atendimentos, addAtendimento, updateAtendimento, deleteAtendimento, getEquipamentosByCliente, loading, error } = useData();
  const [busca, setBusca] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAtendimento, setEditingAtendimento] = useState<Atendimento | null>(null);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [selectedEquipamento, setSelectedEquipamento] = useState<Equipamento | null>(null);
  const [modalClienteVisible, setModalClienteVisible] = useState(false);
  const [modalEquipamentoVisible, setModalEquipamentoVisible] = useState(false);
  const [formData, setFormData] = useState({
    problema: '',
    tecnico: '',
    valorServico: '',
    observacoes: ''
  });

  const atendimentosFiltrados = atendimentos.filter(item => 
    item.clienteNome.toLowerCase().includes(busca.toLowerCase()) ||
    item.equipamentoNome.toLowerCase().includes(busca.toLowerCase()) ||
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
    setEditingAtendimento(null);
    setSelectedCliente(null);
    setSelectedEquipamento(null);
    setFormData({ problema: '', tecnico: '', valorServico: '', observacoes: '' });
    setModalVisible(true);
  };

  const handleEditarAtendimento = (atendimento: Atendimento) => {
    setEditingAtendimento(atendimento);
    const cliente = clientes.find(c => c.id === atendimento.clienteId);
    const equipamento = equipamentos.find(e => e.id === atendimento.equipamentoId);
    setSelectedCliente(cliente || null);
    setSelectedEquipamento(equipamento || null);
    setFormData({
      problema: atendimento.problema,
      tecnico: atendimento.tecnico,
      valorServico: atendimento.valorServico?.toString() || '',
      observacoes: atendimento.observacoes || ''
    });
    setModalVisible(true);
  };

  const handleSalvarAtendimento = async () => {
    if (!selectedCliente || !selectedEquipamento) {
      Alert.alert('Erro', 'Por favor, selecione um cliente e um equipamento');
      return;
    }

    if (!formData.problema || !formData.tecnico) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      const atendimentoData = {
        clienteId: selectedCliente.id,
        equipamentoId: selectedEquipamento.id,
        problema: formData.problema,
        tecnico: formData.tecnico,
        status: 'Aguardando' as const,
        valorServico: formData.valorServico ? parseFloat(formData.valorServico) : undefined,
        observacoes: formData.observacoes
      };

      if (editingAtendimento) {
        await updateAtendimento(editingAtendimento.id, atendimentoData);
        Alert.alert('Sucesso', 'Atendimento atualizado com sucesso!');
      } else {
        await addAtendimento(atendimentoData);
        Alert.alert('Sucesso', 'Atendimento criado com sucesso!');
      }
      
      setModalVisible(false);
      setFormData({ problema: '', tecnico: '', valorServico: '', observacoes: '' });
    } catch (err) {
      Alert.alert('Erro', err instanceof Error ? err.message : 'Erro ao salvar atendimento');
    }
  };

  const handleExcluirAtendimento = (atendimento: Atendimento) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir este atendimento?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAtendimento(atendimento.id);
              Alert.alert('Sucesso', 'Atendimento excluído com sucesso!');
            } catch (err) {
              Alert.alert('Erro', err instanceof Error ? err.message : 'Erro ao excluir atendimento');
            }
          }
        }
      ]
    );
  };

  const handleSelecionarCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setSelectedEquipamento(null); // Reset equipamento quando trocar cliente
    setModalClienteVisible(false);
  };

  const handleSelecionarEquipamento = (equipamento: Equipamento) => {
    setSelectedEquipamento(equipamento);
    setModalEquipamentoVisible(false);
  };

  const equipamentosDoCliente = selectedCliente ? getEquipamentosByCliente(selectedCliente.id) : [];



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
            onPress={() => handleEditarAtendimento(item)}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.clienteName, isDarkMode && styles.textDark]}>{item.clienteNome}</Text>
              <View style={styles.actionButtons}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.actionButton, isDarkMode && styles.actionButtonDark]}
                  onPress={() => handleExcluirAtendimento(item)}
                >
                  <Icon name="delete" size={20} color="#FF4444" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.cardBody}>
              <Text style={[styles.equipamento, isDarkMode && styles.textDark]}><Text style={[styles.label, isDarkMode && styles.labelDark]}>Equipamento:</Text> {item.equipamentoNome}</Text>
              <Text style={[styles.problema, isDarkMode && styles.textDark]}><Text style={[styles.label, isDarkMode && styles.labelDark]}>Problema:</Text> {item.problema}</Text>
              <Text style={[styles.data, isDarkMode && styles.textDark]}><Text style={[styles.label, isDarkMode && styles.labelDark]}>Data:</Text> {item.data}</Text>
              <Text style={[styles.tecnico, isDarkMode && styles.textDark]}><Text style={[styles.label, isDarkMode && styles.labelDark]}>Técnico:</Text> {item.tecnico}</Text>
              {item.valorServico && (
                <Text style={[styles.valor, isDarkMode && styles.textDark]}><Text style={[styles.label, isDarkMode && styles.labelDark]}>Valor:</Text> R$ {item.valorServico.toFixed(2)}</Text>
              )}
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

      {/* Modal de Cadastro/Edição de Atendimento */}
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
                {editingAtendimento ? 'Editar Atendimento' : 'Novo Atendimento'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="close" size={24} color={isDarkMode ? '#E0E0E0' : '#333'} />
              </TouchableOpacity>
            </View>

            {/* Seleção de Cliente */}
            <TouchableOpacity 
              style={[styles.selector, isDarkMode && styles.selectorDark]}
              onPress={() => setModalClienteVisible(true)}
            >
              <Text style={[styles.selectorText, isDarkMode && styles.textDark]}>
                {selectedCliente ? selectedCliente.nome : 'Selecionar Cliente *'}
              </Text>
              <Icon name="arrow-drop-down" size={24} color={isDarkMode ? '#E0E0E0' : '#333'} />
            </TouchableOpacity>

            {/* Seleção de Equipamento */}
            <TouchableOpacity 
              style={[styles.selector, isDarkMode && styles.selectorDark]}
              onPress={() => setModalEquipamentoVisible(true)}
              disabled={!selectedCliente}
            >
              <Text style={[styles.selectorText, isDarkMode && styles.textDark, !selectedCliente && styles.disabledText]}>
                {selectedEquipamento ? selectedEquipamento.nome : 'Selecionar Equipamento *'}
              </Text>
              <Icon name="arrow-drop-down" size={24} color={isDarkMode ? '#E0E0E0' : '#333'} />
            </TouchableOpacity>

            <TextInput
              style={[styles.modalInput, isDarkMode && styles.modalInputDark]}
              placeholder="Descrição do Problema *"
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              value={formData.problema}
              onChangeText={(text) => setFormData({...formData, problema: text})}
              multiline
              numberOfLines={3}
            />

            <TextInput
              style={[styles.modalInput, isDarkMode && styles.modalInputDark]}
              placeholder="Nome do Técnico *"
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              value={formData.tecnico}
              onChangeText={(text) => setFormData({...formData, tecnico: text})}
            />

            <TextInput
              style={[styles.modalInput, isDarkMode && styles.modalInputDark]}
              placeholder="Valor do Serviço (R$)"
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              value={formData.valorServico}
              onChangeText={(text) => setFormData({...formData, valorServico: text})}
              keyboardType="numeric"
            />

            <TextInput
              style={[styles.modalInput, isDarkMode && styles.modalInputDark]}
              placeholder="Observações"
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              value={formData.observacoes}
              onChangeText={(text) => setFormData({...formData, observacoes: text})}
              multiline
              numberOfLines={2}
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
                onPress={handleSalvarAtendimento}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Seleção de Cliente */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalClienteVisible}
        onRequestClose={() => setModalClienteVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode && styles.modalContentDark]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDarkMode && styles.textDark]}>Selecionar Cliente</Text>
              <TouchableOpacity onPress={() => setModalClienteVisible(false)}>
                <Icon name="close" size={24} color={isDarkMode ? '#E0E0E0' : '#333'} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={clientes}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.listItem, isDarkMode && styles.listItemDark]}
                  onPress={() => handleSelecionarCliente(item)}
                >
                  <View>
                    <Text style={[styles.listItemName, isDarkMode && styles.textDark]}>{item.nome}</Text>
                    <Text style={[styles.listItemInfo, isDarkMode && styles.textDark]}>{item.telefone}</Text>
                  </View>
                  <Icon name="arrow-forward-ios" size={16} color={isDarkMode ? '#E0E0E0' : '#333'} />
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Modal de Seleção de Equipamento */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalEquipamentoVisible}
        onRequestClose={() => setModalEquipamentoVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode && styles.modalContentDark]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDarkMode && styles.textDark]}>Selecionar Equipamento</Text>
              <TouchableOpacity onPress={() => setModalEquipamentoVisible(false)}>
                <Icon name="close" size={24} color={isDarkMode ? '#E0E0E0' : '#333'} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={equipamentosDoCliente}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.listItem, isDarkMode && styles.listItemDark]}
                  onPress={() => handleSelecionarEquipamento(item)}
                >
                  <View>
                    <Text style={[styles.listItemName, isDarkMode && styles.textDark]}>{item.nome}</Text>
                    <Text style={[styles.listItemInfo, isDarkMode && styles.textDark]}>{item.marca} - {item.modelo}</Text>
                  </View>
                  <Icon name="arrow-forward-ios" size={16} color={isDarkMode ? '#E0E0E0' : '#333'} />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Icon name="devices-other" size={50} color={isDarkMode ? '#A0A0A0' : colors.gray} />
                  <Text style={[styles.emptyText, isDarkMode && styles.textDark]}>Nenhum equipamento cadastrado para este cliente</Text>
                </View>
              }
            />
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
    backgroundColor: colors.white,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
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
  selector: {
    height: 50,
    borderColor: colors.lightGray,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: colors.lightGray,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectorDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#444',
  },
  selectorText: {
    color: '#333',
    fontSize: 16,
  },
  disabledText: {
    color: '#999',
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
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  listItemDark: {
    borderBottomColor: '#444',
  },
  listItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  listItemInfo: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
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
  valor: {
    fontSize: 14,
    color: '#333',
    fontWeight: 'bold',
  },
});