import { useEffect, useState } from 'react';
import { DescricaoService, DescricaoServico } from '../services/descricaoService';

export const useDescricoes = () => {
  const [descricoes, setDescricoes] = useState<DescricaoServico[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarDescricoes = async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await DescricaoService.getAllDescricoes();
      setDescricoes(dados);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const carregarDescricoesAtivas = async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await DescricaoService.getDescricoesAtivas();
      setDescricoes(dados);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const carregarPorCategoria = async (categoria: string) => {
    setLoading(true);
    setError(null);
    try {
      const dados = await DescricaoService.getDescricoesPorCategoria(categoria);
      setDescricoes(dados);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const buscarDescricoes = async (texto: string) => {
    setLoading(true);
    setError(null);
    try {
      const dados = await DescricaoService.buscarDescricoes(texto);
      setDescricoes(dados);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const criarDescricao = async (descricao: Omit<DescricaoServico, 'id' | 'criadoEm' | 'atualizadoEm'>) => {
    setLoading(true);
    setError(null);
    try {
      const id = await DescricaoService.criarDescricao(descricao);
      await carregarDescricoes(); // Recarrega a lista
      return id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const atualizarDescricao = async (id: string, dados: Partial<DescricaoServico>) => {
    setLoading(true);
    setError(null);
    try {
      await DescricaoService.atualizarDescricao(id, dados);
      await carregarDescricoes(); // Recarrega a lista
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletarDescricao = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await DescricaoService.deletarDescricao(id);
      await carregarDescricoes(); // Recarrega a lista
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleAtivo = async (id: string, ativo: boolean) => {
    setLoading(true);
    setError(null);
    try {
      await DescricaoService.toggleAtivo(id, ativo);
      await carregarDescricoes(); // Recarrega a lista
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDescricoes();
  }, []);

  return {
    descricoes,
    loading,
    error,
    carregarDescricoes,
    carregarDescricoesAtivas,
    carregarPorCategoria,
    buscarDescricoes,
    criarDescricao,
    atualizarDescricao,
    deletarDescricao,
    toggleAtivo
  };
};

export const useCategorias = () => {
  const [categorias, setCategorias] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const carregarCategorias = async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await DescricaoService.getCategorias();
      setCategorias(dados);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarCategorias();
  }, []);

  return {
    categorias,
    loading,
    error,
    carregarCategorias
  };
};
