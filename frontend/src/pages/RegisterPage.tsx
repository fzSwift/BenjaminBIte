import { FormEvent, useState } from "react";
import api from "../services/api";
import { saveAuth } from "../services/auth";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    adminSecretKey: "",
    referredByCode: ""
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    try {
      const { data } = await api.post("/user/register", form);
      saveAuth(data.token, data.user);
      navigate(data.user.role === "admin" ? "/admin/dashboard" : "/menu");
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-7">
          <div className="card p-4 p-md-5 auth-card">
            <div className="text-center mb-4">
              <h2 className="mb-1">Create Your Account</h2>
              <p className="text-muted mb-0">Join Benjamin Bite and start ordering in minutes.</p>
            </div>

            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}

            <form onSubmit={submit}>
              <label className="form-label">Username</label>
              <input
                className="form-control mb-3"
                placeholder="Enter username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />

              <label className="form-label">Email</label>
              <input
                className="form-control mb-3"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />

              <label className="form-label">Password</label>
              <input
                className="form-control mb-3"
                type="password"
                placeholder="Create password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />

              <label className="form-label">Account Type</label>
              <select className="form-select mb-3" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="user">User</option>
                <option value="admin">Admin (Canteen)</option>
              </select>

              {form.role === "admin" && (
                <>
                  <label className="form-label">Admin Secret Key</label>
                  <input
                    className="form-control mb-3"
                    placeholder="Enter admin secret key"
                    value={form.adminSecretKey}
                    onChange={(e) => setForm({ ...form, adminSecretKey: e.target.value })}
                    required
                  />
                </>
              )}

              <label className="form-label">Referral Code (Optional)</label>
              <input
                className="form-control mb-4"
                placeholder="Enter referral code"
                value={form.referredByCode}
                onChange={(e) => setForm({ ...form, referredByCode: e.target.value })}
              />

              <button className="btn btn-warning w-100 fw-semibold" disabled={loading}>
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </form>

            <p className="text-center text-muted mt-3 mb-0">
              Already have an account?{" "}
              <Link to="/login" className="fw-semibold text-decoration-none">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
