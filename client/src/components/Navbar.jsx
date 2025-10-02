import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useNavigate } from 'react-router-dom';

function Navigation() {
  const token = localStorage.getItem('token');
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
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/orders">Orders</Nav.Link>
            <Nav.Link as={NavLink} to="/products">Products</Nav.Link>
            <Nav.Link as={NavLink} to="/user">Users</Nav.Link>
            <Nav.Link as={NavLink} to="/ai">AI*Coming Soon*</Nav.Link>
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