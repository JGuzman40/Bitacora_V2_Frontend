import { useState } from "react";
import axios from "axios";
import "./LoginForm.css";

const API_URL = import.meta.env.VITE_API_URL;
console.log("API URL:", API_URL);

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("Todos los campos son obligatorios");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "admin") {
        window.location.href = "/dashboard-administrador";
      } else {
        window.location.href = "/dashboard-participante";
      }
    } catch (err) {
      setError(err.response?.data?.message || "Ocurrió un error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <header className="login-header">
        <h1>Bienvenido a Bitácora</h1>
      </header>

      <main className="login-main">
        <form className="login-form" onSubmit={handleLogin}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Contraseña</label>
          <div className="password-input-container">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password-btn"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Cargando..." : "Ingresar"}
          </button>
        </form>
      </main>

      <footer className="login-footer">
        <p>Desarrollado por Jesu Guzman</p>
      </footer>
    </div>
  );
}

export default LoginForm;
