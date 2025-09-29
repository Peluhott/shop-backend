import { useEffect, useState } from 'react';
import UserCard from '../components/UserCard';

function UserPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/user/all', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Failed to fetch users:', err));
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {users.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

export default UserPage;