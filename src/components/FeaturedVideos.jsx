import React from 'react';
import { Link } from 'react-router-dom';
import { useVideos } from '../contexts/VideoContext';
import Card from './ui/Card';
import Button from './ui/Button';

const FeaturedVideos = () => {
  const { videos } = useVideos();
  const featuredVideos = videos.slice(0, 4); // Get the first 4 videos as featured

  return (
    <section className="py-16 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-8">Featured Videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredVideos.map((video) => (
            <Card key={video.id}>
              <Link to={`/videos/${video.id}`}>
                <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover" />
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 text-white">{video.title}</h3>
                  <p className="text-gray-300">{video.category}</p>
                </div>
              </Link>
            </Card>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/videos">
            <Button size="large">
              View All Videos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedVideos;