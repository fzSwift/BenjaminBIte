import { useEffect, useState } from "react";
import api from "../services/api";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [searchOrderId, setSearchOrderId] = useState("");
  const [searchUsername, setSearchUsername] = useState("");

  const loadOrders = () => api.get("/orders/admin").then((res) => setOrders(res.data));
  useEffect(() => {
    loadOrders();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    await api.put(`/orders/${orderId}/status`, { status });
    loadOrders();
  };

  const searchOrders = async () => {
    const { data } = await api.get("/orders/admin/search", { params: { orderId: searchOrderId, username: searchUsername } });
    setOrders(data);
  };

  return (
    <div className="container py-4">
      <h2>Admin Orders</h2>
      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <input className="form-control" placeholder="Order ID" onChange={(e) => setSearchOrderId(e.target.value)} />
        </div>
        <div className="col-md-4">
          <input className="form-control" placeholder="Username" onChange={(e) => setSearchUsername(e.target.value)} />
        </div>
        <div className="col-md-4">
          <button className="btn btn-outline-dark w-100" onClick={searchOrders}>
            Search
          </button>
        </div>
      </div>

      {orders.map((order) => (
        <div key={order._id} className="card p-3 mb-2">
          <p className="mb-1">
            <strong>Order:</strong> {order._id}
          </p>
          <p className="mb-1">
            <strong>Status:</strong> {order.status}
          </p>
          <p className="mb-2">
            <strong>Total:</strong> ${order.totalAmount.toFixed(2)}
          </p>
          <select className="form-select" onChange={(e) => updateStatus(order._id, e.target.value)} value={order.status}>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
            <option>Cancelled</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default AdminOrdersPage;
