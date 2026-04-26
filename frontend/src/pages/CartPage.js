import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { FiTrash2 } from "react-icons/fi";

function CartPage() {
  const { cartItems, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <div style={{ fontSize: 60 }}>🛒</div>
        <h2 style={{ marginTop: 16, color: "#666" }}>السلة فارغة</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      <h2 style={{ marginBottom: 28 }}>سلة التسوق</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>

        {/* قائمة المنتجات */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {cartItems.map((item) => (
            <div key={item._id} style={{
              background: "white", borderRadius: 12,
              padding: 16, display: "flex", gap: 16, alignItems: "center",
              boxShadow: "0 2px 6px rgba(0,0,0,0.06)"
            }}>
              <img
                src={item.image || "https://via.placeholder.com/80"}
                alt={item.name}
                style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8 }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ marginBottom: 4 }}>{item.name}</h3>
                <p style={{ color: "#666", fontSize: 14 }}>
                  {item.price} ر.س × {item.qty}
                </p>
              </div>
              <span style={{ fontWeight: "bold", fontSize: 16 }}>
                {item.price * item.qty} ر.س
              </span>
              <button
                onClick={() => removeFromCart(item._id)}
                style={{ background: "none", border: "none", color: "#e63946", padding: 8 }}
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* ملخص الطلب */}
        <div style={{
          background: "white", borderRadius: 12,
          padding: 24, boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
          height: "fit-content"
        }}>
          <h3 style={{ marginBottom: 20 }}>ملخص الطلب</h3>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, color: "#666" }}>
            <span>المجموع الفرعي</span>
            <span>{totalPrice} ر.س</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, color: "#666" }}>
            <span>الشحن</span>
            <span style={{ color: "green" }}>مجاني</span>
          </div>

          <div style={{
            borderTop: "1px solid #eee", paddingTop: 16,
            display: "flex", justifyContent: "space-between",
            fontWeight: "bold", fontSize: 18, marginBottom: 20
          }}>
            <span>الإجمالي</span>
            <span>{totalPrice} ر.س</span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            style={{
              width: "100%", background: "#1a1a2e", color: "white",
              border: "none", padding: "14px", borderRadius: 10,
              fontSize: 15, fontWeight: "bold"
            }}
          >
            إتمام الشراء ←
          </button>
        </div>

      </div>
    </div>
  );
}

export default CartPage;