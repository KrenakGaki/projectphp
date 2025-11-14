import { useEffect, useState } from 'react';
import api from '../services/api'; // importa o axios configurado

function Produtos() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    api.get('/api/produtos')
      .then(response => setProdutos(response.data))
      .catch(error => console.error('Erro ao buscar produtos:', error));
  }, []);

  return (
    <div>
      <h1>Lista de Produtos</h1>
      <ul>
        {produtos.map(p => (
          <li key={p.id}>{p.nome}</li>
        ))}
      </ul>
    </div>
  );
}

export default Produtos;
