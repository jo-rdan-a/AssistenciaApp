import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EntradaScreen() {
  const [productCode, setProductCode] = useState('');
  const [quantity, setQuantity] = useState('');
  const [supplier, setSupplier] = useState('');

  return (
    <View style={styles.container}>
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
          <MaterialIcons name="qr-code-scanner" size={24} color="white" />
          <Text style={styles.buttonText}>Escanear Código</Text>
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
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#2A5C8A'
  },
  form: {
    backgroundColor: 'white',
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
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: 'white'
  },
  scanButton: {
    height: 50,
    borderRadius: 8,
    backgroundColor: '#2A5C8A',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row'
  },
  registerButton: {
    height: 50,
    borderRadius: 8,
    backgroundColor: '#F07F13',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10
  }
});