import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    FirestoreError,
    getDoc,
    getDocs,
    orderBy,
    query,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Função para traduzir erros do Firestore
const getFirestoreErrorMessage = (error: FirestoreError): string => {
  switch (error.code) {
    case 'permission-denied':
      return 'Permissão negada. Verifique as regras do Firestore.';
    case 'unavailable':
      return 'Serviço temporariamente indisponível. Tente novamente.';
    case 'unauthenticated':
      return 'Usuário não autenticado. Faça login novamente.';
    case 'not-found':
      return 'Documento não encontrado.';
    case 'already-exists':
      return 'Documento já existe.';
    case 'failed-precondition':
      return 'Operação falhou devido a uma condição prévia.';
    case 'aborted':
      return 'Operação foi cancelada.';
    case 'out-of-range':
      return 'Valor fora do intervalo permitido.';
    case 'unimplemented':
      return 'Operação não implementada.';
    case 'internal':
      return 'Erro interno do servidor.';
    case 'data-loss':
      return 'Perda de dados detectada.';
    case 'deadline-exceeded':
      return 'Tempo limite excedido.';
    default:
      return 'Erro do banco de dados. Tente novamente.';
  }
};

// Tipos para os dados
export interface Cliente {
  id?: string;
  nome: string;
  email: string;
  telefone: string;
  endereco?: string;
  dataCadastro: Timestamp;
  observacoes?: string;
}

export interface Agendamento {
  id?: string;
  clienteId: string;
  clienteNome: string;
  data: Timestamp;
  hora: string;
  servico: string;
  observacoes?: string;
  status: 'agendado' | 'em_andamento' | 'concluido' | 'cancelado';
  valor?: number;
}

export interface Atendimento {
  id?: string;
  clienteId: string;
  clienteNome: string;
  data: Timestamp;
  servicos: string[];
  observacoes?: string;
  valor: number;
  status: 'em_andamento' | 'concluido';
}

export interface Orcamento {
  id?: string;
  clienteId: string;
  clienteNome: string;
  data: Timestamp;
  servicos: Array<{
    nome: string;
    descricao: string;
    valor: number;
  }>;
  valorTotal: number;
  validade: Timestamp;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  observacoes?: string;
}

// Serviços para Clientes
export const clienteService = {
  // Criar novo cliente
  async criar(cliente: Omit<Cliente, 'id' | 'dataCadastro'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'clientes'), {
        ...cliente,
        dataCadastro: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      if (error instanceof Error) {
        throw new Error(getFirestoreErrorMessage(error as FirestoreError));
      }
      throw new Error('Erro ao criar cliente. Tente novamente.');
    }
  },

  // Buscar todos os clientes
  async listar(): Promise<Cliente[]> {
    try {
      const querySnapshot = await getDocs(collection(db, 'clientes'));
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Cliente));
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      if (error instanceof Error) {
        throw new Error(getFirestoreErrorMessage(error as FirestoreError));
      }
      throw new Error('Erro ao listar clientes. Tente novamente.');
    }
  },

  // Buscar cliente por ID
  async buscarPorId(id: string): Promise<Cliente | null> {
    try {
      const docRef = doc(db, 'clientes', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Cliente;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      if (error instanceof Error) {
        throw new Error(getFirestoreErrorMessage(error as FirestoreError));
      }
      throw new Error('Erro ao buscar cliente. Tente novamente.');
    }
  },

  // Atualizar cliente
  async atualizar(id: string, dados: Partial<Cliente>): Promise<void> {
    try {
      const docRef = doc(db, 'clientes', id);
      await updateDoc(docRef, dados);
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      if (error instanceof Error) {
        throw new Error(getFirestoreErrorMessage(error as FirestoreError));
      }
      throw new Error('Erro ao atualizar cliente. Tente novamente.');
    }
  },

  // Deletar cliente
  async deletar(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'clientes', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      if (error instanceof Error) {
        throw new Error(getFirestoreErrorMessage(error as FirestoreError));
      }
      throw new Error('Erro ao deletar cliente. Tente novamente.');
    }
  }
};

// Serviços para Agendamentos
export const agendamentoService = {
  // Criar novo agendamento
  async criar(agendamento: Omit<Agendamento, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'agendamentos'), agendamento);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      throw error;
    }
  },

  // Listar agendamentos por data
  async listarPorData(data: Date): Promise<Agendamento[]> {
    try {
      const inicioDia = new Date(data);
      inicioDia.setHours(0, 0, 0, 0);
      
      const fimDia = new Date(data);
      fimDia.setHours(23, 59, 59, 999);

      const q = query(
        collection(db, 'agendamentos'),
        where('data', '>=', Timestamp.fromDate(inicioDia)),
        where('data', '<=', Timestamp.fromDate(fimDia)),
        orderBy('data', 'asc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Agendamento));
    } catch (error) {
      console.error('Erro ao listar agendamentos:', error);
      throw error;
    }
  },

  // Atualizar status do agendamento
  async atualizarStatus(id: string, status: Agendamento['status']): Promise<void> {
    try {
      const docRef = doc(db, 'agendamentos', id);
      await updateDoc(docRef, { status });
    } catch (error) {
      console.error('Erro ao atualizar status do agendamento:', error);
      throw error;
    }
  }
};

// Serviços para Atendimentos
export const atendimentoService = {
  // Criar novo atendimento
  async criar(atendimento: Omit<Atendimento, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'atendimentos'), atendimento);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar atendimento:', error);
      throw error;
    }
  },

  // Listar atendimentos por período
  async listarPorPeriodo(inicio: Date, fim: Date): Promise<Atendimento[]> {
    try {
      const q = query(
        collection(db, 'atendimentos'),
        where('data', '>=', Timestamp.fromDate(inicio)),
        where('data', '<=', Timestamp.fromDate(fim)),
        orderBy('data', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Atendimento));
    } catch (error) {
      console.error('Erro ao listar atendimentos:', error);
      throw error;
    }
  }
};

// Serviços para Orçamentos
export const orcamentoService = {
  // Criar novo orçamento
  async criar(orcamento: Omit<Orcamento, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'orcamentos'), orcamento);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar orçamento:', error);
      throw error;
    }
  },

  // Listar orçamentos por cliente
  async listarPorCliente(clienteId: string): Promise<Orcamento[]> {
    try {
      const q = query(
        collection(db, 'orcamentos'),
        where('clienteId', '==', clienteId),
        orderBy('data', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Orcamento));
    } catch (error) {
      console.error('Erro ao listar orçamentos:', error);
      throw error;
    }
  },

  // Atualizar status do orçamento
  async atualizarStatus(id: string, status: Orcamento['status']): Promise<void> {
    try {
      const docRef = doc(db, 'orcamentos', id);
      await updateDoc(docRef, { status });
    } catch (error) {
      console.error('Erro ao atualizar status do orçamento:', error);
      throw error;
    }
  }
};
