import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import AnalyticCard from '../components/AnalyticCard';
import RevenueCard from '../components/RevenueCard';
import QuantCard from '../components/QuantCard';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function HomePage() {
  const [analytics, setAnalytics] = useState(null);
  const [averageOrder, setAverageOrder] = useState(null);
  const [topDollar, setTopDollar] = useState(null);
  const [topQuantity, setTopQuantity] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('https://shop-backend-4x9h.onrender.com/product/analytics', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setAnalytics(data))
      .catch(err => console.error('Failed to fetch store analytics:', err));

    fetch('https://shop-backend-4x9h.onrender.com/order/average', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setAverageOrder(data.averageOrderAmount))
      .catch(err => console.error('Failed to fetch average order amount:', err));

    fetch('https://shop-backend-4x9h.onrender.com/product/top-dollar?limit=1', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setTopDollar(data[0]))
      .catch(err => console.error('Failed to fetch top dollar product:', err));

    fetch('https://shop-backend-4x9h.onrender.com/product/top-quantity?limit=1', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setTopQuantity(data[0]))
      .catch(err => console.error('Failed to fetch top quantity product:', err));
  }, []);

  return (
    <div>
      <h1>Analytics</h1>
      <Row className="mb-4">
        <Col md="auto">
          <AnalyticCard
            title="Total Dollar Sold"
            value={analytics ? analytics.totalDollarSold : 'Loading...'}
            color="info"
            textColor="white"
            unit="$"
          />
        </Col>
        <Col md="auto">
          <AnalyticCard
            title="Total Quantity Sold"
            value={analytics ? analytics.totalQuantitySold : 'Loading...'}
            color="warning"
            textColor="dark"
          />
        </Col>
        <Col md="auto">
          <AnalyticCard
            title="Average Order Amount"
            value={averageOrder !== null ? averageOrder.toFixed(2) : 'Loading...'}
            color="success"
            textColor="white"
            unit="$"
          />
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <RevenueCard product={topDollar} />
        </Col>
        <Col md={6}>
          <QuantCard product={topQuantity} />
        </Col>
      </Row>
    </div>
  );
}

export default HomePage;