import Card from 'react-bootstrap/Card';

function QuantCard({ product }) {
  if (!product) {
    return (
      <Card bg="danger" text="white" className="mb-4">
        <Card.Body>
          <Card.Title>#1 Selling Item by Quantity</Card.Title>
          <p>Loading...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card bg="danger" text="white" className="mb-4">
      <Card.Body>
        <Card.Title>#1 Selling Item by Quantity</Card.Title>
        <div className="d-flex align-items-center">
          <img
            src={product.picture}
            alt={product.name}
            style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '1rem', borderRadius: '8px' }}
          />
          <div>
            <div><strong>{product.name}</strong></div>
            <div>Quantity Sold: {product.totalQuantity ?? product.stock}</div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default QuantCard;