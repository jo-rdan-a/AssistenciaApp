import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useFirebaseConnection } from '../hooks/useFirebase';
import { clienteService } from '../services/firestoreService';

export const FirebaseTest: React.FC = () => {
  const { user, signOut } = useAuth();
  const { isConnected, isChecking } = useFirebaseConnection();
  const [testando, setTestando] = useState(false);

  const testarFirestore = async () => {
    setTestando(true);
    try {
      // Testa criar um cliente de exemplo
      const clienteId = await clienteService.criar({
        nome: 'Cliente Teste',
        email: 'teste@exemplo.com',
        telefone: '11999999999',
        observacoes: 'Cliente criado para teste do Firebase'
      });

      Alert.alert('Sucesso!', `Cliente criado com ID: ${clienteId}`);
      
      // Lista os clientes para confirmar
      const clientes = await clienteService.listar();
      console.log('Clientes no banco:', clientes);
      
    } catch (error: any) {
      Alert.alert('Erro', `Erro ao testar Firestore: ${error.message}`);
    } finally {
      setTestando(false);
    }
  };

  const testarAuth = () => {
    if (user) {
      Alert.alert('Auth OK', `Usuário logado: ${user.email}`);
    } else {
      Alert.alert('Auth', 'Nenhum usuário logado');
    }
  };

  if (isChecking) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Verificando conexão com Firebase...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Teste do Firebase</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.label}>Status da Conexão:</Text>
        <Text style={[styles.status, { color: isConnected ? 'green' : 'red' }]}>
          {isConnected ? 'Conectado' : 'Desconectado'}
        </Text>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.label}>Usuário:</Text>
        <Text style={styles.status}>
          {user ? user.email : 'Não logado'}
        </Text>
      </View>

      <TouchableOpacity 
        style={[styles.button, !isConnected && styles.disabledButton]} 
        onPress={testarFirestore}
        disabled={!isConnected || testando}
      >
        <Text style={styles.buttonText}>
          {testando ? 'Testando...' : 'Testar Firestore'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={testarAuth}>
        <Text style={styles.buttonText}>Testar Auth</Text>
      </TouchableOpacity>

      {user && (
        <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={signOut}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    margin: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#3466F6',
    padding: 12,
    borderRadius: 8,
    marginVertical: 5,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  text: {
    textAlign: 'center',
    fontSize: 16,
  },
});
