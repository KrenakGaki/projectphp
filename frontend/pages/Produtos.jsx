/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Plus, Package, Edit2, Trash2, X, Search, TrendingUp, AlertCircle, ArrowLeftCircle } from "lucide-react";
import api from '../services/api';

function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    quantity: "",
    cost_price: "",
    sale_price: "",
  });

  const navigate = useNavigate();

  const buscarProdutos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/produtos');
      setProdutos(response.data);
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
      alert('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.sale_price || !formData.cost_price || !formData.quantity) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const dadosParaEnviar = {
      name: formData.name,
      description: formData.description,
      cost_price: parseFloat(formData.cost_price),
      sale_price: parseFloat(formData.sale_price),
      quantity: parseInt(formData.quantity),
    };

    try {
      setLoading(true);

      if (editando) {
        await api.put(`/produtos/${editando.id}`, dadosParaEnviar);
        alert("Produto atualizado com sucesso!");
      } else {
        await api.post('/produtos', dadosParaEnviar);
        alert("Produto cadastrado com sucesso!");
      }

      await buscarProdutos();
      resetForm();

    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      console.error('Detalhes do erro:', error.response?.data);
      alert("Erro ao salvar produto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      quantity: "",
      cost_price: "",
      sale_price: "",
    });
    setShowModal(false);
    setEditando(null);
  };

  const handleEdit = (produto) => {
    setFormData({
      name: produto.name,
      description: produto.description || "",
      quantity: produto.quantity.toString(),
      cost_price: Number(produto.cost_price).toFixed(2),
      sale_price: Number(produto.sale_price).toFixed(2),
    });
    setEditando(produto);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      await api.delete(`/produtos/${id}`);
      await buscarProdutos();
      alert("Produto excluído com sucesso!");
    } catch (err) {
      alert("Erro ao excluir produto.");
    }
  };

  const produtosFiltrados = produtos.filter(produto =>
    produto.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produto.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProdutos = produtos.length;
  const valorTotal = produtos.reduce((acc, p) => acc + (p.sale_price * p.quantity), 0);
  const estoqueTotal = produtos.reduce((acc, p) => acc + p.quantity, 0);

  const formatarReal = (valorReal) => {
    return 'R$ ' + Number(valorReal).toLocaleString('pt-BR', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-xl text-gray-700 font-semibold">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50">
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-xl shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                  Gestão de Produtos
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">Sistema inteligente de controle</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="fixed top-5 left-5 z-50 flex items-center gap-2.5 bg-white border-2 border-gray-300 text-gray-800 px-5 py-3 rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:border-gray-400 hover:bg-gray-50 transform hover:scale-110 transition-all duration-300 group"
            >
              <ArrowLeftCircle className="w-7 h-7 text-blue-600 group-hover:text-blue-700 transition-colors" />
              <span className="hidden sm:block">Dashboard</span>
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Novo Produto
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Total de Produtos</p>
                <p className="text-3xl font-bold text-gray-800">{totalProdutos}</p>
              </div>
              <div className="p-4 bg-purple-100 rounded-xl">
                <Package className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Valor Total</p>
                <p className="text-3xl font-bold text-gray-800">{formatarReal(valorTotal)}</p>
              </div>
              <div className="p-4 bg-green-100 rounded-xl">
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium mb-1">Estoque Total</p>
                <p className="text-3xl font-bold text-gray-800">{estoqueTotal}</p>
              </div>
              <div className="p-4 bg-blue-100 rounded-xl">
                <AlertCircle className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Pesquisar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-xl shadow-md">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {produtosFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-fuchsia-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Package className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              {searchTerm ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}
            </h3>
            <p className="text-gray-500 mb-8 text-lg">
              {searchTerm ? "Tente usar outros termos de busca" : "Comece adicionando seu primeiro produto"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white px-8 py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Adicionar Primeiro Produto
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...produtosFiltrados]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((produto) => (
                <div key={produto.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden group">
                  <div className="h-2 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800 flex-1 group-hover:text-purple-600 transition-colors">
                        {produto.name}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(produto)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:scale-110"
                          title="Editar"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(produto.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:scale-110"
                          title="Excluir"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    {produto.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{produto.description}</p>
                    )}
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                        <span className="text-gray-600 text-sm font-medium">Custo:</span>
                        <span className="font-bold text-lg text-blue-600">
                          {produto.cost_price
                            ? `R$ ${Number(produto.cost_price).toFixed(2).replace('.', ',')}`
                            : 'Não definido'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
                        <span className="text-gray-600 text-sm font-medium">Venda:</span>
                        <span className={`font-bold text-lg ${
                          produto.sale_price ? 'text-green-600' : 'text-gray-700'
                        }`}>
                          {produto.sale_price
                            ? `R$ ${Number(produto.sale_price).toFixed(2).replace('.', ',')}`
                            : 'Não definido'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                        <span className="text-gray-600 text-sm font-medium">Estoque:</span>
                        <span className={`font-bold text-lg ${produto.quantity < 10 ? 'text-red-600' : 'text-gray-700'}`}>
                          {produto.quantity} un
                        </span>
                      </div>
                      {produto.cost_price && produto.sale_price && (
                        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                          <span className="text-gray-600 text-sm font-medium">Margem:</span>
                          <span className="font-bold text-lg text-yellow-700">
                            {((produto.sale_price - produto.cost_price) / produto.cost_price * 100).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>

                    {produto.category && (
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                        <span className="bg-gradient-to-r from-purple-100 to-fuchsia-100 text-purple-700 px-3 py-1.5 rounded-full text-xs font-semibold">
                          {produto.category}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white p-6 rounded-t-3xl flex justify-between items-center shadow-lg z-10">
              <div>
                <h2 className="text-2xl font-bold">
                  {editando ? "Editar Produto" : "Novo Produto"}
                </h2>
                <p className="text-purple-100 text-sm mt-1">
                  {editando ? "Atualize as informações do produto" : "Preencha os dados do novo produto"}
                </p>
              </div>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-all hover:rotate-90"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Ex: Notebook Dell Inspiron"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  placeholder="Descreva as características do produto..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Preço de Custo (R$) *
                  </label>
                  <input
                    type="number"
                    name="cost_price"
                    value={formData.cost_price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Preço de Venda (R$) *
                  </label>
                  <input
                    type="number"
                    name="sale_price"
                    value={formData.sale_price}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Quantidade *
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="0"
                />
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all hover:scale-105"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Salvando...' : editando ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Produtos;