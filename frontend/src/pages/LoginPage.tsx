import { FormEvent, useState } from "react";
import api from "../services/api";
import { saveAuth } from "../services/auth";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/user/login", { email, password });
      saveAuth(data.token, data.user);
      navigate(data.user.role === "admin" ? "/admin/dashboard" : "/menu");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="container py-4">
      <h2>Login</h2>
      {message && <div className="alert alert-danger">{message}</div>}
      <form className="card p-3" onSubmit={submit}>
        <input className="form-control mb-2" type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input className="form-control mb-3" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        <button className="btn btn-dark">Sign In</button>
      </form>
    </div>
  );
};

export default LoginPage;
