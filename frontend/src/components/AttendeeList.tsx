import { useEffect, useState } from 'react';
import { getAttendees } from '../services/api';
import type { Attendee } from '../types';

const AttendeeList = () => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAttendees();
  }, []);

  const fetchAttendees = async () => {
    try {
      setLoading(true);
      const data = await getAttendees();
      setAttendees(data);
      setError(null);
    } catch (err) {
      setError('Failed to load attendees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="mt-4 text-gray-300">Loading attendees...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-400">{error}</p>
        <button onClick={fetchAttendees} className="btn-secondary mt-4">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">Attendees ({attendees.length})</h3>
        <button onClick={fetchAttendees} className="btn-secondary text-sm">
          Refresh
        </button>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Designation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Registered At
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {attendees.map((attendee) => (
                <tr key={attendee.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-white font-medium">
                    {attendee.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {attendee.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {attendee.designation}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                    {new Date(attendee.registeredAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {attendees.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No attendees registered yet
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendeeList;

