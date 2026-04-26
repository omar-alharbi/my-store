const express  = require("express");
const router   = express.Router();
const Order    = require("../models/Order");
const { protect, adminOnly } = require("../middleware/auth");

// إنشاء طلب جديد
router.post("/", protect, async (req, res) => {
  try {
    const { items, totalPrice, address } = req.body;
    const order = await Order.create({
      user: req.user.id,
      items,
      totalPrice,
      address,
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// طلبات المستخدم الحالي
router.get("/my", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// كل الطلبات — للمدير
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// تحديث حالة الطلب — للمدير
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;