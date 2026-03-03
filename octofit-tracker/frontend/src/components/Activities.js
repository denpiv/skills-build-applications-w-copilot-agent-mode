import { useEffect, useState } from 'react';
import { getApiBaseUrl } from '../apiBaseUrl';

const ACTIVITIES_ENDPOINT = `${getApiBaseUrl()}/activities/`;

function Activities() {
  const [activities, setActivities] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Activities endpoint:', ACTIVITIES_ENDPOINT);
      const response = await fetch(ACTIVITIES_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      console.log('Activities fetched data:', data);
      setActivities(Array.isArray(data) ? data : data.results || []);
    } catch (fetchError) {
      setError(`Unable to load activities from API (${fetchError.message}).`);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const filteredActivities = activities.filter((activity) =>
    String(activity.type || '').toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 mb-0">Activities</h2>
          <a className="link-primary" href={ACTIVITIES_ENDPOINT} target="_blank" rel="noreferrer">
            API endpoint
          </a>
        </div>

        <form className="row g-2 mb-3" onSubmit={(event) => event.preventDefault()}>
          <div className="col-md-8">
            <input
              className="form-control"
              type="search"
              placeholder="Search activities by type"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="col-md-4 d-grid d-md-flex justify-content-md-end gap-2">
            <button type="button" className="btn btn-outline-secondary" onClick={() => setQuery('')}>
              Clear
            </button>
            <button type="button" className="btn btn-primary" onClick={fetchActivities} disabled={loading}>
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
                <th scope="col">Type</th>
                <th scope="col">Duration (min)</th>
                <th scope="col">Calories</th>
                <th scope="col" className="text-end">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-4">
                    {loading ? 'Loading activities...' : 'No activities found from the API.'}
                  </td>
                </tr>
              ) : (
                filteredActivities.map((activity, index) => (
                  <tr key={activity.id || activity._id || index}>
                    <td>{index + 1}</td>
                    <td>{activity.type || '-'}</td>
                    <td>{activity.duration ?? '-'}</td>
                    <td>{activity.calories ?? '-'}</td>
                    <td className="text-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#activitiesDetailModal"
                        onClick={() => setSelectedActivity(activity)}
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

      <div className="modal fade" id="activitiesDetailModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title h5">Activity Details</h3>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <p className="mb-1">
                <strong>Type:</strong> {selectedActivity?.type || '-'}
              </p>
              <p className="mb-1">
                <strong>Duration:</strong> {selectedActivity?.duration ?? '-'} min
              </p>
              <p className="mb-0">
                <strong>Calories:</strong> {selectedActivity?.calories ?? '-'}
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

export default Activities;