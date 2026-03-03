import { useEffect, useState } from 'react';

const LEADERBOARD_ENDPOINT = `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api/leaderboard/`;

function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Leaderboard endpoint:', LEADERBOARD_ENDPOINT);
      const response = await fetch(LEADERBOARD_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      console.log('Leaderboard fetched data:', data);
      setEntries(Array.isArray(data) ? data : data.results || []);
    } catch (fetchError) {
      setError(`Unable to load leaderboard from API (${fetchError.message}).`);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const filteredEntries = entries.filter((entry) =>
    String(entry.team || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 mb-0">Leaderboard</h2>
          <a className="link-primary" href={LEADERBOARD_ENDPOINT} target="_blank" rel="noreferrer">
            API endpoint
          </a>
        </div>

        <form className="row g-2 mb-3" onSubmit={(event) => event.preventDefault()}>
          <div className="col-md-8">
            <input
              className="form-control"
              type="search"
              placeholder="Search leaderboard by team"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="col-md-4 d-grid d-md-flex justify-content-md-end gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={() => setQuery('')}>
              Clear
            </button>
            <button type="button" className="btn btn-primary" onClick={fetchLeaderboard} disabled={loading}>
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
                <th scope="col">Team</th>
                <th scope="col">Score</th>
                <th scope="col" className="text-end">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">
                    {loading ? 'Loading leaderboard...' : 'No leaderboard entries found from the API.'}
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry, index) => (
                  <tr key={entry.id || entry._id || index}>
                    <td>{index + 1}</td>
                    <td>{entry.team || '-'}</td>
                    <td>{entry.score ?? '-'}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#leaderboardDetailModal"
                        onClick={() => setSelectedEntry(entry)}
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

      <div className="modal fade" id="leaderboardDetailModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title h5">Leaderboard Entry</h3>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <p className="mb-1">
                <strong>Team:</strong> {selectedEntry?.team || '-'}
              </p>
              <p className="mb-0">
                <strong>Score:</strong> {selectedEntry?.score ?? '-'}
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

export default Leaderboard;