import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const AdminDashboard = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <ScrollView style={styles.container}>
        {/* Cabeçalho dentro do ScrollView, alinhado */}
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Image
              source={require('../assets/images/servico-tecnico.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appTitle}>Assistência Técnica</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <MaterialIcons name="account-circle" size={40} color="#2A5C8A" />
          </TouchableOpacity>
        </View>
    
        {/* caixa com a movimentação do dia*/
          } 
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Caixa do Dia</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>Valor arrecadado até o momento</Text>
            <Text style={styles.infoText}>Movimentação da assistência em tempo real</Text>
          </View>
        </View>

        {/* produtos entregues e em andamento */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Minha Assistência</Text>
          <View style={styles.employeeCard}>
            <Text style={styles.employeeName}>Eduardo Oliveira</Text>
            <View style={styles.row}>
              <Text>Dinheiro: R$ 30,00</Text>
              <Text>Cartão: R$ 290,00</Text>
            </View>
            <View style={styles.row}>
              <Text>A receber: R$ 630,00</Text>
              <Text>Despesas: R$ 0,00</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.bold}>Total: R$ 950,00</Text>
              <Text style={styles.status}>Na assistência</Text>
            </View>
          </View>
          <View style={styles.employeeCard}>
            <Text style={styles.employeeName}>Alex</Text>
            <View style={styles.row}>
              <Text>Dinheiro: R$ 45,00</Text>
              <Text>Cartão: R$ 150,00</Text>
            </View>
            <View style={styles.row}>
              <Text>A receber: R$ 420,00</Text>
              <Text>Despesas: R$ 25,00</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.bold}>Total: R$ 615,00</Text>
              <Text style={styles.status}>Entrega(o)</Text>
            </View>
          </View>
        </View>


        {/* Ações Rápidas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AÇÕES RÁPIDAS</Text>
          <View style={styles.quickActions}>
            <Link href="/src/entradaScreen" asChild>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialIcons name="login" size={24} color="#333" />
                <Text style={styles.actionText}>ENTRADA</Text>
              </TouchableOpacity>
            </Link>
            <TouchableOpacity style={styles.actionButton}>
              <MaterialIcons name="assignment" size={24} color="#333" />
              <Text style={styles.actionText}>ATENDIMENTO</Text>
            </TouchableOpacity>
            <Link href="/src/saidaScreen" asChild>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialIcons name="logout" size={24} color="#333" />
                <Text style={styles.actionText}>SAÍDA</Text>
              </TouchableOpacity>
            </Link>
            <Link href="/src/agendamentoScreen" asChild>
              <TouchableOpacity style={styles.actionButton}>
                <MaterialIcons name="calendar-today" size={24} color="#333" />
                <Text style={styles.actionText}>AGENDA</Text>
              </TouchableOpacity>
            </Link>
            <View style={styles.actionButton}>
              <MaterialIcons name="attach-money" size={24} color="#333" />
              <Text style={styles.actionText}>ORÇAMENTO</Text>
            </View>
            <View style={styles.actionButton}>
              <MaterialIcons name="people" size={24} color="#333" />
              <Text style={styles.actionText}>CLIENTES</Text>
            </View>
          </View>
        </View>

        
       
        {/* Sugestão: Adicione um rodapé com informações de contato ou versão do app aqui */}
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
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  appTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2A5C8A',
  },
  profileButton: {
    padding: 4,
    marginRight: 8,
  },
  container: {
    flex: 1,
    padding: 15,
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  adminSection: {
    backgroundColor: '#f0f4fa', // Sugestão: cor diferente para destacar
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
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  actionText: {
    marginTop: 5,
    fontSize: 12,
    textAlign: 'center',
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
});

export default AdminDashboard;