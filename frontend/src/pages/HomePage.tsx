import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const HomePage = () => {
  return (
    <div className="container py-5">
      <div className="row align-items-center g-4 hero-card card border-0 rounded-4 p-4 p-md-5 shadow-sm">
        <div className="col-lg-7">
          <span className="badge bg-warning text-dark mb-3 px-3 py-2">
            Campus Food Ordering Made Easy
          </span>

          <h1 className="display-5 fw-bold mb-3">
            Welcome to <span className="text-warning">Benjamin Bite</span>
          </h1>

          <p className="lead text-muted mb-4">
            Order your favourite canteen meals faster, manage your cart, track
            loyalty points, and enjoy a smooth food experience built for
            students and staff.
          </p>

          <div className="d-flex flex-wrap gap-3">
            <Link className="btn btn-warning px-4 py-2 fw-semibold" to="/menu">
              Browse Menu
            </Link>

            <Link className="btn btn-outline-dark px-4 py-2 fw-semibold" to="/register">
              Create Account
            </Link>

            <Link className="btn btn-dark px-4 py-2 fw-semibold" to="/login">
              Admin Login
            </Link>
          </div>
        </div>

        <div className="col-lg-5 text-center">
          <img
            src={logo}
            alt="Benjamin Bite Logo"
            className="img-fluid"
            style={{ maxWidth: "320px" }}
          />
        </div>
      </div>

      <div className="row g-4 mt-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100 p-4 rounded-4">
            <h5 className="fw-bold mb-2 text-warning">Fast Ordering</h5>
            <p className="mb-0 text-muted">
              Browse available meals, add items to cart, and checkout in just a few clicks.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100 p-4 rounded-4">
            <h5 className="fw-bold mb-2 text-warning">Loyalty Rewards</h5>
            <p className="mb-0 text-muted">
              Earn points from orders, redeem discounts, and move up through loyalty tiers.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100 p-4 rounded-4">
            <h5 className="fw-bold mb-2 text-warning">Smart Admin Tools</h5>
            <p className="mb-0 text-muted">
              Admins can manage menu items, monitor orders, and update order status easily.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold">How It Works</h2>
          <p className="text-muted mb-0">
            A simple process from browsing to enjoying your meal.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card border-0 bg-light h-100 p-4 rounded-4 text-center">
              <div className="fs-2 fw-bold text-warning mb-2">1</div>
              <h5 className="fw-semibold">Explore Menu</h5>
              <p className="text-muted mb-0">
                View meals, drinks, and specials available in the canteen.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 bg-light h-100 p-4 rounded-4 text-center">
              <div className="fs-2 fw-bold text-warning mb-2">2</div>
              <h5 className="fw-semibold">Add to Cart</h5>
              <p className="text-muted mb-0">
                Choose your preferred items and quantities before checking out.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 bg-light h-100 p-4 rounded-4 text-center">
              <div className="fs-2 fw-bold text-warning mb-2">3</div>
              <h5 className="fw-semibold">Order & Enjoy</h5>
              <p className="text-muted mb-0">
                Place your order, earn loyalty points, and enjoy your meal.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 bg-warning-subtle rounded-4 p-4 p-md-5 mt-5 text-center shadow-sm">
        <h3 className="fw-bold mb-2">Ready to order?</h3>
        <p className="text-muted mb-3">
          Join Benjamin Bite today and enjoy a smoother campus canteen experience.
        </p>
        <div className="d-flex justify-content-center flex-wrap gap-3">
          <Link className="btn btn-warning px-4 fw-semibold" to="/menu">
            Start Ordering
          </Link>
          <Link className="btn btn-outline-dark px-4 fw-semibold" to="/register">
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;