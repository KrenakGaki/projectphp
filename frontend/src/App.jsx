import { useEffect, useState } from "react";
import { Plus, Package, Edit2, Trash2, X} from "lucide-react";
import api from "./axios";

function App() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState(null);


  // Formulario
  const [formData, setFormData] = useState({
      nome: "",
      descricao: "",
      quantidade: 0,
      preco: "",
    });

    
    useEffect(() => {
      api.get("/produtos")
        .then((response) => {
          setProdutos(response.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Erro ao buscar produtos:", err);
          setLoading(false);
        });
    }, []);

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setFormData(prev => ({...prev, [name]: value}))};

  const handleSubmit = (e) => {
  e.preventDefault(); // ← Impede o refresh da página

  // ✅ CORRIGI: descricao não é obrigatória, e adicionei preco
  if (!formData.nome || !formData.preco || !formData.quantidade) {
    alert("Por favor, preencha todos os campos obrigatórios.");
    return;
  }

  // Preparar os dados (convertendo para número)
  const dadosParaEnviar = {
    ...formData,
    preco: parseFloat(formData.preco),
    quantidade: parseInt(formData.quantidade)
  };

  if (editando) {
    // 📝 EDITANDO um produto existente
    api.put(`/produtos/${editando.id}`, dadosParaEnviar)
      .then((response) => {
        // Atualiza o produto na lista
        setProdutos(prev => prev.map(p =>
          p.id === editando.id ? response.data : p
        ));
        resetForm();
        alert("Produto atualizado com sucesso!");
      })
      .catch((err) => {
        console.error("Erro ao atualizar:", err);
        alert("Erro ao atualizar produto!");
      });
  } 
  else {
    // ➕ CRIANDO um produto novo
    api.post("/produtos", dadosParaEnviar)
      .then((response) => {
        // Adiciona o produto na lista
        setProdutos(prev => [...prev, response.data]);
        resetForm();
        alert("Produto cadastrado com sucesso!");
      })
      .catch((err) => {
        console.error("Erro ao cadastrar:", err);
        alert("Erro ao cadastrar produto!");
      });
  }

};

  const resetForm = () => {
    setFormData({
      nome: "",
      descricao: "",
      quantidade: "",
      preco: "",
    });
    setShowModal(false);
    setEditando(null);
  };

  const handleEdit = (produto) => {
    setFormData ({
      nome: produto.nome,
      descricao: produto.descricao|| "",
      quantidade: produto.quantidade.toString(),
      preco: produto.preco,
    });
    setEditando(produto);
    setShowModal (true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Deseja apagar o item?")) {
      api.delete(`/produtos/${id}`)
      .then(() => {
        setProdutos(prev => prev.filter(p => p.id !== id));
        alert("Produto deletado com sucesso!");
  })
      .catch(() => {
        setError("Erro ao carregar produtos");
      });
    }
  };

    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 font-medium">Carregando produtos...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-indigo-600" />
                <h1 className="text-3xl font-bold text-gray-800">Gestão de Produtos</h1>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                Novo Produto
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {produtos.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Nenhum produto cadastrado</h3>
              <p className="text-gray-500 mb-6">Comece adicionando seu primeiro produto</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Adicionar Produto
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {produtos.map((produto) => (
                <div key={produto.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-gray-800 flex-1">{produto.nome}</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(produto)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(produto.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    {produto.descricao && (
                      <p className="text-gray-600 text-sm mb-4">{produto.descricao}</p>
                    )}
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Preço:</span>
                        <span className="text-2xl font-bold text-green-600">
                          R$ {produto.preco ? parseFloat(produto.preco).toFixed(2) : '0.00'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Estoque:</span>
                        <span className={`font-semibold ${produto.quantidade < 10 ? 'text-red-600' : 'text-gray-700'}`}>
                          {produto.quantidade} unidades
                        </span>
                      </div>
                    </div>

                    {(produto.categoria || produto.fornecedor) && (
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                        {produto.categoria && (
                          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                            {produto.categoria}
                          </span>
                        )}
                        {produto.fornecedor && (
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                            {produto.fornecedor}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de Cadastro/Edição */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {editando ? "Editar Produto" : "Novo Produto"}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Ex: Notebook Dell Inspiron"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Descreva as características do produto..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Preço (R$) *
                    </label>
                    <input
                      type="number"
                      name="preco"
                      value={formData.preco}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quantidade *
                    </label>
                    <input
                      type="number"
                      name="quantidade"
                      value={formData.quantidade}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Categoria
                  </label>
                  <input
                    type="text"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Ex: Eletrônicos, Periféricos, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Fornecedor
                  </label>
                  <input
                    type="text"
                    name="fornecedor"
                    value={formData.fornecedor}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Nome do fornecedor"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
                  >
                    {editando ? "Atualizar" : "Cadastrar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }

export default App;