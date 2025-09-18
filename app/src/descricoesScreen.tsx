import Icon from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useCategorias, useDescricoes } from '../../hooks/useDescricoes';
import colors from './styles/colors';

export default function DescricoesScreen() {
  const { 
    descricoes, 
    loading, 
    error, 
    carregarDescricoesAtivas, 
    carregarPorCategoria, 
    buscarDescricoes,
    deletarDescricao,
    toggleAtivo
  } = useDescricoes();
  
  const { categorias, carregarCategorias } = useCategorias();
  
  const [filtro, setFiltro] = useState('');
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>('Todas');
  const [busca, setBusca] = useState('');

  const handleBuscar = () => {
    if (busca.trim()) {
      buscarDescricoes(busca);
    } else {
      carregarDescricoesAtivas();
    }
  };

  const handleFiltrarCategoria = (categoria: string) => {
    setCategoriaSelecionada(categoria);
    if (categoria === 'Todas') {
      carregarDescricoesAtivas();
    } else {
      carregarPorCategoria(categoria);
    }
  };

  const handleDeletar = (id: string, titulo: string) => {
    Alert.alert(
      'Confirmar Exclusão',
      `Tem certeza que deseja excluir "${titulo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive', 
          onPress: async () => {
            try {
              await deletarDescricao(id);
              Alert.alert('Sucesso', 'Descrição excluída com sucesso!');
            } catch (error) {
              Alert.alert('Erro', 'Erro ao excluir descrição');
            }
          }
        }
      ]
    );
  };

  const handleToggleAtivo = async (id: string, ativo: boolean, titulo: string) => {
    try {
      await toggleAtivo(id, !ativo);
      Alert.alert('Sucesso', `Descrição "${titulo}" ${!ativo ? 'ativada' : 'desativada'} com sucesso!`);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao alterar status da descrição');
    }
  };

  const renderDescricao = ({ item }: { item: DescricaoServico }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitulo}>{item.titulo}</Text>
          <Text style={styles.cardCategoria}>{item.categoria}</Text>
        </View>
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={[styles.statusButton, { backgroundColor: item.ativo ? '#4CAF50' : '#F44336' }]}
            onPress={() => handleToggleAtivo(item.id!, item.ativo, item.titulo)}
          >
            <Text style={styles.statusText}>{item.ativo ? 'Ativo' : 'Inativo'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeletar(item.id!, item.titulo)}
          >
            <Icon name="delete" size={20} color="#F44336" />
          </TouchableOpacity>
        </View>
      </View>
      
      <Text style={styles.cardDescricao} numberOfLines={3}>
        {item.descricao}
      </Text>
      
      <View style={styles.cardFooter}>
        <View style={styles.cardInfoItem}>
          <Icon name="attach-money" size={16} color={colors.primary} />
          <Text style={styles.cardInfoText}>R$ {item.preco.toFixed(2)}</Text>
        </View>
        <View style={styles.cardInfoItem}>
          <Icon name="schedule" size={16} color={colors.primary} />
          <Text style={styles.cardInfoText}>{item.duracao} min</Text>
        </View>
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  const renderCategoria = (categoria: string) => (
    <TouchableOpacity
      key={categoria}
      style={[
        styles.categoriaButton,
        categoriaSelecionada === categoria && styles.categoriaButtonAtiva
      ]}
      onPress={() => handleFiltrarCategoria(categoria)}
    >
      <Text style={[
        styles.categoriaText,
        categoriaSelecionada === categoria && styles.categoriaTextAtiva
      ]}>
        {categoria}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Descrições de Serviços</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => router.push('/src/novaDescricaoScreen')}
        >
          <Icon name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Busca */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon name="search" size={20} color={colors.text} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar descrições..."
            placeholderTextColor={colors.text}
            value={busca}
            onChangeText={setBusca}
            onSubmitEditing={handleBuscar}
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleBuscar}>
          <Icon name="search" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Filtros por categoria */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.categoriaButton,
              categoriaSelecionada === 'Todas' && styles.categoriaButtonAtiva
            ]}
            onPress={() => handleFiltrarCategoria('Todas')}
          >
            <Text style={[
              styles.categoriaText,
              categoriaSelecionada === 'Todas' && styles.categoriaTextAtiva
            ]}>
              Todas
            </Text>
          </TouchableOpacity>
          {categorias.map(renderCategoria)}
        </ScrollView>
      </View>

      {/* Lista de descrições */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Carregando descrições...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Icon name="error" size={48} color="#F44336" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={carregarDescricoesAtivas}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={descricoes}
          renderItem={renderDescricao}
          keyExtractor={(item) => item.id!}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="description" size={64} color={colors.text} />
              <Text style={styles.emptyText}>Nenhuma descrição encontrada</Text>
              <Text style={styles.emptySubtext}>
                {busca ? 'Tente ajustar sua busca' : 'Adicione uma nova descrição de serviço'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.background,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  addButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  searchButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoriaButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginRight: 8,
  },
  categoriaButtonAtiva: {
    backgroundColor: colors.primary,
  },
  categoriaText: {
    fontSize: 14,
    color: colors.text,
  },
  categoriaTextAtiva: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  cardCategoria: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 4,
  },
  cardDescricao: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  cardInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  cardInfoText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  tag: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    opacity: 0.7,
  },
});
