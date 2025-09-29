import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function UserDetailPage() {
  const { id } = useParams();
  const [info, setInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`http://localhost:5000/user/info/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setInfo(data))
      .catch(err => console.error('Failed to fetch user info:', err));
  }, [id]);

  if (!info) {
    return <p>Loading user details...</p>;
  }

  return (
    <div>
      <h2>User Details</h2>
      <p><strong>User ID:</strong> {info.userId}</p>
      <p><strong>Email:</strong> {info.email}</p>
      <p><strong>Address:</strong> {info.address || 'N/A'}</p>
      <p><strong>City:</strong> {info.city || 'N/A'}</p>
      <p><strong>State:</strong> {info.state || 'N/A'}</p>
      <p><strong>Zipcode:</strong> {info.zipcode || 'N/A'}</p>
      <p><strong>Country:</strong> {info.country || 'N/A'}</p>
      <p><strong>Age:</strong> {info.age !== undefined && info.age !== null ? info.age : 'N/A'}</p>
      <p><strong>Gender:</strong> {info.gender || 'N/A'}</p>
    </div>
  );
}

export default UserDetailPage;