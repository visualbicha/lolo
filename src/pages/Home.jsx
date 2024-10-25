import React from 'react';
import Hero from '../components/Hero';
import FeaturedVideos from '../components/FeaturedVideos';
import PopularCategories from '../components/PopularCategories';
import CallToAction from '../components/CallToAction';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedVideos />
      <PopularCategories />
      <CallToAction />
    </div>
  );
};

export default Home;