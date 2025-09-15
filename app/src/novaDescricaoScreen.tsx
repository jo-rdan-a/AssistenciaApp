import Icon from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { FirebaseService } from '../../config/firebaseService';
import { useCategorias, useDescricoes } from '../../hooks/useDescricoes';
import { DescricaoServico } from '../../services/descricaoService';
import colors from './styles/colors';

interface NovaDescricaoProps {
  descricao?: DescricaoServico;
  isEdit?: boolean;
}

export default function NovaDescricaoScreen({ descricao, isEdit = false }: NovaDescricaoProps) {
  const { criarDescricao, atualizarDescricao, loading } = useDescricoes();
  const { categorias } = useCategorias();
  
  const [titulo, setTitulo] = useState(descricao?.titulo || '');
  const [descricaoText, setDescricaoText] = useState(descricao?.descricao || '');
  const [categoria, setCategoria] = useState(descricao?.categoria || '');
  const [novaCategoria, setNovaCategoria] = useState('');
  const [preco, setPreco] = useState(descricao?.preco?.toString() || '');
  const [duracao, setDuracao] = useState(descricao?.duracao?.toString() || '');
  const [tags, setTags] = useState(descricao?.tags?.join(', ') || '');
  const [observacoes, setObservacoes] = useState(descricao?.observacoes || '');
  const [mostrarNovaCategoria, setMostrarNovaCategoria] = useState(false);

  const isDisabled = !titulo.trim() || !descricaoText.trim() || !categoria.trim() || !preco.trim() || !duracao.trim() || loading;

  const handleSalvar = async () => {
    if (isDisabled) return;

    const precoNum = parseFloat(preco);
    const duracaoNum = parseInt(duracao);

    if (isNaN(precoNum) || precoNum < 0) {
      Alert.alert('Erro', 'Preço deve ser um número válido');
      return;
    }

    if (isNaN(duracaoNum) || duracaoNum <= 0) {
      Alert.alert('Erro', 'Duração deve ser um número válido maior que zero');
      return;
    }

    const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    const dadosDescricao = {
      titulo: titulo.trim(),
      descricao: descricaoText.trim(),
      categoria: categoria.trim(),
      preco: precoNum,
      duracao: duracaoNum,
      ativo: true,
      criadoPor: FirebaseService.getCurrentUserId() || 'unknown',
      tags: tagsArray,
      observacoes: observacoes.trim()
    };

    try {
      if (isEdit && descricao?.id) {
        await atualizarDescricao(descricao.id, dadosDescricao);
        Alert.alert('Sucesso', 'Descrição atualizada com sucesso!');
      } else {
        await criarDescricao(dadosDescricao);
        Alert.alert('Sucesso', 'Descrição criada com sucesso!');
      }
      router.back();
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao salvar descrição');
    }
  };

  const handleAdicionarCategoria = () => {
    if (novaCategoria.trim()) {
      setCategoria(novaCategoria.trim());
      setNovaCategoria('');
      setMostrarNovaCategoria(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Icon name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>
          {isEdit ? 'Editar Descrição' : 'Nova Descrição'}
        </Text>
        <TouchableOpacity 
          style={[styles.saveButton, isDisabled && styles.saveButtonDisabled]} 
          onPress={handleSalvar}
          disabled={isDisabled}
        >
          <Text style={[styles.saveButtonText, isDisabled && styles.saveButtonTextDisabled]}>
            Salvar
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Título */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Manutenção de Notebook"
            placeholderTextColor={colors.text}
            value={titulo}
            onChangeText={setTitulo}
          />
        </View>

        {/* Descrição */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Descrição *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Descreva o serviço em detalhes..."
            placeholderTextColor={colors.text}
            value={descricaoText}
            onChangeText={setDescricaoText}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Categoria */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Categoria *</Text>
          <View style={styles.categoriaContainer}>
            <TextInput
              style={[styles.input, styles.categoriaInput]}
              placeholder="Selecione ou digite uma categoria"
              placeholderTextColor={colors.text}
              value={categoria}
              onChangeText={setCategoria}
            />
            <TouchableOpacity
              style={styles.addCategoriaButton}
              onPress={() => setMostrarNovaCategoria(!mostrarNovaCategoria)}
            >
              <Icon name="add" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          {mostrarNovaCategoria && (
            <View style={styles.novaCategoriaContainer}>
              <TextInput
                style={[styles.input, styles.novaCategoriaInput]}
                placeholder="Nova categoria"
                placeholderTextColor={colors.text}
                value={novaCategoria}
                onChangeText={setNovaCategoria}
              />
              <TouchableOpacity
                style={styles.confirmCategoriaButton}
                onPress={handleAdicionarCategoria}
              >
                <Icon name="check" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          {/* Lista de categorias existentes */}
          {categorias.length > 0 && (
            <View style={styles.categoriasList}>
              <Text style={styles.categoriasTitle}>Categorias existentes:</Text>
              <View style={styles.categoriasTags}>
                {categorias.map((cat, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.categoriaTag, categoria === cat && styles.categoriaTagAtiva]}
                    onPress={() => setCategoria(cat)}
                  >
                    <Text style={[styles.categoriaTagText, categoria === cat && styles.categoriaTagTextAtiva]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Preço e Duração */}
        <View style={styles.rowContainer}>
          <View style={[styles.inputContainer, styles.halfInput]}>
            <Text style={styles.label}>Preço (R$) *</Text>
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor={colors.text}
              value={preco}
              onChangeText={setPreco}
              keyboardType="numeric"
            />
          </View>
          <View style={[styles.inputContainer, styles.halfInput]}>
            <Text style={styles.label}>Duração (min) *</Text>
            <TextInput
              style={styles.input}
              placeholder="60"
              placeholderTextColor={colors.text}
              value={duracao}
              onChangeText={setDuracao}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Tags */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tags (opcional)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: notebook, manutenção, hardware"
            placeholderTextColor={colors.text}
            value={tags}
            onChangeText={setTags}
          />
          <Text style={styles.helpText}>Separe as tags por vírgula</Text>
        </View>

        {/* Observações */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Observações (opcional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Informações adicionais sobre o serviço..."
            placeholderTextColor={colors.text}
            value={observacoes}
            onChangeText={setObservacoes}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Botão de salvar */}
        <TouchableOpacity 
          style={[styles.salvarButton, isDisabled && styles.salvarButtonDisabled]} 
          onPress={handleSalvar}
          disabled={isDisabled}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.salvarButtonText}>
              {isEdit ? 'Atualizar Descrição' : 'Criar Descrição'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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
  saveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonTextDisabled: {
    color: '#666666',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoriaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoriaInput: {
    flex: 1,
    marginRight: 8,
  },
  addCategoriaButton: {
    backgroundColor: colors.primary + '20',
    borderRadius: 8,
    padding: 12,
  },
  novaCategoriaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  novaCategoriaInput: {
    flex: 1,
    marginRight: 8,
  },
  confirmCategoriaButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 12,
  },
  categoriasList: {
    marginTop: 12,
  },
  categoriasTitle: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  categoriasTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoriaTag: {
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  categoriaTagAtiva: {
    backgroundColor: colors.primary,
  },
  categoriaTagText: {
    fontSize: 12,
    color: colors.text,
  },
  categoriaTagTextAtiva: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  helpText: {
    fontSize: 12,
    color: colors.text,
    opacity: 0.7,
    marginTop: 4,
  },
  salvarButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  salvarButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  salvarButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
