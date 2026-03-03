import { useEffect, useState } from 'react';
import { getApiBaseUrl } from '../apiBaseUrl';

const USERS_ENDPOINT = `${getApiBaseUrl()}/users/`;

function Users() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Users endpoint:', USERS_ENDPOINT);
      const response = await fetch(USERS_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      console.log('Users fetched data:', data);
      setUsers(Array.isArray(data) ? data : data.results || []);
    } catch (fetchError) {
      setError(`Unable to load users from API (${fetchError.message}).`);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const search = query.toLowerCase();
    return (
      String(user.username || '').toLowerCase().includes(search) ||
      String(user.email || '').toLowerCase().includes(search)
    );
  });

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 mb-0">Users</h2>
          <a className="link-primary" href={USERS_ENDPOINT} target="_blank" rel="noreferrer">
            API endpoint
          </a>
        </div>

        <form className="row g-2 mb-3" onSubmit={(event) => event.preventDefault()}>
          <div className="col-md-8">
            <input
              className="form-control"
              type="search"
              placeholder="Search users by name or email"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="col-md-4 d-grid d-md-flex justify-content-md-end gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={() => setQuery('')}>
              Clear
            </button>
            <button type="button" className="btn btn-primary" onClick={fetchUsers} disabled={loading}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </form>

        {error && <div className="alert alert-warning mb-3">{error}</div>}

        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col" className="text-end">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">
                    {loading ? 'Loading users...' : 'No users found from the API.'}
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user.id || user._id || index}>
                    <td>{index + 1}</td>
                    <td>{user.username || '-'}</td>
                    <td>{user.email || '-'}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#usersDetailModal"
                        onClick={() => setSelectedUser(user)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="modal fade" id="usersDetailModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title h5">User Details</h3>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <p className="mb-1">
                <strong>Username:</strong> {selectedUser?.username || '-'}
              </p>
              <p className="mb-0">
                <strong>Email:</strong> {selectedUser?.email || '-'}
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Users;