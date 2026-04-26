const express = require("express");
const router  = express.Router();
const bcrypt  = require("bcryptjs");
const jwt     = require("jsonwebtoken");
const User    = require("../models/User");
const { protect, adminOnly } = require("../middleware/auth");

// تسجيل مستخدم جديد
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "البريد مستخدم مسبقاً" });

    const hashed = await bcrypt.hash(password, 10);
    const user   = await User.create({ name, email, password: hashed });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// تسجيل الدخول
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "بيانات خاطئة" });

    // تحقق إذا الحساب موقوف
    if (user.isBlocked) return res.status(403).json({ message: "هذا الحساب موقوف. تواصل مع الإدارة" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "بيانات خاطئة" });

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// جلب كل المستخدمين — للأدمن فقط
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// حذف مستخدم — للأدمن فقط
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });
    if (user.isAdmin) return res.status(400).json({ message: "لا يمكن حذف الأدمن" });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "تم حذف المستخدم" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// إيقاف / تفعيل مستخدم — للأدمن فقط
router.put("/users/:id/block", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "المستخدم غير موجود" });
    if (user.isAdmin) return res.status(400).json({ message: "لا يمكن إيقاف الأدمن" });
    user.isBlocked = !user.isBlocked;
    await user.save();
    res.json({ message: user.isBlocked ? "تم إيقاف الحساب" : "تم تفعيل الحساب" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;