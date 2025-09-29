import { useEffect, useState } from 'react'
import OrderCard from '../components/OrderCard'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'

function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [sortedOrders, setSortedOrders] = useState([])
  const [sortType, setSortType] = useState('none')

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/order/all', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setOrders(data)
        setSortedOrders(data)
      })
      .catch(err => console.error('Failed to fetch orders:', err))
  }, [])

  const handleSort = (type) => {
    setSortType(type)
    let sorted = [...orders]
    if (type === 'filled') {
      sorted = sorted.filter(order => order.filled)
    } else if (type === 'unfilled') {
      sorted = sorted.filter(order => !order.filled)
    } else if (type === 'amount') {
      sorted.sort((a, b) => b.total - a.total)
    } else if (type === 'created') {
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    } else {
      sorted = [...orders]
    }
    setSortedOrders(sorted)
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Orders</h2>
        <DropdownButton
          id="dropdown-sort-orders"
          title="Sort Orders"
          onSelect={handleSort}
        >
          <Dropdown.Item active={sortType === 'none'} eventKey="none">All</Dropdown.Item>
          <Dropdown.Item active={sortType === 'filled'} eventKey="filled">Filled</Dropdown.Item>
          <Dropdown.Item active={sortType === 'unfilled'} eventKey="unfilled">Unfilled</Dropdown.Item>
          <Dropdown.Item active={sortType === 'amount'} eventKey="amount">By Amount</Dropdown.Item>
          <Dropdown.Item active={sortType === 'created'} eventKey="created">By Time Created</Dropdown.Item>
        </DropdownButton>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {sortedOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          sortedOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </div>
    </div>
  )
}

export default OrdersPage