import Snow from "./Snow";

function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <Snow />
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
