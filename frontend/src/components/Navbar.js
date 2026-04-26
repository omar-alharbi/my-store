import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FiShoppingCart, FiUser, FiLogOut, FiSettings } from "react-icons/fi";

function Navbar() {
  const { cartItems, userInfo, logout } = useCart();
  const itemCount = cartItems.reduce((sum, x) => sum + x.qty, 0);

  return (
    <nav style={{
      background: "#1a1a2e", color: "white",
      padding: "14px 0", position: "sticky",
      top: 0, zIndex: 100,
      boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
    }}>
      <div className="container" style={{
        display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <Link to="/" style={{ color: "white", textDecoration: "none", fontSize: 22, fontWeight: "bold" }}>
          🛍 متجري
        </Link>

        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <Link to="/products" style={{ color: "#ccc", textDecoration: "none" }}>المنتجات</Link>

          {userInfo ? (
            <>
              {userInfo.isAdmin && (
                <Link to="/admin" style={{
                  color: "#fbbf24", textDecoration: "none",
                  display: "flex", alignItems: "center", gap: 4,
                  fontWeight: "bold"
                }}>
                  <FiSettings size={15} /> لوحة الإدارة
                </Link>
              )}
              <span style={{ color: "#ccc", fontSize: 14, display: "flex", alignItems: "center", gap: 4 }}>
                <FiUser size={14} /> {userInfo.name}
              </span>
              <button onClick={logout} style={{
                background: "none", border: "none",
                color: "#ccc", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 4, fontSize: 14
              }}>
                <FiLogOut size={16} /> خروج
              </button>
            </>
          ) : (
            <Link to="/login" style={{ color: "#ccc", textDecoration: "none" }}>دخول</Link>
          )}

          <Link to="/cart" style={{ color: "white", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
            <FiShoppingCart size={20} />
            {itemCount > 0 && (
              <span style={{
                background: "#e63946", borderRadius: "50%",
                width: 20, height: 20,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: "bold"
              }}>{itemCount}</span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;