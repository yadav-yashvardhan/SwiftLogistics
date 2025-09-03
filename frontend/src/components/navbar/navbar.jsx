import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Truck, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAccountOpen, setIsAccountOpen] = useState(false);
    
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    
    const accountMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
                setIsAccountOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [accountMenuRef]);

    const handleLogout = () => {
        logout();
        setIsAccountOpen(false);
        setIsMenuOpen(false);
        navigate('/');
    };

    const userFirstName = user ? user.name.split(' ')[0] : 'Account';

    // Check the user's role to decide which navbar to show
    if (user?.role === 'driver') {
        // ### DRIVER NAVBAR ###
        // This simple navbar is only shown to logged-in drivers.
        return (
            <nav className="bg-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo links to the driver's dashboard */}
                        <Link to="/driver/dashboard" className="flex items-center space-x-2">
                            <div className="bg-purple-600 p-2 rounded-lg"> <Truck className="h-6 w-6 text-white" /> </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent"> SwiftLogistics </span>
                        </Link>
                        
                        {/* The only other item is the account/logout button */}
                        <div className="relative" ref={accountMenuRef}>
                            <button 
                                onClick={() => setIsAccountOpen(!isAccountOpen)}
                                className="flex items-center space-x-2 border-2 border-purple-600 text-purple-600 px-6 py-2 rounded-lg hover:bg-purple-600 hover:text-white transition-colors"
                            >
                                <User className="h-4 w-4" />
                                <span>{userFirstName}</span>
                            </button>
                            {isAccountOpen && (
                                <div className="absolute right-0 mt-2 w-full bg-white border rounded-lg shadow-lg z-50">
                                    <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-gray-700 hover:bg-purple-600 hover:text-white transition-colors duration-200">
                                        <LogOut className="h-4 w-4 mr-2" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        );
    }

    // ### USER & GUEST & ADMIN NAVBAR ###
    // This full navbar is shown to regular users, admins, and visitors.
    return (
        <nav className="bg-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2"> <div className="bg-purple-600 p-2 rounded-lg"> <Truck className="h-6 w-6 text-white" /> </div> <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent"> SwiftLogistics </span> </Link>
                    
                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Home</Link>
                        <Link to="/about" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">About</Link>
                        <Link to="/contact" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">Contact</Link>
                        {user && user.role !== 'admin' && <Link to="/bookings" className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">My Bookings</Link>}
                        
                        <div className="relative" ref={accountMenuRef}>
                            <button 
                                onClick={() => setIsAccountOpen(!isAccountOpen)}
                                className="flex items-center space-x-2 border-2 border-purple-600 text-purple-600 px-6 py-2 rounded-lg hover:bg-purple-600 hover:text-white transition-colors"
                            >
                                <User className="h-4 w-4" />
                                <span>{userFirstName}</span>
                            </button>
                            {isAccountOpen && (
                                <div className="absolute right-0 mt-2 w-full bg-white border rounded-lg shadow-lg z-50">
                                    {user ? (
                                        <>
                                            {user.role === 'admin' && (
                                                <Link 
                                                    to="/admin-analytics" 
                                                    className="block px-4 py-2 text-gray-700 hover:bg-purple-600 hover:text-white transition-colors duration-200" 
                                                    onClick={() => setIsAccountOpen(false)}
                                                >
                                                    Admin Dashboard
                                                </Link>
                                            )}
                                            <button 
                                                onClick={handleLogout} 
                                                className="w-full text-left flex items-center px-4 py-2 text-gray-700 hover:bg-purple-600 hover:text-white transition-colors duration-200"
                                            >
                                                <LogOut className="h-4 w-4 mr-2" />
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link 
                                                to="/login" 
                                                className="block px-4 py-2 text-gray-700 hover:bg-purple-600 hover:text-white transition-colors duration-200" 
                                                onClick={() => setIsAccountOpen(false)}
                                            >
                                                Login
                                            </Link>
                                            <Link 
                                                to="/signup" 
                                                className="block px-4 py-2 text-gray-700 hover:bg-purple-600 hover:text-white transition-colors duration-200" 
                                                onClick={() => setIsAccountOpen(false)}
                                            >
                                                Signup
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden"> 
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}> 
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />} 
                        </button> 
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link 
                            to="/" 
                            className="block px-3 py-2 text-gray-700 hover:bg-purple-600 hover:text-white rounded-md transition-colors" 
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link 
                            to="/about" 
                            className="block px-3 py-2 text-gray-700 hover:bg-purple-600 hover:text-white rounded-md transition-colors" 
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About
                        </Link>
                        <Link 
                            to="/contact" 
                            className="block px-3 py-2 text-gray-700 hover:bg-purple-600 hover:text-white rounded-md transition-colors" 
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Contact
                        </Link>
                        {user && user.role !== 'admin' && (
                            <Link 
                                to="/bookings" 
                                className="block w-full text-left px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors" 
                                onClick={() => setIsMenuOpen(false)}
                            >
                                My Bookings
                            </Link>
                        )}
                        
                        <div className="relative">
                            <button 
                                className="flex items-center space-x-2 w-full px-3 py-2 border-2 border-purple-600 text-purple-600 rounded-md hover:bg-purple-600 hover:text-white transition-colors mt-2" 
                                onClick={() => setIsAccountOpen(!isAccountOpen)}
                            >
                                <User className="h-4 w-4" />
                                <span>{userFirstName}</span>
                            </button>
                            {isAccountOpen && (
                                <div className="mt-2 space-y-1">
                                    {user ? (
                                        <>
                                            {user.role === 'admin' && (
                                                <Link 
                                                    to="/admin-analytics" 
                                                    className="block px-3 py-2 text-gray-700 hover:bg-purple-600 hover:text-white rounded-md transition-colors duration-200" 
                                                    onClick={() => { setIsMenuOpen(false); setIsAccountOpen(false); }}
                                                >
                                                    Admin Dashboard
                                                </Link>
                                            )}
                                            <button 
                                                onClick={handleLogout} 
                                                className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-purple-600 hover:text-white rounded-md transition-colors duration-200"
                                            >
                                                <LogOut className="h-4 w-4 mr-2" />
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link 
                                                to="/login" 
                                                className="block px-3 py-2 text-gray-700 hover:bg-purple-600 hover:text-white rounded-md transition-colors duration-200" 
                                                onClick={() => { setIsMenuOpen(false); setIsAccountOpen(false); }}
                                            >
                                                Login
                                            </Link>
                                            <Link 
                                                to="/signup" 
                                                className="block px-3 py-2 text-gray-700 hover:bg-purple-600 hover:text-white rounded-md transition-colors duration-200" 
                                                onClick={() => { setIsMenuOpen(false); setIsAccountOpen(false); }}
                                            >
                                                Signup
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;