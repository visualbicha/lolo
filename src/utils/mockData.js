// Mock data store
export const mockData = {
  users: [
    {
      id: '1',
      username: 'admin',
      email: 'admin@example.com',
      password: 'Admin123!',
      role: 'admin'
    },
    {
      id: '2',
      username: 'user',
      email: 'user@example.com',
      password: 'User123!',
      role: 'user'
    }
  ],
  videos: [
    {
      id: 1,
      title: 'Sunset Time Lapse',
      description: 'Beautiful sunset over the ocean',
      category: 'Nature',
      tags: ['sunset', 'ocean', 'timelapse'],
      videoUrl: 'https://example.com/videos/sunset.mp4',
      thumbnail: 'https://example.com/thumbnails/sunset.jpg',
      duration: '0:30'
    },
    {
      id: 2,
      title: 'City Streets',
      description: 'Urban life in motion',
      category: 'Urban',
      tags: ['city', 'street', 'people'],
      videoUrl: 'https://example.com/videos/city.mp4',
      thumbnail: 'https://example.com/thumbnails/city.jpg',
      duration: '1:00'
    }
  ],
  categories: [
    {
      name: 'Nature',
      subcategories: ['Landscapes', 'Wildlife', 'Weather']
    },
    {
      name: 'Urban',
      subcategories: ['City Life', 'Architecture', 'Street Art']
    },
    {
      name: 'Technology',
      subcategories: ['AI', 'Robotics', 'Digital Art']
    }
  ]
};

// Mock API functions
export const mockApi = {
  login: async (email, password) => {
    const user = mockData.users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      token: `mock-token-${Date.now()}`
    };
  },

  register: async (userData) => {
    if (mockData.users.some(u => u.email === userData.email)) {
      throw new Error('User already exists');
    }
    const newUser = {
      id: String(mockData.users.length + 1),
      ...userData,
      role: 'user'
    };
    mockData.users.push(newUser);
    return { success: true };
  },

  updateUser: async (userId, userData) => {
    const userIndex = mockData.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    mockData.users[userIndex] = { ...mockData.users[userIndex], ...userData };
    return mockData.users[userIndex];
  },

  getVideos: async () => mockData.videos,
  
  addVideo: async (videoData) => {
    const newVideo = {
      ...videoData,
      id: mockData.videos.length + 1,
      thumbnail: 'https://example.com/thumbnails/new.jpg',
      videoUrl: 'https://example.com/videos/new.mp4'
    };
    mockData.videos.push(newVideo);
    return newVideo;
  },

  updateVideo: async (videoId, videoData) => {
    const videoIndex = mockData.videos.findIndex(v => v.id === videoId);
    if (videoIndex === -1) {
      throw new Error('Video not found');
    }
    mockData.videos[videoIndex] = { ...mockData.videos[videoIndex], ...videoData };
    return mockData.videos[videoIndex];
  },

  deleteVideo: async (videoId) => {
    const videoIndex = mockData.videos.findIndex(v => v.id === videoId);
    if (videoIndex === -1) {
      throw new Error('Video not found');
    }
    mockData.videos.splice(videoIndex, 1);
    return true;
  },

  getCategories: async () => mockData.categories
};