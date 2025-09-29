import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function CreateProductPage() {
  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    stock: ''
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (!file) {
      setError('A product image file is required.');
      return;
    }
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('category', form.category);
    formData.append('description', form.description);
    formData.append('price', parseFloat(form.price)); // Ensure price is float
    formData.append('stock', parseInt(form.stock, 10)); // Ensure stock is int
    formData.append('picture', file);

    try {
      const res = await fetch('http://localhost:5000/product/create', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      if (res.ok) {
        navigate('/products');
      } else {
        setError('Failed to create product.');
      }
    } catch (err) {
      setError(err,'Error creating product.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '28rem', padding: '1rem' }}>
        <Card.Body>
          <Card.Title className="mb-4 text-center">Create Product</Card.Title>
          {error && <p className="text-danger">{error}</p>}
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                name="description"
                value={form.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                name="price"
                type="number"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                name="stock"
                type="number"
                value={form.stock}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Picture (Upload)</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </Form.Group>
            <Button variant="success" type="submit" className="w-100">
              Create Product
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default CreateProductPage;