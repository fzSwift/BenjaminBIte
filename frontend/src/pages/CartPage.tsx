import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  image?: string;
  available: boolean;
  quantity: number;
  lineTotal: number;
}

const CartPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [message, setMessage] = useState("");

  const loadCart = async () => {
    const { data } = await api.get("/cart");
    setItems(data.items);
    setTotalAmount(data.totalAmount || 0);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQty = async (menuItemId: string, quantity: number) => {
    if (quantity < 1) return;
    await api.put(`/cart/${menuItemId}`, { quantity });
    await loadCart();
  };

  const removeItem = async (menuItemId: string) => {
    await api.delete(`/cart/${menuItemId}`);
    await loadCart();
  };

  const checkout = async () => {
    try {
      const { data } = await api.post("/cart/checkout");
      setMessage("Checkout successful");
      navigate("/checkout", {
        state: {
          orderId: data.order?._id,
          totalAmount: data.order?.totalAmount
        }
      });
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Checkout failed");
    }
  };

  return (
    <div className="container py-4">
      <h2 className="section-title">Your Cart</h2>
      {message && <div className="alert alert-info">{message}</div>}
      {items.length === 0 && (
        <div className="card p-4 text-center">
          <p className="mb-3">No items in cart yet.</p>
          <button className="btn btn-warning" onClick={() => navigate("/menu")}>
            Browse Menu
          </button>
        </div>
      )}
      {items.map((item) => (
        <div key={item.menuItemId} className="card p-3 mb-2">
          <div className="d-flex justify-content-between gap-3 align-items-center">
            <div className="d-flex align-items-center gap-3">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="rounded"
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                />
              )}
              <div>
                <h6 className="mb-1">{item.name}</h6>
                <small className="text-muted">${item.price.toFixed(2)} each</small>
                {!item.available && <div className="text-danger small">Currently unavailable</div>}
              </div>
            </div>
            <div className="d-flex gap-2 align-items-center">
              <input
                type="number"
                min={1}
                className="form-control"
                style={{ width: "90px" }}
                value={item.quantity}
                onChange={(e) => updateQty(item.menuItemId, Number(e.target.value))}
              />
              <button className="btn btn-sm btn-outline-danger" onClick={() => removeItem(item.menuItemId)}>
                Remove
              </button>
            </div>
          </div>
          <div className="mt-2 text-end fw-semibold">Line Total: ${item.lineTotal.toFixed(2)}</div>
        </div>
      ))}
      {items.length > 0 && (
        <div className="card p-3 mt-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Total: ${totalAmount.toFixed(2)}</h5>
            <button className="btn btn-warning" onClick={checkout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
