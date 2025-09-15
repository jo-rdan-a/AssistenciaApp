import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { db } from '../config/firebase';

export interface DescricaoServico {
  id?: string;
  titulo: string;
  descricao: string;
  categoria: string;
  preco: number;
  duracao: number; // em minutos
  ativo: boolean;
  criadoEm: Date;
  atualizadoEm?: Date;
  criadoPor: string; // UID do usuário que criou
  tags?: string[];
  observacoes?: string;
}

export class DescricaoService {
  // Buscar todas as descrições de serviços
  static async getAllDescricoes(): Promise<DescricaoServico[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'descricoes'), orderBy('criadoEm', 'desc'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DescricaoServico[];
    } catch (error) {
      console.error('Erro ao buscar descrições:', error);
      return [];
    }
  }

  // Buscar descrições por categoria
  static async getDescricoesPorCategoria(categoria: string): Promise<DescricaoServico[]> {
    try {
      const q = query(
        collection(db, 'descricoes'), 
        where('categoria', '==', categoria),
        where('ativo', '==', true),
        orderBy('titulo')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DescricaoServico[];
    } catch (error) {
      console.error('Erro ao buscar descrições por categoria:', error);
      return [];
    }
  }

  // Buscar descrição por ID
  static async getDescricaoPorId(id: string): Promise<DescricaoServico | null> {
    try {
      const docRef = doc(db, 'descricoes', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as DescricaoServico;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar descrição:', error);
      return null;
    }
  }

  // Criar nova descrição de serviço
  static async criarDescricao(descricao: Omit<DescricaoServico, 'id' | 'criadoEm' | 'atualizadoEm'>): Promise<string> {
    try {
      const docRef = await setDoc(doc(collection(db, 'descricoes')), {
        ...descricao,
        criadoEm: new Date(),
        atualizadoEm: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar descrição:', error);
      throw new Error('Erro ao criar descrição de serviço');
    }
  }

  // Atualizar descrição de serviço
  static async atualizarDescricao(id: string, dados: Partial<DescricaoServico>): Promise<boolean> {
    try {
      const docRef = doc(db, 'descricoes', id);
      await updateDoc(docRef, {
        ...dados,
        atualizadoEm: new Date()
      });
      return true;
    } catch (error) {
      console.error('Erro ao atualizar descrição:', error);
      return false;
    }
  }

  // Deletar descrição de serviço
  static async deletarDescricao(id: string): Promise<boolean> {
    try {
      const docRef = doc(db, 'descricoes', id);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error('Erro ao deletar descrição:', error);
      return false;
    }
  }

  // Buscar descrições ativas
  static async getDescricoesAtivas(): Promise<DescricaoServico[]> {
    try {
      const q = query(
        collection(db, 'descricoes'),
        where('ativo', '==', true),
        orderBy('categoria'),
        orderBy('titulo')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DescricaoServico[];
    } catch (error) {
      console.error('Erro ao buscar descrições ativas:', error);
      return [];
    }
  }

  // Buscar por texto (título ou descrição)
  static async buscarDescricoes(texto: string): Promise<DescricaoServico[]> {
    try {
      const todasDescricoes = await this.getAllDescricoes();
      const textoLower = texto.toLowerCase();
      
      return todasDescricoes.filter(descricao => 
        descricao.titulo.toLowerCase().includes(textoLower) ||
        descricao.descricao.toLowerCase().includes(textoLower) ||
        descricao.tags?.some(tag => tag.toLowerCase().includes(textoLower))
      );
    } catch (error) {
      console.error('Erro ao buscar descrições:', error);
      return [];
    }
  }

  // Obter categorias únicas
  static async getCategorias(): Promise<string[]> {
    try {
      const descricoes = await this.getAllDescricoes();
      const categorias = [...new Set(descricoes.map(d => d.categoria))];
      return categorias.sort();
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return [];
    }
  }

  // Ativar/Desativar descrição
  static async toggleAtivo(id: string, ativo: boolean): Promise<boolean> {
    try {
      const docRef = doc(db, 'descricoes', id);
      await updateDoc(docRef, {
        ativo,
        atualizadoEm: new Date()
      });
      return true;
    } catch (error) {
      console.error('Erro ao alterar status da descrição:', error);
      return false;
    }
  }
}
