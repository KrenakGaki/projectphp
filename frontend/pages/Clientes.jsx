/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, X, Users, Phone, FileText, MapPin, ArrowLeftCircle } from 'lucide-react';
import api from '../services/api';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    address: '',
  });

  const navigate = useNavigate();

  const voltarAoDashboard = () => {
    navigate('/dashboard');
  };

  useEffect(() => {
    buscarClientes();
  }, []);

  const buscarClientes = () => {
    setLoading(true);
    api.get('/clientes')
      .then(response => {
        setClientes(response.data);
      })
      .catch(error => {
        console.error('Erro ao carregar clientes:', error);
        alert('Erro ao carregar clientes');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      alert('Preencha nome e e-mail!');
      return;
    }

    const requisicao = editando
      ? api.put(`/clientes/${editando.id}`, formData)
      : api.post('/clientes', formData);

    requisicao
      .then(response => {
        if (editando) {
          setClientes(prev => prev.map(c => c.id === editando.id ? response.data : c));
        } else {
          setClientes(prev => [...prev, response.data]);
        }
        resetForm();
        alert('Cliente salvo com sucesso!');
      })
      .catch(err => {
        console.error('Erro ao salvar:', err);
        alert('Erro ao salvar cliente');
      });
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', cpf: '', address: '' });
    setShowModal(false);
    setEditando(null);
  };

  const handleEdit = (cliente) => {
    setFormData(cliente);
    setEditando(cliente);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      api.delete(`/clientes/${id}`)
        .then(() => {
          setClientes(prev => prev.filter(c => c.id !== id));
          alert('Cliente excluído com sucesso!');
        })
        .catch(err => {
          console.error('Erro ao excluir:', err);
          alert('Erro ao excluir cliente');
        });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 border-8 border-blue-200 rounded-full"></div>
            <div className="absolute inset-0 border-8 border-t-transparent border-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-2xl font-bold text-blue-700">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
              onClick={voltarAoDashboard}
              className="fixed top-5 left-5 z-50 flex items-center gap-2.5 bg-white border-2 border-gray-300 text-gray-800 px-5 py-3 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:border-gray-400 hover:bg-gray-50 transform hover:scale-110 transition-all duration-300 group"
            >
              <ArrowLeftCircle className="w-7 h-7 text-blue-600 group-hover:text-blue-700 transition-colors" />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Novo Cliente
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {clientes.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-20 text-center border border-blue-100">
            <div className="w-28 h-28 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full mx-auto mb-8 flex items-center justify-center shadow-inner">
              <Users className="w-14 h-14 text-blue-500" />
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Nenhum cliente cadastrado ainda
            </h3>
            <p className="text-lg text-gray-600 mb-10 max-w-md mx-auto">
              Comece agora mesmo adicionando seu primeiro cliente ao sistema
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              <Plus className="w-6 h-6" />
              Adicionar Primeiro Cliente
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-12">
            {[...clientes]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((cliente) => (
                <div
                  key={cliente.id}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden border border-blue-100"
                >
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center shadow-inner">
                          <Users className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {cliente.name}
                          </h3>
                          <p className="text-sm text-gray-500">{cliente.email}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(cliente)}
                          className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl transition-all hover:scale-110"
                          title="Editar"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(cliente.id)}
                          className="p-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all hover:scale-110"
                          title="Excluir"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-100">
                      {cliente.phone && (
                        <div className="flex items-center gap-3 text-gray-600">
                          <Phone className="w-5 h-5 text-blue-500" />
                          <span className="text-sm font-medium">{cliente.phone}</span>
                        </div>
                      )}
                      {cliente.cpf && (
                        <div className="flex items-center gap-3 text-gray-600">
                          <FileText className="w-5 h-5 text-cyan-500" />
                          <span className="text-sm font-medium">{cliente.cpf}</span>
                        </div>
                      )}
                      {cliente.address && (
                        <div className="flex items-center gap-3 text-gray-600">
                          <MapPin className="w-5 h-5 text-indigo-500" />
                          <span className="text-sm font-medium line-clamp-2">{cliente.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-8 rounded-t-3xl shadow-xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-3xl font-bold">
                      {editando ? "Editar Cliente" : "Novo Cliente"}
                    </h2>
                    <p className="text-blue-100 mt-1">
                      {editando ? "Atualize os dados do cliente" : "Preencha todos os campos"}
                    </p>
                  </div>
                  <button
                    onClick={resetForm}
                    className="p-3 hover:bg-white/20 rounded-2xl transition-all hover:rotate-90"
                  >
                    <X className="w-7 h-7" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Nome completo *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                      placeholder="João Silva"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">E-mail *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                      placeholder="joao@exemplo.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Telefone</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                      placeholder="(11) 98765-4321"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">CPF</label>
                    <input
                      type="text"
                      value={formData.cpf}
                      onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                      className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all"
                      placeholder="123.456.789-00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Endereço completo</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={3}
                    className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all resize-none"
                    placeholder="Rua Exemplo, 123 - Bairro - Cidade/SP"
                  />
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-8 py-5 border-2 border-gray-300 text-gray-700 rounded-2xl font-bold hover:bg-gray-50 transition-all hover:scale-105"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-8 py-5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                  >
                    {editando ? "Atualizar Cliente" : "Cadastrar Cliente"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Clientes;