import React from 'react';
import { Link } from 'react-router-dom';
import Button from './ui/Button';

const CallToAction = () => {
  return (
    <section className="bg-gradient-to-r from-purple-600 to-blue-600 py-20 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Ready to Elevate Your Projects?</h2>
        <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">Join iVisionary today and access our premium library of AI-generated videos. Perfect for creators, marketers, and visionaries.</p>
        <Link to="/subscription">
          <Button size="large">
            Get Started Now
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;