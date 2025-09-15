import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FirebaseService, FirebaseUser } from '../../config/firebaseService';
import { useTheme } from '../../contexts/ThemeContext';
import colors from './styles/colors';

const AdminDashboard = () => {
  const { isDarkMode, primaryColor } = useTheme();
  const [userData, setUserData] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = FirebaseService.onAuthStateChanged((user: FirebaseUser | null) => {
      if (user) {
        setUserData(user);
      } else {
        router.replace('/src/loginScreen');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  if (loading) {
    return (
      <View style={[styles.container, isDarkMode && styles.containerDark]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, isDarkMode && styles.textDark]}>Carregando...</Text>
        </View>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cabeçalho dentro do ScrollView, alinhado */}
          <View style={[styles.headerRow, isDarkMode && styles.headerRowDark]}>
            <View style={styles.headerLeft}>
              <Text style={[styles.sectionTitle, {color: primaryColor}]}>
                Olá, {userData?.userData?.nome?.split(' ')[0] || userData?.displayName?.split(' ')[0] || 'Usuário'}
              </Text>
            </View>
            <TouchableOpacity 
              style={[styles.profileButton, isDarkMode && styles.profileButtonDark]}
              onPress={() => router.push('/src/perfilScreen')}
            >
              <MaterialIcons name="person" size={24} color={primaryColor} />
            </TouchableOpacity>
          </View>
    
        {/* caixa com a movimentação do dia*/} 
        <View style={[styles.section, isDarkMode && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>Caixa do Dia</Text>
          <View style={[styles.infoBox, isDarkMode && styles.infoBoxDark]}>
            <Text style={[styles.infoText, isDarkMode && styles.textDark]}>Valor arrecadado até o momento</Text>
            <Text style={[styles.infoText, isDarkMode && styles.textDark]}>Movimentação da assistência em tempo real</Text>
          </View>
        </View>

        {/* produtos entregues e em andamento */}
        <View style={[styles.section, isDarkMode && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>Minha Assistência</Text>
          <View style={[styles.employeeCard, isDarkMode && styles.employeeCardDark]}>
            <Text style={[styles.employeeName, isDarkMode && styles.textDark]}>Eduardo Oliveira</Text>
            <View style={styles.row}>
              <Text style={isDarkMode && styles.textDark}>Dinheiro: R$ 30,00</Text>
              <Text style={isDarkMode && styles.textDark}>Cartão: R$ 290,00</Text>
            </View>
            <View style={styles.row}>
              <Text style={isDarkMode && styles.textDark}>A receber: R$ 630,00</Text>
              <Text style={isDarkMode && styles.textDark}>Despesas: R$ 0,00</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={[styles.bold, isDarkMode && styles.textDark]}>Total: R$ 950,00</Text>
              <Text style={[styles.status, {color: primaryColor}]}>Na assistência</Text>
            </View>
          </View>
          <View style={[styles.employeeCard, isDarkMode && styles.employeeCardDark]}>
            <Text style={[styles.employeeName, isDarkMode && styles.textDark]}>Alex</Text>
            <View style={styles.row}>
              <Text style={isDarkMode && styles.textDark}>Dinheiro: R$ 45,00</Text>
              <Text style={isDarkMode && styles.textDark}>Cartão: R$ 150,00</Text>
            </View>
            <View style={styles.row}>
              <Text style={isDarkMode && styles.textDark}>A receber: R$ 420,00</Text>
              <Text style={isDarkMode && styles.textDark}>Despesas: R$ 25,00</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={[styles.bold, isDarkMode && styles.textDark]}>Total: R$ 615,00</Text>
              <Text style={[styles.status, {color: primaryColor}]}>Entrega(o)</Text>
            </View>
          </View>
        </View>

        {/* Ações Rápidas */}
        <View style={[styles.section, isDarkMode && styles.sectionDark]}>
          <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>AÇÕES RÁPIDAS</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.actionButton, isDarkMode && styles.actionButtonDark]}
              onPress={() => router.push('/src/entradaScreen')}
            >
              <MaterialIcons name="login" size={24} color={primaryColor} />
              <Text style={[styles.actionText, isDarkMode && styles.textDark]}>ENTRADA</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, isDarkMode && styles.actionButtonDark]}
              onPress={() => router.push('/src/atendimentoScreen')}
            >
              <MaterialIcons name="assignment" size={24} color={primaryColor} />
              <Text style={[styles.actionText, isDarkMode && styles.textDark]}>ATENDIMENTO</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, isDarkMode && styles.actionButtonDark]}
              onPress={() => router.push('/src/saidaScreen')}
            >
              <MaterialIcons name="logout" size={24} color={primaryColor} />
              <Text style={[styles.actionText, isDarkMode && styles.textDark]}>SAÍDA</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, isDarkMode && styles.actionButtonDark]}
              onPress={() => router.push('/src/agendamentoScreen')}
            >
              <MaterialIcons name="calendar-today" size={24} color={primaryColor} />
              <Text style={[styles.actionText, isDarkMode && styles.textDark]}>AGENDA</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, isDarkMode && styles.actionButtonDark]}
              onPress={() => router.push('/src/orcamentoScreen')}
            >
              <MaterialIcons name="attach-money" size={24} color={primaryColor} />
              <Text style={[styles.actionText, isDarkMode && styles.textDark]}>ORÇAMENTO</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, isDarkMode && styles.actionButtonDark]}
              onPress={() => router.push('/src/clientesScreen')}
            >
              <MaterialIcons name="people" size={24} color={primaryColor} />
              <Text style={[styles.actionText, isDarkMode && styles.textDark]}>CLIENTES</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 0,
    marginBottom: 10,
    borderRadius: 0,
  },
  headerRowDark: {
    backgroundColor: 'transparent',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  logo: {
    width: 200,
    height: 100,
    marginRight: 10,
  },
  profileButton: {
    padding: 4,
    marginRight: 8,
  },
  profileButtonDark: {
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: colors.background,
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  section: {
    marginBottom: 20,
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: 15,
  },
  sectionDark: {
    backgroundColor: '#1E1E1E',
  },
  adminSection: {
    backgroundColor: '#f0f4fa',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  infoBox: {
    marginBottom: 10,
  },
  infoBoxDark: {
    backgroundColor: '#2C2C2C',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  employeeCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  employeeCardDark: {
    borderColor: '#444',
    backgroundColor: '#2C2C2C',
  },
  employeeName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  bold: {
    fontWeight: 'bold',
  },
  status: {
    color: 'green',
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    backgroundColor: colors.white,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.primary
  },
  actionButtonDark: {
    backgroundColor: '#2C2C2C',
    borderColor: '#444',
  },
  actionText: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
    color: colors.primary,
  },
  textDark: {
    color: '#E0E0E0',
  },
  adminAction: {
    padding: 12,
    backgroundColor: '#e9e9e9',
    borderRadius: 6,
    marginBottom: 8,
  },
  adminText: {
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
  },
});

export default AdminDashboard;