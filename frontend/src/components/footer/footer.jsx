import React from 'react';
import { Truck, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info Section */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-purple-600 p-2 rounded-lg">
                <Truck className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">SwiftLogistics</span>
            </div>
            <p className="text-gray-400 mb-6">
              Your trusted partner for fast, reliable, and secure logistics solutions across India.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 cursor-pointer transition-colors">
                <span className="text-white font-bold">f</span>
              </div>
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 cursor-pointer transition-colors">
                <span className="text-white font-bold">t</span>
              </div>
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 cursor-pointer transition-colors">
                <span className="text-white font-bold">in</span>
              </div>
            </div>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Services</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Express Delivery
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Bulk Shipping
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  International
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Warehousing
                </a>
              </li>
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Track Package
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Shipping Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Returns
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact</h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-center hover:text-white transition-colors">
                <Phone className="h-4 w-4 mr-2" />
                <span>+91 1800-123-4567</span>
              </li>
              <li className="flex items-center hover:text-white transition-colors">
                <Mail className="h-4 w-4 mr-2" />
                <span>support@swiftlogistics.com</span>
              </li>
              <li className="flex items-start hover:text-white transition-colors">
                <MapPin className="h-4 w-4 mr-2 mt-1" />
                <span>123 Business Center, New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 SwiftLogistics. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;