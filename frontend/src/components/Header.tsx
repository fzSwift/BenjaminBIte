import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { clearAuth, getCurrentUser } from "../services/auth";
import api from "../services/api";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!user) {
        setCartCount(0);
        return;
      }
      try {
        const { data } = await api.get("/cart");
        const totalItems = (data.items || []).reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
        setCartCount(totalItems);
      } catch (_error) {
        setCartCount(0);
      }
    };

    fetchCartCount();
  }, [location.pathname, user?.id]);

  const logout = () => {
    clearAuth();
    setCartCount(0);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bb-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <img src="/logo.png" alt="Benjamin Bite logo" className="bb-brand-logo" />
          <span>Benjamin Bite</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#bbNavbar"
          aria-controls="bbNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="bbNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/cart">
                    Cart {cartCount > 0 ? `(${cartCount})` : ""}
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/orders">
                    Orders
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/profile">
                    Profile
                  </NavLink>
                </li>
              </>
            )}
            {user?.role === "admin" && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/admin/dashboard">
                  Admin Dashboard
                </NavLink>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2">
            {!user ? (
              <>
                <Link to="/login" className="btn btn-outline-light btn-sm px-3">
                  Login
                </Link>
                <Link to="/register" className="btn btn-warning btn-sm px-3">
                  Register
                </Link>
              </>
            ) : (
              <>
                <span className="bb-user-chip">{user.username}</span>
                <button className="btn btn-outline-light btn-sm px-3" onClick={logout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
