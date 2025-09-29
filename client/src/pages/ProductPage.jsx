import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import ProductCard from '../components/ProductCard';

function ProductPage() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/product/all')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

  // Remove product from state after deletion
  const handleDelete = (deletedId) => {
    setProducts(products => products.filter(product => product.id !== deletedId));
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Products</h2>
        <Button variant="success" onClick={() => navigate('/products/create')}>
          Create Product
        </Button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map(product => (
            <ProductCard key={product.id} product={product} onDelete={handleDelete} />
          ))
        )}
      </div>
    </div>
  );
}

export default ProductPage;