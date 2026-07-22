import { Link } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-[1500px] mx-auto px-6 md:px-10 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">LF</span>
            </div>
            <span className="text-sm font-bold text-gray-800">Lost & Found Portal</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link to="/lost-items" className="hover:text-blue-600 transition">Lost Items</Link>
            <Link to="/found-items" className="hover:text-blue-600 transition">Found Items</Link>
            <Link to="/claims" className="hover:text-blue-600 transition">Claims</Link>
            <Link to="/dashboard" className="hover:text-blue-600 transition">Dashboard</Link>
          </div>

          {/* Copyright */}
          <p className="text-xs text-gray-400">
            © {year} Lost & Found Portal. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;