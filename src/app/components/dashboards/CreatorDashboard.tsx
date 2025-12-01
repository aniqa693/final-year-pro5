

export default function CreatorDashboard() {
  const stats = [
    { title: 'Posts Created', value: '156', icon: '📝', trend: 'up', trendValue: '12 this week', color: 'blue' as const },
    { title: 'Scheduled Posts', value: '23', icon: '📅', trend: 'down', trendValue: '5 less', color: 'green' as const },
    { title: 'Engagement Rate', value: '4.2%', icon: '❤️', trend: 'up', trendValue: '0.5%', color: 'purple' as const },
    { title: 'Audience Growth', value: '+1.2K', icon: '👥', trend: 'up', trendValue: '8%', color: 'orange' as const },
  ];

  const quickActions = [
    { label: 'Create Post', icon: '✨', onClick: () => console.log('Create Post'), color: 'bg-blue-100 border-blue-300 text-blue-700' },
    { label: 'Schedule', icon: '🗓️', onClick: () => console.log('Schedule'), color: 'bg-green-100 border-green-300 text-green-700' },
    { label: 'Analytics', icon: '📊', onClick: () => console.log('Analytics'), color: 'bg-purple-100 border-purple-300 text-purple-700' },
    { label: 'Content Library', icon: '📚', onClick: () => console.log('Content Library'), color: 'bg-orange-100 border-orange-300 text-orange-700' },
  ];

  const activities = [
    { id: '1', type: 'post', description: 'New Instagram post published', time: '30 minutes ago', user: 'You', icon: '📸' },
    { id: '2', type: 'schedule', description: 'Facebook posts scheduled', time: '2 hours ago', user: 'You', icon: '📅' },
    { id: '3', type: 'engagement', description: 'Post reached 10K views', time: '5 hours ago', user: 'Analytics', icon: '👀' },
    { id: '4', type: 'content', description: 'New content idea saved', time: '1 day ago', user: 'You', icon: '💡' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold">Creator Dashboard</h1>
        <p className="text-pink-100 mt-2 text-lg">
          Content creation and social media management
        </p>
      </div>


      {/* Content Ideas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Ideas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Summer Campaign', platform: 'Instagram', engagement: 'High', icon: '📸' },
            { title: 'Product Launch', platform: 'Facebook', engagement: 'Medium', icon: '🚀' },
            { title: 'Behind Scenes', platform: 'TikTok', engagement: 'High', icon: '🎬' },
          ].map((idea, index) => (
            <div key={index} className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 transition-colors">
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-2xl">{idea.icon}</span>
                <div>
                  <p className="font-semibold text-gray-900">{idea.title}</p>
                  <p className="text-sm text-gray-500">{idea.platform}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  idea.engagement === 'High' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {idea.engagement} Engagement
                </span>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Use Idea
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}