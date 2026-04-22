import { FormEvent, useEffect, useState } from "react";
import api from "../services/api";
import { getCurrentUser } from "../services/auth";

interface OrderRecord {
  _id: string;
  status: string;
  totalAmount: number;
  redeemedPoints?: number;
}

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [redeemValues, setRedeemValues] = useState<Record<string, string>>({});
  const [pointsBalance, setPointsBalance] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadOrders = async () => {
    const user = getCurrentUser();
    if (!user) return;
    const [ordersRes, pointsRes] = await Promise.all([
      api.get(`/orders/${user.id}`),
      api.get(`/user/${user.id}/points`)
    ]);
    setOrders(ordersRes.data);
    setPointsBalance(pointsRes.data.pointsBalance || 0);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const redeemForOrder = async (e: FormEvent, orderId: string) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const value = Number(redeemValues[orderId] || 0);
      const { data } = await api.post(`/orders/${orderId}/redeem`, { pointsToRedeem: value });
      setMessage(`${data.message}. New total: $${Number(data.updatedOrderTotal).toFixed(2)}`);
      setRedeemValues((prev) => ({ ...prev, [orderId]: "" }));
      await loadOrders();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to redeem points");
    }
  };

  return (
    <div className="container py-4">
      <h2>Order History</h2>
      <p className="text-muted">Current points balance: {pointsBalance}</p>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {orders.map((order) => {
        const alreadyRedeemed = (order.redeemedPoints || 0) > 0;
        return (
          <div key={order._id} className="card p-3 mb-2">
            <h6>Order #{order._id}</h6>
            <p className="mb-1">Status: {order.status}</p>
            <p className="mb-2">Total: ${order.totalAmount.toFixed(2)}</p>
            {alreadyRedeemed ? (
              <small className="text-success">Redeemed points: {order.redeemedPoints}</small>
            ) : (
              <form className="d-flex gap-2" onSubmit={(e) => redeemForOrder(e, order._id)}>
                <input
                  type="number"
                  min={1}
                  className="form-control"
                  placeholder="Points to redeem"
                  value={redeemValues[order._id] || ""}
                  onChange={(e) =>
                    setRedeemValues((prev) => ({
                      ...prev,
                      [order._id]: e.target.value
                    }))
                  }
                />
                <button className="btn btn-warning">Redeem</button>
              </form>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderHistoryPage;
