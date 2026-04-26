import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/api";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search,   setSearch]   = useState("");
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  useEffect(() => {
    getProducts()
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("تعذّر تحميل المنتجات");
        setLoading(false);
      });
  }, []);

  const filtered = products.filter((p) =>
    p.name.includes(search)
  );

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      <h2 style={{ marginBottom: 24, fontSize: 28 }}>جميع المنتجات</h2>

      <input
        type="text"
        placeholder="ابحث عن منتج..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%", padding: "12px 16px",
          borderRadius: 10, border: "1px solid #ddd",
          fontSize: 15, marginBottom: 28, background: "white"
        }}
      />

      {loading && (
        <div style={{ textAlign: "center", padding: 60, fontSize: 18, color: "#666" }}>
          ⏳ جاري تحميل المنتجات...
        </div>
      )}

      {error && (
        <div style={{ textAlign: "center", padding: 60, color: "#e63946", fontSize: 16 }}>
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 60, color: "#666" }}>
          لا توجد منتجات
        </div>
      )}

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: 24
      }}>
        {filtered.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;