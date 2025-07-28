import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TripDetails from './pages/TripDetails';
import CreateTrip from './pages/CreateTrip';
import EditTrip from './pages/EditTrip';
import TripPhotos from './pages/TripPhotos';
import { AuthProvider } from './contexts/AuthContext';
import AppNavbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import { useState } from 'react';
import AppFooter from './components/Footer';
import MyAccount from './pages/MyAccount';
import ContactUs from './pages/ContactUs';
import './App.css';

function App() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState("login"); // "login" or "signup"

  const openAuthModal = (mode) => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <AuthProvider>
      <Router>
        <AppNavbar
          onLoginClick={() => openAuthModal("login")}
          onSignupClick={() => openAuthModal("signup")}
        />
        <AuthModal
          show={authModalOpen}
          type={authModalMode}
          handleClose={() => setAuthModalOpen(false)}
        />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trip/:id" element={<TripDetails />} />
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/edit-trip/:id" element={<EditTrip />} />
          <Route path="/trips/:tripId/photos" element={<TripPhotos />} />
          <Route path="/account" element={<MyAccount />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
      </Router>
    </AuthProvider>

  );
}

export default App;