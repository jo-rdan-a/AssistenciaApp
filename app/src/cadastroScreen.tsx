import Icon from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import colors from './styles/colors';

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const isDisabled = nome.trim() === '' || email.trim() === '' || senha.trim() === '' || confirmarSenha.trim() === '' || telefone.trim() === '';

  const handleCadastro = () => {
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }

    // Aqui seria implementada a lógica de cadastro com API
    Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
      { text: 'OK', onPress: () => router.push('/src/loginScreen') }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Icon name="arrow-back" size={24} color={colors.primary} />
      </TouchableOpacity>

      <Image
        style={styles.image}
        resizeMode="contain"
        source={require('../../assets/images/logo.png')}
      />
      <Text style={styles.title}>Criar Conta</Text>
      <Text style={styles.subtitle}>Preencha os dados para se cadastrar</Text>
      
      {/* Input de Nome */}
      <View style={styles.inputContainer}>
        <Icon name="person" size={24} color={colors.primary} style={styles.inputIcon}/>
        <TextInput
          style={styles.inputField}
          placeholder="Nome completo"
          placeholderTextColor={colors.gray}
          value={nome}
          onChangeText={setNome}
        />
      </View>

      {/* Input de E-mail */}
      <View style={styles.inputContainer}>
        <Icon name="email" size={24} color={colors.primary} style={styles.inputIcon}/>
        <TextInput
          style={styles.inputField}
          placeholder="E-mail"
          placeholderTextColor={colors.gray}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Input de Telefone */}
      <View style={styles.inputContainer}>
        <Icon name="phone" size={24} color={colors.primary} style={styles.inputIcon}/>
        <TextInput
          style={styles.inputField}
          placeholder="Telefone"
          placeholderTextColor={colors.gray}
          keyboardType="phone-pad"
          value={telefone}
          onChangeText={setTelefone}
        />
      </View>

      {/* Input de Senha */}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={24} color={colors.primary} style={styles.inputIcon}/>
        <TextInput
          style={styles.inputField}
          placeholder="Senha"
          placeholderTextColor={colors.gray}
          secureTextEntry={!mostrarSenha}
          value={senha}
          onChangeText={setSenha}
        />
        <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)} style={styles.eyeIcon}>
          <Icon name={mostrarSenha ? "visibility" : "visibility-off"} size={24} color={colors.gray} />
        </TouchableOpacity>
      </View>

      {/* Input de Confirmar Senha */}
      <View style={styles.inputContainer}>
        <Icon name="lock" size={24} color={colors.primary} style={styles.inputIcon}/>
        <TextInput
          style={styles.inputField}
          placeholder="Confirmar senha"
          placeholderTextColor={colors.gray}
          secureTextEntry={!mostrarConfirmarSenha}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />
        <TouchableOpacity onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)} style={styles.eyeIcon}>
          <Icon name={mostrarConfirmarSenha ? "visibility" : "visibility-off"} size={24} color={colors.gray} />
        </TouchableOpacity>
      </View>

      {/* Botão de Cadastro */}
      <TouchableOpacity 
        style={isDisabled ? styles.disabledButton : styles.button} 
        disabled={isDisabled}
        onPress={handleCadastro}
      >
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      {/* Botão de Voltar para Login */}
      <TouchableOpacity 
        style={styles.secondaryButton}
        onPress={() => router.push('/src/loginScreen')}
      >
        <Text style={styles.secondaryButtonText}>Já tenho uma conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  backButton: {
    marginTop: 40,
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 120,
    alignSelf: 'center',
    marginVertical: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.primary,
    marginBottom: 10,
  },
  subtitle:{
    fontSize: 16,
    marginBottom: 30,
    color: colors.gray,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: colors.lightGray,
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: colors.lightGray,
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
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    height: 50,
    borderRadius: 8,
    backgroundColor: '#7C9EFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});