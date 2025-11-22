import { useEffect, useState } from 'react';
import { getSpeakers, createSpeaker, updateSpeaker, deleteSpeaker, getSessions } from '../services/api';
import type { Speaker, Session } from '../types';

const SpeakerManagement = () => {
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState<Speaker | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar: '',
    sessions: [] as string[],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [speakersData, sessionsData] = await Promise.all([
        getSpeakers(),
        getSessions(),
      ]);
      setSpeakers(speakersData);
      setSessions(sessionsData);
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
      if (editingSpeaker) {
        await updateSpeaker(editingSpeaker.id, formData);
      } else {
        await createSpeaker(formData);
      }
      setShowForm(false);
      setEditingSpeaker(null);
      setFormData({ name: '', bio: '', avatar: '', sessions: [] });
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (speaker: Speaker) => {
    setEditingSpeaker(speaker);
    setFormData({
      name: speaker.name,
      bio: speaker.bio,
      avatar: speaker.avatar,
      sessions: speaker.sessions,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this speaker?')) return;

    try {
      await deleteSpeaker(id);
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Delete failed');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSpeaker(null);
    setFormData({ name: '', bio: '', avatar: '', sessions: [] });
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
        <h3 className="text-2xl font-bold text-white">Speakers ({speakers.length})</h3>
        <button
          onClick={() => {
            setEditingSpeaker(null);
            setFormData({ name: '', bio: '', avatar: '', sessions: [] });
            setShowForm(true);
          }}
          className="btn-primary"
        >
          Add Speaker
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
            {editingSpeaker ? 'Edit Speaker' : 'Add New Speaker'}
          </h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Bio
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="input-field"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="input-field"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Sessions
              </label>
              <select
                multiple
                value={formData.sessions}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions, (option) => option.value);
                  setFormData({ ...formData, sessions: selected });
                }}
                className="input-field"
                size={4}
              >
                {sessions.map((session) => (
                  <option key={session.id} value={session.id} className="bg-slate-800">
                    {session.title}
                  </option>
                ))}
              </select>
              <p className="text-gray-400 text-xs mt-1">Hold Ctrl/Cmd to select multiple</p>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                {editingSpeaker ? 'Update' : 'Create'}
              </button>
              <button type="button" onClick={handleCancel} className="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {speakers.map((speaker) => (
          <div key={speaker.id} className="card">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl overflow-hidden flex-shrink-0">
                {speaker.avatar ? (
                  <img
                    src={speaker.avatar}
                    alt={speaker.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  speaker.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-white">{speaker.name}</h4>
                {speaker.bio && (
                  <p className="text-gray-400 text-sm mt-1 line-clamp-2">{speaker.bio}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(speaker)}
                className="btn-secondary flex-1 text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(speaker.id)}
                className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg px-4 py-2 text-red-200 text-sm transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {speakers.length === 0 && !showForm && (
        <div className="text-center py-12 text-gray-400">
          No speakers added yet
        </div>
      )}
    </div>
  );
};

export default SpeakerManagement;

