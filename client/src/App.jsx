import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navbar'
import Container from 'react-bootstrap/Container'
import OrdersPage from './pages/OrdersPage'
import ProductPage from './pages/ProductPage'
import LoginPage from './pages/LoginPage'
import UserPage from './pages/UserPage'
import UserDetailPage from './pages/UserDetailPage'
import UserOrderPage from './pages/UserOrderPage'
import EditProductPage from './pages/EditProductPage'
import CreateProductPage from './pages/CreateProductPage'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import './App.css'

function App() {
  return (
    <Router>
      <Navigation />
      <Container className="mt-4">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/create"
            element={
              <ProtectedRoute>
                <CreateProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products/edit/:id"
            element={
              <ProtectedRoute>
                <EditProductPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id"
            element={
              <ProtectedRoute>
                <UserDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:id/orders"
            element={
              <ProtectedRoute>
                <UserOrderPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Container>
    </Router>
  )
}

export default App
