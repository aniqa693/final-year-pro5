

export default function AnalystDashboard() {
  const stats = [
    { title: 'Reports Generated', value: '45', icon: '📈', trend: 'up', trendValue: '5 this week', color: 'blue' as const },
    { title: 'Data Points', value: '1.2M', icon: '🔢', trend: 'up', trendValue: '50K new', color: 'green' as const },
    { title: 'Insights Delivered', value: '234', icon: '💡', trend: 'up', trendValue: '12 new', color: 'purple' as const },
    { title: 'Export Requests', value: '12', icon: '📤', trend: 'stable', trendValue: '0 change', color: 'orange' as const },
  ];

  const quickActions = [
    { label: 'Create Report', icon: '📊', onClick: () => console.log('Create Report'), color: 'bg-blue-100 border-blue-300 text-blue-700' },
    { label: 'Data Analysis', icon: '🔍', onClick: () => console.log('Data Analysis'), color: 'bg-green-100 border-green-300 text-green-700' },
    { label: 'Export Data', icon: '📤', onClick: () => console.log('Export Data'), color: 'bg-purple-100 border-purple-300 text-purple-700' },
    { label: 'AI Insights', icon: '🤖', onClick: () => console.log('AI Insights'), color: 'bg-orange-100 border-orange-300 text-orange-700' },
  ];

  const activities = [
    { id: '1', type: 'report', description: 'Weekly performance report generated', time: '1 hour ago', user: 'You', icon: '📊' },
    { id: '2', type: 'insight', description: 'New engagement pattern detected', time: '3 hours ago', user: 'AI System', icon: '💡' },
    { id: '3', type: 'export', description: 'Data exported for client', time: '5 hours ago', user: 'You', icon: '📤' },
    { id: '4', type: 'analysis', description: 'Campaign ROI analysis completed', time: '1 day ago', user: 'You', icon: '💰' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold">Analyst Dashboard</h1>
        <p className="text-green-100 mt-2 text-lg">
          Data analysis and performance insights
        </p>
      </div>


      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Trends</h3>
          <div className="space-y-4">
            {[
              { platform: 'Instagram', trend: 'up', value: '+15%', color: 'bg-pink-500' },
              { platform: 'Facebook', trend: 'down', value: '-5%', color: 'bg-blue-500' },
              { platform: 'Twitter', trend: 'up', value: '+8%', color: 'bg-sky-500' },
              { platform: 'LinkedIn', trend: 'up', value: '+12%', color: 'bg-blue-600' },
            ].map((platform, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${platform.color}`}></div>
                  <span className="font-medium text-gray-900">{platform.platform}</span>
                </div>
                <span className={`font-semibold ${
                  platform.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {platform.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Content</h3>
          <div className="space-y-3">
            {[
              { title: 'Summer Sale Announcement', engagement: '15.2K', platform: 'Instagram' },
              { title: 'Product Tutorial', engagement: '12.8K', platform: 'YouTube' },
              { title: 'Team Introduction', engagement: '9.4K', platform: 'Facebook' },
            ].map((content, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{content.title}</p>
                  <p className="text-sm text-gray-500">{content.platform}</p>
                </div>
                <span className="font-semibold text-gray-900">{content.engagement}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}