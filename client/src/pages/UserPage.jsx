import { useEffect, useState } from 'react';
import UserCard from '../components/UserCard';
import Button from 'react-bootstrap/Button';
import { apiBaseUrl } from '../config';

function UserPage() {
  const [users, setUsers] = useState([]);
  const [cursorStack, setCursorStack] = useState([null]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pagination, setPagination] = useState({
    nextCursor: null,
    hasNextPage: false
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const params = new URLSearchParams({ limit: '9' });
    const cursor = cursorStack[pageIndex];

    if (cursor) {
      params.set('cursor', String(cursor));
    }

    setIsLoading(true);
    fetch(`${apiBaseUrl}/user/all?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setUsers(Array.isArray(data?.data) ? data.data : []);
        setPagination(data?.pagination ?? { nextCursor: null, hasNextPage: false });
      })
      .catch(err => console.error('Failed to fetch users:', err))
      .finally(() => setIsLoading(false));
  }, [cursorStack, pageIndex]);

  return (
    <div>
      <h2>Users</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {isLoading ? <p>Loading users...</p> : users.map(user => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
      {!isLoading && users.length === 0 ? <p>No users found.</p> : null}
      <div className="d-flex justify-content-between align-items-center mt-4">
        <Button
          variant="outline-dark"
          disabled={pageIndex === 0 || isLoading}
          onClick={() => setPageIndex((currentPage) => currentPage - 1)}
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

            setCursorStack((currentStack) => {
              if (currentStack[pageIndex + 1] === pagination.nextCursor) {
                return currentStack;
              }

              return [...currentStack.slice(0, pageIndex + 1), pagination.nextCursor];
            });
            setPageIndex((currentPage) => currentPage + 1);
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default UserPage;
