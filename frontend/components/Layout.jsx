import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      {/* Lateral fixa */}
      <aside style={{ width: "250px", background: "#222", color: "#fff", padding: "20px" }}>
        <h2>Menu</h2>
        <ul>
          <li>Dashboard</li>
          <li>Clientes</li>
          <li>Produtos</li>
          <li>Vendas</li>
        </ul>
      </aside>

      {/* Conteúdo que muda */}
      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>
    </div>
  );
}
