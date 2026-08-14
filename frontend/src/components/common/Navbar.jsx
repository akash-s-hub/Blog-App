import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import toast from "react-hot-toast";

export default function Navbar() {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out");
      navigate("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 border-b bg-white">
      <Link to="/" className="font-bold text-lg">BlogApp</Link>

      <div className="flex items-center gap-4">
        {loading ? (
          <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
        ) : isAuthenticated ? (
          <>
            <Link to="/create-post" className="text-sm text-blue-600">Write</Link>
            <Link to={`/profile/${user?._id}`} className="text-sm">{user?.username}</Link>
            <button onClick={handleLogout} className="text-sm text-red-600">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm">Login</Link>
            <Link to="/register" className="text-sm">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}