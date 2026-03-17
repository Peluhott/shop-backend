import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import { apiBaseUrl } from '../config';
import { getAuthToken } from '../auth';

function CustomerProductCard({ product, onAddedToCart }) {
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddToCart = async () => {
    setAdding(true);
    setMessage('');

    try {
      const res = await fetch(`${apiBaseUrl}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          productId: product.id,
          quantity: 1,
          unitPrice: product.price
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setMessage(data?.message || 'Could not add item to cart.');
      } else {
        setMessage('Added to cart.');
        onAddedToCart?.();
      }
    } catch {
      setMessage('Could not add item to cart.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <Card className="h-100 shadow-sm rounded-4 border-0">
      <Card.Img
        variant="top"
        src={product.picture}
        alt={product.name}
        style={{ height: '260px', objectFit: 'cover' }}
      />
      <Card.Body>
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>
          <strong>Category:</strong> {product.category}<br />
          <strong>Description:</strong> {product.description}<br />
          <strong>Price:</strong> ${product.price}<br />
          <strong>Stock:</strong> {product.stock}
        </Card.Text>
        <div className="d-flex gap-2">
          <Button as={Link} to={`/shop/products/${product.id}`} variant="outline-dark">
            View Details
          </Button>
          <Button
            variant="primary"
            onClick={handleAddToCart}
            disabled={adding || product.stock <= 0}
          >
            {product.stock <= 0 ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Cart'}
          </Button>
        </div>
        {message ? <div className="mt-2 small">{message}</div> : null}
      </Card.Body>
    </Card>
  );
}

export default CustomerProductCard;
