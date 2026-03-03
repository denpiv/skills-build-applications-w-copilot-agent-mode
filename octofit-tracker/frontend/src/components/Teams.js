import { useEffect, useState } from 'react';
import { getApiBaseUrl } from '../apiBaseUrl';

const TEAMS_ENDPOINT = `${getApiBaseUrl()}/teams/`;

function Teams() {
  const [teams, setTeams] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Teams endpoint:', TEAMS_ENDPOINT);
      const response = await fetch(TEAMS_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      console.log('Teams fetched data:', data);
      setTeams(Array.isArray(data) ? data : data.results || []);
    } catch (fetchError) {
      setError(`Unable to load teams from API (${fetchError.message}).`);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const filteredTeams = teams.filter((team) =>
    String(team.name || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 mb-0">Teams</h2>
          <a className="link-primary" href={TEAMS_ENDPOINT} target="_blank" rel="noreferrer">
            API endpoint
          </a>
        </div>

        <form className="row g-2 mb-3" onSubmit={(event) => event.preventDefault()}>
          <div className="col-md-8">
            <input
              className="form-control"
              type="search"
              placeholder="Search teams"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="col-md-4 d-grid d-md-flex justify-content-md-end gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={() => setQuery('')}>
              Clear
            </button>
            <button type="button" className="btn btn-primary" onClick={fetchTeams} disabled={loading}>
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
                <th scope="col">Team Name</th>
                <th scope="col">Members</th>
                <th scope="col" className="text-end">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTeams.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-muted py-4">
                    {loading ? 'Loading teams...' : 'No teams found from the API.'}
                  </td>
                </tr>
              ) : (
                filteredTeams.map((team, index) => (
                  <tr key={team.id || team._id || index}>
                    <td>{index + 1}</td>
                    <td>{team.name || '-'}</td>
                    <td>{Array.isArray(team.members) ? team.members.length : 0}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#teamsDetailModal"
                        onClick={() => setSelectedTeam(team)}
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

      <div className="modal fade" id="teamsDetailModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title h5">Team Details</h3>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <p className="mb-1">
                <strong>Name:</strong> {selectedTeam?.name || '-'}
              </p>
              <p className="mb-0">
                <strong>Members:</strong>{' '}
                {Array.isArray(selectedTeam?.members) ? selectedTeam.members.length : 0}
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

export default Teams;