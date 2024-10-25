import React from 'react';
import Card from './ui/Card';

const testimonials = [
  {
    id: 1,
    name: 'John Doe',
    role: 'Filmmaker',
    content: 'iVisionary has been a game-changer for my projects. The quality of videos is unmatched!',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: 2,
    name: 'Jane Smith',
    role: 'Marketing Director',
    content: 'The variety of content available on iVisionary has helped us create stunning campaigns.',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    role: 'Content Creator',
    content: 'I love how easy it is to find and download high-quality videos. Highly recommended!',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id}>
              <p className="text-gray-300 mb-4">"{testimonial.content}"</p>
              <div className="flex items-center">
                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                <div>
                  <h4 className="text-white font-semibold">{testimonial.name}</h4>
                  <p className="text-gray-400">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;