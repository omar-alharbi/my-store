import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div style={{
      background: "white",
      borderRadius: 12,
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      transition: "transform 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
      onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
    >
      <img
        src={product.image || "https://via.placeholder.com/300x200"}
        alt={product.name}
        style={{ width: "100%", height: 200, objectFit: "cover" }}
      />
      <div style={{ padding: 16 }}>
        <h3 style={{ marginBottom: 6, fontSize: 16 }}>{product.name}</h3>
        <p style={{ color: "#666", fontSize: 13, marginBottom: 12 }}>
          {product.description}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 18, fontWeight: "bold", color: "#1a1a2e" }}>
            {product.price} ر.س
          </span>
          <button
            onClick={() => addToCart(product)}
            style={{
              background: "#1a1a2e",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: 8,
              fontSize: 13,
            }}
          >
            + أضف للسلة
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;