import Icon from '@expo/vector-icons/MaterialIcons';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView, Alert, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import colors from './styles/colors';

type EntradaItem = {
  id: string;
  codigo: string;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  fornecedor: string;
  dataEntrada: string;
  categoria: string;
  notaFiscal: string;
};

export default function EntradaScreen() {
  const { primaryColor, isDarkMode } = useTheme();
  const [productCode, setProductCode] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [supplier, setSupplier] = useState('');
  const [category, setCategory] = useState('');
  const [invoice, setInvoice] = useState('');
  const [historico, setHistorico] = useState<EntradaItem[]>([
    {
      id: '1',
      codigo: 'LCD-IP11',
      nome: 'Tela LCD iPhone 11',
      quantidade: 5,
      precoUnitario: 250.00,
      fornecedor: 'TechParts Ltda',
      dataEntrada: '15/05/2023',
      categoria: 'Peças',
      notaFiscal: 'NF-12345'
    },
    {
      id: '2',
      codigo: 'BAT-S20',
      nome: 'Bateria Samsung S20',
      quantidade: 10,
      precoUnitario: 120.00,
      fornecedor: 'BatteryMax',
      dataEntrada: '10/05/2023',
      categoria: 'Peças',
      notaFiscal: 'NF-12346'
    },
    {
      id: '3',
      codigo: 'KIT-FERR',
      nome: 'Kit Ferramentas Precisão',
      quantidade: 2,
      precoUnitario: 180.00,
      fornecedor: 'ToolMaster',
      dataEntrada: '05/05/2023',
      categoria: 'Ferramentas',
      notaFiscal: 'NF-12347'
    }
  ]);
  
  const registrarEntrada = () => {
    if (!productCode || !productName || !quantity || !price || !supplier || !category) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const novaEntrada: EntradaItem = {
      id: Date.now().toString(),
      codigo: productCode,
      nome: productName,
      quantidade: Number(quantity),
      precoUnitario: Number(price),
      fornecedor: supplier,
      dataEntrada: new Date().toLocaleDateString('pt-BR'),
      categoria: category,
      notaFiscal: invoice || 'N/A'
    };

    setHistorico([novaEntrada, ...historico]);
    limparFormulario();
    Alert.alert('Sucesso', 'Entrada registrada com sucesso!');
  };

  const limparFormulario = () => {
    setProductCode('');
    setProductName('');
    setQuantity('');
    setPrice('');
    setSupplier('');
    setCategory('');
    setInvoice('');
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
        <Text style={[styles.headerTitle, {color: primaryColor}]}>Controle de entradas</Text>
        <TouchableOpacity style={styles.addButton}>
          <Icon name="add" size={24} color={primaryColor} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={[styles.form, isDarkMode && styles.formDark]}>
          <TextInput
            style={[styles.input, isDarkMode && styles.inputDark]}
            placeholder="Código do Produto"
            placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
            value={productCode}
            onChangeText={setProductCode}
          />
          
          <TextInput
            style={[styles.input, isDarkMode && styles.inputDark]}
            placeholder="Nome do Produto"
            placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
            value={productName}
            onChangeText={setProductName}
          />
          
          <View style={styles.rowContainer}>
            <TextInput
              style={[styles.inputHalf, isDarkMode && styles.inputDark]}
              placeholder="Quantidade"
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
            />
            
            <TextInput
              style={[styles.inputHalf, isDarkMode && styles.inputDark]}
              placeholder="Preço Unitário (R$)"
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
            />
          </View>

          <TextInput
            style={[styles.input, isDarkMode && styles.inputDark]}
            placeholder="Fornecedor"
            placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
            value={supplier}
            onChangeText={setSupplier}
          />
          
          <View style={styles.rowContainer}>
            <TextInput
              style={[styles.inputHalf, isDarkMode && styles.inputDark]}
              placeholder="Categoria"
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              value={category}
              onChangeText={setCategory}
            />
            
            <TextInput
              style={[styles.inputHalf, isDarkMode && styles.inputDark]}
              placeholder="Nota Fiscal"
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              value={invoice}
              onChangeText={setInvoice}
            />
          </View>

          <TouchableOpacity style={[styles.scanButton, { borderColor: primaryColor }]}>
            <Icon name="qr-code-scanner" size={24} color={primaryColor} />
            <Text style={[styles.scanText, { color: primaryColor }]}>Escanear Código</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.registerButton, { backgroundColor: primaryColor }]}
          onPress={registrarEntrada}
        >
          <Text style={styles.buttonText}>Registrar Entrada</Text>
        </TouchableOpacity>
        
        <View style={styles.historicoContainer}>
          <Text style={[styles.historicoTitle, isDarkMode && styles.textDark]}>Histórico de Entradas</Text>
          
          {historico.map((item) => (
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
                  <Text style={[styles.detailLabel, isDarkMode && styles.textDark]}>Quantidade:</Text>
                  <Text style={[styles.detailValue, isDarkMode && styles.textDark]}>{item.quantidade}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, isDarkMode && styles.textDark]}>Preço Unit.:</Text>
                  <Text style={[styles.detailValue, isDarkMode && styles.textDark]}>{formatarMoeda(item.precoUnitario)}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, isDarkMode && styles.textDark]}>Total:</Text>
                  <Text style={[styles.detailValue, isDarkMode && styles.textDark]}>
                    {formatarMoeda(item.quantidade * item.precoUnitario)}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, isDarkMode && styles.textDark]}>Fornecedor:</Text>
                  <Text style={[styles.detailValue, isDarkMode && styles.textDark]}>{item.fornecedor}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, isDarkMode && styles.textDark]}>Categoria:</Text>
                  <Text style={[styles.detailValue, isDarkMode && styles.textDark]}>{item.categoria}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, isDarkMode && styles.textDark]}>Nota Fiscal:</Text>
                  <Text style={[styles.detailValue, isDarkMode && styles.textDark]}>{item.notaFiscal}</Text>
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
  addButton: {
    padding: 8,
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
  }
});