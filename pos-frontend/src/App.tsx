import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import POS from "./pages/POS";
import ProtectedRoute from "./components/ProtectedRoute";

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
      </Routes>
    </BrowserRouter>
  );
}