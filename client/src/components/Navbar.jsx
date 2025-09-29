import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';

function Navigation() {
  const token = localStorage.getItem('token');

  return (
    <>
      <Navbar bg="light" data-bs-theme="light">
        <Container>
          <Navbar.Brand href="#home">Navbar</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/orders">Orders</Nav.Link>
            <Nav.Link as={NavLink} to="/products">Products</Nav.Link>
            <Nav.Link as={NavLink} to="/user">Users</Nav.Link>
            <Nav.Link as={NavLink} to="/ai">AI*Coming Soon*</Nav.Link>
            {!token && <Nav.Link as={NavLink} to="/login">Login</Nav.Link>}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Navigation;