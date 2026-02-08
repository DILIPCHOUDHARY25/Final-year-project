import { Link } from 'react-router-dom';
import { Brain, Heart, Users, Sparkles } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Support',
      description: 'Get instant mental health support from our AI assistant MindFull, available 24/7.',
    },
    {
      icon: Heart,
      title: 'Wellness Tracking',
      description: 'Monitor your emotional well-being and receive personalized insights.',
    },
    {
      icon: Users,
      title: 'Connect',
      description: 'Stay connected with counselors and parents for additional support.',
    },
    {
      icon: Sparkles,
      title: 'Personalized Care',
      description: 'Receive tailored recommendations based on your unique needs.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-20 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary-600">MindfulStudent</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Your personal mental health companion. Get support, track your wellness,
            and connect with resources to help you thrive.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/register"
              className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg border-2 border-primary-600 hover:bg-primary-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>

        <div className="py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose MindfulStudent?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
