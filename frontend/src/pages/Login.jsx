import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../utils/api";
import "../styles/Auth.css";

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { email, password } = formData;

      if (!email || !password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      const data = await loginUser(formData);

      console.log("Login successful, user data:", {
        id: data.user?._id,
        username: data.user?.username,
        hasToken: !!data.token,
      });

      localStorage.setItem("token", data.token);
      setUser(data.user);

      navigate("/");
    } catch (error) {
      console.error("Login error:", error);

      if (error.response && error.response.data) {
        setError(
          error.response.data.message || "An error occurred. Please try again."
        );
      } else {
        setError("Cannot connect to server. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h2>Login to Your Account</h2>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-redirect">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
