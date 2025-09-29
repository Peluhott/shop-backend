import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function ProductCard({ product }) {
  return (
    <Card style={{ width: '18rem' }}>
      <Card.Img variant="top" src={product.picture} alt={product.name} />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>
          <strong>Category:</strong> {product.category}<br />
          <strong>Description:</strong> {product.description}<br />
          <strong>Price:</strong> ${product.price}
        </Card.Text>
        <Button variant="primary">Edit</Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;