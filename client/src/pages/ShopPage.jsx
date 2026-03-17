import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import CustomerProductCard from '../components/CustomerProductCard';
import { apiBaseUrl } from '../config';

const categories = [
  { label: 'All', value: 'all' },
  { label: 'Couches', value: 'couches' },
  { label: 'Armchairs', value: 'armchairs' },
  { label: 'Rugs', value: 'rugs' }
];

function ShopPage() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortOrder, setSortOrder] = useState('default');

  useEffect(() => {
    fetch(`${apiBaseUrl}/product/all`)
      .then((res) => res.json())
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts([]));
  }, []);

  const visibleProducts = [...products]
    .filter((product) => selectedCategory === 'all' || product.category === selectedCategory)
    .sort((firstProduct, secondProduct) => {
      if (sortOrder === 'price-asc') {
        return firstProduct.price - secondProduct.price;
      }

      if (sortOrder === 'price-desc') {
        return secondProduct.price - firstProduct.price;
      }

      return 0;
    });

  return (
    <Container className="py-4">
      <Row className="g-4 align-items-start">
        <Col lg={3}>
          <Card className="shadow-sm rounded-4 border-0">
            <Card.Body className="p-4">
              <h2 className="h4 mb-3">Browse</h2>
              <p className="text-muted mb-3">Filter by furniture type.</p>
              <div className="d-grid gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? 'dark' : 'outline-dark'}
                    onClick={() => setSelectedCategory(category.value)}
                  >
                    {category.label}
                  </Button>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={9}>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
            <div>
              <h1 className="h2 mb-1">Shop</h1>
              <p className="text-muted mb-0">
                {visibleProducts.length} product{visibleProducts.length === 1 ? '' : 's'} shown
              </p>
            </div>

            <Form.Group style={{ minWidth: '220px' }}>
              <Form.Label className="mb-2">Sort by price</Form.Label>
              <Form.Select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                <option value="default">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </Form.Select>
            </Form.Group>
          </div>

          {visibleProducts.length === 0 ? (
            <Card className="border-0 shadow-sm rounded-4">
              <Card.Body className="p-4">
                <p className="mb-0">No products found for this category.</p>
              </Card.Body>
            </Card>
          ) : (
            <Row className="g-4">
              {visibleProducts.map((product) => (
                <Col key={product.id} sm={6} xl={4}>
                  <CustomerProductCard product={product} />
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ShopPage;
