import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FirebaseService, FirebaseUser } from '../../config/firebaseService';
import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../contexts/ThemeContext';
import colors from './styles/colors';

const AdminDashboard = () => {
 const { isDarkMode, primaryColor } = useTheme();
 const { atendimentos, loading, error } = useData();
 const [userData, setUserData] = useState<FirebaseUser | null>(null);
 const [filtroStatus, setFiltroStatus] = useState<'Todos' | 'Aguardando' | 'Em andamento' | 'Concluído' | 'Recusado'>('Todos');

 useEffect(() => {
const unsubscribe = FirebaseService.onAuthStateChanged((user: FirebaseUser | null) => {
 if (user) {
setUserData(user);
 } else {
router.replace('/src/loginScreen');
 }
});

return () => unsubscribe();
 }, []);

 const getStatusColor = (status: string) => {
switch(status) {
 case 'Aguardando': return '#FFA500';
   case 'Em andamento': return '#3466F6';
   case 'Concluído': return '#4CAF50';
   case 'Recusado': return '#F44336';
   default: return '#666';
  }
 };

 // Filtrar atendimentos por status
 const atendimentosFiltrados = filtroStatus === 'Todos' 
   ? atendimentos 
   : atendimentos.filter(atendimento => atendimento.status === filtroStatus);

 // Calcular estatísticas
 const totalAtendimentos = atendimentos.length;
 const aguardando = atendimentos.filter(a => a.status === 'Aguardando').length;
 const emAndamento = atendimentos.filter(a => a.status === 'Em andamento').length;
 const concluidos = atendimentos.filter(a => a.status === 'Concluído').length;
 const recusados = atendimentos.filter(a => a.status === 'Recusado').length;

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

{/* Estatísticas dos Atendimentos 
<View style={[styles.section, isDarkMode && styles.sectionDark]}>
 <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>Estatísticas dos Atendimentos</Text>
 <View style={styles.statsContainer}>
   <View style={[styles.statCard, isDarkMode && styles.statCardDark]}>
     <Text style={[styles.statNumber, isDarkMode && styles.textDark]}>{totalAtendimentos}</Text>
     <Text style={[styles.statLabel, isDarkMode && styles.textDark]}>Total</Text>
   </View>
   <View style={[styles.statCard, isDarkMode && styles.statCardDark]}>
     <Text style={[styles.statNumber, { color: '#FFA500' }]}>{aguardando}</Text>
     <Text style={[styles.statLabel, isDarkMode && styles.textDark]}>Aguardando</Text>
   </View>
   <View style={[styles.statCard, isDarkMode && styles.statCardDark]}>
     <Text style={[styles.statNumber, { color: '#3466F6' }]}>{emAndamento}</Text>
     <Text style={[styles.statLabel, isDarkMode && styles.textDark]}>Em Andamento</Text>
   </View>
   <View style={[styles.statCard, isDarkMode && styles.statCardDark]}>
     <Text style={[styles.statNumber, { color: '#4CAF50' }]}>{concluidos}</Text>
     <Text style={[styles.statLabel, isDarkMode && styles.textDark]}>Concluídos</Text>
   </View>
   <View style={[styles.statCard, isDarkMode && styles.statCardDark]}>
     <Text style={[styles.statNumber, { color: '#F44336' }]}>{recusados}</Text>
     <Text style={[styles.statLabel, isDarkMode && styles.textDark]}>Recusados</Text>
   </View>
 </View>
</View>*/}

{/* Filtros de Status */}
<View style={[styles.section, isDarkMode && styles.sectionDark]}>
 <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>Filtrar por Status</Text>
 <View style={styles.filterContainer}>
   {['Todos', 'Aguardando', 'Em andamento', 'Concluído', 'Recusado'].map((status) => (
     <TouchableOpacity
       key={status}
       style={[
         styles.filterButton,
         filtroStatus === status && styles.filterButtonActive,
         isDarkMode && styles.filterButtonDark
       ]}
       onPress={() => setFiltroStatus(status as any)}
     >
       <Text style={[
         styles.filterButtonText,
         filtroStatus === status && styles.filterButtonTextActive,
         isDarkMode && styles.textDark
       ]}>
         {status}
       </Text>
     </TouchableOpacity>
   ))}
 </View>
</View>

{/* Lista de Atendimentos */}
<View style={[styles.section, isDarkMode && styles.sectionDark]}>
 <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>
   Atendimentos {filtroStatus !== 'Todos' && `(${filtroStatus})`}
 </Text>
 {atendimentosFiltrados.length > 0 ? (
atendimentosFiltrados.map((atendimento) => (
 <View key={atendimento.id} style={[styles.employeeCard, isDarkMode && styles.employeeCardDark]}>
<Text style={[styles.employeeName, isDarkMode && styles.textDark]}>{atendimento.clienteNome}</Text>
<Text style={[styles.statusText, { color: getStatusColor(atendimento.status) }]}>{atendimento.status}</Text>
<View style={styles.row}>
 <Text style={isDarkMode && styles.textDark}>Equipamento: {atendimento.equipamentoNome}</Text>
</View>
<View style={styles.row}>
 <Text style={isDarkMode && styles.textDark}>Problema: {atendimento.problema}</Text>
</View>
<View style={styles.totalRow}>
 <Text style={[styles.bold, isDarkMode && styles.textDark]}>Técnico: {atendimento.tecnico}</Text>
 {atendimento.valorServico && (
<Text style={[styles.bold, isDarkMode && styles.textDark]}>Valor: R$ {atendimento.valorServico.toFixed(2)}</Text>
 )}
</View>
 </View>
))
 ) : (
<View style={styles.emptyContainer}>
 <Text style={[styles.emptyText, isDarkMode && styles.textDark]}>
   {filtroStatus === 'Todos' ? 'Nenhum atendimento encontrado.' : `Nenhum atendimento com status "${filtroStatus}".`}
 </Text>
</View>
 )}
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
 statusText: {
fontWeight: 'bold',
marginBottom: 8,
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
 emptyContainer: {
alignItems: 'center',
padding: 20,
 },
 emptyText: {
fontSize: 16,
textAlign: 'center',
marginTop: 10,
 },
 statsContainer: {
   flexDirection: 'row',
   flexWrap: 'wrap',
   justifyContent: 'space-between',
   marginTop: 10,
 },
 statCard: {
   width: '18%',
   backgroundColor: '#f8f9fa',
   borderRadius: 8,
   padding: 10,
   alignItems: 'center',
   marginBottom: 10,
 },
 statCardDark: {
   backgroundColor: '#2C2C2C',
 },
 statNumber: {
   fontSize: 20,
   fontWeight: 'bold',
   color: '#333',
 },
 statLabel: {
   fontSize: 12,
   color: '#666',
   marginTop: 4,
   textAlign: 'center',
 },
 filterContainer: {
   flexDirection: 'row',
   flexWrap: 'wrap',
   marginTop: 10,
   gap: 8,
 },
 filterButton: {
   paddingHorizontal: 12,
   paddingVertical: 6,
   borderRadius: 16,
   backgroundColor: '#f0f0f0',
   borderWidth: 1,
   borderColor: '#ddd',
 },
 filterButtonActive: {
   backgroundColor: colors.primary,
   borderColor: colors.primary,
 },
 filterButtonDark: {
   backgroundColor: '#2C2C2C',
   borderColor: '#444',
 },
 filterButtonText: {
   fontSize: 12,
   color: '#333',
   fontWeight: '500',
 },
 filterButtonTextActive: {
   color: colors.white,
 },
});

export default AdminDashboard;