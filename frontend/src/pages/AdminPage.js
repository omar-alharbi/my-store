import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function AdminPage() {
  const { userInfo } = useCart();
  const navigate     = useNavigate();

  const [orders,  setOrders]  = useState([]);
  const [users,   setUsers]   = useState([]);
  const [tab,     setTab]     = useState("orders");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userInfo?.isAdmin) { navigate("/"); return; }
    fetchOrders();
    fetchUsers();
  }, []);

  const headers = { Authorization: `Bearer ${userInfo?.token}` };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders`, { headers });
      setOrders(res.data);
    } catch { console.log("خطأ في الطلبات"); }
    finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/users`, { headers });
      setUsers(res.data);
    } catch { console.log("خطأ في المستخدمين"); }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/orders/${id}/status`, { status }, { headers });
      fetchOrders();
    } catch { alert("خطأ في تحديث الحالة"); }
  };

  const deleteUser = async (id, name) => {
    if (!window.confirm(`هل تريد حذف المستخدم "${name}" نهائياً؟`)) return;
    try {
      await axios.delete(`${API_URL}/auth/users/${id}`, { headers });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "خطأ في الحذف");
    }
  };

  const blockUser = async (id, isBlocked) => {
    const msg = isBlocked ? `تفعيل هذا الحساب؟` : `إيقاف هذا الحساب؟`;
    if (!window.confirm(msg)) return;
    try {
      await axios.put(`${API_URL}/auth/users/${id}/block`, {}, { headers });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || "خطأ");
    }
  };

  const statusColor = {
    pending:   { bg: "#fff7ed", color: "#c2410c" },
    confirmed: { bg: "#eff6ff", color: "#1d4ed8" },
    shipped:   { bg: "#f0fdf4", color: "#166534" },
    delivered: { bg: "#f5f3ff", color: "#6d28d9" },
  };
  const statusLabel = {
    pending:   "⏳ جديد",
    confirmed: "✅ مؤكد",
    shipped:   "🚚 شُحن",
    delivered: "📦 وُصّل",
  };

  const stats = {
    total:    orders.length,
    pending:  orders.filter((o) => o.status === "pending").length,
    revenue:  orders.reduce((s, o) => s + o.totalPrice, 0),
    users:    users.length,
    blocked:  users.filter((u) => u.isBlocked).length,
  };

  const tabStyle = (t) => ({
    padding: "10px 24px", border: "none", cursor: "pointer",
    fontWeight: tab === t ? "bold" : "normal", fontSize: 14,
    borderBottom: tab === t ? "3px solid #1a1a2e" : "3px solid transparent",
    background: "transparent", color: tab === t ? "#1a1a2e" : "#666",
    transition: "all 0.2s",
  });

  return (
    <div className="container" style={{ padding: "32px 20px" }}>
      <h2 style={{ marginBottom: 24 }}>⚙️ لوحة الإدارة</h2>

      {/* إحصائيات */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 28 }}>
        {[
          { label: "إجمالي الطلبات", value: stats.total,           color: "#1a1a2e" },
          { label: "طلبات جديدة",    value: stats.pending,          color: "#c2410c" },
          { label: "الإيرادات",      value: `${stats.revenue} ر.س`, color: "#166534" },
          { label: "المستخدمون",     value: stats.users,            color: "#1d4ed8" },
          { label: "موقوفون",        value: stats.blocked,          color: "#9333ea" },
        ].map((s) => (
          <div key={s.label} style={{
            background: "white", borderRadius: 14, padding: "16px 12px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)", textAlign: "center"
          }}>
            <div style={{ fontSize: 24, fontWeight: "bold", color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* تبويبات */}
      <div style={{ background: "white", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ display: "flex", borderBottom: "1px solid #f0f0f0", padding: "0 16px" }}>
          <button style={tabStyle("orders")} onClick={() => setTab("orders")}>
            📦 الطلبات ({stats.total})
          </button>
          <button style={tabStyle("users")} onClick={() => setTab("users")}>
            👥 المستخدمون ({stats.users})
          </button>
        </div>

        {/* تبويب الطلبات */}
        {tab === "orders" && (
          <div>
            <div style={{ padding: "14px 24px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "#666" }}>إجمالي {orders.length} طلب</span>
              <button onClick={fetchOrders} style={{
                background: "#f5f5f5", border: "none", borderRadius: 8,
                padding: "7px 14px", fontSize: 13, cursor: "pointer"
              }}>🔄 تحديث</button>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: 40, color: "#666" }}>جاري التحميل...</div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "#666" }}>لا توجد طلبات بعد</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: "#f9f9f9", textAlign: "right" }}>
                      {["رقم الطلب","العميل","المنتجات","العنوان","الإجمالي","الحالة","إجراء"].map((h) => (
                        <th key={h} style={{ padding: "12px 16px", fontWeight: 600, color: "#444" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} style={{ borderTop: "1px solid #f0f0f0" }}>
                        <td style={{ padding: "14px 16px", color: "#888", fontSize: 12 }}>
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ fontWeight: 500 }}>{order.user?.name || "—"}</div>
                          <div style={{ fontSize: 12, color: "#888" }}>{order.user?.email}</div>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          {order.items.map((item, i) => (
                            <div key={i} style={{ fontSize: 12, color: "#555" }}>
                              {item.name} × {item.qty}
                            </div>
                          ))}
                        </td>
                        <td style={{ padding: "14px 16px", fontSize: 12, color: "#555", maxWidth: 140 }}>
                          {order.address}
                        </td>
                        <td style={{ padding: "14px 16px", fontWeight: "bold" }}>
                          {order.totalPrice} ر.س
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <span style={{
                            padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500,
                            background: statusColor[order.status]?.bg   || "#f5f5f5",
                            color:      statusColor[order.status]?.color || "#333",
                          }}>
                            {statusLabel[order.status] || order.status}
                          </span>
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          <select
                            value={order.status}
                            onChange={(e) => updateStatus(order._id, e.target.value)}
                            style={{
                              padding: "6px 10px", borderRadius: 8,
                              border: "1px solid #ddd", fontSize: 13,
                              background: "white", cursor: "pointer"
                            }}
                          >
                            <option value="pending">⏳ جديد</option>
                            <option value="confirmed">✅ تأكيد</option>
                            <option value="shipped">🚚 شحن</option>
                            <option value="delivered">📦 توصيل</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* تبويب المستخدمين */}
        {tab === "users" && (
          <div>
            <div style={{ padding: "14px 24px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "#666" }}>إجمالي {users.length} مستخدم</span>
              <button onClick={fetchUsers} style={{
                background: "#f5f5f5", border: "none", borderRadius: 8,
                padding: "7px 14px", fontSize: 13, cursor: "pointer"
              }}>🔄 تحديث</button>
            </div>

            {users.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: "#666" }}>لا يوجد مستخدمون</div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: "#f9f9f9", textAlign: "right" }}>
                      {["الاسم","البريد الإلكتروني","الصلاحية","الحالة","تاريخ التسجيل","إجراءات"].map((h) => (
                        <th key={h} style={{ padding: "12px 16px", fontWeight: 600, color: "#444" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} style={{
                        borderTop: "1px solid #f0f0f0",
                        background: u.isBlocked ? "#fff5f5" : "white"
                      }}>
                        <td style={{ padding: "14px 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{
                              width: 36, height: 36, borderRadius: "50%",
                              background: u.isAdmin ? "#fbbf24" : "#1a1a2e",
                              color: "white", display: "flex", alignItems: "center",
                              justifyContent: "center", fontWeight: "bold", fontSize: 14, flexShrink: 0
                            }}>
                              {u.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 500 }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 16px", color: "#555" }}>{u.email}</td>
                        <td style={{ padding: "14px 16px" }}>
                          {u.isAdmin ? (
                            <span style={{ background: "#fef9c3", color: "#854d0e", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
                              👑 أدمن
                            </span>
                          ) : (
                            <span style={{ background: "#f0f0f0", color: "#555", padding: "3px 10px", borderRadius: 20, fontSize: 12 }}>
                              عميل
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          {u.isBlocked ? (
                            <span style={{ background: "#fee2e2", color: "#b91c1c", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
                              🚫 موقوف
                            </span>
                          ) : (
                            <span style={{ background: "#dcfce7", color: "#166534", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
                              ✅ نشط
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "14px 16px", color: "#888", fontSize: 13 }}>
                          {new Date(u.createdAt).toLocaleDateString("ar-SA")}
                        </td>
                        <td style={{ padding: "14px 16px" }}>
                          {!u.isAdmin && (
                            <div style={{ display: "flex", gap: 8 }}>
                              <button
                                onClick={() => blockUser(u._id, u.isBlocked)}
                                style={{
                                  padding: "6px 12px", borderRadius: 7, border: "none",
                                  fontSize: 12, cursor: "pointer", fontWeight: 500,
                                  background: u.isBlocked ? "#dcfce7" : "#fff7ed",
                                  color:      u.isBlocked ? "#166534" : "#c2410c",
                                }}
                              >
                                {u.isBlocked ? "✅ تفعيل" : "🚫 إيقاف"}
                              </button>
                              <button
                                onClick={() => deleteUser(u._id, u.name)}
                                style={{
                                  padding: "6px 12px", borderRadius: 7, border: "none",
                                  fontSize: 12, cursor: "pointer", fontWeight: 500,
                                  background: "#fee2e2", color: "#b91c1c",
                                }}
                              >
                                🗑 حذف
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPage;