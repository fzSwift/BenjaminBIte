import { FormEvent, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../services/api";
import { getCurrentUser } from "../services/auth";

interface CheckoutState {
  orderId?: string;
  totalAmount?: number;
}

const CheckoutPage = () => {
  const location = useLocation();
  const { orderId, totalAmount } = (location.state as CheckoutState) || {};
  const user = getCurrentUser();
  const [pointsBalance, setPointsBalance] = useState(0);
  const [pointsToRedeem, setPointsToRedeem] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [updatedTotal, setUpdatedTotal] = useState<number | null>(null);
  const [redeemedPoints, setRedeemedPoints] = useState(0);

  useEffect(() => {
    if (!user) return;
    api
      .get(`/user/${user.id}/points`)
      .then((res) => setPointsBalance(res.data.pointsBalance || 0))
      .catch(() => setPointsBalance(0));
  }, [user?.id]);

  const redeemFromCheckout = async (e: FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    setMessage("");
    setError("");
    try {
      const { data } = await api.post(`/orders/${orderId}/redeem`, {
        pointsToRedeem: Number(pointsToRedeem)
      });
      setMessage(data.message || "Points redeemed successfully");
      setUpdatedTotal(data.updatedOrderTotal);
      setRedeemedPoints(data.redeemedPoints || 0);
      setPointsBalance(data.updatedBalance || 0);
      setPointsToRedeem("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to redeem points");
    }
  };

  return (
    <div className="container py-5">
      <div className="alert alert-success mb-4">
        <h4>Checkout Complete</h4>
        <p className="mb-1">Your order has been placed. Loyalty points were added automatically.</p>
        {typeof totalAmount === "number" && <p className="mb-0 fw-semibold">Order Total: ${totalAmount.toFixed(2)}</p>}
      </div>

      {orderId ? (
        <div className="card p-3">
          <h5>Redeem Points Now</h5>
          <p className="text-muted mb-2">
            Current Points Balance: <strong>{pointsBalance}</strong>
          </p>
          {redeemedPoints > 0 && (
            <div className="alert alert-info">
              Redeemed {redeemedPoints} points. New total: ${Number(updatedTotal || totalAmount || 0).toFixed(2)}
            </div>
          )}
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          <form className="d-flex gap-2" onSubmit={redeemFromCheckout}>
            <input
              type="number"
              min={1}
              className="form-control"
              placeholder="Points to redeem"
              value={pointsToRedeem}
              onChange={(e) => setPointsToRedeem(e.target.value)}
            />
            <button className="btn btn-warning">Redeem</button>
          </form>
          <small className="text-muted mt-2">This order allows one redemption only.</small>
        </div>
      ) : (
        <div className="card p-3">
          <p className="mb-2">Need to redeem points for a previous order?</p>
          <Link to="/orders" className="btn btn-outline-dark btn-sm">
            Open Order History
          </Link>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
