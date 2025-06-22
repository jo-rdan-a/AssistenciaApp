import Icon from '@expo/vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const isDisabled = email.trim() === '' || senha.trim() === '';

  return (
    <LinearGradient 
      style={styles.container}
      colors={['white', '#b5cef5']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <Image
        style={styles.image}
        source={require('../../../assets/images/servico-tecnico(1).png')} {/* esta porra ta dando errado */}
      />
      <Text style={styles.title}>Bem Vindo</Text>
      
      {/* Input de E-mail */}
      <View style={styles.inputContainer}>
        <Icon name="email" size={24} color="#2A5C8A" style={styles.inputIcon}/>
        <TextInput
          style={styles.inputField}
          placeholder="E-mail"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Input de Senha com Toggle */}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={24} color="#2A5C8A" style={styles.inputIcon}/>
        <TextInput
          style={styles.inputField}
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
      </View>

      {/* Esqueceu sua senha */}
      <TouchableOpacity style={styles.senhaButton}>
        <Text style={styles.textButton}>Esqueceu sua senha?</Text>
      </TouchableOpacity>

      {/* Botão de Login */}
      <Link href="/src/adminDashboard" asChild>
        <TouchableOpacity style={[styles.button, isDisabled && styles.disabledButton]} disabled={isDisabled}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </Link>

      {/* Botão de Criar conta */}
      
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Criar conta</Text>
        </TouchableOpacity>
      
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#2A5C8A',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: 'white',
    marginBottom: 15,
    paddingRight: 10,
  },
  inputField: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
    color: '#333',
  },
  inputIcon: {
    marginLeft: 15,
    marginRight: 10,
  },
  eyeIcon: {
    padding: 10,
  },
  button: {
    height: 50,
    borderRadius: 8,
    backgroundColor: '#F07F13',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  senhaButton: {
    alignSelf: 'flex-end',
    padding: 10,
    marginBottom: 10,
  },
  textButton: {
    color: '#2A5C8A',
    fontSize: 14,
    fontWeight: '500',
  },
  secondaryButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    
  },
  secondaryButtonText: {
    color: '#2A5C8A',
    fontSize: 16,
    fontWeight: 'bold',
  },
});