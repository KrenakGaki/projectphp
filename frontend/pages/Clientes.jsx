/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Edit2, Trash2, X, Users, Phone, Mail,
  FileText, MapPin, ArrowLeftCircle, Search,
  CheckCircle, AlertCircle, XCircle
} from 'lucide-react';
import api from '../services/api';

// ─── Máscaras ────────────────────────────────────────────────────────

const mascaraCPF = (v) =>
  v.replace(/\D/g, '')
   .replace(/(\d{3})(\d)/, '$1.$2')
   .replace(/(\d{3})(\d)/, '$1.$2')
   .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
   .slice(0, 14);

const mascaraTelefone = (v) =>
  v.replace(/\D/g, '')
   .replace(/(\d{2})(\d)/, '($1) $2')
   .replace(/(\d{4,5})(\d{4})$/, '$1-$2')
   .slice(0, 15);

// ─── Componentes externos ──────────────────────────────────────────────────────

const ICONES_NOTIFICACAO = {
  success: <CheckCircle className="w-6 h-6" />,
  error:   <XCircle    className="w-6 h-6" />,
  warning: <AlertCircle className="w-6 h-6" />,
  info:    <AlertCircle className="w-6 h-6" />,
};

const CORES_NOTIFICACAO = {
  success: 'bg-green-500',
  error:   'bg-red-500',
  warning: 'bg-yellow-500',
  info:    'bg-blue-500',
};

const Notificacao = ({ notificacao, onClose }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (notificacao) ref.current?.focus();
  }, [notificacao]);

  if (!notificacao) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] animate-slide-in">
      <div
        ref={ref}
        tabIndex={-1}
        className={`${CORES_NOTIFICACAO[notificacao.tipo]} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md outline-none`}
      >
        {ICONES_NOTIFICACAO[notificacao.tipo]}
        <p className="flex-1 font-semibold">{notificacao.mensagem}</p>
        <button
          onClick={onClose}
          className="hover:bg-white/20 rounded-lg p-1 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const ModalConfirmacao = ({ confirmacao, onClose }) => {
  if (!confirmacao) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Confirmar Exclusão</h3>
        </div>

        <p className="text-gray-600 mb-6">{confirmacao.mensagem}</p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => { confirmacao.onConfirm(); onClose(); }}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Componentes principais ──────────────────────────────────────────────────────

const FORM_INICIAL = {
  name: '', last_name: '', email: '', phone: '', cpf: '', address: '',
};

