import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { IconLoader } from "./icons";

export default function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-canvas">
        <div className="flex items-center gap-2 text-ink-2">
          <IconLoader className="h-4 w-4" />
          <span className="text-[13.5px]">Loading EcoTwin…</span>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
