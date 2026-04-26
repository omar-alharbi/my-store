import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <div style={{
        background: "linear-gradient(135deg, #1a1a2e, #16213e)",
        color: "white",
        padding: "80px 20px",
        textAlign: "center"
      }}>
        <h1 style={{ fontSize: 42, marginBottom: 16 }}>أفضل المنتجات</h1>
        <p style={{ fontSize: 18, color: "#aaa", marginBottom: 32 }}>
          اكتشف مجموعتنا الواسعة بأفضل الأسعار
        </p>
        <Link to="/products">
          <button style={{
            background: "#e63946",
            color: "white",
            border: "none",
            padding: "14px 36px",
            borderRadius: 30,
            fontSize: 16,
            fontWeight: "bold"
          }}>
            تسوق الآن
          </button>
        </Link>
      </div>

      {/* Features */}
      <div className="container" style={{ padding: "60px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
          {[
            { icon: "🚚", title: "شحن سريع", desc: "توصيل لجميع مناطق المملكة" },
            { icon: "🔒", title: "دفع آمن", desc: "جميع المعاملات مشفرة" },
            { icon: "↩️", title: "إرجاع مجاني", desc: "إرجاع خلال 14 يوم" },
          ].map((f) => (
            <div key={f.title} style={{
              background: "white",
              borderRadius: 12,
              padding: 28,
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
            }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ marginBottom: 8 }}>{f.title}</h3>
              <p style={{ color: "#666", fontSize: 14 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;