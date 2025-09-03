import React, { useState } from 'react';
import { Truck, Mail, Lock, Eye, EyeOff, ArrowRight, User as UserIcon, Shield, Package, MapPin, Clock } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [role, setRole] = useState('user'); // 'user' ya 'driver'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation(); // Added to access navigation state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const apiUrl = role === 'user'
      ? `${import.meta.env.VITE_API_URL}/api/auth/login`
      : `${import.meta.env.VITE_API_URL}/api/auth/driver/login`;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Login failed');
      }
      
      login(data.user, data.token);

      // Check for redirect state and handle accordingly
      if (location.state?.from === '/schedule-pickup' && location.state?.showPricing) {
        navigate('/schedule-pickup', { state: { showPricing: true } });
      } else if (data.user.role === 'driver') {
        navigate('/driver/dashboard');
      } else {
        navigate('/bookings');
      }

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/${provider}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-purple-600 p-2 rounded-lg"> <Truck className="h-8 w-8 text-white" /> </div>
              <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent"> SwiftLogistics </span>
            </div>
            
            <div className="mb-6 flex justify-center border-b">
              <button onClick={() => setRole('user')} className={`px-6 py-2 font-semibold ${role === 'user' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}>
                <UserIcon className="inline-block h-4 w-4 mr-2" />User Login
              </button>
              <button onClick={() => setRole('driver')} className={`px-6 py-2 font-semibold ${role === 'driver' ? 'border-b-2 border-purple-600 text-purple-600' : 'text-gray-500'}`}>
                <Shield className="inline-block h-4 w-4 mr-2" />Driver Login
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h2>
              <p className="text-gray-600">Login to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1"> Email Address </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <Mail className="h-5 w-5 text-gray-400" /> </div>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600" placeholder="Enter your email" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1"> Password </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"> <Lock className="h-5 w-5 text-gray-400" /> </div>
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600" placeholder="Enter your password" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center" > {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />} </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="flex items-center"> <input type="checkbox" name="rememberMe" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" /> <span className="ml-2 text-sm text-gray-600">Remember me</span> </label>
                <a href="#" className="text-sm text-purple-600 hover:text-purple-700 font-medium"> Forgot password? </a>
              </div>
              {error && <p className="text-red-500 text-sm text-center">{error}</p>}
              <button type="submit" disabled={isLoading} className="w-full bg-purple-600 text-white py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50" >
                {isLoading ? ( <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> ) : ( <> <span>Login</span> <ArrowRight className="h-5 w-5" /> </> )}
              </button>
              
              {role === 'user' && (
                <>
                  <div className="relative my-4"> <div className="absolute inset-0 flex items-center"> <div className="w-full border-t border-gray-300"></div> </div> <div className="relative flex justify-center text-sm"> <span className="px-2 bg-white text-gray-500">Or continue with</span> </div> </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => handleSocialLogin('google')} className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" > <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-5 w-5 mr-2" /> <span className="text-sm font-medium text-gray-700">Google</span> </button>
                    <button type="button" onClick={() => handleSocialLogin('facebook')} className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" > <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" alt="Facebook" className="h-5 w-5 mr-2" /> <span className="text-sm font-medium text-gray-700">Facebook</span> </button>
                  </div>
                </>
              )}

              <p className="text-center text-sm text-gray-600 pt-2"> Don't have an account?{' '} <Link to="/Signup" className="text-purple-600 hover:text-purple-700 font-medium"> Sign up for free </Link> </p>
            </form>
          </div>
        </div>
        
        <div className="hidden lg:block bg-gradient-to-br from-purple-600 to-purple-800 p-12 text-white relative overflow-hidden">
             <div className="absolute inset-0 opacity-10"> <div className="absolute -top-24 -right-24 w-96 h-96 bg-white rounded-full"></div> <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-white rounded-full"></div> </div>
             <div className="relative z-10 h-full flex flex-col justify-center">
                 <h3 className="text-4xl font-bold mb-6"> Manage Your Logistics with Ease </h3>
                 <p className="text-purple-100 mb-12 text-lg"> Track shipments, manage deliveries, and streamline your supply chain operations all in one place. </p>
                 <div className="space-y-6">
                     <div className="flex items-start space-x-4"> <div className="bg-white/20 p-3 rounded-lg"> <Package className="h-6 w-6" /> </div> <div> <h4 className="font-semibold text-lg mb-1">Real-time Tracking</h4> <p className="text-purple-100">Monitor your shipments 24/7 with live updates</p> </div> </div>
                     <div className="flex items-start space-x-4"> <div className="bg-white/20 p-3 rounded-lg"> <MapPin className="h-6 w-6" /> </div> <div> <h4 className="font-semibold text-lg mb-1">Global Coverage</h4> <p className="text-purple-100">Deliver to over 200+ countries worldwide</p> </div> </div>
                     <div className="flex items-start space-x-4"> <div className="bg-white/20 p-3 rounded-lg"> <Clock className="h-6 w-6" /> </div> <div> <h4 className="font-semibold text-lg mb-1">On-time Delivery</h4> <p className="text-purple-100">99.9% on-time delivery guarantee</p> </div> </div>
                     <div className="flex items-start space-x-4"> <div className="bg-white/20 p-3 rounded-lg"> <Shield className="h-6 w-6" /> </div> <div> <h4 className="font-semibold text-lg mb-1">Secure & Insured</h4> <p className="text-purple-100">Full insurance coverage for all shipments</p> </div> </div>
                 </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Login;