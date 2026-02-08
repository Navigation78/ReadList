import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

function ProtectedLayout() {
  return (
    <>
      <Navbar />
      <main className="px-4 py-6 font-lato">
        <Outlet />
      </main>
    </>
  );
}

export default ProtectedLayout;
