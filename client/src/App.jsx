import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navigation from './components/Navbar'
import Container from 'react-bootstrap/Container'
import OrdersPage from './pages/OrdersPage'
import ProductPage from './pages/ProductPage'
import LoginPage from './pages/LoginPage'
import UserPage from './pages/UserPage'
import UserDetailPage from './pages/UserDetailPage'
import UserOrderPage from './pages/UserOrderPage'
import './App.css'

function App() {
  return (
    <Router>
      <Navigation />
      <Container className="mt-4">
        <Routes>
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user" element={<UserPage />} />
          <Route path="/users/:id" element={<UserDetailPage />} />
          <Route path="/users/:id/orders" element={<UserOrderPage />} />
          {/* Add other routes here as needed */}
        </Routes>
      </Container>
    </Router>
  )
}

export default App
