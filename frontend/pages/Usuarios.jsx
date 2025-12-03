import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Users, Shield, User as UserIcon, X, Search, ArrowLeftCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Usuarios() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [busca, setBusca] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    type: 'user'
  });

  // Buscar usuário logado
  const buscarUsuarioLogado = async () => {
    try {
      const response = await api.get('/me');
      console.log('Usuário logado:', response.data);
      setUsuarioLogado(response.data);
    } catch (err) {
      console.error('Erro ao buscar usuário logado:', err);
      // Se não conseguir buscar, assume que não está logado ou redireciona
      // navigate('/login');
    }
  };

  const buscarUsuarios = () => {
    setCarregando(true);
    api.get('/usuarios')
      .then(res => {
        console.log('Usuários recebidos:', res.data);
        setUsuarios(res.data);
      })
      .catch(err => console.error('Erro ao buscar usuários:', err))
      .finally(() => setCarregando(false));
  };

  useEffect(() => {
    buscarUsuarioLogado();
    buscarUsuarios();
  }, []);

  const abrirModal = (usuario = null) => {
    if (usuario) {
      setUsuarioEditando(usuario);
      setFormData({
        name: usuario.name,
        email: usuario.email,
        password: '',
        type: usuario.type
      });
    } else {
      setUsuarioEditando(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        type: 'user'
      });
    }
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setUsuarioEditando(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      type: 'user'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCarregando(true);

    try {
      if (usuarioEditando) {
        // Atualiza UI antes da resposta
        const usuariosAtualizados = usuarios.map(u => 
          u.id === usuarioEditando.id 
            ? { ...u, ...formData, password: undefined } 
            : u
        );
        setUsuarios(usuariosAtualizados);
        fecharModal();
        
        // Requisição em background
        const dados = { ...formData };
        if (!dados.password) {
          delete dados.password;
        }
        await api.put(`/usuarios/${usuarioEditando.id}`, dados);

        
      } else {
        // Adiciona à lista antes da resposta
        const novoUsuarioTemp = {
          id: Date.now(), // ID temporário
          ...formData,
          password: undefined,
          created_at: new Date().toISOString()
        };
        setUsuarios([novoUsuarioTemp, ...usuarios]);
        fecharModal();
        
        // Requisição em background
        const response = await api.post('/usuarios', formData);
        alert('Usuário criado com sucesso!');
        
        // Atualiza com o ID real do servidor
        setUsuarios(prev => prev.map(u => 
          u.id === novoUsuarioTemp.id ? response.data.user : u
        ));
      }

      // Sincroniza com servidor por segurança
      setTimeout(() => buscarUsuarios(), 100);

    } catch (err) {
      console.error('Erro:', err);
      // Reverte em caso de erro
      buscarUsuarios();
      
      if (err.response?.data?.errors) {
        const erros = Object.values(err.response.data.errors).flat();
        alert('Erros:\n' + erros.join('\n'));
      } else if (err.response?.data?.message) {
        alert('Erro: ' + err.response.data.message);
      } else {
        alert('Erro ao salvar usuário');
      }
    } finally {
      setCarregando(false);
    }
  };

  const excluirUsuario = async (id, nome) => {
    if (!window.confirm(`Deseja realmente excluir o usuário "${nome}"?`)) {
      return;
    }

    try {
      // ATUALIZAÇÃO OTIMISTA: Remove da UI imediatamente
      const usuariosAtualizados = usuarios.filter(u => u.id !== id);
      setUsuarios(usuariosAtualizados);
      alert('Usuário excluído com sucesso!');
      
      // Deleta no servidor em background
      await api.delete(`/usuarios/${id}`);
      
    } catch (err) {
      console.error('Erro:', err);
      // Reverte em caso de erro
      buscarUsuarios();
      alert('Erro ao excluir usuário');
    }
  };

  const usuariosFiltrados = usuarios.filter(user =>
    user.name.toLowerCase().includes(busca.toLowerCase()) ||
    user.email.toLowerCase().includes(busca.toLowerCase())
  );

  const isAdmin = usuarioLogado?.type === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
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
                Admin: {usuarios.filter(u => u.type === 'admin').length} | 
                User: {usuarios.filter(u => u.type === 'user').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barra de ações */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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

        {/* Tabela de Usuários */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {carregando && usuarios.length === 0 ? (
            <div className="p-16 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando usuários...</p>
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
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Cadastro
                    </th>
                    {isAdmin && (
                      <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Ações
                      </th>
                    )}
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
                            {usuario.type === 'admin' ? (
                              <Shield className="w-5 h-5 text-purple-600" />
                            ) : (
                              <UserIcon className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">{usuario.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-600">{usuario.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          usuario.type === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {usuario.type === 'admin' ? 'Administrador' : 'Usuário'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600">
                          {new Date(usuario.created_at).toLocaleDateString('pt-BR')}
                        </p>
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

      {/* Modal de Criar/Editar */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                {usuarioEditando ? <Edit className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                {usuarioEditando ? 'Editar Usuário' : 'Novo Usuário'}
              </h2>
              <button
                onClick={fecharModal}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="Digite o nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                  placeholder="Mínimo 6 caracteres"
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Tipo de Usuário *
                </label>
                <select
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
                  disabled={carregando}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {carregando ? 'Salvando...' : usuarioEditando ? 'Atualizar' : 'Criar'}
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