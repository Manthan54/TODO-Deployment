import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FiLogOut, FiCheckSquare, FiUser } from "react-icons/fi";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="nav-logo">
          <FiCheckSquare size={26} />
          TaskFlow
        </Link>

        <div className="nav-actions">
          <div className="user-badge">
            <FiUser />
            {user?.name || "User"}
          </div>
          <button onClick={handleLogout} className="btn-outline">
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
