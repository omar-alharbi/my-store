import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar           from "./components/Navbar";
import HomePage         from "./pages/HomePage";
import ProductsPage     from "./pages/ProductsPage";
import CartPage         from "./pages/CartPage";
import LoginPage        from "./pages/LoginPage";
import CheckoutPage     from "./pages/CheckoutPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import AdminPage        from "./pages/AdminPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/"               element={<HomePage />}         />
        <Route path="/products"       element={<ProductsPage />}     />
        <Route path="/cart"           element={<CartPage />}         />
        <Route path="/login"          element={<LoginPage />}        />
        <Route path="/checkout"       element={<CheckoutPage />}     />
        <Route path="/order-success"  element={<OrderSuccessPage />} />
        <Route path="/admin"          element={<AdminPage />}        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;