import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function OrderCard({ order, onStatusChange }) {
  const [filled, setFilled] = useState(order.filled);

  const handleMarkFilledOrUnfilled = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`https://shop-backend-4x9h.onrender.com/order/markFilledOrUnfilled/${order.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        setFilled(f => !f); // Toggle filled state locally for instant UI update
        if (onStatusChange) onStatusChange();
      } else {
        console.error('Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  const bgColor = filled ? 'success' : 'warning'; // green if filled, yellow if unfilled

  return (
    <Card style={{ width: '18rem' }} bg={bgColor} text={filled ? 'white' : 'dark'}>
      <Card.Body>
        <Card.Title>Order #{order.id}</Card.Title>
        <Card.Text>
          User ID: {order.user_id}<br />
          Total: ${order.total}<br />
          Created At: {new Date(order.created_at).toLocaleString()}<br />
          Filled: {filled ? 'Yes' : 'No'}
        </Card.Text>
        <Button variant="primary" onClick={handleMarkFilledOrUnfilled}>
          Mark filled or unfilled
        </Button>
      </Card.Body>
    </Card>
  );
}

export default OrderCard;