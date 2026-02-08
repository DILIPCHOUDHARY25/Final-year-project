import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatWidget from '../components/ChatWidget';
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  MessageSquare,
  Activity,
} from 'lucide-react';

const StudentDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const stats = [
    {
      title: 'Courses',
      value: '4',
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Completed',
      value: '12',
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: 'Hours Studied',
      value: '48',
      icon: Clock,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: 'Progress',
      value: '78%',
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-600',
    },
  ];

  const upcomingTasks = [
    { id: 1, title: 'Math Assignment', due: 'Today, 11:59 PM', completed: false },
    { id: 2, title: 'Psychology Essay', due: 'Tomorrow, 5:00 PM', completed: false },
    { id: 3, title: 'Group Project Meeting', due: 'Wed, 3:00 PM', completed: true },
    { id: 4, title: 'Quiz: Chapter 5', due: 'Fri, 12:00 PM', completed: false },
  ];

  const recentActivity = [
    { id: 1, text: 'Completed "Introduction to Psychology" module', time: '2 hours ago' },
    { id: 2, text: 'Started new course: "Stress Management"', time: '5 hours ago' },
    { id: 3, text: 'Achieved 90% on Calculus Quiz', time: '1 day ago' },
    { id: 4, text: 'Joined study group: "Midterm Prep"', time: '2 days ago' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 lg:ml-0">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="mt-1 text-gray-600">
                Here's what's happening with your learning journey
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5 text-primary-600" />
                      <h2 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h2>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="space-y-4">
                      {upcomingTasks.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                task.completed
                                  ? 'bg-green-500 border-green-500'
                                  : 'border-gray-300'
                              }`}
                            >
                              {task.completed && (
                                <CheckCircle className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <span
                              className={`text-sm sm:text-base ${
                                task.completed ? 'line-through text-gray-400' : 'text-gray-900'
                              }`}
                            >
                              {task.title}
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm text-gray-500">{task.due}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-5 w-5 text-primary-600" />
                      <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">{activity.text}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-5 w-5 text-primary-600" />
                      <h2 className="text-lg font-semibold text-gray-900">AI Assistant</h2>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <p className="text-sm text-gray-600 mb-4">
                      Chat with MindFull for mental health support and study tips.
                    </p>
                    <div className="bg-primary-50 p-4 rounded-lg">
                      <p className="text-xs text-primary-700">
                        💡 Tip: Try asking "How can I manage exam stress?" or "What are some good
                        study techniques?"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl shadow-sm p-4 sm:p-6 text-white">
                  <h3 className="text-lg font-semibold mb-2">Daily Motivation</h3>
                  <p className="text-sm text-primary-100">
                    "Success is not final, failure is not fatal: it is the courage to continue that
                    counts."
                  </p>
                  <p className="text-xs text-primary-200 mt-2">- Winston Churchill</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <ChatWidget />
    </div>
  );
};

export default StudentDashboard;
