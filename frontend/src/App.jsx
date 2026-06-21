import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
  path="/"
  element={<Navigate to="/login" />}
/>
        <Route
          path="/register"
          element={<Register />}
        />

        <Route
  path="/dashboard"
  element={<Dashboard />}
/>

        <Route
          path="/login"
          element={<Login />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;