import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import {
  atendimentoService,
  clienteService,
  dataUtils,
  equipamentoService
} from '../services/caixaService';

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
  dataCadastro: string;
}

export interface Equipamento {
  id: string;
  codigo: string;
  nome: string;
  marca: string;
  modelo: string;
  clienteId: string;
  clienteNome: string;
  dataEntrada: string;
  categoria: string;
  observacoes?: string;
}

export interface Atendimento {
  id: string;
  clienteId: string;
  clienteNome: string;
  equipamentoId: string;
  equipamentoNome: string;
  problema: string;
  status: 'Aguardando' | 'Em andamento' | 'Concluído' | 'Recusado';
  data: string;
  tecnico: string;
  valorServico?: number;
  observacoes?: string;
}

interface DataContextType {
  // Estados
  loading: boolean;
  error: string | null;
  
  // Clientes
  clientes: Cliente[];
  addCliente: (cliente: Omit<Cliente, 'id' | 'dataCadastro'>) => Promise<void>;
  updateCliente: (id: string, cliente: Partial<Cliente>) => Promise<void>;
  deleteCliente: (id: string) => Promise<void>;
  getClienteById: (id: string) => Cliente | undefined;
  
  // Equipamentos
  equipamentos: Equipamento[];
  addEquipamento: (equipamento: Omit<Equipamento, 'id' | 'dataEntrada' | 'clienteNome'>) => Promise<void>;
  updateEquipamento: (id: string, equipamento: Partial<Equipamento>) => Promise<void>;
  deleteEquipamento: (id: string) => Promise<void>;
  getEquipamentosByCliente: (clienteId: string) => Equipamento[];
  
  // Atendimentos
  atendimentos: Atendimento[];
  addAtendimento: (atendimento: Omit<Atendimento, 'id' | 'data' | 'clienteNome' | 'equipamentoNome'>) => Promise<void>;
  updateAtendimento: (id: string, atendimento: Partial<Atendimento>) => Promise<void>;
  deleteAtendimento: (id: string) => Promise<void>;
  
  // Utilitários
  recarregarDados: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [equipamentos, setEquipamentos] = useState<Equipamento[]>([]);
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);

      const clientesFirebase = await clienteService.listar();
      const clientesConvertidos = clientesFirebase.map(dataUtils.clienteFirebaseToLocal);
      setClientes(clientesConvertidos);

      const equipamentosFirebase = await equipamentoService.listar();
      const equipamentosConvertidos = equipamentosFirebase.map(dataUtils.equipamentoFirebaseToLocal);
      setEquipamentos(equipamentosConvertidos);

      const atendimentosFirebase = await atendimentoService.listar();
      const atendimentosConvertidos = atendimentosFirebase.map(dataUtils.atendimentoFirebaseToLocal);
      setAtendimentos(atendimentosConvertidos);

    } catch (err) {
      console.error('Erro ao carregar dados:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  // Funções para Clientes
  const addCliente = async (cliente: Omit<Cliente, 'id' | 'dataCadastro'>) => {
    try {
      const clienteFirebase = dataUtils.clienteLocalToFirebase(cliente);
      const id = await clienteService.criar(clienteFirebase);
      
      await carregarDados(); // Recarrega todos os dados para garantir consistência
    } catch (err) {
      console.error('Erro ao adicionar cliente:', err);
      throw err;
    }
  };

  const updateCliente = async (id: string, cliente: Partial<Cliente>) => {
    try {
      const clienteFirebase = dataUtils.clienteLocalToFirebase(cliente);
      await clienteService.atualizar(id, clienteFirebase);
      
      await carregarDados(); // Recarrega para garantir que os dados de atendimentos e equipamentos também sejam atualizados, se necessário
    } catch (err) {
      console.error('Erro ao atualizar cliente:', err);
      throw err;
    }
  };

  const deleteCliente = async (id: string) => {
    try {
      await clienteService.deletar(id); // A exclusão em cascata agora é feita no serviço
      await carregarDados(); // Recarrega todos os dados
    } catch (err) {
      console.error('Erro ao deletar cliente:', err);
      throw err;
    }
  };

  const getClienteById = (id: string) => {
    return clientes.find(c => c.id === id);
  };

  // Funções para Equipamentos
  const addEquipamento = async (equipamento: Omit<Equipamento, 'id' | 'dataEntrada' | 'clienteNome'>) => {
    try {
      const cliente = getClienteById(equipamento.clienteId);
      const equipamentoCompleto = {
        ...equipamento,
        clienteNome: cliente?.nome || 'Cliente não encontrado'
      };
      
      const equipamentoFirebase = dataUtils.equipamentoLocalToFirebase(equipamentoCompleto);
      const id = await equipamentoService.criar(equipamentoFirebase);
      
      await carregarDados();
    } catch (err) {
      console.error('Erro ao adicionar equipamento:', err);
      throw err;
    }
  };

  const updateEquipamento = async (id: string, equipamento: Partial<Equipamento>) => {
    try {
      const equipamentoFirebase = dataUtils.equipamentoLocalToFirebase(equipamento);
      await equipamentoService.atualizar(id, equipamentoFirebase);
      
      await carregarDados();
    } catch (err) {
      console.error('Erro ao atualizar equipamento:', err);
      throw err;
    }
  };

  const deleteEquipamento = async (id: string) => {
    try {
      await equipamentoService.deletar(id); // A exclusão em cascata agora é feita no serviço
      await carregarDados();
    } catch (err) {
      console.error('Erro ao deletar equipamento:', err);
      throw err;
    }
  };

  const getEquipamentosByCliente = (clienteId: string) => {
    return equipamentos.filter(e => e.clienteId === clienteId);
  };

  // Funções para Atendimentos
  const addAtendimento = async (atendimento: Omit<Atendimento, 'id' | 'data' | 'clienteNome' | 'equipamentoNome'>) => {
    try {
      const cliente = getClienteById(atendimento.clienteId);
      const equipamento = equipamentos.find(e => e.id === atendimento.equipamentoId);
      
      const atendimentoCompleto = {
        ...atendimento,
        clienteNome: cliente?.nome || 'Cliente não encontrado',
        equipamentoNome: equipamento?.nome || 'Equipamento não encontrado'
      };
      
      const atendimentoFirebase = dataUtils.atendimentoLocalToFirebase(atendimentoCompleto);
      const id = await atendimentoService.criar(atendimentoFirebase);
      
      await carregarDados();
    } catch (err) {
      console.error('Erro ao adicionar atendimento:', err);
      throw err;
    }
  };

  const updateAtendimento = async (id: string, atendimento: Partial<Atendimento>) => {
    try {
      const atendimentoFirebase = dataUtils.atendimentoLocalToFirebase(atendimento);
      await atendimentoService.atualizar(id, atendimentoFirebase);
      
      await carregarDados();
    } catch (err) {
      console.error('Erro ao atualizar atendimento:', err);
      throw err;
    }
  };

  const deleteAtendimento = async (id: string) => {
    try {
      await atendimentoService.deletar(id); // A exclusão é feita no serviço
      await carregarDados();
    } catch (err) {
      console.error('Erro ao deletar atendimento:', err);
      throw err;
    }
  };

  const value: DataContextType = {
    loading,
    error,
    clientes,
    addCliente,
    updateCliente,
    deleteCliente,
    getClienteById,
    equipamentos,
    addEquipamento,
    updateEquipamento,
    deleteEquipamento,
    getEquipamentosByCliente,
    atendimentos,
    addAtendimento,
    updateAtendimento,
    deleteAtendimento,
    recarregarDados: carregarDados
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};