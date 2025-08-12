import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import BackButton from '../../components/BackButton';
import { useTheme } from '../../contexts/ThemeContext';
import css from './styles/globalStyles';
import colors from './styles/colors';

type SaidaItem = {
  id: string;
  numeroOS: string;
  tecnico: string;
  cliente: string;
  dataSaida: string;
  itens: {
    id: string;
    nome: string;
    quantidade: number;
    precoUnitario: number;
  }[];
};

type ProdutoEstoque = {
  id: string;
  codigo: string;
  nome: string;
  quantidade: number;
  precoUnitario: number;
};

export default function SaidaScreen() {
  const { primaryColor, isDarkMode } = useTheme();
  const [osNumber, setOsNumber] = useState('');
  const [technician, setTechnician] = useState('');
  const [client, setClient] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<{id: string, quantidade: string}[]>([]);
  
  // Produtos disponíveis em estoque (simulação)
  const [produtosEstoque, setProdutosEstoque] = useState<ProdutoEstoque[]>([
    { id: '1', codigo: 'LCD-IP11', nome: 'Tela LCD iPhone 11', quantidade: 5, precoUnitario: 250.00 },
    { id: '2', codigo: 'BAT-S20', nome: 'Bateria Samsung S20', quantidade: 10, precoUnitario: 120.00 },
    { id: '3', codigo: 'KIT-FERR', nome: 'Kit Ferramentas Precisão', quantidade: 2, precoUnitario: 180.00 },
    { id: '4', codigo: 'CABO-USB', nome: 'Cabo USB-C', quantidade: 15, precoUnitario: 25.00 },
    { id: '5', codigo: 'CAPA-IP12', nome: 'Capa iPhone 12', quantidade: 8, precoUnitario: 45.00 },
  ]);
  
  // Histórico de saídas (simulação)
  const [historicoSaidas, setHistoricoSaidas] = useState<SaidaItem[]>([
    {
      id: '1',
      numeroOS: '2023001',
      tecnico: 'Carlos Silva',
      cliente: 'Maria Oliveira',
      dataSaida: '10/05/2023',
      itens: [
        { id: '1', nome: 'Tela LCD iPhone 11', quantidade: 1, precoUnitario: 250.00 },
        { id: '2', nome: 'Bateria Samsung S20', quantidade: 1, precoUnitario: 120.00 }
      ]
    },
    {
      id: '2',
      numeroOS: '2023002',
      tecnico: 'Ana Pereira',
      cliente: 'João Santos',
      dataSaida: '15/05/2023',
      itens: [
        { id: '3', nome: 'Kit Ferramentas Precisão', quantidade: 1, precoUnitario: 180.00 }
      ]
    }
  ]);

  const adicionarProduto = () => {
    setSelectedProducts([...selectedProducts, {id: '', quantidade: ''}]);
  };

  const removerProduto = (index: number) => {
    const novosProdutos = [...selectedProducts];
    novosProdutos.splice(index, 1);
    setSelectedProducts(novosProdutos);
  };

  const atualizarProdutoSelecionado = (index: number, produtoId: string) => {
    const novosProdutos = [...selectedProducts];
    novosProdutos[index].id = produtoId;
    setSelectedProducts(novosProdutos);
  };

  const atualizarQuantidade = (index: number, quantidade: string) => {
    const novosProdutos = [...selectedProducts];
    novosProdutos[index].quantidade = quantidade;
    setSelectedProducts(novosProdutos);
  };

  const registrarSaida = () => {
    if (!osNumber || !technician || !client || selectedProducts.length === 0) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios e adicione pelo menos um produto');
      return;
    }

    // Verificar se todos os produtos têm ID e quantidade válidos
    const produtosInvalidos = selectedProducts.some(p => !p.id || !p.quantidade || Number(p.quantidade) <= 0);
    if (produtosInvalidos) {
      Alert.alert('Erro', 'Por favor, selecione produtos válidos e quantidades maiores que zero');
      return;
    }

    // Verificar se há quantidade suficiente em estoque
    let estoqueInsuficiente = false;
    const novoEstoque = [...produtosEstoque];

    selectedProducts.forEach(produto => {
      const estoqueIndex = novoEstoque.findIndex(p => p.id === produto.id);
      if (estoqueIndex >= 0) {
        const quantidadeSolicitada = Number(produto.quantidade);
        if (novoEstoque[estoqueIndex].quantidade < quantidadeSolicitada) {
          estoqueInsuficiente = true;
          return;
        }
        novoEstoque[estoqueIndex].quantidade -= quantidadeSolicitada;
      }
    });

    if (estoqueInsuficiente) {
      Alert.alert('Erro', 'Quantidade insuficiente em estoque para um ou mais produtos');
      return;
    }

    // Criar nova saída
    const itensSaida = selectedProducts.map(produto => {
      const produtoEstoque = produtosEstoque.find(p => p.id === produto.id);
      return {
        id: produto.id,
        nome: produtoEstoque?.nome || '',
        quantidade: Number(produto.quantidade),
        precoUnitario: produtoEstoque?.precoUnitario || 0
      };
    });

    const novaSaida: SaidaItem = {
      id: Date.now().toString(),
      numeroOS: osNumber,
      tecnico: technician,
      cliente: client,
      dataSaida: new Date().toLocaleDateString('pt-BR'),
      itens: itensSaida
    };

    // Atualizar histórico e estoque
    setHistoricoSaidas([novaSaida, ...historicoSaidas]);
    setProdutosEstoque(novoEstoque);

    // Limpar formulário
    setOsNumber('');
    setTechnician('');
    setClient('');
    setSelectedProducts([]);

    Alert.alert('Sucesso', 'Saída registrada com sucesso!');
  };

  const formatarMoeda = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const calcularTotal = (itens: {quantidade: number, precoUnitario: number}[]) => {
    return itens.reduce((total, item) => total + (item.quantidade * item.precoUnitario), 0);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, isDarkMode && styles.containerDark]}
    >
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={primaryColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: primaryColor}]}>Controle de Saída</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color={primaryColor} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={[styles.form, isDarkMode && styles.formDark]}>
          <TextInput
            style={[styles.input, isDarkMode && styles.inputDark]}
            placeholder="N° da OS"
            placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
            keyboardType="numeric"
            value={osNumber}
            onChangeText={setOsNumber}
          />
          
          <View style={styles.rowContainer}>
            <TextInput
              style={[styles.inputHalf, isDarkMode && styles.inputDark]}
              placeholder="Técnico"
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              value={technician}
              onChangeText={setTechnician}
            />
            
            <TextInput
              style={[styles.inputHalf, isDarkMode && styles.inputDark]}
              placeholder="Cliente"
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              value={client}
              onChangeText={setClient}
            />
          </View>
          
          <View style={styles.productListHeader}>
            <Text style={[styles.productListTitle, isDarkMode && styles.textDark]}>Produtos</Text>
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: primaryColor }]}
              onPress={adicionarProduto}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
          
          {selectedProducts.length === 0 ? (
            <Text style={[styles.emptyText, isDarkMode && styles.textDark]}>Nenhum produto adicionado</Text>
          ) : (
            <View style={styles.productList}>
              {selectedProducts.map((produto, index) => (
                <View key={index} style={[styles.productItem, isDarkMode && styles.productItemDark]}>
                  <View style={styles.productSelectContainer}>
                    <View style={styles.productSelect}>
                      <Text style={[styles.productSelectLabel, isDarkMode && styles.textDark]}>Produto:</Text>
                      <View style={[styles.selectWrapper, isDarkMode && styles.selectWrapperDark]}>
                        <Picker
                          selectedValue={produto.id}
                          onValueChange={(itemValue) => atualizarProdutoSelecionado(index, itemValue)}
                          style={[styles.picker, isDarkMode && styles.pickerDark]}
                        >
                          <Picker.Item label="Selecione um produto" value="" />
                          {produtosEstoque.map((p) => (
                            <Picker.Item 
                              key={p.id} 
                              label={`${p.nome} (${p.quantidade} em estoque)`} 
                              value={p.id} 
                            />
                          ))}
                        </Picker>
                      </View>
                    </View>
                    
                    <View style={styles.quantityContainer}>
                      <Text style={[styles.quantityLabel, isDarkMode && styles.textDark]}>Qtd:</Text>
                      <TextInput 
                        style={[styles.quantityInput, isDarkMode && styles.inputDark]}
                        placeholder="Qtd"
                        placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
                        keyboardType="numeric"
                        value={produto.quantidade}
                        onChangeText={(value) => atualizarQuantidade(index, value)}
                      />
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => removerProduto(index)}
                  >
                    <Ionicons name="trash-outline" size={20} color="#ff4d4d" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={[styles.registerButton, { backgroundColor: primaryColor }]}
          onPress={registrarSaida}
        >
          <Text style={styles.buttonText}>Registrar Saída</Text>
        </TouchableOpacity>
        
        <View style={styles.historicoContainer}>
          <Text style={[styles.historicoTitle, isDarkMode && styles.textDark]}>Histórico de Saídas</Text>
          
          {historicoSaidas.map((saida) => (
            <View key={saida.id} style={[styles.historicoItem, isDarkMode && styles.historicoItemDark]}>
              <View style={styles.itemHeader}>
                <Text style={[styles.itemOS, isDarkMode && styles.textDark]}>OS: {saida.numeroOS}</Text>
                <Text style={[styles.itemData, isDarkMode && styles.textDark]}>{saida.dataSaida}</Text>
              </View>
              
              <View style={[styles.itemDetails, isDarkMode && styles.itemDetailsDark]}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, isDarkMode && styles.textDark]}>Cliente:</Text>
                  <Text style={[styles.detailValue, isDarkMode && styles.textDark]}>{saida.cliente}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, isDarkMode && styles.textDark]}>Técnico:</Text>
                  <Text style={[styles.detailValue, isDarkMode && styles.textDark]}>{saida.tecnico}</Text>
                </View>
                
                <Text style={[styles.itemsTitle, isDarkMode && styles.textDark]}>Itens:</Text>
                
                {saida.itens.map((item, index) => (
                  <View key={index} style={styles.itemRow}>
                    <Text style={[styles.itemName, isDarkMode && styles.textDark]}>
                      {item.quantidade}x {item.nome}
                    </Text>
                    <Text style={[styles.itemPrice, isDarkMode && styles.textDark]}>
                      {formatarMoeda(item.quantidade * item.precoUnitario)}
                    </Text>
                  </View>
                ))}
                
                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, isDarkMode && styles.textDark]}>Total:</Text>
                  <Text style={[styles.totalValue, isDarkMode && styles.textDark]}>
                    {formatarMoeda(calcularTotal(saida.itens))}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
  textDark: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
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
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: 'white'
  },
  inputHalf: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: 'white',
    width: '48%'
  },
  inputDark: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
    color: '#fff',
  },
  productListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 10,
  },
  productListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 20,
    fontStyle: 'italic',
  },
  productList: {
    marginTop: 10
  },
  productItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  productItemDark: {
    backgroundColor: '#333',
  },
  productSelectContainer: {
    flex: 1,
  },
  productSelect: {
    marginBottom: 10,
  },
  productSelectLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  selectWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  selectWrapperDark: {
    borderColor: '#444',
    backgroundColor: '#2a2a2a',
  },
  picker: {
    height: 40,
    width: '100%',
  },
  pickerDark: {
    color: '#fff',
  },
  quantityContainer: {
    marginTop: 5,
  },
  quantityLabel: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555',
  },
  quantityInput: {
    width: '100%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: 'white'
  },
  removeButton: {
    padding: 5,
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  registerButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
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
  itemOS: {
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
  itemsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemName: {
    fontSize: 14,
  },
  itemPrice: {
    fontSize: 14,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});