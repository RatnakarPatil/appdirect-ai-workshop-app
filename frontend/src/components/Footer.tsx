interface FooterProps {
  onAdminClick: () => void;
}

const Footer = ({ onAdminClick }: FooterProps) => {
  return (
    <footer className="py-12 px-4 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} AppDirect India AI Workshop. All rights reserved.
            </p>
          </div>
          <button
            onClick={onAdminClick}
            className="btn-secondary text-sm px-4 py-2"
          >
            Admin Login
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

