import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import Home from './components/Home'
import Team from './components/Team'
import Overview from './components/Overview'
import Contact from './components/Contact'
// import Education from './components/Education'
import Enterprise from './components/Enterprise'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import './styles.css'

import BtechPage from './components/page/BtechPage'; // Ensure this path is correct
import BtechDepartmentsPage from './components/page/BtechDepartmentsPage';
import BcaSemestersPage from './components/page/BcaSemestersPage'; // <-- Import the new component
import Btech_CE_Page from './components/page/Btech_CE_Page';
import Btech_CSE_Page from './components/page/Btech_CSE_Page';
import Btech_EEE_Page from './components/page/Btech_EEE_Page';
import Btech_ME_Page from './components/page/Btech_ME_Page';
import Btech_ECE_Page from './components/page/Btech_ECE_Page';


import GeminiChatbot from './components/GeminiChatbot/GeminiChatbot';

function App() {
  const [, setIsAuthenticated] = useState(false)

  // Custom wrapper to use useLocation outside Router
  const NavbarWrapper = () => {
    const location = useLocation();
    // Hide Navbar on /btech (and optionally its subroutes)
    const hideNavbar = location.pathname.startsWith('/btech');
    return !hideNavbar ? <Navbar /> : null;
  };

  return (
    <Router>
      <NavbarWrapper /> {/* Main Navbar will show on BtechPage */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/team" element={<Team />} />
        <Route path="/overview" element={<Overview />} />
        <Route path="/contact" element={<Contact />} />
        {/* <Route path="/education" element={<Education />} /> */}

        <Route path="/btech/departments" element={<BtechDepartmentsPage />} />
        <Route path="/btech/departments/civil" element={<Btech_CE_Page />} />
        <Route path="/btech/departments/cse" element={<Btech_CSE_Page />} />
        <Route path="/btech/departments/eee" element={<Btech_EEE_Page />} />
        <Route path="/btech/departments/me" element={<Btech_ME_Page />} />
        <Route path="/btech/departments/ece" element={<Btech_ECE_Page />} />

        <Route path="/btech/ai-chatbot" element={<GeminiChatbot />} />

        <Route path="/bca/departments" element={<BcaSemestersPage />} />
        <Route path="/btech" element={<BtechPage />} /> {/* This route renders BtechPage */}
        <Route path="/enterprise" element={<Enterprise />} />
      </Routes>
      <Footer /> {/* Footer will show on BtechPage */}
      <AuthModal
        setIsAuthenticated={setIsAuthenticated}
        onClose={() => {
          // Ensure modal closes properly, Bootstrap might need jQuery or its own JS
          // For a simple hide, you might need to manage a state for modal visibility
          // or ensure Bootstrap's JS is correctly handling this.
          const modal = document.getElementById('authModal');
          if (modal) {
            // This is a direct DOM manipulation, ideally handle with state or Bootstrap JS
            modal.classList.remove('show');
            modal.style.display = 'none';
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
              backdrop.remove();
            }
            document.body.classList.remove('modal-open');
          }
        }}
      />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Router>
  )
}

export default App