import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Globe, TrendingUp, Users, ArrowRight, ChevronsDown } from 'lucide-react';

const AboutPage = () => {

  const values = [
    {
      icon: Zap,
      title: 'Speed & Efficiency',
      description: 'We leverage cutting-edge technology and optimized routes to ensure your parcels are delivered in the fastest time possible, every single time.'
    },
    {
      icon: ShieldCheck,
      title: 'Unmatched Security',
      description: 'Your trust is our priority. From real-time tracking to secure handling, every shipment is protected with the utmost care and professionalism.'
    },
    {
      icon: Globe,
      title: 'Nationwide Coverage',
      description: 'Our extensive logistics network connects every corner of the country, from bustling metros to remote towns, ensuring no location is out of your reach.'
    },
  ];

  const stats = [
    { value: '10M+', label: 'Parcels Delivered' },
    { value: '99.9%', label: 'On-Time Delivery Rate' },
    { value: '25,000+', label: 'Pin Codes Served' },
    { value: '50K+', label: 'Happy Businesses' },
  ];

  return (
    <div className="bg-white text-gray-800">

      {/* Hero Section */}
      <section className="relative h-[90vh] flex flex-col items-center justify-center text-center text-white bg-gradient-to-br from-purple-800 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10 p-6">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight animate-fade-in-down">
            Moving India Forward.
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-indigo-200 animate-fade-in-up">
            SwiftLogistics is not just a delivery service; we are the backbone of your business, the trusted partner for your promises, and the future of logistics in India.
          </p>
          <div className="mt-12">
            <Link
              to="/schedule-pickup"
              className="inline-block bg-white text-purple-700 font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300"
            >
              Get Started Today
            </Link>
          </div>
        </div>
        <div className="absolute bottom-10 animate-bounce">
          <ChevronsDown className="h-8 w-8 text-white/50" />
        </div>
      </section>

      {/* Our Core Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-purple-600 tracking-wider uppercase">Our Promise</h2>
            <p className="mt-2 text-4xl font-extrabold text-gray-900">
              The SwiftLogistics Advantage
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12">
            {values.map((value) => (
              <div key={value.title} className="p-8 bg-white rounded-2xl shadow-lg transform hover:-translate-y-2 transition-transform duration-300">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white mx-auto">
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="mt-8 text-2xl font-bold text-gray-900 text-center">{value.title}</h3>
                <p className="mt-4 text-base text-gray-600 text-center">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey in Numbers Section */}
      <section className="py-20 bg-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-extrabold">Our Journey in Numbers</h2>
            <p className="mt-4 text-lg text-purple-200 max-w-2xl mx-auto">
              We are proud of our milestones, which reflect our commitment to excellence and the trust our clients place in us.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="p-4">
                <p className="text-5xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="mt-2 text-lg text-purple-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-gray-900">
            Ready to Elevate Your Logistics?
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Let's build the future of your business together. Get an instant quote and experience the best delivery service in the industry.
          </p>
          <Link
            to="/schedule-pickup"
            className="mt-10 w-full inline-flex items-center justify-center px-8 py-4 border border-transparent rounded-full shadow-sm text-lg font-bold text-white bg-purple-600 hover:bg-purple-700 sm:w-auto transform hover:scale-105 transition-transform"
          >
            Schedule a Pickup <ArrowRight className="ml-3 h-6 w-6" />
          </Link>
        </div>
      </section>
      
      {/* CSS for background pattern - Add this to your main CSS file or a style tag */}
      <style>{`
        .bg-grid-pattern {
          background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 2rem 2rem;
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 1s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out 0.5s forwards; }
      `}</style>
    </div>
  );
};

export default AboutPage;