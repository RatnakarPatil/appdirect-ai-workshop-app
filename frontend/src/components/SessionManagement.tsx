import { useEffect, useState } from 'react';
import { getSessions, createSession, updateSession, deleteSession, getSpeakers } from '../services/api';
import type { Session, Speaker } from '../types';

const SessionManagement = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: '',
    duration: '',
    speakerIds: [] as string[],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sessionsData, speakersData] = await Promise.all([
        getSessions(),
        getSpeakers(),
      ]);
      setSessions(sessionsData);
      setSpeakers(speakersData);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingSession) {
        await updateSession(editingSession.id, formData);
      } else {
        await createSession(formData);
      }
      setShowForm(false);
      setEditingSession(null);
      setFormData({ title: '', description: '', time: '', duration: '', speakerIds: [] });
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (session: Session) => {
    setEditingSession(session);
    setFormData({
      title: session.title,
      description: session.description,
      time: session.time,
      duration: session.duration,
      speakerIds: session.speakerIds,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this session?')) return;

    try {
      await deleteSession(id);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Delete failed');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSession(null);
    setFormData({ title: '', description: '', time: '', duration: '', speakerIds: [] });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
        <p className="mt-4 text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">Sessions ({sessions.length})</h3>
        <button
          onClick={() => {
            setEditingSession(null);
            setFormData({ title: '', description: '', time: '', duration: '', speakerIds: [] });
            setShowForm(true);
          }}
          className="btn-primary"
        >
          Add Session
        </button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm mb-4">
          {error}
        </div>
      )}

      {showForm && (
        <div className="card mb-6">
          <h4 className="text-xl font-bold text-white mb-4">
            {editingSession ? 'Edit Session' : 'Add New Session'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Time
                </label>
                <input
                  type="text"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="input-field"
                  placeholder="e.g., 10:00 AM"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="input-field"
                  placeholder="e.g., 1 hour"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Speakers
              </label>
              <select
                multiple
                value={formData.speakerIds}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                  setFormData({ ...formData, speakerIds: selected });
                }}
                className="input-field"
                size={4}
              >
                {speakers.map((speaker) => (
                  <option key={speaker.id} value={speaker.id} className="bg-slate-800">
                    {speaker.name}
                  </option>
                ))}
              </select>
              <p className="text-gray-400 text-xs mt-1">Hold Ctrl/Cmd to select multiple</p>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                {editingSession ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={handleCancel} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {sessions.map((session) => {
          const sessionSpeakers = speakers.filter((s) => session.speakerIds.includes(s.id));
          return (
            <div key={session.id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">{session.title}</h4>
                  {session.time && (
                    <p className="text-purple-300 text-sm mb-2">
                      {session.time} • {session.duration}
                    </p>
                  )}
                  {session.description && (
                    <p className="text-gray-300 text-sm">{session.description}</p>
                  )}
                  {sessionSpeakers.length > 0 && (
                    <div className="mt-3">
                      <p className="text-gray-400 text-xs mb-1">Speakers:</p>
                      <div className="flex flex-wrap gap-2">
                        {sessionSpeakers.map((speaker) => (
                          <span
                            key={speaker.id}
                            className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded text-xs"
                          >
                            {speaker.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(session)}
                    className="btn-secondary text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(session.id)}
                    className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg px-4 py-2 text-red-200 text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {sessions.length === 0 && !showForm && (
        <div className="text-center py-12 text-gray-400">
          No sessions added yet
        </div>
      )}
    </div>
  );
};

export default SessionManagement;

