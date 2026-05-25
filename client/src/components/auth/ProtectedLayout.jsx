import Navbar from "../common/Navbar";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./ProtectedLayout.module.css";

function ProtectedLayout({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className={styles.loading}>Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className={styles.shell}>
      <Navbar />
      <main className={styles.main}>{children}</main>
    </div>
  );
}

export default ProtectedLayout;
