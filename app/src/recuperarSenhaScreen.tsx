import Icon from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
<<<<<<< HEAD
import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../../config/firebase';
=======
import { useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
>>>>>>> bb36819fe5797ef6aa9436cfd61f3900cc6aeb43
import colors from './styles/colors';

export default function RecuperarSenhaScreen() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
<<<<<<< HEAD
  const [loading, setLoading] = useState(false);

  const handleRecuperarSenha = async () => {
=======

  const handleRecuperarSenha = () => {
>>>>>>> bb36819fe5797ef6aa9436cfd61f3900cc6aeb43
    if (email.trim() === '') {
      Alert.alert('Erro', 'Por favor, informe seu e-mail.');
      return;
    }

<<<<<<< HEAD
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setEnviado(true);
    } catch (error: any) {
      let msg = 'Erro ao enviar email de recuperação. Tente novamente.';
      if (error.code === 'auth/user-not-found') {
        msg = 'Nenhum usuário encontrado com este email.';
      } else if (error.code === 'auth/invalid-email') {
        msg = 'Email inválido.';
      }
      Alert.alert('Erro', msg);
    } finally {
      setLoading(false);
    }
=======
    // Aqui seria implementada a lógica de recuperação de senha com API
    setEnviado(true);
>>>>>>> bb36819fe5797ef6aa9436cfd61f3900cc6aeb43
  };

  const handleVoltar = () => {
    router.push('/src/loginScreen');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleVoltar}>
        <Icon name="arrow-back" size={24} color={colors.primary} />
      </TouchableOpacity>

      <Image
        style={styles.image}
        resizeMode="contain"
        source={require('../../assets/images/logo.png')}
      />

      {!enviado ? (
        <>
          <Text style={styles.title}>Recuperar Senha</Text>
          <Text style={styles.subtitle}>Informe seu e-mail para receber as instruções de recuperação de senha</Text>
          
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

          {/* Botão de Enviar */}
          <TouchableOpacity 
<<<<<<< HEAD
            style={email.trim() === '' || loading ? styles.disabledButton : styles.button} 
            disabled={email.trim() === '' || loading}
            onPress={handleRecuperarSenha}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Enviar</Text>
            )}
=======
            style={email.trim() === '' ? styles.disabledButton : styles.button} 
            disabled={email.trim() === ''}
            onPress={handleRecuperarSenha}
          >
            <Text style={styles.buttonText}>Enviar</Text>
>>>>>>> bb36819fe5797ef6aa9436cfd61f3900cc6aeb43
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>E-mail Enviado</Text>
          <Text style={styles.subtitle}>Verifique sua caixa de entrada e siga as instruções enviadas para o e-mail {email}</Text>
          
          <View style={styles.successIcon}>
            <Icon name="check-circle" size={80} color={colors.primary} />
          </View>

          {/* Botão de Voltar para Login */}
          <TouchableOpacity 
            style={styles.button}
            onPress={handleVoltar}
          >
            <Text style={styles.buttonText}>Voltar para Login</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Botão de Voltar para Login */}
      {!enviado && (
        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={handleVoltar}
        >
          <Text style={styles.secondaryButtonText}>Voltar para Login</Text>
        </TouchableOpacity>
      )}
    </View>
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
  button: {
    height: 50,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    height: 50,
    borderRadius: 8,
    backgroundColor: '#7C9EFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  successIcon: {
    alignItems: 'center',
    marginVertical: 30,
  },
});