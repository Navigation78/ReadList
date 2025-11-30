import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookList from "./components/BookList";
import Navbar from "./components/Navbar";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
return (
		<BrowserRouter>
			<Navbar />
			<div className="px-4 py-6 font-lato">
				<Routes>
				<Route path="/" element={<SignUp />} />
					<Route path="/about" element={<About />} />
<Route path="/signup" element={<SignUp />} />
<Route path="/login" element={<Login />} />
<Route
path="/dashboard"
element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute>
}
/>
<Route path="/books" element={<BookList />} />
<Route path="*" element={<NotFound />} /> </Routes> </div> </BrowserRouter>
);
}

export default App;
