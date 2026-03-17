import { useEffect, useState } from 'react';
import OrderCard from '../components/OrderCard';
import { apiBaseUrl } from '../config';
import { getAuthToken } from '../auth';

function MyOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch(`${apiBaseUrl}/order/user`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    })
      .then((res) => res.json())
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => setOrders([]));
  }, []);

  return (
    <div>
      <h2>My Orders</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.map((order) => (
            <OrderCard key={order.id} order={order} readOnly />
          ))
        )}
      </div>
    </div>
  );
}

export default MyOrdersPage;
