import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Videos from './pages/Videos';
import Login from './pages/Login';
import Register from './pages/Register';
import MyAccount from './pages/MyAccount';
import Admin from './pages/Admin';
import VideoDetail from './pages/VideoDetail';
import Subscription from './pages/Subscription';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import CookiesPolicy from './pages/CookiesPolicy';
import TermsOfService from './pages/TermsOfService';
import ForgotPassword from './pages/ForgotPassword';
import EmailVerificationBanner from './components/EmailVerificationBanner';
import PrivateRoute from './components/PrivateRoute';
import CookieBanner from './components/CookieBanner';
import BackToTop from './components/BackToTop';
import SubscriptionSuccess from './pages/SubscriptionSuccess';

const App = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header />
      <EmailVerificationBanner />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/videos/:id" element={<VideoDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/subscription/success" element={<SubscriptionSuccess />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cookies" element={<CookiesPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route 
            path="/admin/*" 
            element={
              <PrivateRoute>
                <Admin />
              </PrivateRoute>
            } 
          />
        </Routes>
      </main>
      <Footer />
      <CookieBanner />
      <BackToTop />
    </div>
  );
};

export default App;