function Clientes() {
  const [clientes,      setClientes]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [salvando,      setSalvando]      = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(false);
  const [editando,      setEditando]      = useState(null);
  const [searchTerm,    setSearchTerm]    = useState('');
  const [notificacao,   setNotificacao]   = useState(null);
  const [confirmacao,   setConfirmacao]   = useState(null);
  const [formData,      setFormData]      = useState(FORM_INICIAL);

  const navigate = useNavigate();

  // ── Notificações ──────────────────────────────────────────────────────────

  const mostrarNotificacao = useCallback((mensagem, tipo = 'info') => {
    setNotificacao({ mensagem, tipo });
    setTimeout(() => setNotificacao(null), 4000);
  }, []);

  const mostrarConfirmacao = useCallback((mensagem, onConfirm) => {
    setConfirmacao({ mensagem, onConfirm });
  }, []);

  // ── Dados ─────────────────────────────────────────────────────────────────

  const buscarClientes = useCallback(() => {
    setLoading(true);
    api.get('/clientes')
      .then(response => setClientes(response.data))
      .catch(() => mostrarNotificacao('Erro ao carregar clientes', 'error'))
      .finally(() => setLoading(false));
  }, [mostrarNotificacao]);

  useEffect(() => {
    buscarClientes();
  }, [buscarClientes]);

  // ── Filtro e ordenação ───────────────────────────────────────

  const clientesFiltrados = useMemo(() => {
    const termo = searchTerm.toLowerCase();
    return [...clientes]
      .filter(c =>
        c.name.toLowerCase().includes(termo) ||
        c.email.toLowerCase().includes(termo) ||
        (c.cpf && c.cpf.includes(termo))
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [clientes, searchTerm]);

  // ── Formulário ────────────────────────────────────────────────────────────

  const resetForm = useCallback(() => {
    setFormData(FORM_INICIAL);
    setShowSidePanel(false);
    setEditando(null);
  }, []);

  const handleEdit = useCallback((cliente) => {
    setFormData({
      name:      cliente.name      || '',
      last_name: cliente.last_name || '',
      email:     cliente.email     || '',
      phone:     cliente.phone     || '',
      cpf:       cliente.cpf       || '',
      address:   cliente.address   || '',
    });
    setEditando(cliente);
    setShowSidePanel(true);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      mostrarNotificacao('Preencha nome e e-mail!', 'warning');
      return;
    }

    const dadosLimpos = {
      name:      formData.name.trim(),
      last_name: formData.last_name?.trim()  || '',
      email:     formData.email.trim(),
      phone:     formData.phone?.trim()      || '',
      cpf:       formData.cpf?.trim()        || '',
      address:   formData.address?.trim()    || '',
    };

    setSalvando(true);

    const requisicao = editando
      ? api.put(`/clientes/${editando.id}`, dadosLimpos)
      : api.post('/clientes', dadosLimpos);

    requisicao
      .then(response => {
        if (editando) {
          setClientes(prev => prev.map(c => c.id === editando.id ? response.data : c));
        } else {
          setClientes(prev => [...prev, response.data]);
        }
        resetForm();
        mostrarNotificacao('Cliente salvo com sucesso!', 'success');
      })
      .catch(err => {
        console.error('Erro ao salvar:', err.response?.data);

        if (err.response?.data?.errors) {
          const primeiroErro = Object.values(err.response.data.errors)
            .flat()
            .slice(0, 2)
            .join(' • ');
          mostrarNotificacao(primeiroErro, 'error');
        } else if (err.response?.data?.message) {
          mostrarNotificacao(err.response.data.message, 'error');
        } else {
          mostrarNotificacao('Erro ao salvar cliente. Verifique os dados.', 'error');
        }
      })
      .finally(() => setSalvando(false));
  };

  const handleDelete = useCallback((id) => {
    const cliente = clientes.find(c => c.id === id);
    const nome = cliente ? `${cliente.name} ${cliente.last_name}`.trim() : 'este cliente';

    mostrarConfirmacao(
      `Tem certeza que deseja excluir ${nome}?`,
      () => {
        api.delete(`/clientes/${id}`)
          .then(() => {
            setClientes(prev => prev.filter(c => c.id !== id));
            mostrarNotificacao('Cliente excluído com sucesso!', 'success');
          })
          .catch(() => mostrarNotificacao('Erro ao excluir cliente', 'error'));
      }
    );
  }, [clientes, mostrarConfirmacao, mostrarNotificacao]);

  // ── Render ────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Notificacao notificacao={notificacao} onClose={() => setNotificacao(null)} />
      <ModalConfirmacao confirmacao={confirmacao} onClose={() => setConfirmacao(null)} />

      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Gestão de Clientes
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">Sistema inteligente de controle</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="fixed top-5 left-5 z-50 flex items-center gap-2.5 bg-white border-2 border-gray-300 text-gray-800 px-5 py-3 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:border-gray-400 hover:bg-gray-50 transform hover:scale-110 transition-all duration-300 group"
            >
              <ArrowLeftCircle className="w-7 h-7 text-blue-600 group-hover:text-blue-700 transition-colors" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            <button
              onClick={() => setShowSidePanel(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Novo Cliente
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Barra de pesquisa */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nome, e-mail ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Empty State */}
        {clientesFiltrados.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? 'Tente buscar com outros termos'
                : 'Comece adicionando seu primeiro cliente'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowSidePanel(true)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                Adicionar Cliente
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Cliente', 'Contato', 'CPF', 'Endereço', 'Ações'].map((col, i) => (
                      <th
                        key={col}
                        className={`px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider ${i === 4 ? 'text-right' : 'text-left'}`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {clientesFiltrados.map((cliente) => (
                    <tr key={cliente.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                            <span className="text-blue-600 font-semibold text-sm">
                              {cliente.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {cliente.name} {cliente.last_name}
                            </div>
                            <div className="text-sm text-gray-500">{cliente.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {cliente.phone ? (
                          <div className="flex items-center gap-2 text-gray-700">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{cliente.phone}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{cliente.cpf || '—'}</span>
                      </td>
                      <td className="px-6 py-4">
                        {cliente.address ? (
                          <div className="text-sm text-gray-700 max-w-xs truncate">{cliente.address}</div>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(cliente)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cliente.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slide-in {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        .animate-slide-in { animation: slide-in 0.3s ease-out; }

        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
      `}</style>

      {/* Side Panel */}
      {showSidePanel && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={resetForm} />

          <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {editando ? 'Editar Cliente' : 'Novo Cliente'}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {editando ? 'Atualize as informações' : 'Preencha os dados do cliente'}
                  </p>
                </div>
                <button onClick={resetForm} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Nome e Sobrenome */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="João"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sobrenome</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData(p => ({ ...p, last_name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Silva"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="joao@exemplo.com"
                  />
                </div>
              </div>

              {/* Telefone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData(p => ({ ...p, phone: mascaraTelefone(e.target.value) }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="(11) 98765-4321"
                    maxLength={15}
                  />
                </div>
              </div>

              {/* CPF */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => setFormData(p => ({ ...p, cpf: mascaraCPF(e.target.value) }))}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123.456.789-00"
                    maxLength={14}
                  />
                </div>
              </div>

              {/* Endereço */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
                    rows={3}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Rua Exemplo, 123 - Bairro - Cidade/SP"
                  />
                </div>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  {salvando ? 'Salvando...' : editando ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

export default Clientes;