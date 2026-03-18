import { useEffect, useState } from 'react'
import OrderCard from '../components/OrderCard'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Button from 'react-bootstrap/Button'
import { apiBaseUrl } from '../config'

function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [sortedOrders, setSortedOrders] = useState([])
  const [sortType, setSortType] = useState('none')
  const [cursorStack, setCursorStack] = useState([null])
  const [pageIndex, setPageIndex] = useState(0)
  const [pagination, setPagination] = useState({
    nextCursor: null,
    hasNextPage: false
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const cursor = cursorStack[pageIndex]
    const params = new URLSearchParams({ limit: '9' })

    if (cursor) {
      params.set('cursor', String(cursor))
    }

    const endpoint =
      sortType === 'filled'
        ? `${apiBaseUrl}/order/filled`
        : sortType === 'unfilled'
          ? `${apiBaseUrl}/order/unfilled`
          : `${apiBaseUrl}/order/all`

    setIsLoading(true)
    fetch(`${endpoint}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const pageOrders = Array.isArray(data?.data) ? data.data : []
        setOrders(pageOrders)
        setPagination(data?.pagination ?? { nextCursor: null, hasNextPage: false })
      })
      .catch(err => console.error('Failed to fetch orders:', err))
      .finally(() => setIsLoading(false))
  }, [cursorStack, pageIndex, sortType])

  useEffect(() => {
    let nextOrders = [...orders]

    if (sortType === 'amount') {
      nextOrders.sort((a, b) => b.total - a.total)
    } else if (sortType === 'created') {
      nextOrders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }

    setSortedOrders(nextOrders)
  }, [orders, sortType])

  const handleSort = (type) => {
    setSortType(type)
    setCursorStack([null])
    setPageIndex(0)
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
        {isLoading ? (
          <p>Loading orders...</p>
        ) : sortedOrders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          sortedOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))
        )}
      </div>
      <div className="d-flex justify-content-between align-items-center mt-4">
        <Button
          variant="outline-dark"
          disabled={pageIndex === 0 || isLoading}
          onClick={() => setPageIndex(currentPage => currentPage - 1)}
        >
          Previous
        </Button>
        <span className="text-muted">Page {pageIndex + 1}</span>
        <Button
          variant="dark"
          disabled={!pagination.hasNextPage || isLoading}
          onClick={() => {
            if (!pagination.nextCursor) {
              return
            }

            setCursorStack(currentStack => {
              if (currentStack[pageIndex + 1] === pagination.nextCursor) {
                return currentStack
              }

              return [...currentStack.slice(0, pageIndex + 1), pagination.nextCursor]
            })
            setPageIndex(currentPage => currentPage + 1)
          }}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

export default OrdersPage
