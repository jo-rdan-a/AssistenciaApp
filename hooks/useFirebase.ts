import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Agendamento, agendamentoService, Atendimento, atendimentoService, Cliente, clienteService, Orcamento, orcamentoService } from '../services/firestoreService';

// Hook para gerenciar clientes
export const useClientes = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await clienteService.listar();
      setClientes(dados);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const criarCliente = async (cliente: Omit<Cliente, 'id' | 'dataCadastro'>) => {
    setLoading(true);
    setError(null);
    try {
      const id = await clienteService.criar(cliente);
      await carregarClientes(); // Recarrega a lista
      return id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const atualizarCliente = async (id: string, dados: Partial<Cliente>) => {
    setLoading(true);
    setError(null);
    try {
      await clienteService.atualizar(id, dados);
      await carregarClientes(); // Recarrega a lista
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletarCliente = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await clienteService.deletar(id);
      await carregarClientes(); // Recarrega a lista
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarClientes();
  }, []);

  return {
    clientes,
    loading,
    error,
    carregarClientes,
    criarCliente,
    atualizarCliente,
    deletarCliente
  };
};

// Hook para gerenciar agendamentos
export const useAgendamentos = () => {
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarAgendamentosPorData = async (data: Date) => {
    setLoading(true);
    setError(null);
    try {
      const dados = await agendamentoService.listarPorData(data);
      setAgendamentos(dados);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const criarAgendamento = async (agendamento: Omit<Agendamento, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const id = await agendamentoService.criar(agendamento);
      return id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatusAgendamento = async (id: string, status: Agendamento['status']) => {
    setLoading(true);
    setError(null);
    try {
      await agendamentoService.atualizarStatus(id, status);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    agendamentos,
    loading,
    error,
    carregarAgendamentosPorData,
    criarAgendamento,
    atualizarStatusAgendamento
  };
};

// Hook para gerenciar atendimentos
export const useAtendimentos = () => {
  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarAtendimentosPorPeriodo = async (inicio: Date, fim: Date) => {
    setLoading(true);
    setError(null);
    try {
      const dados = await atendimentoService.listarPorPeriodo(inicio, fim);
      setAtendimentos(dados);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const criarAtendimento = async (atendimento: Omit<Atendimento, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const id = await atendimentoService.criar(atendimento);
      return id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    atendimentos,
    loading,
    error,
    carregarAtendimentosPorPeriodo,
    criarAtendimento
  };
};

// Hook para gerenciar orçamentos
export const useOrcamentos = () => {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarOrcamentosPorCliente = async (clienteId: string) => {
    setLoading(true);
    setError(null);
    try {
      const dados = await orcamentoService.listarPorCliente(clienteId);
      setOrcamentos(dados);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const criarOrcamento = async (orcamento: Omit<Orcamento, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const id = await orcamentoService.criar(orcamento);
      return id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const atualizarStatusOrcamento = async (id: string, status: Orcamento['status']) => {
    setLoading(true);
    setError(null);
    try {
      await orcamentoService.atualizarStatus(id, status);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    orcamentos,
    loading,
    error,
    carregarOrcamentosPorCliente,
    criarOrcamento,
    atualizarStatusOrcamento
  };
};

// Hook para verificar conexão com Firebase
export const useFirebaseConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkConnection = async () => {
      setIsChecking(true);
      try {
        // Tenta fazer uma operação simples para verificar a conexão
        await clienteService.listar();
        setIsConnected(true);
      } catch (error) {
        console.error('Erro de conexão com Firebase:', error);
        setIsConnected(false);
      } finally {
        setIsChecking(false);
      }
    };

    checkConnection();
  }, [user]);

  return { isConnected, isChecking };
};
