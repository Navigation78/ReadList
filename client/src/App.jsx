import BookSearch from "./components/BookSearch";
import BookList from "./components/BookList";

function App() {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>📚 My Reading List</h1>
      <p style={{ color: "#555" }}>
        Search books using Google Books API or browse your personal reading list.
      </p>

      <section style={{ marginBottom: "40px" }}>
        <BookSearch />
      </section>

      <section>
        <BookList />
      </section>
    </div>
  );
}

export default App;
