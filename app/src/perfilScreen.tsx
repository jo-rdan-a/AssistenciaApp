import Icon from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
<<<<<<< HEAD
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth } from '../../config/firebase';
import { FirebaseService, FirebaseUser } from '../../config/firebaseService';
import { useTheme } from '../../contexts/ThemeContext';
import { UserService } from '../../services/userService';
=======
import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
>>>>>>> bb36819fe5797ef6aa9436cfd61f3900cc6aeb43
import colors from './styles/colors';

export default function PerfilScreen() {
  const { isDarkMode, primaryColor } = useTheme();
<<<<<<< HEAD
  const [userData, setUserData] = useState<FirebaseUser | null>(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cargo, setCargo] = useState('Técnico');
  const [editando, setEditando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const unsubscribe = FirebaseService.onAuthStateChanged((user: FirebaseUser | null) => {
      if (user) {
        setUserData(user);
        setNome(user.userData?.nome || user.displayName || 'Usuário');
        setEmail(user.email || '');
        setTelefone(user.userData?.telefone || '');
        setCargo(user.userData?.tipo === 'admin' ? 'Administrador' : 'Técnico');
      } else {
        router.replace('/src/loginScreen');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSalvar = async () => {
=======
  const [nome, setNome] = useState('Eduardo Oliveira');
  const [email, setEmail] = useState('eduardo@assistencia.com');
  const [telefone, setTelefone] = useState('(11) 98765-4321');
  const [cargo, setCargo] = useState('Técnico');
  const [editando, setEditando] = useState(false);

  const handleSalvar = () => {
>>>>>>> bb36819fe5797ef6aa9436cfd61f3900cc6aeb43
    if (nome.trim() === '' || email.trim() === '' || telefone.trim() === '') {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

<<<<<<< HEAD
    if (!userData?.uid) {
      Alert.alert('Erro', 'Usuário não encontrado');
      return;
    }

    setSalvando(true);
    try {
      // Atualizar dados no Firestore
      const sucesso = await UserService.updateUser(userData.uid, {
        nome: nome.trim(),
        telefone: telefone.trim(),
        endereco: userData.userData?.endereco || '',
        observacoes: userData.userData?.observacoes || ''
      });

      if (sucesso) {
        Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
        setEditando(false);
        // Recarregar dados do usuário
        const dadosAtualizados = await FirebaseService.getUserData(userData.uid);
        if (dadosAtualizados) {
          setUserData({
            ...userData,
            userData: dadosAtualizados
          });
        }
      } else {
        Alert.alert('Erro', 'Erro ao atualizar perfil');
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      Alert.alert('Erro', 'Erro ao salvar alterações');
    } finally {
      setSalvando(false);
    }
=======
    // Aqui seria implementada a lógica de atualização do perfil com API
    Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    setEditando(false);
>>>>>>> bb36819fe5797ef6aa9436cfd61f3900cc6aeb43
  };

  const handleAlterarSenha = () => {
    Alert.alert('Alterar Senha', 'Funcionalidade em desenvolvimento');
<<<<<<< HEAD
  };

  const handleLogout = async () => {
=======
    // Aqui seria implementada a navegação para a tela de alteração de senha
  };

  const handleLogout = () => {
>>>>>>> bb36819fe5797ef6aa9436cfd61f3900cc6aeb43
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sim',
<<<<<<< HEAD
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace('/src/loginScreen');
            } catch (error) {
              Alert.alert('Erro', 'Erro ao fazer logout');
            }
          },
=======
          onPress: () => router.push('/src/loginScreen'),
>>>>>>> bb36819fe5797ef6aa9436cfd61f3900cc6aeb43
        },
      ],
    );
  };

<<<<<<< HEAD
  if (loading) {
    return (
      <ScrollView style={[styles.container, isDarkMode && styles.containerDark]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, isDarkMode && styles.textDark]}>Carregando...</Text>
        </View>
      </ScrollView>
    );
  }

=======
>>>>>>> bb36819fe5797ef6aa9436cfd61f3900cc6aeb43
  return (
    <ScrollView style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={primaryColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: primaryColor }, isDarkMode && styles.textDark]}>Meu Perfil</Text>
        <TouchableOpacity 
          onPress={() => editando ? handleSalvar() : setEditando(true)} 
<<<<<<< HEAD
          style={[styles.editButton, salvando && styles.editButtonDisabled]}
          disabled={salvando}
        >
          <Icon 
            name={editando ? (salvando ? "hourglass-empty" : "check") : "edit"} 
            size={24} 
            color={salvando ? colors.gray : primaryColor} 
          />
=======
          style={styles.editButton}
        >
          <Icon name={editando ? "check" : "edit"} size={24} color={primaryColor} />
>>>>>>> bb36819fe5797ef6aa9436cfd61f3900cc6aeb43
        </TouchableOpacity>
      </View>

      <View style={styles.profileImageContainer}>
        <View style={[styles.profileImage, isDarkMode && styles.profileImageDark]}>
          <Icon name="account-circle" size={100} color={primaryColor} />
        </View>
        {editando && (
          <TouchableOpacity style={[styles.changePhotoButton, { backgroundColor: primaryColor }]}>
            <Icon name="camera-alt" size={20} color={colors.white} />
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.infoContainer, isDarkMode && styles.infoContainerDark]}>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, isDarkMode && styles.infoLabelDark]}>Nome</Text>
          {editando ? (
            <TextInput
              style={[styles.input, isDarkMode && styles.inputDark]}
              value={nome}
              onChangeText={setNome}
              placeholder="Nome completo"
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
            />
          ) : (
            <Text style={[styles.infoValue, isDarkMode && styles.infoValueDark]}>{nome}</Text>
          )}
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, isDarkMode && styles.infoLabelDark]}>E-mail</Text>
<<<<<<< HEAD
          <Text style={[styles.infoValue, isDarkMode && styles.infoValueDark]}>{email}</Text>
          
