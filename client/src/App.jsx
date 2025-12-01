import { BrowserRouter, Routes, Route } from "react-router-dom";
import BookList from "./components/BookList";
import BookSearch from "./components/BookSearch";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
return (
	<AuthProvider>
		<BrowserRouter>
			<Navbar />
			<main id="main-content" className="px-4 py-6 font-lato">
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route
						path="/"
						element={
							<ProtectedRoute>
								<BookList />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/books"
						element={
							<ProtectedRoute>
								<BookList />
							</ProtectedRoute>
						}
					/>
					<Route
						path="/search"
						element={
							<ProtectedRoute>
								<BookSearch />
							</ProtectedRoute>
						}
					/>
					<Route
						path="*"
						element={
							<div id="notfound" className="max-w-4xl mx-auto mt-8">
								<h2 id="notfound-heading" className="text-xl font-roboto mb-2">404 — Not Found</h2>
								<p className="text-gray-700">The page you requested does not exist.</p>
							</div>
						}
					/>
				</Routes>
			</main>
		</BrowserRouter>
	</AuthProvider>
);
}

export default App;
