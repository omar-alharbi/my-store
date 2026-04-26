import { Link } from "react-router-dom";

function OrderSuccessPage() {
  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <div style={{ fontSize: 80 }}>🎉</div>
      <h1 style={{ marginTop: 20, marginBottom: 12, color: "#1a1a2e" }}>
        تم استلام طلبك بنجاح!
      </h1>
      <p style={{ color: "#666", fontSize: 16, marginBottom: 32 }}>
        سيتواصل معك فريقنا قريباً لتأكيد الطلب والتوصيل
      </p>
      <Link to="/products">
        <button style={{
          background: "#1a1a2e", color: "white",
          border: "none", padding: "14px 36px",
          borderRadius: 30, fontSize: 16, fontWeight: "bold"
        }}>
          متابعة التسوق
        </button>
      </Link>
    </div>
  );
}

export default OrderSuccessPage;