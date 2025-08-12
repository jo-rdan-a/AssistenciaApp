import Icon from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import colors from './styles/colors';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const isDisabled = email.trim() === '' || senha.trim() === '';

  const handleLogin = () => {
    // Credenciais fixas para teste
    const validEmail = 'admin@admin.com';
    const validPassword = '123456';
    
    if (email === validEmail && senha === validPassword) {
      router.push('/src/adminDashboard');
    } else {
      Alert.alert('Erro', 'Email ou senha incorretos!');
    }
  };

  return (
    <View style={styles.container}>
        <Image
          style={styles.image}
          resizeMode="contain"
          source={require('../../assets/images/logo.png')}
        />
        <Text style={styles.title}>Bem Vindo(a) de volta!</Text>
        <Text style={styles.subtitle}>Entre para continuar</Text>
        
        {/* Input de E-mail */}
        <View style={styles.inputContainer}>
          <Icon name="email" size={24} color="#3466F6" style={styles.inputIcon}/>
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

        {/* Input de Senha com Toggle */}
        <View style={styles.inputContainer}>
          <Icon name="lock" size={24} color="#3466F6" style={styles.inputIcon}/>
          <TextInput
            style={styles.inputField}
            placeholder="Senha"
            placeholderTextColor={colors.gray}
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
        </View>

        {/* Esqueceu sua senha */}
        <TouchableOpacity 
          style={styles.senhaButton}
          onPress={() => router.push('/src/recuperarSenhaScreen')}
        >
          <Text style={styles.textButton}>Esqueceu sua senha?</Text>
        </TouchableOpacity>

        {/* Botão de Login */}
        <TouchableOpacity 
          style={isDisabled ? styles.disabledButton : styles.button} 
          disabled={isDisabled}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        {/* Botão de Criar conta */}
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => router.push('/src/cadastroScreen')}
        >
          <Text style={styles.secondaryButtonText}>Criar conta</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 10,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 200,
    height: 120,
    alignSelf: 'center',
    marginVertical: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.primary,
    marginBottom: 10,
  },
  subtitle:{
    fontSize: 16,
    fontWeight: 'regular',
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
    backgroundColor: '#3466F6',
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
  senhaButton: {
    alignSelf: 'flex-end',
    padding: 10,
    marginBottom: 10,
  },
  textButton: {
    color: '#3466F6',
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
    color: '#3466F6',
    fontSize: 16,
    fontWeight: 'bold',
  },
});