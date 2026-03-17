import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navbar'
import Container from 'react-bootstrap/Container'
import OrdersPage from './pages/OrdersPage'
import ProductPage from './pages/ProductPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UserPage from './pages/UserPage'
import UserDetailPage from './pages/UserDetailPage'
import UserOrderPage from './pages/UserOrderPage'
import EditProductPage from './pages/EditProductPage'
import CreateProductPage from './pages/CreateProductPage'
import ShopPage from './pages/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import MyOrdersPage from './pages/MyOrdersPage'
import ProfilePage from './pages/ProfilePage'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import RoleHome from './components/RoleHome'
import './App.css'

function App() {
  return (
    <Router>
      <Navigation />
      <Container className="mt-4">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <RoleHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute requiredRole="admin">
                <ProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute requiredRole="admin">
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/create"
            element={
              <ProtectedRoute requiredRole="admin">
                <CreateProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/edit/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <EditProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoute requiredRole="admin">
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id"
            element={
              <ProtectedRoute requiredRole="admin">
                <UserDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id/orders"
            element={
              <ProtectedRoute requiredRole="admin">
                <UserOrderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop"
            element={
              <ProtectedRoute requiredRole="customer">
                <ShopPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shop/products/:id"
            element={
              <ProtectedRoute requiredRole="customer">
                <ProductDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute requiredRole="customer">
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <ProtectedRoute requiredRole="customer">
                <MyOrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute requiredRole="customer">
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Container>
    </Router>
  )
}

export default App
