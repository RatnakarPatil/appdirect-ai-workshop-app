import { useState, useEffect } from 'react';
import AttendeeList from './AttendeeList';
import SpeakerManagement from './SpeakerManagement';
import SessionManagement from './SessionManagement';
import PieChart from './PieChart';
import { getAdminStats } from '../services/api';
import type { DesignationStats } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
}

type Tab = 'attendees' | 'speakers' | 'sessions' | 'analytics';

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const [activeTab, setActiveTab] = useState<Tab>('attendees');
  const [stats, setStats] = useState<DesignationStats[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchStats();
    }
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'attendees', label: 'Attendees' },
    { id: 'speakers', label: 'Speakers' },
    { id: 'sessions', label: 'Sessions' },
    { id: 'analytics', label: 'Analytics' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="border-b border-white/10 bg-white/5 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <button onClick={onLogout} className="btn-secondary text-sm">
              Logout
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'attendees' && <AttendeeList />}
        {activeTab === 'speakers' && <SpeakerManagement />}
        {activeTab === 'sessions' && <SessionManagement />}
        {activeTab === 'analytics' && (
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">
              Attendee Breakdown by Designation
            </h3>
            <div className="card">
              {loadingStats ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                  <p className="mt-4 text-gray-300">Loading statistics...</p>
                </div>
              ) : (
                <PieChart data={stats} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

