import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  Timestamp,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '../config/firebase';

const getFirestoreErrorMessage = (error: any): string => {
  const code = error && typeof error.code === 'string' ? (error.code as string) : null;

  switch (code) {
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
      return (error && error.message) ? String(error.message) : 'Erro do banco de dados. Tente novamente.';
  }
};

/* ---------- Interfaces ---------- */
export interface ClienteFirebase {
  id?: string;
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
  dataCadastro: Timestamp;
}

export interface EquipamentoFirebase {
  id?: string;
  codigo: string;
  nome: string;
  marca: string;
  modelo: string;
  clienteId: string;
  clienteNome: string;
  dataEntrada: Timestamp;
  categoria: string;
  observacoes?: string;
}

export interface AtendimentoFirebase {
  id?: string;
  clienteId: string;
  clienteNome: string;
  equipamentoId: string;
  equipamentoNome: string;
  problema: string;
  status: 'Aguardando' | 'Em andamento' | 'Concluído' | 'Recusado'; 
  data: Timestamp;
  tecnico: string;
  valorServico?: number;
  observacoes?: string;
}

/* ---------- Serviços Clientes ---------- */
export const clienteService = {
  async criar(cliente: Omit<ClienteFirebase, 'id' | 'dataCadastro'>): Promise<string> {
    try {
      const clienteData = {
        ...cliente,
        dataCadastro: Timestamp.now()
      };
      const docRef = await addDoc(collection(db, 'clientes'), clienteData);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar cliente no Firebase:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  },

  async listar(): Promise<ClienteFirebase[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'clientes'), orderBy('dataCadastro', 'desc'))
      );
      return querySnapshot.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<ClienteFirebase, 'id'>)
      } as ClienteFirebase));
    } catch (error) {
      console.error('Erro ao listar clientes:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  },

  async buscarPorId(id: string): Promise<ClienteFirebase | null> {
    try {
      const docRef = doc(db, 'clientes', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...(docSnap.data() as Omit<ClienteFirebase, 'id'>)
        } as ClienteFirebase;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  },

  async atualizar(id: string, dados: Partial<ClienteFirebase>): Promise<void> {
    try {
      const docRef = doc(db, 'clientes', id);
      await updateDoc(docRef, dados);
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  },

  async deletar(id: string): Promise<void> {
    try {
      // 1. Excluir atendimentos do cliente
      const atendimentosQuery = query(collection(db, 'atendimentos'), where('clienteId', '==', id));
      const atendimentosSnapshot = await getDocs(atendimentosQuery);
      const deleteAtendimentosPromises = atendimentosSnapshot.docs.map(d => deleteDoc(doc(db, 'atendimentos', d.id)));
      await Promise.all(deleteAtendimentosPromises);

      // 2. Excluir equipamentos do cliente
      const equipamentosQuery = query(collection(db, 'equipamentos'), where('clienteId', '==', id));
      const equipamentosSnapshot = await getDocs(equipamentosQuery);
      const deleteEquipamentosPromises = equipamentosSnapshot.docs.map(d => deleteDoc(doc(db, 'equipamentos', d.id)));
      await Promise.all(deleteEquipamentosPromises);

      // 3. Finalmente, exclui o cliente
      const clienteDocRef = doc(db, 'clientes', id);
      await deleteDoc(clienteDocRef);
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  }
};

/* ---------- Serviços Equipamentos ---------- */
export const equipamentoService = {
  async criar(equipamento: Omit<EquipamentoFirebase, 'id' | 'dataEntrada'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'equipamentos'), {
        ...equipamento,
        dataEntrada: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar equipamento:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  },

  async listar(): Promise<EquipamentoFirebase[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'equipamentos'), orderBy('dataEntrada', 'desc'))
      );
      return querySnapshot.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<EquipamentoFirebase, 'id'>)
      } as EquipamentoFirebase));
    } catch (error) {
      console.error('Erro ao listar equipamentos:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  },

  async listarPorCliente(clienteId: string): Promise<EquipamentoFirebase[]> {
    try {
      const q = query(
        collection(db, 'equipamentos'),
        where('clienteId', '==', clienteId),
        orderBy('dataEntrada', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<EquipamentoFirebase, 'id'>)
      } as EquipamentoFirebase));
    } catch (error) {
      console.error('Erro ao listar equipamentos do cliente:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  },

  async buscarPorId(id: string): Promise<EquipamentoFirebase | null> {
    try {
      const docRef = doc(db, 'equipamentos', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...(docSnap.data() as Omit<EquipamentoFirebase, 'id'>)
        } as EquipamentoFirebase;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar equipamento:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  },

  async atualizar(id: string, dados: Partial<EquipamentoFirebase>): Promise<void> {
    try {
      const docRef = doc(db, 'equipamentos', id);
      await updateDoc(docRef, dados);
    } catch (error) {
      console.error('Erro ao atualizar equipamento:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  },

  async deletar(id: string): Promise<void> {
    try {
      // 1. Excluir atendimentos vinculados a este equipamento
      const atendimentosQuery = query(collection(db, 'atendimentos'), where('equipamentoId', '==', id));
      const atendimentosSnapshot = await getDocs(atendimentosQuery);
      const deleteAtendimentosPromises = atendimentosSnapshot.docs.map(d => deleteDoc(doc(db, 'atendimentos', d.id)));
      await Promise.all(deleteAtendimentosPromises);

      // 2. Finalmente, exclui o equipamento
      const equipamentoDocRef = doc(db, 'equipamentos', id);
      await deleteDoc(equipamentoDocRef);
    } catch (error) {
      console.error('Erro ao deletar equipamento:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  }
};

/* ---------- Serviços Atendimentos ---------- */
export const atendimentoService = {
  async criar(atendimento: Omit<AtendimentoFirebase, 'id' | 'data'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, 'atendimentos'), {
        ...atendimento,
        data: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar atendimento:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  },

  async listar(): Promise<AtendimentoFirebase[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'atendimentos'), orderBy('data', 'desc'))
      );
      return querySnapshot.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<AtendimentoFirebase, 'id'>)
      } as AtendimentoFirebase));
    } catch (error) {
      console.error('Erro ao listar atendimentos:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  },

  async listarPorCliente(clienteId: string): Promise<AtendimentoFirebase[]> {
    try {
      const q = query(
        collection(db, 'atendimentos'),
        where('clienteId', '==', clienteId),
        orderBy('data', 'desc')
      );

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<AtendimentoFirebase, 'id'>)
      } as AtendimentoFirebase));
    } catch (error) {
      console.error('Erro ao listar atendimentos do cliente:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  },

  async buscarPorId(id: string): Promise<AtendimentoFirebase | null> {
    try {
      const docRef = doc(db, 'atendimentos', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...(docSnap.data() as Omit<AtendimentoFirebase, 'id'>)
        } as AtendimentoFirebase;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar atendimento:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  },

  async atualizar(id: string, dados: Partial<AtendimentoFirebase>): Promise<void> {
    try {
      const docRef = doc(db, 'atendimentos', id);
      await updateDoc(docRef, dados);
    } catch (error) {
      console.error('Erro ao atualizar atendimento:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  },

  async deletar(id: string): Promise<void> {
    try {
      const docRef = doc(db, 'atendimentos', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Erro ao deletar atendimento:', error);
      throw new Error(getFirestoreErrorMessage(error));
    }
  }
};

/* ---------- Utilitários de conversão ---------- */
export const dataUtils = {
  /**
   * Converte um Timestamp do Firestore para string no formato pt-BR.
   * Se o valor não for um Timestamp válido retorna '-' como fallback.
   */
  timestampToString(timestamp?: Timestamp | null): string {
    try {
      if (!timestamp || !(timestamp instanceof Timestamp)) {
        return '-';
      }
      return timestamp.toDate().toLocaleDateString('pt-BR');
    } catch (err) {
      console.warn('timestampToString: valor inválido', err);
      return '-';
    }
  },

  clienteFirebaseToLocal(firebaseCliente: ClienteFirebase) {
    return {
      id: firebaseCliente.id!,
      nome: firebaseCliente.nome,
      telefone: firebaseCliente.telefone,
      email: firebaseCliente.email,
      endereco: firebaseCliente.endereco,
      dataCadastro: dataUtils.timestampToString(firebaseCliente.dataCadastro)
    };
  },

  clienteLocalToFirebase(localCliente: any): Omit<ClienteFirebase, 'id' | 'dataCadastro'> {
    return {
      nome: localCliente.nome,
      telefone: localCliente.telefone,
      email: localCliente.email,
      endereco: localCliente.endereco
    };
  },

  equipamentoFirebaseToLocal(firebaseEquipamento: EquipamentoFirebase) {
    return {
      id: firebaseEquipamento.id!,
      codigo: firebaseEquipamento.codigo,
      nome: firebaseEquipamento.nome,
      marca: firebaseEquipamento.marca,
      modelo: firebaseEquipamento.modelo,
      clienteId: firebaseEquipamento.clienteId,
      clienteNome: firebaseEquipamento.clienteNome,
      dataEntrada: dataUtils.timestampToString(firebaseEquipamento.dataEntrada),
      categoria: firebaseEquipamento.categoria,
      observacoes: firebaseEquipamento.observacoes
    };
  },

  equipamentoLocalToFirebase(localEquipamento: any): Omit<EquipamentoFirebase, 'id' | 'dataEntrada'> {
    return {
      codigo: localEquipamento.codigo,
      nome: localEquipamento.nome,
      marca: localEquipamento.marca,
      modelo: localEquipamento.modelo,
      clienteId: localEquipamento.clienteId,
      clienteNome: localEquipamento.clienteNome,
      categoria: localEquipamento.categoria,
      observacoes: localEquipamento.observacoes
    };
  },

  atendimentoFirebaseToLocal(firebaseAtendimento: AtendimentoFirebase) {
    return {
      id: firebaseAtendimento.id!,
      clienteId: firebaseAtendimento.clienteId,
      clienteNome: firebaseAtendimento.clienteNome,
      equipamentoId: firebaseAtendimento.equipamentoId,
      equipamentoNome: firebaseAtendimento.equipamentoNome,
      problema: firebaseAtendimento.problema,
      status: firebaseAtendimento.status,
      data: dataUtils.timestampToString(firebaseAtendimento.data),
      tecnico: firebaseAtendimento.tecnico,
      valorServico: firebaseAtendimento.valorServico,
      observacoes: firebaseAtendimento.observacoes
    };
  },

  atendimentoLocalToFirebase(localAtendimento: any): Omit<AtendimentoFirebase, 'id' | 'data'> {
    return {
      clienteId: localAtendimento.clienteId,
      clienteNome: localAtendimento.clienteNome,
      equipamentoId: localAtendimento.equipamentoId,
      equipamentoNome: localAtendimento.equipamentoNome,
      problema: localAtendimento.problema,
      status: localAtendimento.status,
      tecnico: localAtendimento.tecnico,
      valorServico: localAtendimento.valorServico,
      observacoes: localAtendimento.observacoes
    };
  }
};