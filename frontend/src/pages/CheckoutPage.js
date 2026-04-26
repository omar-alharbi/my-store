import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api";

function CheckoutPage() {
  const { cartItems, totalPrice, clearCart, userInfo } = useCart();
  const navigate = useNavigate();

  const [address,  setAddress]  = useState("");
  const [phone,    setPhone]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  // إذا السلة فارغة ارجع للمنتجات
  if (cartItems.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <div style={{ fontSize: 60 }}>🛒</div>
        <h2 style={{ marginTop: 16, color: "#666" }}>السلة فارغة</h2>
        <button onClick={() => navigate("/products")} style={{
          marginTop: 20, background: "#1a1a2e", color: "white",
          border: "none", padding: "12px 28px", borderRadius: 10, fontSize: 15
        }}>تسوق الآن</button>
      </div>
    );
  }

  // إذا غير مسجل، وجّهه لتسجيل الدخول
  if (!userInfo) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <div style={{ fontSize: 60 }}>🔒</div>
        <h2 style={{ marginTop: 16 }}>يجب تسجيل الدخول أولاً</h2>
        <button onClick={() => navigate("/login")} style={{
          marginTop: 20, background: "#1a1a2e", color: "white",
          border: "none", padding: "12px 28px", borderRadius: 10, fontSize: 15
        }}>تسجيل الدخول</button>
      </div>
    );
  }

  const handleOrder = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await createOrder({
        items: cartItems.map((item) => ({
          product: item._id,
          name:    item.name,
          price:   item.price,
          qty:     item.qty,
          image:   item.image,
        })),
        totalPrice,
        address: `${address} — ${phone}`,
      });
      clearCart();
      navigate("/order-success");
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ، حاول مجدداً");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px",
    borderRadius: 10, border: "1px solid #ddd",
    fontSize: 15, marginBottom: 14,
    background: "white", fontFamily: "inherit"
  };

  return (
    <div className="container" style={{ padding: "40px 20px" }}>
      <h2 style={{ marginBottom: 28 }}>إتمام الشراء</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 28 }}>

        {/* فورم العنوان */}
        <div style={{ background: "white", borderRadius: 16, padding: 28, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <h3 style={{ marginBottom: 20 }}>بيانات التوصيل</h3>
          <form onSubmit={handleOrder}>
            <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>الاسم الكامل</label>
            <input type="text" value={userInfo.name} readOnly
              style={{ ...inputStyle, background: "#f5f5f5", color: "#666" }} />

            <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>العنوان التفصيلي</label>
            <textarea
              placeholder="المدينة، الحي، الشارع، رقم المبنى..."
              value={address} onChange={(e) => setAddress(e.target.value)}
              required rows={3}
              style={{ ...inputStyle, resize: "none" }}
            />

            <label style={{ fontSize: 13, color: "#666", display: "block", marginBottom: 6 }}>رقم الجوال</label>
            <input type="tel" placeholder="05xxxxxxxx"
              value={phone} onChange={(e) => setPhone(e.target.value)}
              required style={inputStyle} />

            {error && (
              <div style={{ color: "#e63946", fontSize: 13, marginBottom: 12 }}>{error}</div>
            )}

            <button type="submit" disabled={loading} style={{
              width: "100%", background: "#1a1a2e", color: "white",
              border: "none", padding: 16, borderRadius: 12,
              fontSize: 16, fontWeight: "bold",
              opacity: loading ? 0.7 : 1
            }}>
              {loading ? "جاري إرسال الطلب..." : "تأكيد الطلب 🛍"}
            </button>
          </form>
        </div>

        {/* ملخص الطلب */}
        <div>
          <div style={{ background: "white", borderRadius: 16, padding: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: 16 }}>
            <h3 style={{ marginBottom: 16 }}>ملخص طلبك</h3>
            {cartItems.map((item) => (
              <div key={item._id} style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: 12,
                paddingBottom: 12, borderBottom: "1px solid #f0f0f0"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <img src={item.image} alt={item.name}
                    style={{ width: 44, height: 44, objectFit: "cover", borderRadius: 8 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>× {item.qty}</div>
                  </div>
                </div>
                <span style={{ fontWeight: "bold" }}>{item.price * item.qty} ر.س</span>
              </div>
            ))}
            <div style={{ borderTop: "2px solid #f0f0f0", paddingTop: 14, display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: 18 }}>
              <span>الإجمالي</span>
              <span>{totalPrice} ر.س</span>
            </div>
          </div>

          <div style={{ background: "#f0fdf4", borderRadius: 12, padding: 16, fontSize: 13, color: "#166534" }}>
            ✅ الدفع عند الاستلام<br/>
            🚚 التوصيل خلال 3-5 أيام عمل<br/>
            ↩️ إرجاع مجاني خلال 14 يوم
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;