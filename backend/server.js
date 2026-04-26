const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth",     require("./routes/authRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders",   require("./routes/orderRoutes"));

app.get("/", (req, res) => {
  res.json({ message: "الخادم يعمل بنجاح ✅" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ اتصلنا بقاعدة البيانات");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 الخادم يعمل على المنفذ ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => console.log("❌ خطأ في الاتصال:", err));