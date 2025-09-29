import { useEffect, useState } from 'react'
import OrderCard from '../components/OrderCard'

function OrdersPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/order/all', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error('Failed to fetch orders:', err))
  }, [])

  return (
    <div><h2>Orders</h2>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))
      )}
    </div>
    </div>
  )
}

export default OrdersPage