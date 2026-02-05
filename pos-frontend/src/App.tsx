import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import POS from "./pages/POS";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/admin/Outlet/Dashboard";
import Products from "./pages/admin/Outlet/Products";
import AdminLayout from "./pages/admin/Layout/Navbar";
import Reports from "./pages/admin/Outlet/Reports";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/pos"
          element={
            <ProtectedRoute>
              <POS />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
        </Route>

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Products />} />
        </Route>
        
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Reports />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}