import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { apiBaseUrl } from '../config';
import { getAuthToken } from '../auth';

function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [message, setMessage] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch(`${apiBaseUrl}/product/id/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch(() => setMessage('Could not load product.'));
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) {
      return;
    }

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

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setMessage(data?.message || 'Could not add item to cart.');
      } else {
        setMessage('Added to cart.');
      }
    } catch {
      setMessage('Could not add item to cart.');
    } finally {
      setAdding(false);
    }
  };

  if (!product) {
    return <p>Loading product...</p>;
  }

  return (
    <Container className="py-4">
      <Row className="g-4 align-items-start">
        <Col lg={6}>
          <div className="border rounded-4 overflow-hidden bg-white shadow-sm">
            <img
              src={product.picture}
              alt={product.name}
              className="d-block w-100"
              style={{ aspectRatio: '4 / 5', objectFit: 'cover' }}
            />
          </div>
        </Col>
        <Col lg={6}>
          <Card className="border-0 shadow-sm rounded-4">
            <Card.Body className="p-4 p-xl-5">
              <Card.Title as="h1" className="fs-2 mb-2">{product.name}</Card.Title>
              <Card.Subtitle className="mb-4 text-muted text-capitalize">{product.category}</Card.Subtitle>
              <Card.Text className="mb-4">{product.description}</Card.Text>
              <Card.Text className="fs-5 mb-4">
                <strong>Price:</strong> ${product.price}<br />
                <strong>Stock:</strong> {product.stock}
              </Card.Text>
              <Button onClick={handleAddToCart} disabled={adding || product.stock <= 0} size="lg">
                {product.stock <= 0 ? 'Out of Stock' : adding ? 'Adding...' : 'Add to Cart'}
              </Button>
              {message ? <Alert className="mt-3 mb-0" variant={message === 'Added to cart.' ? 'success' : 'danger'}>{message}</Alert> : null}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductDetailPage;
