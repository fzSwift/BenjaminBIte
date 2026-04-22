import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="container py-5 text-center">
      <h1>404</h1>
      <p>Page not found.</p>
      <Link to="/" className="btn btn-dark">
        Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
