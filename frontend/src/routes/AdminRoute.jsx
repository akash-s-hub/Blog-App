import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "../components/common/Loader";

export default function AdminRoute() {
  const { isAdmin, loading } = useAuth();

  if (loading) return <Loader />;

  if (!isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}