=======
          {editando ? (
            <TextInput
              style={[styles.input, isDarkMode && styles.inputDark]}
              value={email}
              onChangeText={setEmail}
              placeholder="E-mail"
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          ) : (
            <Text style={[styles.infoValue, isDarkMode && styles.infoValueDark]}>{email}</Text>
          )}
>>>>>>> bb36819fe5797ef6aa9436cfd61f3900cc6aeb43
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, isDarkMode && styles.infoLabelDark]}>Telefone</Text>
          {editando ? (
            <TextInput
              style={[styles.input, isDarkMode && styles.inputDark]}
              value={telefone}
              onChangeText={setTelefone}
              placeholder="Telefone"
              placeholderTextColor={isDarkMode ? '#888' : '#aaa'}
              keyboardType="phone-pad"
            />
          ) : (
            <Text style={[styles.infoValue, isDarkMode && styles.infoValueDark]}>{telefone}</Text>
          )}
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, isDarkMode && styles.infoLabelDark]}>Cargo</Text>
          <Text style={[styles.infoValue, isDarkMode && styles.infoValueDark]}>{cargo}</Text>
        </View>
      </View>

      <View style={[styles.actionsContainer, isDarkMode && styles.actionsContainerDark]}>
        <TouchableOpacity 
          style={[styles.actionButton, isDarkMode && styles.actionButtonDark]}
          onPress={handleAlterarSenha}
        >
          <Icon name="lock" size={24} color={primaryColor} style={styles.actionIcon} />
          <Text style={[styles.actionText, isDarkMode && styles.actionTextDark]}>Alterar Senha</Text>
          <Icon name="chevron-right" size={24} color={isDarkMode ? '#aaa' : colors.gray} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, isDarkMode && styles.actionButtonDark]}
          onPress={() => router.push('/src/configuracoesScreen')}
        >
          <Icon name="settings" size={24} color={primaryColor} style={styles.actionIcon} />
          <Text style={[styles.actionText, isDarkMode && styles.actionTextDark]}>Configurações</Text>
          <Icon name="chevron-right" size={24} color={isDarkMode ? '#aaa' : colors.gray} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.actionButton, styles.logoutButton, isDarkMode && styles.actionButtonDark]}
          onPress={handleLogout}
        >
          <Icon name="logout" size={24} color="#F44336" style={styles.actionIcon} />
          <Text style={[styles.actionText, styles.logoutText]}>Sair</Text>
          <Icon name="chevron-right" size={24} color={isDarkMode ? '#aaa' : colors.gray} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  },
  textDark: {
    color: '#fff',
  },
  editButton: {
    padding: 8,
  },
<<<<<<< HEAD
  editButtonDisabled: {
    opacity: 0.5,
  },
=======
>>>>>>> bb36819fe5797ef6aa9436cfd61f3900cc6aeb43
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 20,
    position: 'relative',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
  },
  profileImageDark: {
    backgroundColor: '#2A2D2E',
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    margin: 16,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoContainerDark: {
    backgroundColor: '#1E1E1E',
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 4,
  },
  infoLabelDark: {
    color: '#aaa',
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  infoValueDark: {
    color: '#fff',
  },
<<<<<<< HEAD
  infoNote: {
    fontSize: 12,
    color: colors.gray,
    fontStyle: 'italic',
    marginTop: 2,
  },
  infoNoteDark: {
    color: '#aaa',
  },
=======
>>>>>>> bb36819fe5797ef6aa9436cfd61f3900cc6aeb43
  input: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#fff',
  },
  inputDark: {
    borderColor: '#444',
    color: '#fff',
    backgroundColor: '#2A2A2A',
  },
  actionsContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    margin: 16,
    marginTop: 0,
    padding: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionsContainerDark: {
    backgroundColor: '#1E1E1E',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  actionButtonDark: {
    borderBottomColor: '#333',
  },
  actionIcon: {
    marginRight: 16,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  actionTextDark: {
    color: '#fff',
  },
  logoutButton: {
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#F44336',
  },
<<<<<<< HEAD
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
  },
=======
>>>>>>> bb36819fe5797ef6aa9436cfd61f3900cc6aeb43
});