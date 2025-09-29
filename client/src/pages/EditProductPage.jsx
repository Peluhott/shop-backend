import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    name: '',
    category: '',
    picture: '',
    description: '',
    price: '',
    stock: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`https://shop-backend-4x9h.onrender.com/product/id/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setForm({
          name: data.name || '',
          category: data.category || '',
          picture: data.picture || '',
          description: data.description || '',
          price: data.price || '',
          stock: data.stock || ''
        });
      })
      .catch(err => console.error('Failed to fetch product:', err));
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10)
    };
    try {
      const res = await fetch(`https://shop-backend-4x9h.onrender.com/product/update/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        navigate('/products');
      } else {
        console.error('Failed to update product');
      }
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  if (!product) return <p>Loading product...</p>;

  return (
    <div>
      <h2>Edit Product</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control name="name" value={form.name} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Control name="category" value={form.category} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Picture URL</Form.Label>
          <Form.Control name="picture" value={form.picture} onChange={handleChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control name="description" value={form.description} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Price</Form.Label>
          <Form.Control name="price" type="number" value={form.price} onChange={handleChange} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Stock</Form.Label>
          <Form.Control name="stock" type="number" value={form.stock} onChange={handleChange} required />
        </Form.Group>
        <Button variant="primary" type="submit">Update Product</Button>
      </Form>
    </div>
  );
}

export default EditProductPage;