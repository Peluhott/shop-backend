import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useNavigate } from 'react-router-dom';
import { getAuthToken, isAdminUser } from '../auth';

function Navigation() {
  const token = getAuthToken();
  const isAdmin = isAdminUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <>
      <Navbar bg="light" data-bs-theme="light">
        <Container>
          <Nav className="me-auto">
            {!token && <Nav.Link as={NavLink} to="/login">Login</Nav.Link>}
            {!token && <Nav.Link as={NavLink} to="/register">Register</Nav.Link>}
            {token && isAdmin && <Nav.Link as={NavLink} to="/admin">Dashboard</Nav.Link>}
            {token && isAdmin && <Nav.Link as={NavLink} to="/orders">Orders</Nav.Link>}
            {token && isAdmin && <Nav.Link as={NavLink} to="/products">Products</Nav.Link>}
            {token && isAdmin && <Nav.Link as={NavLink} to="/user">Users</Nav.Link>}
            {token && !isAdmin && <Nav.Link as={NavLink} to="/shop">Shop</Nav.Link>}
            {token && !isAdmin && <Nav.Link as={NavLink} to="/cart">Cart</Nav.Link>}
            {token && !isAdmin && <Nav.Link as={NavLink} to="/my-orders">My Orders</Nav.Link>}
            {token && !isAdmin && <Nav.Link as={NavLink} to="/profile">Profile</Nav.Link>}
          </Nav>
          {token && (
            <Nav>
              <Nav.Link onClick={handleLogout} style={{ color: 'red' }}>
                Log Out
              </Nav.Link>
            </Nav>
          )}
        </Container>
      </Navbar>
    </>
  );
}

export default Navigation;
