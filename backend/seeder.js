const mongoose = require("mongoose");
const dotenv   = require("dotenv");
const Product  = require("./models/Product");

dotenv.config();

const products = [
  { name: "سماعة لاسلكية",  description: "جودة صوت عالية مع إلغاء الضوضاء", price: 199, stock: 20, category: "إلكترونيات", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400" },
  { name: "ساعة ذكية",      description: "تتبع صحتك ونشاطك اليومي",           price: 349, stock: 15, category: "إلكترونيات", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" },
  { name: "حقيبة جلد",      description: "جلد طبيعي فاخر مع ضمان سنة",        price: 279, stock: 10, category: "أزياء",      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400" },
  { name: "نظارة شمسية",    description: "حماية UV400 وإطار خفيف الوزن",       price: 129, stock: 30, category: "أزياء",      image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400" },
  { name: "حذاء رياضي",     description: "مريح للجري اليومي والتمارين",        price: 259, stock: 25, category: "أزياء",      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" },
  { name: "عطر فاخر",       description: "رائحة راقية تدوم طوال اليوم",        price: 189, stock: 18, category: "عناية",      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400" },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Product.deleteMany();
  await Product.insertMany(products);
  console.log("✅ تم إضافة المنتجات بنجاح!");
  process.exit();
}).catch((err) => {
  console.log("❌ خطأ:", err);
  process.exit(1);
});