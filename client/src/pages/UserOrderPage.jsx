import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import OrderCard from '../components/OrderCard';

function UserOrderPage() {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5000/order/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error('Failed to fetch user orders:', err));
  }, [id]);

  return (
    <div>
      <h2>User Orders</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {orders.length === 0 ? (
          <p>No orders found for this user.</p>
        ) : (
          orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </div>
    </div>
  );
}

export default UserOrderPage;