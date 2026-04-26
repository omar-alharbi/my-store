import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/api";
import { useCart } from "../context/CartContext";

function LoginPage() {
  const [isLogin,  setIsLogin]  = useState(true);
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const { login } = useCart();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = isLogin
        ? await loginUser({ email, password })
        : await registerUser({ name, email, password });

      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "حدث خطأ، حاول مجدداً");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px",
    borderRadius: 10, border: "1px solid #ddd",
    fontSize: 15, marginBottom: 14, background: "white"
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "60px 20px" }}>
      <div style={{
        background: "white", borderRadius: 16, padding: 40,
        width: "100%", maxWidth: 420,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
      }}>
        {/* تبديل بين الدخول والتسجيل */}
        <div style={{ display: "flex", marginBottom: 28, borderRadius: 10, overflow: "hidden", border: "1px solid #eee" }}>
          <button onClick={() => setIsLogin(true)} style={{
            flex: 1, padding: 12, border: "none", fontSize: 14, fontWeight: "bold",
            background: isLogin ? "#1a1a2e" : "white",
            color:      isLogin ? "white"    : "#666",
          }}>دخول</button>
          <button onClick={() => setIsLogin(false)} style={{
            flex: 1, padding: 12, border: "none", fontSize: 14, fontWeight: "bold",
            background: !isLogin ? "#1a1a2e" : "white",
            color:      !isLogin ? "white"    : "#666",
          }}>تسجيل جديد</button>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input type="text" placeholder="الاسم"
              value={name} onChange={(e) => setName(e.target.value)}
              style={inputStyle} required />
          )}
          <input type="email" placeholder="البريد الإلكتروني"
            value={email} onChange={(e) => setEmail(e.target.value)}
            style={inputStyle} required />
          <input type="password" placeholder="كلمة المرور"
            value={password} onChange={(e) => setPassword(e.target.value)}
            style={inputStyle} required />

          {error && (
            <div style={{ color: "#e63946", fontSize: 13, marginBottom: 12, textAlign: "center" }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: "100%", background: "#1a1a2e", color: "white",
            border: "none", padding: 14, borderRadius: 10,
            fontSize: 16, fontWeight: "bold",
            opacity: loading ? 0.7 : 1
          }}>
            {loading ? "جاري التحميل..." : isLogin ? "دخول" : "إنشاء حساب"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;