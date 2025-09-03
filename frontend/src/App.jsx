import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Apne components aur pages import karein
import HomePage from './components/Home';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer/footer';
import Login from './pages/login';
import Signup from './pages/signup';
import BookingsPage from './pages/BookingsPage';
import DriverDashboard from './pages/DriverDashboard';
import SchedulePickup from './pages/schedulepickup';
import TrackingPage from './pages/TrackingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import Admin from './pages/Admin'; // Added import for Admin.jsx
import BookingConfirmation from './pages/BookingConfirmation'; // New import for BookingConfirmation

import { AuthProvider } from './context/AuthContext';
import RoleProtectedRoute from './components/auth/RoleProtectedRoute';

const MainLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* --- Public Routes (Sabhi dekh sakte hain) --- */}
          <Route
            path="/"
            element={
              <MainLayout>
                <HomePage />
              </MainLayout>
            }
          />
          <Route
            path="/about"
            element={
              <MainLayout>
                <AboutPage />
              </MainLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <MainLayout>
                <ContactPage />
              </MainLayout>
            }
          />
          <Route
            path="/track/:trackingId?"
            element={
              <MainLayout>
                <TrackingPage />
              </MainLayout>
            }
          />
          
          {/* --- Authentication Routes (Public, no layout) --- */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* --- User ke liye Protected Routes (Sirf logged-in user) --- */}
          <Route element={<RoleProtectedRoute allowedRoles={['user']} />}>
            <Route
              path="/bookings"
              element={
                <MainLayout>
                  <BookingsPage />
                </MainLayout>
              }
            />
            <Route
              path="/schedule-pickup"
              element={
                <MainLayout>
                  <SchedulePickup />
                </MainLayout>
              }
            />
            <Route
              path="/booking-confirmation"
              element={
                <MainLayout>
                  <BookingConfirmation />
                </MainLayout>
              }
            />
          </Route>

          {/* --- Driver ke liye Protected Routes (Sirf logged-in driver) --- */}
          <Route element={<RoleProtectedRoute allowedRoles={['driver']} />}>
            <Route 
              path="/driver/dashboard" 
              element={ 
                <MainLayout>
                  <DriverDashboard />
                </MainLayout> 
              } 
            />
          </Route>

          {/* --- Admin ke liye Protected Routes (Sirf logged-in admin) --- */}
          <Route element={<RoleProtectedRoute allowedRoles={['admin']} />}>
            <Route
              path="/admin-analytics"
              element={
                <MainLayout>
                  <Admin />
                </MainLayout>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;