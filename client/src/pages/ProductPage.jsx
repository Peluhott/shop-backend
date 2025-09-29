import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

function ProductPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/product/all')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Failed to fetch products:', err));
  }, []);

  return (
    <div>
      <h2>Products</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}

export default ProductPage;