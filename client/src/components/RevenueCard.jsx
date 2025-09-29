import Card from 'react-bootstrap/Card';

function RevenueCard({ product }) {
  if (!product) {
    return (
      <Card bg="primary" text="white" className="mb-4">
        <Card.Body>
          <Card.Title>#1 Selling Item by Dollar Amount</Card.Title>
          <p>Loading...</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card bg="primary" text="white" className="mb-4">
      <Card.Body>
        <Card.Title>#1 Selling Item by Dollar Amount</Card.Title>
        <div className="d-flex align-items-center">
          <img
            src={product.picture}
            alt={product.name}
            style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '1rem', borderRadius: '8px' }}
          />
          <div>
            <div><strong>{product.name}</strong></div>
            <div>Revenue: ${product.totalRevenue ?? product.price}</div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default RevenueCard;