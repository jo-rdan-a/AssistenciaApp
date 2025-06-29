import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BackButton from '../../components/BackButton';
import css from './styles/globalStyles';

export default function SaidaScreen() {
  const [osNumber, setOsNumber] = useState('');
  const [quantities, setQuantities] = useState(['', '', '']);
  const [technician, setTechnician] = useState('');
  const [completionDate, setCompletionDate] = useState('');

  const updateQuantity = (index: number, value: string) => {
    const newQuantities = [...quantities];
    newQuantities[index] = value;
    setQuantities(newQuantities);
  };

  return (
    <View style={css.container}>
      <BackButton />
      <ScrollView contentContainerStyle={css.container}>
        <Text style={css.title}>Controle de Saída</Text>
        
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="N° da OS"
            keyboardType="numeric"
            value={osNumber}
            onChangeText={setOsNumber}
          />
          
          <View style={styles.productList}>
            {[1, 2, 3].map((item, index) => (
              <View key={item} style={styles.productItem}>
                <Text style={styles.productText}>Peça {item}</Text>
                <TextInput 
                  style={styles.quantityInput}
                  placeholder="Qtd"
                  keyboardType="numeric"
                  value={quantities[index]}
                  onChangeText={(value) => updateQuantity(index, value)}
                />
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity style={css.registerButton}>
          <Text style={css.buttonText}>Registrar Saída</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 20,
    backgroundColor: 'white'
  },
  productList: {
    marginTop: 10
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  productText: {
    fontSize: 16,
    color: '#333',
    flex: 1
  },
  quantityInput: {
    width: 80,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    textAlign: 'center',
    backgroundColor: 'white'
  }
});