import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createAttendee, getAttendeeCount } from '../services/api';

const DESIGNATIONS = [
  'Software Engineer',
  'Senior Software Engineer',
  'Tech Lead',
  'Engineering Manager',
  'Product Manager',
  'Data Scientist',
  'ML Engineer',
  'DevOps Engineer',
  'Architect',
  'Director',
  'VP',
  'Other',
];

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    designation: '',
  });
  const [count, setCount] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const currentCount = await getAttendeeCount();
        setCount(currentCount);
      } catch (err) {
        console.error('Failed to fetch count:', err);
      }
    };

    fetchCount();
    // Poll for count updates every 10 seconds
    const interval = setInterval(fetchCount, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email || !formData.designation) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      await createAttendee(formData);
      setShowSuccess(true);
      setFormData({ name: '', email: '', designation: '' });
      // Refresh count
      const newCount = await getAttendeeCount();
      setCount(newCount);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="registration" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Register Now
          </h2>
          <p className="text-xl text-gray-300">
            Secure your spot at the AppDirect India AI Workshop
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Live Count */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card text-center"
          >
            <div className="mb-4">
              <h3 className="text-3xl font-bold text-purple-300 mb-2">Live Count</h3>
              {count !== null ? (
                <div className="text-6xl font-bold text-white mb-4">
                  {count}
                </div>
              ) : (
                <div className="text-6xl font-bold text-white mb-4 animate-pulse">
                  ...
                </div>
              )}
              <p className="text-gray-300 text-lg">
                {count === 1 ? 'Attendee Registered' : 'Attendees Registered'}
              </p>
            </div>
            <div className="mt-8 pt-8 border-t border-white/20">
              <p className="text-gray-400 text-sm">
                Join the growing community of AI enthusiasts and professionals
              </p>
            </div>
          </motion.div>

          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="designation" className="block text-sm font-medium text-gray-300 mb-2">
                  Designation *
                </label>
                <select
                  id="designation"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Select your designation</option>
                  {DESIGNATIONS.map((designation) => (
                    <option key={designation} value={designation} className="bg-slate-800">
                      {designation}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full"
              >
                {submitting ? 'Registering...' : 'Register'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="relative glass-strong rounded-2xl p-8 max-w-md w-full text-center"
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Registration Successful!</h3>
              <p className="text-gray-300">
                Thank you for registering. We'll see you at the workshop!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default RegistrationForm;

