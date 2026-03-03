import { useEffect, useState } from 'react';
import { getApiBaseUrl } from '../apiBaseUrl';

const WORKOUTS_ENDPOINT = `${getApiBaseUrl()}/workouts/`;

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Workouts endpoint:', WORKOUTS_ENDPOINT);
      const response = await fetch(WORKOUTS_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      console.log('Workouts fetched data:', data);
      setWorkouts(Array.isArray(data) ? data : data.results || []);
    } catch (fetchError) {
      setError(`Unable to load workouts from API (${fetchError.message}).`);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const filteredWorkouts = workouts.filter((workout) => {
    const search = query.toLowerCase();
    return (
      String(workout.name || '').toLowerCase().includes(search) ||
      String(workout.difficulty || '').toLowerCase().includes(search)
    );
  });

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 mb-0">Workouts</h2>
          <a className="link-primary" href={WORKOUTS_ENDPOINT} target="_blank" rel="noreferrer">
            API endpoint
          </a>
        </div>

        <form className="row g-2 mb-3" onSubmit={(event) => event.preventDefault()}>
          <div className="col-md-8">
            <input
              className="form-control"
              type="search"
              placeholder="Search workouts"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="col-md-4 d-grid d-md-flex justify-content-md-end gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={() => setQuery('')}>
              Clear
            </button>
            <button type="button" className="btn btn-primary" onClick={fetchWorkouts} disabled={loading}>
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
                <th scope="col">Name</th>
                <th scope="col">Difficulty</th>
                <th scope="col">Description</th>
                <th scope="col" className="text-end">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkouts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    {loading ? 'Loading workouts...' : 'No workouts found from the API.'}
                  </td>
                </tr>
              ) : (
                filteredWorkouts.map((workout, index) => (
                  <tr key={workout.id || workout._id || index}>
                    <td>{index + 1}</td>
                    <td>{workout.name || '-'}</td>
                    <td>{workout.difficulty || '-'}</td>
                    <td>{workout.description || '-'}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#workoutsDetailModal"
                        onClick={() => setSelectedWorkout(workout)}
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

      <div className="modal fade" id="workoutsDetailModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title h5">Workout Details</h3>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <p className="mb-1">
                <strong>Name:</strong> {selectedWorkout?.name || '-'}
              </p>
              <p className="mb-1">
                <strong>Difficulty:</strong> {selectedWorkout?.difficulty || '-'}
              </p>
              <p className="mb-0">
                <strong>Description:</strong> {selectedWorkout?.description || '-'}
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

export default Workouts;