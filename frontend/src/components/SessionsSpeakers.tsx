import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getSessions, getSpeakers } from '../services/api';
import type { Session, Speaker } from '../types';

const SessionsSpeakers = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sessionsData, speakersData] = await Promise.all([
          getSessions(),
          getSpeakers(),
        ]);
        // Ensure we always have arrays, even if API returns null
        setSessions(Array.isArray(sessionsData) ? sessionsData : []);
        setSpeakers(Array.isArray(speakersData) ? speakersData : []);
        setError(null);
      } catch (err) {
        setError('Failed to load sessions and speakers');
        console.error(err);
        // Set empty arrays on error to prevent null errors
        setSessions([]);
        setSpeakers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSessionSpeakers = (session: Session): Speaker[] => {
    return speakers.filter((speaker) => session.speakerIds.includes(speaker.id));
  };

  if (loading) {
    return (
      <section id="sessions" className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading sessions...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="sessions" className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="sessions" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Sessions & Speakers
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore our exciting lineup of AI workshops and meet our expert speakers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sessions && sessions.length > 0 ? sessions.map((session, index) => {
            const sessionSpeakers = getSessionSpeakers(session);
            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card group hover:scale-105"
              >
                <div className="mb-4">
                  <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-purple-300 transition-colors">
                    {session.title}
                  </h3>
                  {session.time && (
                    <p className="text-purple-300 text-sm mb-2">
                      {session.time} • {session.duration}
                    </p>
                  )}
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {session.description}
                  </p>
                </div>

                {sessionSpeakers.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-white/20">
                    <h4 className="text-sm font-semibold text-gray-400 mb-3">Speakers</h4>
                    <div className="space-y-3">
                      {sessionSpeakers.map((speaker) => (
                        <div key={speaker.id} className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg overflow-hidden">
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
                            <p className="text-white font-medium">{speaker.name}</p>
                            {speaker.bio && (
                              <p className="text-gray-400 text-xs line-clamp-2">
                                {speaker.bio}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            );
          }) : null}
        </div>

        {sessions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No sessions available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SessionsSpeakers;

