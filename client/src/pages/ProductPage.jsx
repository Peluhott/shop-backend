import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import ProductCard from '../components/ProductCard';
import { apiBaseUrl } from '../config';

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [cursorStack, setCursorStack] = useState([null]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pagination, setPagination] = useState({
    nextCursor: null,
    hasNextPage: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams({ limit: '9' });
    const cursor = cursorStack[pageIndex];

    if (cursor) {
      params.set('cursor', String(cursor));
    }

    setIsLoading(true);
    fetch(`${apiBaseUrl}/product/all?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data?.data) ? data.data : []);
        setPagination(data?.pagination ?? { nextCursor: null, hasNextPage: false });
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
        setProducts([]);
        setPagination({ nextCursor: null, hasNextPage: false });
      })
      .finally(() => setIsLoading(false));
  }, [cursorStack, pageIndex]);

  // Remove product from state after deletion
  const handleDelete = (deletedId) => {
    setProducts(products => products.filter(product => product.id !== deletedId));
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Products</h2>
        <Button variant="success" onClick={() => navigate('/products/create')}>
          Create Product
        </Button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {isLoading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map(product => (
            <ProductCard key={product.id} product={product} onDelete={handleDelete} />
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
              return;
            }

            setCursorStack(currentStack => {
              if (currentStack[pageIndex + 1] === pagination.nextCursor) {
                return currentStack;
              }

              return [...currentStack.slice(0, pageIndex + 1), pagination.nextCursor];
            });
            setPageIndex(currentPage => currentPage + 1);
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default ProductPage;
