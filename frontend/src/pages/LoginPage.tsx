import { FormEvent, useState } from "react";
import api from "../services/api";
import { saveAuth } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    try {
      const { data } = await api.post("/user/login", { email, password });
      saveAuth(data.token, data.user);
      navigate(data.user.role === "admin" ? "/admin/dashboard" : "/menu");
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card p-4 p-md-5 auth-card">
            <div className="text-center mb-4">
              <h2 className="mb-1">Welcome Back</h2>
              <p className="text-muted mb-0">Sign in to continue ordering with Benjamin Bite.</p>
            </div>

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <form onSubmit={submit}>
              <label className="form-label">Email</label>
              <input
                className="form-control mb-3"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <label className="form-label">Password</label>
              <input
                className="form-control mb-4"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button className="btn btn-dark w-100" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="text-center text-muted mt-3 mb-0">
              New here?{" "}
              <Link to="/register" className="fw-semibold text-decoration-none">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
