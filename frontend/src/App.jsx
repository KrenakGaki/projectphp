import {BrowserRouter, Routes, Route} from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Clientes from "../pages/Clientes";
import Produtos from "../pages/Produtos";
import Vendas from "../pages/Vendas";
import Usuarios from "../pages/Usuarios";

import PrivateRoute from "../components/PrivateRoute";
import Layout from "../components/Layout";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota liberada*/}
          <Route path="/" element={<Login />} />

          {/*Rota bloqueada*/}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/clientes" element={<Clientes />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/vendas" element={<Vendas />} />
            <Route path="/usuarios" element={<Usuarios />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;