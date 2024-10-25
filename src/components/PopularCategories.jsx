import React from 'react';
import { Link } from 'react-router-dom';
import { useVideos } from '../contexts/VideoContext';

const PopularCategories = () => {
  const { categories } = useVideos();
  const popularCategories = categories ? categories.slice(0, 6) : [];

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-8">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularCategories.map((category, index) => (
            <Link 
              key={`${category.name}-${index}`}
              to={`/videos?category=${encodeURIComponent(category.name)}`} 
              className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-700 transition-colors duration-300"
            >
              <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
              <p className="text-gray-400">
                {category.subcategories ? `${category.subcategories.length} subcategories` : 'No subcategories'}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCategories;