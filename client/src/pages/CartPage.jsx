import { useEffect, useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { apiBaseUrl } from '../config';
import { getAuthToken } from '../auth';

function CartPage() {
  const [items, setItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [placingOrder, setPlacingOrder] = useState(false);
  const token = getAuthToken();

  const productsById = useMemo(
    () => new Map(products.map((product) => [product.id, product])),
    [products]
  );

  const loadCart = async () => {
    const [cartRes, subtotalRes, productsRes] = await Promise.all([
      fetch(`${apiBaseUrl}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(`${apiBaseUrl}/cart/subtotal`, {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch(`${apiBaseUrl}/product/all`)
    ]);

    const cartData = await cartRes.json().catch(() => []);
    const subtotalData = await subtotalRes.json().catch(() => ({ subtotal: 0 }));
    const productsData = await productsRes.json().catch(() => []);

    setItems(Array.isArray(cartData) ? cartData : []);
    setSubtotal(typeof subtotalData.subtotal === 'number' ? subtotalData.subtotal : 0);
    setProducts(Array.isArray(productsData) ? productsData : []);
  };

  useEffect(() => {
    loadCart().catch(() => {
      setItems([]);
      setSubtotal(0);
    });
  }, []);

  const updateQuantity = async (productId, quantity, increase) => {
    await fetch(`${apiBaseUrl}/cart/item/${increase ? 'increase' : 'decrease'}/${productId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ quantity })
    });
    await loadCart();
  };

  const removeItem = async (productId) => {
    await fetch(`${apiBaseUrl}/cart/remove/${productId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    await loadCart();
  };

  const placeOrder = async () => {
    setPlacingOrder(true);
    try {
      const res = await fetch(`${apiBaseUrl}/cart/placeorder`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        await loadCart();
      }
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>My Cart</h2>
        <div>
          <strong>Subtotal:</strong> ${subtotal.toFixed(2)}
        </div>
      </div>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {items.map((item) => {
              const product = productsById.get(item.product_id);
              return (
                <Card key={item.id} style={{ width: '18rem' }}>
                  {product?.picture ? <Card.Img variant="top" src={product.picture} alt={product.name} /> : null}
                  <Card.Body>
                    <Card.Title>{product?.name || `Product #${item.product_id}`}</Card.Title>
                    <Card.Text>
                      Quantity: {item.quantity}<br />
                      Unit Price: ${item.unitprice}<br />
                      Item Total: ${(item.quantity * item.unitprice).toFixed(2)}
                    </Card.Text>
                    <div className="d-flex gap-2">
                      <Button variant="outline-primary" onClick={() => updateQuantity(item.product_id, 1, true)}>
                        +
                      </Button>
                      <Button
                        variant="outline-secondary"
                        onClick={() => updateQuantity(item.product_id, 1, false)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </Button>
                      <Button variant="danger" onClick={() => removeItem(item.product_id)}>
                        Remove
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
          <Button className="mt-4" onClick={placeOrder} disabled={placingOrder}>
            {placingOrder ? 'Placing Order...' : 'Place Order'}
          </Button>
        </>
      )}
    </div>
  );
}

export default CartPage;
