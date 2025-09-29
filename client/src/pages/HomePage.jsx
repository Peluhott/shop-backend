import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';

function HomePage() {
  const [topDollar, setTopDollar] = useState([]);
  const [topQuantity, setTopQuantity] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Fetch top selling by dollar amount
    fetch('http://localhost:5000/product/top-dollar?limit=5', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setTopDollar(data))
      .catch(err => console.error('Failed to fetch top dollar products:', err));

    // Fetch top selling by quantity
    fetch('http://localhost:5000/product/top-quantity?limit=5', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setTopQuantity(data))
      .catch(err => console.error('Failed to fetch top quantity products:', err));
  }, []);

  return (
    <div>
      <h1>Analytics</h1>
      <div className="mb-5">
        <h3>Top Selling Items by Dollar Amount</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {topDollar.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <div>
        <h3>Top Selling Items by Quantity</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {topQuantity.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;