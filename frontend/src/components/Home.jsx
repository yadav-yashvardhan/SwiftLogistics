import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate ko import karein
import SchedulePickup from '../pages/schedulepickup';
import { Truck, MapPin, Clock, Shield, Star, Phone, Mail, ArrowRight, Menu, X, Package, Users, Globe, CheckCircle } from 'lucide-react';

const LogisticsHomepage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSchedulePickup, setShowSchedulePickup] = useState(false);

  // NAYI STATE: Tracking feature ke liye
  const [trackingId, setTrackingId] = useState('');
  const navigate = useNavigate(); // navigate function lein

  const testimonials = [
    { name: "Rajesh Kumar", company: "TechCorp Solutions", rating: 5, text: "Exceptional service! My packages always arrive on time and in perfect condition. Highly recommended!" },
    { name: "Priya Sharma", company: "Fashion Hub", rating: 5, text: "The tracking system is amazing. I can monitor my shipments in real-time. Great customer support too!" },
    { name: "Amit Patel", company: "Electronics World", rating: 5, text: "Cost-effective and reliable. They've become our go-to logistics partner for all deliveries." }
  ];

  const services = [
    { icon: Package, title: "Express Pickup", desc: "Same-day pickup within 2 hours" },
    { icon: Truck, title: "Fast Delivery", desc: "Next-day delivery guarantee" },
    { icon: Shield, title: "Secure Transport", desc: "100% insurance coverage" },
    { icon: Globe, title: "Pan-India", desc: "Coverage in 500+ cities" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handleSchedulePickup = () => {
    setShowSchedulePickup(true);
  };

  // BADLAV: handleTrackPackage ab redirect karega
  const handleTrackPackage = (e) => {
    e.preventDefault();
    if (trackingId) {
        navigate(`/track/${trackingId}`);
    }
  };

  if (showSchedulePickup) {
    return <SchedulePickup onBack={() => setShowSchedulePickup(false)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section id="home" className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-black min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-transparent"></div>
        <div className="absolute top-20 left-10 w-20 h-20 bg-purple-500 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-16 h-16 bg-white rounded-full opacity-10 animate-bounce"></div>
        <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-purple-400 rounded-full opacity-10 animate-ping"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Fast & Reliable
                <span className="block bg-gradient-to-r from-purple-400 to-white bg-clip-text text-transparent">
                  Logistics Solutions
                </span>
              </h1>
              <p className="text-xl text-gray-200 leading-relaxed">
                Experience seamless pickup and delivery services across India. 
                Track your packages in real-time with our advanced logistics platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={handleSchedulePickup}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center"
                >
                  Schedule Pickup
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
                <a href="/track" className="border-2 border-white text-white hover:bg-white hover:text-purple-900 px-8 py-4 rounded-lg font-semibold transition-all text-center">
                  Track Package
                </a>
              </div>
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center"><div className="text-3xl font-bold text-purple-400">500+</div><div className="text-gray-300">Cities</div></div>
                <div className="text-center"><div className="text-3xl font-bold text-purple-400">1M+</div><div className="text-gray-300">Deliveries</div></div>
                <div className="text-center"><div className="text-3xl font-bold text-purple-400">99.9%</div><div className="text-gray-300">Success Rate</div></div>
              </div>
            </div>

            {/* Tracking Box */}
            <div id="tracking-section" className="bg-white rounded-2xl shadow-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Track Your Shipment</h3>
                <p className="text-gray-500 mb-6">Enter your tracking ID to see the live status.</p>
                <form onSubmit={handleTrackPackage} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Tracking ID</label>
                        <div className="relative">
                            <Package className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                            <input 
                                type="text" 
                                value={trackingId}
                                onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                                placeholder="e.g., SWIFT-78602"
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        Track Package
                    </button>
                </form>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive logistics solutions tailored to meet your shipping and delivery needs
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 group">
                <div className="bg-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-colors">
                  <service.icon className="h-8 w-8 text-purple-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose SwiftLogistics?</h2>
              <p className="text-xl text-gray-600 mb-8">
                We provide end-to-end logistics solutions with cutting-edge technology and unmatched reliability.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-2 rounded-lg"><Clock className="h-6 w-6 text-purple-600" /></div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Real-time Tracking</h3>
                    <p className="text-gray-600">Monitor your packages every step of the way with live updates</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-2 rounded-lg"><Shield className="h-6 w-6 text-purple-600" /></div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Secure & Insured</h3>
                    <p className="text-gray-600">Complete protection for your valuable shipments</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-2 rounded-lg"><Users className="h-6 w-6 text-purple-600" /></div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">24/7 Support</h3>
                    <p className="text-gray-600">Round-the-clock customer service and assistance</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-8 text-white">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center"><div className="text-3xl font-bold mb-2">2 Hours</div><div className="text-purple-200">Pickup Time</div></div>
                  <div className="text-center"><div className="text-3xl font-bold mb-2">24 Hours</div><div className="text-purple-200">Delivery Time</div></div>
                  <div className="text-center"><div className="text-3xl font-bold mb-2">₹50</div><div className="text-purple-200">Starting Price</div></div>
                  <div className="text-center"><div className="text-3xl font-bold mb-2">100%</div><div className="text-purple-200">Satisfaction</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Trusted by thousands of satisfied customers</p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentSlide].rating)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-xl text-gray-700 mb-8 italic">"{testimonials[currentSlide].text}"</blockquote>
                <div>
                  <div className="font-bold text-lg text-gray-900">{testimonials[currentSlide].name}</div>
                  <div className="text-purple-600">{testimonials[currentSlide].company}</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${currentSlide === index ? 'bg-purple-600' : 'bg-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Experience Swift Logistics?</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us with their shipping needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                  onClick={handleSchedulePickup}
                  className="bg-white text-purple-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Get Started Today
                 
                </button>
                            <a href="/contact" className="border-2 border-white text-white hover:bg-white hover:text-purple-900 px-8 py-4 rounded-lg font-semibold transition-colors">
                 Contact Sales
                </a>
                
            {/* <button className="bg-white text-purple-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">Get Started Today</button> */}
            {/* <button className="border-2 border-white text-white hover:bg-white hover:text-purple-900 px-8 py-4 rounded-lg font-semibold transition-colors">Contact Sales</button> */}
          </div>
        </div>
      </section>

      {/* Animation Styles (No change needed here) */}
      <style>{`
        @keyframes move-truck { 0% { transform: translateX(0) scaleX(-1); } 45% { transform: translateX(0) scaleX(-1); } 55% { transform: translateX(0) scaleX(1); } 100% { transform: translateX(0) scaleX(1); } }
        .truck-animation { animation: move-truck 4s ease-in-out infinite; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default LogisticsHomepage;