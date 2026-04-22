import { FormEvent, useState } from "react";
import api from "../services/api";
import { saveAuth } from "../services/auth";
import { useNavigate } from "react-router-dom";

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
  const [message, setMessage] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/user/register", form);
      saveAuth(data.token, data.user);
      navigate(data.user.role === "admin" ? "/admin/dashboard" : "/menu");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container py-4">
      <h2>Register</h2>
      {message && <div className="alert alert-danger">{message}</div>}
      <form className="card p-3" onSubmit={submit}>
        <input className="form-control mb-2" placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input className="form-control mb-2" type="email" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="form-control mb-2" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <select className="form-select mb-2" onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {form.role === "admin" && (
          <input
            className="form-control mb-2"
            placeholder="Admin Secret Key"
            onChange={(e) => setForm({ ...form, adminSecretKey: e.target.value })}
          />
        )}
        <input
          className="form-control mb-3"
          placeholder="Referral code (optional)"
          onChange={(e) => setForm({ ...form, referredByCode: e.target.value })}
        />
        <button className="btn btn-warning">Create Account</button>
      </form>
    </div>
  );
};

export default RegisterPage;
