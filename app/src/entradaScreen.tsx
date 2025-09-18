import Icon from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Cliente, useData } from '../../contexts/DataContext';
import { useTheme } from '../../contexts/ThemeContext';
import colors from './styles/colors';


export default function EntradaScreen() {
  const { primaryColor, isDarkMode } = useTheme();
  const { clientes, equipamentos, addEquipamento, loading, error } = useData();
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [productCode, setProductCode] = useState('');
  const [productName, setProductName] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [category, setCategory] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [modalClienteVisible, setModalClienteVisible] = useState(false);
  
  const registrarEquipamento = async () => {
    if (!selectedCliente) {
      Alert.alert('Erro', 'Por favor, selecione um cliente');
      return;
    }

    if (!productCode || !productName || !marca || !modelo || !category) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    try {
      await addEquipamento({
        codigo: productCode,
        nome: productName,
        marca: marca,
        modelo: modelo,
        clienteId: selectedCliente.id,
        categoria: category,
        observacoes: observacoes
      });

      limparFormulario();
      Alert.alert('Sucesso', 'Equipamento cadastrado com sucesso!');
    } catch (err) {
      Alert.alert('Erro', err instanceof Error ? err.message : 'Erro ao cadastrar equipamento');
    }
  };

  const limparFormulario = () => {
    setSelectedCliente(null);
    setProductCode('');
    setProductName('');
    setMarca('');
    setModelo('');
    setCategory('');
    setObservacoes('');
  };

  const handleSelecionarCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setModalClienteVisible(false);
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, isDarkMode && styles.containerDark]}
    >
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={primaryColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: primaryColor}]}>Cadastro de Equipamentos</Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="add" size={24} color={primaryColor} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={[styles.form, isDarkMode && styles.formDark]}>
            {/* Seleção de Cliente */}
            <TouchableOpacity 
              style={[styles.clienteSelector, isDarkMode && styles.clienteSelectorDark]}
              onPress={() => setModalClienteVisible(true)}
            >
              <Text style={[styles.clienteSelectorText, isDarkMode && styles.textDark]}>
                {selectedCliente ? selectedCliente.nome : 'Selecionar Cliente *'}
              </Text>
              <Icon name="arrow-drop-down" size={24} color={isDarkMode ? '#E0E0E0' : '#333'} />
            </TouchableOpacity>

            <TextInput
              style={[styles.input, isDarkMode && styles.inputDark]}
              placeholder="Código do Equipamento *"
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              value={productCode}
              onChangeText={setProductCode}
            />
            
            <TextInput
              style={[styles.input, isDarkMode && styles.inputDark]}
              placeholder="Nome do Equipamento *"
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              value={productName}
              onChangeText={setProductName}
            />
            
            <View style={styles.rowContainer}>
              <TextInput
                style={[styles.inputHalf, isDarkMode && styles.inputDark]}
                placeholder="Marca *"
                placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
                value={marca}
                onChangeText={setMarca}
              />
              
              <TextInput
                style={[styles.inputHalf, isDarkMode && styles.inputDark]}
                placeholder="Modelo *"
                placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
                value={modelo}
                onChangeText={setModelo}
              />
            </View>

            <TextInput
              style={[styles.input, isDarkMode && styles.inputDark]}
              placeholder="Categoria *"
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              value={category}
              onChangeText={setCategory}
            />

            <TextInput
              style={[styles.input, isDarkMode && styles.inputDark]}
              placeholder="Observações"
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              value={observacoes}
              onChangeText={setObservacoes}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity style={[styles.scanButton, { borderColor: primaryColor }]}>
              <Icon name="qr-code-scanner" size={24} color={primaryColor} />
              <Text style={[styles.scanText, { color: primaryColor }]}>Escanear Código</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.registerButton, { backgroundColor: primaryColor }]}
            onPress={registrarEquipamento}
          >
            <Text style={styles.buttonText}>Cadastrar Equipamento</Text>
          </TouchableOpacity>
          
          <View style={styles.historicoContainer}>
            <Text style={[styles.historicoTitle, isDarkMode && styles.textDark]}>Equipamentos Cadastrados</Text>
            
            {equipamentos.map((item) => (
              <View key={item.id} style={[styles.historicoItem, isDarkMode && styles.historicoItemDark]}>
                <View style={styles.itemHeader}>
                  <Text style={[styles.itemNome, isDarkMode && styles.textDark]}>{item.nome}</Text>
                  <Text style={[styles.itemData, isDarkMode && styles.textDark]}>{item.dataEntrada}</Text>
                </View>
                
                <View style={[styles.itemDetails, isDarkMode && styles.itemDetailsDark]}>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, isDarkMode && styles.textDark]}>Código:</Text>
                    <Text style={[styles.detailValue, isDarkMode && styles.textDark]}>{item.codigo}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, isDarkMode && styles.textDark]}>Cliente:</Text>
                    <Text style={[styles.detailValue, isDarkMode && styles.textDark]}>{item.clienteNome}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, isDarkMode && styles.textDark]}>Marca:</Text>
                    <Text style={[styles.detailValue, isDarkMode && styles.textDark]}>{item.marca}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, isDarkMode && styles.textDark]}>Modelo:</Text>
                    <Text style={[styles.detailValue, isDarkMode && styles.textDark]}>{item.modelo}</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, isDarkMode && styles.textDark]}>Categoria:</Text>
                    <Text style={[styles.detailValue, isDarkMode && styles.textDark]}>{item.categoria}</Text>
                  </View>
                  
                  {item.observacoes && (
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, isDarkMode && styles.textDark]}>Observações:</Text>
                      <Text style={[styles.detailValue, isDarkMode && styles.textDark]}>{item.observacoes}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

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
                  style={[styles.clienteItem, isDarkMode && styles.clienteItemDark]}
                  onPress={() => handleSelecionarCliente(item)}
                >
                  <View>
                    <Text style={[styles.clienteItemName, isDarkMode && styles.textDark]}>{item.nome}</Text>
                    <Text style={[styles.clienteItemInfo, isDarkMode && styles.textDark]}>{item.telefone}</Text>
                    <Text style={[styles.clienteItemInfo, isDarkMode && styles.textDark]}>{item.email}</Text>
                  </View>
                  <Icon name="arrow-forward-ios" size={16} color={isDarkMode ? '#E0E0E0' : '#333'} />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Icon name="person-off" size={50} color={isDarkMode ? '#A0A0A0' : colors.gray} />
                  <Text style={[styles.emptyText, isDarkMode && styles.textDark]}>Nenhum cliente cadastrado</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightGray
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
  textDark: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  form: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  formDark: {
    backgroundColor: '#2a2a2a',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    height: 50,
    borderColor: colors.lightGray,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: colors.lightGray,
    color: colors.gray
  },
  inputHalf: {
    height: 50,
    borderColor: colors.lightGray,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: colors.lightGray,
    color: colors.gray,
    width: '48%'
  },
  inputDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
    color: '#fff',
  },
  scanButton: {
    height: 50,
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row'
  },
  registerButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  scanText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  historicoContainer: {
    marginBottom: 20,
  },
  historicoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  historicoItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  historicoItemDark: {
    backgroundColor: '#2a2a2a',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  itemNome: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemData: {
    fontSize: 14,
    color: '#888',
  },
  itemDetails: {
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 10,
  },
  itemDetailsDark: {
    backgroundColor: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  detailLabel: {
    fontSize: 14,
    color: '#555',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
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
  clienteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  clienteItemDark: {
    borderBottomColor: '#444',
  },
  clienteItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  clienteItemInfo: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 2,
  },
  clienteSelector: {
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
  clienteSelectorDark: {
    backgroundColor: '#2A2A2A',
    borderColor: '#444',
  },
  clienteSelectorText: {
    color: '#333',
    fontSize: 16,
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