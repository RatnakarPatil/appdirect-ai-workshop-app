import { motion } from 'framer-motion';

const Location = () => {
  return (
    <section id="location" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Event Location
          </h2>
          <p className="text-xl text-gray-300">
            Join us at AppDirect India office
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card"
          >
            <h3 className="text-2xl font-bold text-white mb-6">Event Details</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-purple-300 font-semibold mb-1">Date</h4>
                <p className="text-gray-300">To be announced</p>
              </div>
              <div>
                <h4 className="text-purple-300 font-semibold mb-1">Time</h4>
                <p className="text-gray-300">9:00 AM - 5:00 PM IST</p>
              </div>
              <div>
                <h4 className="text-purple-300 font-semibold mb-1">Venue</h4>
                <p className="text-gray-300">AppDirect India</p>
                <p className="text-gray-400 text-sm mt-1">
                  Pune, Maharashtra, India
                </p>
              </div>
              <div>
                <h4 className="text-purple-300 font-semibold mb-1">Contact</h4>
                <p className="text-gray-300">For inquiries, please contact the event organizers</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="card p-0 overflow-hidden"
          >
            <div className="w-full h-full min-h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3930.310034205593!2d73.92600257972352!3d18.515585566381823!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c18cf4eaad8d%3A0xc5835f1d9e3a91d3!2sAppDirect%20India!5e0!3m2!1sen!2sin!4v1762854087901!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Location;

