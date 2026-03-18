import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Plus, Trash2, Edit, Users, Shield, User as UserIcon, X, Search, ArrowLeftCircle, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// ─── Componentes externos ──────────────────────────────────────────────────────

const ICONES_NOTIFICACAO = {
  success: <CheckCircle className="w-6 h-6" />,
  error:   <XCircle     className="w-6 h-6" />,
  warning: <AlertCircle className="w-6 h-6" />,
};

const CORES_NOTIFICACAO = {
  success: 'bg-green-500',
  error:   'bg-red-500',
  warning: 'bg-yellow-500',
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
        <button onClick={onClose} className="hover:bg-white/20 rounded-lg p-1 transition-colors">
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

// ─── Componente principal ──────────────────────────────────────────────────────

const FORM_INICIAL = { name: '', email: '', password: '', type: 'user' };

function Usuarios() {
  const navigate = useNavigate();

  const [usuarios,        setUsuarios]        = useState([]);
  const [usuarioLogado,   setUsuarioLogado]   = useState(null);
  const [modalAberto,     setModalAberto]     = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [carregando,      setCarregando]      = useState(false);
  const [salvando,        setSalvando]        = useState(false);
  const [busca,           setBusca]           = useState('');
  const [notificacao,     setNotificacao]     = useState(null);
  const [confirmacao,     setConfirmacao]     = useState(null);
  const [formData,        setFormData]        = useState(FORM_INICIAL);

  // ── Notificações ──────────────────────────────────────────────────────────

  const mostrarNotificacao = useCallback((mensagem, tipo = 'success') => {
    setNotificacao({ mensagem, tipo });
    setTimeout(() => setNotificacao(null), 4000);
  }, []);

  const mostrarConfirmacao = useCallback((mensagem, onConfirm) => {
    setConfirmacao({ mensagem, onConfirm });
  }, []);

  // ── Dados ─────────────────────────────────────────────────────────────────

  const buscarUsuarioLogado = useCallback(async () => {
    try {
      const response = await api.get('/me');
      setUsuarioLogado(response.data);
    } catch (err) {
      console.error('Erro ao buscar usuário logado:', err);
    }
  }, []);

  const buscarUsuarios = useCallback(() => {
    setCarregando(true);
    api.get('/usuarios')
      .then(res => setUsuarios(res.data || []))
      .catch(err => {
        console.error('Erro ao buscar usuários:', err);
        mostrarNotificacao('Erro ao carregar usuários', 'error');
      })
      .finally(() => setCarregando(false));
  }, [mostrarNotificacao]);

  useEffect(() => {
    buscarUsuarioLogado();
    buscarUsuarios();
  }, [buscarUsuarioLogado, buscarUsuarios]);

  // ── Filtro ────────────────────────────────────────────────────

  const usuariosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase();
    return usuarios.filter(u =>
      u?.name?.toLowerCase().includes(termo) ||
      u?.email?.toLowerCase().includes(termo)
    );
  }, [usuarios, busca]);

  const totalAdmin = useMemo(() => usuarios.filter(u => u?.type === 'admin').length, [usuarios]);
  const totalUser  = useMemo(() => usuarios.filter(u => u?.type === 'user').length,  [usuarios]);

  // ── Modal ─────────────────────────────────────────────────────────────────

  const abrirModal = useCallback((usuario = null) => {
    if (usuario) {
      setUsuarioEditando(usuario);
      setFormData({ name: usuario.name, email: usuario.email, password: '', type: usuario.type });
    } else {
      setUsuarioEditando(null);
      setFormData(FORM_INICIAL);
    }
    setModalAberto(true);
  }, []);

  const fecharModal = useCallback(() => {
    setModalAberto(false);
    setUsuarioEditando(null);
    setFormData(FORM_INICIAL);
  }, []);

  // ── Submit ────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSalvando(true);

    try {
      if (usuarioEditando) {
        const dados = { ...formData };
        if (!dados.password) delete dados.password;

        const response = await api.put(`/usuarios/${usuarioEditando.id}`, dados);
        setUsuarios(prev => prev.map(u => u.id === usuarioEditando.id ? response.data : u));
        mostrarNotificacao('Usuário atualizado com sucesso!');
      } else {
        const response = await api.post('/usuarios', formData);
        setUsuarios(prev => [response.data.user ?? response.data, ...prev]);
        mostrarNotificacao('Usuário criado com sucesso!');
      }
      fecharModal();
    } catch (err) {
      console.error('Erro:', err.response?.data);

      if (err.response?.data?.errors) {
        const erros = Object.values(err.response.data.errors).flat().slice(0, 2).join(' • ');
        mostrarNotificacao(erros, 'error');
      } else if (err.response?.data?.message) {
        mostrarNotificacao(err.response.data.message, 'error');
      } else {
        mostrarNotificacao('Erro ao salvar usuário', 'error');
      }
    } finally {
      setSalvando(false);
    }
  };

  const excluirUsuario = useCallback((id, nome) => {
    mostrarConfirmacao(
      `Deseja realmente excluir o usuário "${nome}"?`,
      async () => {
        try {
          await api.delete(`/usuarios/${id}`);
          setUsuarios(prev => prev.filter(u => u.id !== id));
          mostrarNotificacao('Usuário excluído com sucesso!');
        } catch (err) {
          console.error('Erro:', err);
          mostrarNotificacao('Erro ao excluir usuário', 'error');
        }
      }
    );
  }, [mostrarConfirmacao, mostrarNotificacao]);

  const isAdmin = usuarioLogado?.type === 'admin';

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      <Notificacao notificacao={notificacao} onClose={() => setNotificacao(null)} />
      <ModalConfirmacao confirmacao={confirmacao} onClose={() => setConfirmacao(null)} />

      {/* Cabeçalho */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Gerenciar Usuários
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">Controle de acesso ao sistema</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="fixed top-5 left-5 z-50 flex items-center gap-2.5 bg-white border-2 border-gray-300 text-gray-800 px-5 py-3 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:border-gray-400 hover:bg-gray-50 transform hover:scale-110 transition-all duration-300 group"
            >
              <ArrowLeftCircle className="w-7 h-7 text-blue-600 group-hover:text-blue-700 transition-colors" />
              <span className="hidden sm:block">Dashboard</span>
            </button>

            <div className="text-right">
              <p className="text-sm text-gray-500">
                Total: <span className="font-bold text-blue-600">{usuarios.length}</span> usuários
              </p>
              <p className="text-xs text-gray-400">
                Admin: {totalAdmin} | User: {totalUser}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barra de ações */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nome ou email..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
            />
          </div>

          {isAdmin && (
            <button
              onClick={() => abrirModal()}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Novo Usuário
            </button>
          )}
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {carregando && usuarios.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Carregando usuários...</p>
            </div>
          ) : usuariosFiltrados.length === 0 ? (
            <div className="p-16 text-center">
              <Users className="w-20 h-20 text-gray-300 mx-auto mb-6" />
              <p className="text-xl text-gray-600">
                {busca ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <tr>
                    {['Usuário', 'Email', 'Tipo', 'Cadastro', ...(isAdmin ? ['Ações'] : [])].map((col) => (
                      <th
                        key={col}
                        className={`px-6 py-4 text-xs font-bold text-gray-700 uppercase tracking-wider ${col === 'Ações' ? 'text-center' : 'text-left'}`}
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            usuario.type === 'admin'
                              ? 'bg-gradient-to-br from-purple-100 to-pink-100'
                              : 'bg-gradient-to-br from-blue-100 to-cyan-100'
                          }`}>
                            {usuario.type === 'admin'
                              ? <Shield   className="w-5 h-5 text-purple-600" />
                              : <UserIcon className="w-5 h-5 text-blue-600" />
                            }
                          </div>
                          <p className="font-bold text-gray-800">{usuario.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{usuario.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          usuario.type === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {usuario.type === 'admin' ? 'Administrador' : 'Usuário'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => abrirModal(usuario)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all hover:scale-110"
                              title="Editar"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => excluirUsuario(usuario.id, usuario.name)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all hover:scale-110"
                              title="Excluir"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
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

      {/* Modal */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {usuarioEditando ? <Edit className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                {usuarioEditando ? 'Editar Usuário' : 'Novo Usuário'}
              </h2>
              <button
                onClick={fecharModal}
                className="p-2 hover:bg-white/20 rounded-lg transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="Digite o nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="email@exemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Senha {usuarioEditando ? '(deixe em branco para não alterar)' : '*'}
                </label>
                <input
                  type="password"
                  required={!usuarioEditando}
                  value={formData.password}
                  onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Usuário *</label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData(p => ({ ...p, type: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                >
                  <option value="user">Usuário</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={fecharModal}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={salvando}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {salvando ? 'Salvando...' : usuarioEditando ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Usuarios;