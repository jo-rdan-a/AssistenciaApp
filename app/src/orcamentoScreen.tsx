import Icon from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useData } from '../../contexts/DataContext';
import { useTheme } from '../../contexts/ThemeContext';
import colors from './styles/colors';

interface Orcamento {
  id: string;
  cliente: string;
  equipamento: string;
  descricao: string;
  valor: number;
  status: 'Pendente' | 'Aprovado' | 'Recusado';
  data: string;
  tecnico: string;
}

export default function OrcamentoScreen() {
  const { isDarkMode, primaryColor } = useTheme();
  const { atendimentos, updateAtendimento, loading } = useData();
  const [busca, setBusca] = useState('');
  
  const orcamentos = atendimentos
    .filter(atendimento => atendimento.valorServico && atendimento.valorServico > 0) // Apenas atendimentos com valor
    .map(atendimento => ({
      id: atendimento.id,
      cliente: atendimento.clienteNome,
      equipamento: atendimento.equipamentoNome,
      descricao: atendimento.problema,
      valor: atendimento.valorServico || 0,
      status: atendimento.status === 'Concluído' ? 'Aprovado' : atendimento.status === 'Recusado' ? 'Recusado' : 'Pendente',
      data: atendimento.data,
      tecnico: atendimento.tecnico,
    }));

  const orcamentosFiltrados = orcamentos.filter(item => 
    item.cliente.toLowerCase().includes(busca.toLowerCase()) ||
    item.equipamento.toLowerCase().includes(busca.toLowerCase()) ||
    item.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pendente': return '#FFA500';
      case 'Aprovado': return '#4CAF50';
      case 'Recusado': return '#F44336';
      default: return colors.gray;
    }
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const isOrcamentoAltoValor = (valor: number) => {
    return valor > 300;
  };

  const handleAprovarOrcamento = async (id: string) => {
    try {
      await updateAtendimento(id, { status: 'Concluído' });
      Alert.alert('Sucesso', 'Orçamento aprovado e atendimento concluído!');
    } catch (err) {
      Alert.alert('Erro', err instanceof Error ? err.message : 'Erro ao aprovar orçamento');
    }
  };

  const handleRecusarOrcamento = async (id: string) => {
    try {
      await updateAtendimento(id, { status: 'Recusado' });
      Alert.alert('Sucesso', 'Orçamento recusado!');
    } catch (err) {
      Alert.alert('Erro', err instanceof Error ? err.message : 'Erro ao recusar orçamento');
    }
  };
  
  // Seus botões de "Novo Orçamento" e "Editar Orçamento" não farão mais nada, já que a lógica agora é puxar de atendimentos.
  const handleNovoOrcamento = () => {
    Alert.alert('Novo Orçamento', 'Crie um novo atendimento para gerar um orçamento.');
  };

  const handleEditarOrcamento = () => {
    Alert.alert('Editar Orçamento', 'Edite o atendimento correspondente para alterar o orçamento.');
  };


  return (
    <View style={[styles.container, isDarkMode && styles.containerDark]}>
      <View style={[styles.header, isDarkMode && styles.headerDark]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={primaryColor} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: primaryColor}]}>Orçamentos</Text>
        <TouchableOpacity onPress={handleNovoOrcamento} style={styles.addButton}>
          <Icon name="add" size={24} color={primaryColor} />
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, isDarkMode && styles.searchContainerDark]}>
        <Icon name="search" size={20} color={isDarkMode ? '#E0E0E0' : colors.gray} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, isDarkMode && styles.searchInputDark]}
          placeholder="Buscar orçamento..."
          placeholderTextColor={isDarkMode ? '#A0A0A0' : colors.gray}
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      <FlatList
        data={orcamentosFiltrados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.card, isDarkMode && styles.cardDark]}
            onPress={() => handleEditarOrcamento()}
          >
            <View style={styles.cardHeader}>
              <Text style={[styles.clienteName, isDarkMode && styles.textDark]}>{item.cliente}</Text>
              <View style={styles.headerRight}>
                {isOrcamentoAltoValor(item.valor) && (
                  <View style={styles.altoValorBadge}>
                    <Text style={styles.altoValorText}>Alto Valor</Text>
                  </View>
                )}
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
            </View>
            <View style={styles.cardBody}>
              <Text style={[styles.equipamento, isDarkMode && styles.textDark]}><Text style={[styles.label, isDarkMode && styles.labelDark]}>Equipamento:</Text> {item.equipamento}</Text>
              <Text style={[styles.descricao, isDarkMode && styles.textDark]}><Text style={[styles.label, isDarkMode && styles.labelDark]}>Descrição:</Text> {item.descricao}</Text>
              <Text style={[styles.tecnico, isDarkMode && styles.textDark]}><Text style={[styles.label, isDarkMode && styles.labelDark]}>Técnico:</Text> {item.tecnico}</Text>
              <View style={styles.cardFooter}>
                <Text style={[styles.data, isDarkMode && styles.textDark]}><Text style={[styles.label, isDarkMode && styles.labelDark]}>Data:</Text> {item.data}</Text>
                <Text style={[styles.valor, isDarkMode && styles.valorDark]}>{formatarValor(item.valor)}</Text>
              </View>
              {item.status === 'Pendente' && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[styles.approveButton, isDarkMode && styles.approveButtonDark, { flex: 1 }]} 
                    onPress={() => handleAprovarOrcamento(item.id)}
                  >
                    <Icon name="check-circle" size={16} color={isDarkMode ? '#121212' : colors.white} />
                    <Text style={[styles.approveButtonText, isDarkMode && styles.approveButtonTextDark]}>Aprovar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.declineButton, isDarkMode && styles.declineButtonDark, { flex: 1 }]} 
                    onPress={() => handleRecusarOrcamento(item.id)}
                  >
                    <Icon name="cancel" size={16} color={isDarkMode ? '#121212' : colors.white} />
                    <Text style={[styles.declineButtonText, isDarkMode && styles.declineButtonTextDark]}>Recusar</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="search-off" size={50} color={isDarkMode ? '#A0A0A0' : colors.gray} />
            <Text style={[styles.emptyText, isDarkMode && styles.textDark]}>Nenhum orçamento encontrado</Text>
          </View>
        }
      />
    </View>
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
    color: colors.primary,
  },
  addButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  searchContainerDark: {
    backgroundColor: '#1E1E1E',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#333',
  },
  searchInputDark: {
    color: '#E0E0E0',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardDark: {
    backgroundColor: '#1E1E1E',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clienteName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardBody: {
    gap: 4,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  label: {
    fontWeight: 'bold',
    color: colors.gray,
  },
  labelDark: {
    color: '#A0A0A0',
  },
  equipamento: {
    fontSize: 14,
    color: '#333',
  },
  descricao: {
    fontSize: 14,
    color: '#333',
  },
  tecnico: {
    fontSize: 14,
    color: '#333',
  },
  data: {
    fontSize: 14,
    color: '#333',
  },
  textDark: {
    color: '#E0E0E0',
  },
  valor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  valorDark: {
    color: '#E0E0E0',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 16,
    color: colors.gray,
    textAlign: 'center',
  },
  altoValorBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  altoValorText: {
    color: '#333',
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  approveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    flex: 1,
    gap: 8,
  },
  approveButtonDark: {
    backgroundColor: '#8BC34A',
  },
  approveButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  approveButtonTextDark: {
    color: '#121212',
  },
  declineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    flex: 1,
    gap: 8,
  },
  declineButtonDark: {
    backgroundColor: '#E57373',
  },
  declineButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  declineButtonTextDark: {
    color: '#121212',
  },
});