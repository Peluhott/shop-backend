import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { apiBaseUrl } from '../config';
import { getAuthToken } from '../auth';

const initialForm = {
  email: '',
  address: '',
  city: '',
  state: '',
  zipcode: '',
  country: '',
  age: '',
  gender: ''
};

function ProfilePage() {
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${apiBaseUrl}/user/info`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setForm({
          email: data.email || '',
          address: data.address || '',
          city: data.city || '',
          state: data.state || '',
          zipcode: data.zipcode || '',
          country: data.country || '',
          age: data.age ?? '',
          gender: data.gender || ''
        });
      })
      .catch(() => setError('Could not load profile.'));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    const payload = {
      ...form,
      age: form.age === '' ? null : Number(form.age)
    };

    try {
      const res = await fetch(`${apiBaseUrl}/user/info/upsert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.message || 'Could not update profile.');
        return;
      }

      setMessage('Profile updated.');
    } catch {
      setError('Could not update profile.');
    }
  };

  return (
    <Card style={{ maxWidth: '40rem' }}>
      <Card.Body>
        <Card.Title className="mb-3">My Profile</Card.Title>
        {message ? <Alert variant="success">{message}</Alert> : null}
        {error ? <Alert variant="danger">{error}</Alert> : null}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control name="email" type="email" value={form.email} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control name="address" value={form.address} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>City</Form.Label>
            <Form.Control name="city" value={form.city} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>State</Form.Label>
            <Form.Control name="state" value={form.state} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Zipcode</Form.Label>
            <Form.Control name="zipcode" value={form.zipcode} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Country</Form.Label>
            <Form.Control name="country" value={form.country} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Age</Form.Label>
            <Form.Control name="age" type="number" value={form.age} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Control name="gender" value={form.gender} onChange={handleChange} />
          </Form.Group>
          <Button type="submit">Save Profile</Button>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ProfilePage;
