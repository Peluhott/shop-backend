import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

function UserCard({ user }) {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>{user.username}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {user.is_admin ? 'Admin' : 'User'}
        </Card.Subtitle>
        <Card.Text>
          {/* You can add more user info here if needed */}
        </Card.Text>
        <Card.Link as={Link} to={`/users/${user.id}`}>More Details</Card.Link>
        <Card.Link as={Link} to={`/users/${user.id}/orders`}>View Orders</Card.Link>
      </Card.Body>
    </Card>
  );
}

export default UserCard;