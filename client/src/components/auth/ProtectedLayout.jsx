import Navbar from "../common/Navbar";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="p-6">Loading…</div>;

  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      <Navbar />
      <main className="px-4 py-6">
        {children}
      </main>
    </>
  );
}

export default ProtectedLayout;