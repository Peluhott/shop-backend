import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';

function ProductCard({ product, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setDeleting(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/product/remove/${product.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        if (onDelete) onDelete(product.id);
      } else {
        alert('Failed to delete product.');
      }
    } catch (err) {
      alert(err,'Error deleting product.');
    }
    setDeleting(false);
  };

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
        <Button as={Link} to={`/products/edit/${product.id}`} variant="primary" className="me-2">
          Edit
        </Button>
        <Button
          variant="danger"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;