import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const position = [28.644800, 77.216721]; // Example: Center of Delhi

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you shortly.');
    // Here you would typically handle form submission to a backend
    console.log(formData);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-700 to-purple-900 text-white text-center py-20">
        <h1 className="text-5xl font-extrabold">Get in Touch</h1>
        <p className="mt-4 text-lg text-purple-200">We're here to help with all your logistics needs.</p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left Column: Contact Info & Map */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full"><MapPin className="h-6 w-6 text-purple-600" /></div>
                  <div>
                    <h3 className="text-lg font-semibold">Our Office</h3>
                    <p className="text-gray-600">B-45, Sector 62, Noida, Uttar Pradesh 201309</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full"><Mail className="h-6 w-6 text-purple-600" /></div>
                  <div>
                    <h3 className="text-lg font-semibold">Email Us</h3>
                    <p className="text-gray-600">support@swiftlogistics.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-3 rounded-full"><Phone className="h-6 w-6 text-purple-600" /></div>
                  <div>
                    <h3 className="text-lg font-semibold">Call Us</h3>
                    <p className="text-gray-600">+91 98765 43210</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="h-96 w-full rounded-xl shadow-lg overflow-hidden">
              <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                  <Popup>
                    SwiftLogistics Head Office
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="text-sm font-semibold text-gray-700">Full Name</label>
                <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"/>
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</label>
                <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"/>
              </div>
              <div>
                <label htmlFor="subject" className="text-sm font-semibold text-gray-700">Subject</label>
                <input type="text" name="subject" id="subject" value={formData.subject} onChange={handleChange} required className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"/>
              </div>
              <div>
                <label htmlFor="message" className="text-sm font-semibold text-gray-700">Message</label>
                <textarea name="message" id="message" rows="5" value={formData.message} onChange={handleChange} required className="mt-2 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"></textarea>
              </div>
              <div>
                <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                  <Send className="h-5 w-5 mr-2" /> Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;