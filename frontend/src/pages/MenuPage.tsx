import { useEffect, useState } from "react";
import api from "../services/api";
import { MenuItem } from "../types";

const MenuPage = () => {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [isOfflineDemoMode, setIsOfflineDemoMode] = useState(false);

  const fetchMenu = async () => {
    const response = await api.get("/menu");
    const offline = response.headers["x-app-mode"] === "offline-demo";
    setIsOfflineDemoMode(offline);
    setMenu(response.data.filter((item: MenuItem) => item.available));
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const addToCart = async (menuItemId: string) => {
    try {
      await api.post("/cart", { menuItemId, quantity: 1 });
      setMessage("Added to cart");
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Failed to add item");
    }
  };

  const searchMenu = async () => {
    const response = await api.get("/menu/search", { params: { q: search } });
    const offline = response.headers["x-app-mode"] === "offline-demo";
    setIsOfflineDemoMode(offline);
    setMenu(response.data);
  };

  return (
    <div className="container py-4">
      <h2 className="section-title">Menu</h2>
      {isOfflineDemoMode && (
        <div className="alert alert-warning">
          Running in offline demo mode. Showing fallback menu items because database is currently unavailable.
        </div>
      )}
      {message && <div className="alert alert-info">{message}</div>}
      <div className="d-flex gap-2 mb-3">
        <input className="form-control" placeholder="Search food..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button className="btn btn-outline-dark" onClick={searchMenu}>
          Search
        </button>
      </div>
      <div className="row g-3">
        {menu.map((item) => (
          <div className="col-md-4" key={item._id}>
            <div className="card h-100">
              {item.image && <img src={item.image} className="card-img-top menu-image" alt={item.name} />}
              <div className="card-body">
                <h5>{item.name}</h5>
                <p className="text-muted">{item.description}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="price-pill">${item.price.toFixed(2)}</span>
                  <button className="btn btn-warning btn-sm" onClick={() => addToCart(item._id)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
