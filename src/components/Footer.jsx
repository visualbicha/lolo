import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm">iVisionary is your platform for high-quality AI-generated stock videos.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm hover:text-white transition-colors duration-200">Home</Link></li>
              <li><Link to="/videos" className="text-sm hover:text-white transition-colors duration-200">Videos</Link></li>
              <li><Link to="/subscription" className="text-sm hover:text-white transition-colors duration-200">Subscription</Link></li>
              <li><Link to="/faq" className="text-sm hover:text-white transition-colors duration-200">FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-sm hover:text-white transition-colors duration-200">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-sm hover:text-white transition-colors duration-200">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="text-sm hover:text-white transition-colors duration-200">Cookie Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <FaFacebookF />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} iVisionary. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;