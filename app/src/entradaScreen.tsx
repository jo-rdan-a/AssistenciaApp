import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BackButton from '../../components/BackButton';
import colors from './styles/colors';

export default function EntradaScreen() {
  const [productCode, setProductCode] = useState('');
  const [quantity, setQuantity] = useState('');
  const [supplier, setSupplier] = useState('');

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Controle de Entrada</Text>
      
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Código do Produto"
          keyboardType="numeric"
          value={productCode}
          onChangeText={setProductCode}
        />
        
        <TextInput
          style={styles.input}
          placeholder="Quantidade"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
        />

        <TextInput
          style={styles.input}
          placeholder="Fornecedor"
          value={supplier}
          onChangeText={setSupplier}
        />

        <TouchableOpacity style={styles.scanButton}>
          <MaterialIcons name="qr-code-scanner" size={24} color={colors.primary} />
          <Text style={styles.scanText}>Escanear Código</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.registerButton}>
        <Text style={styles.buttonText}>Registrar Entrada</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.lightGray
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: colors.primary
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
  scanButton: {
    height: 50,
    borderRadius: 8,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row'
  },
  registerButton: {
    height: 50,
    borderRadius: 8,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  scanText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10
  }
});