import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Calendar, MessageCircle, Settings, X, Users } from 'lucide-react';
import { cn } from '../lib/utils.js';

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { to: '/dashboard', icon: Home, label: 'Dashboard' },
    { to: '/peer-support', icon: Users, label: 'Peer Support' },
    { to: '/courses', icon: BookOpen, label: 'Courses' },
    { to: '/schedule', icon: Calendar, label: 'Schedule' },
    { to: '/messages', icon: MessageCircle, label: 'Messages' },
    { to: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 lg:hidden">
          <span className="text-lg font-semibold text-gray-900">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => onClose()}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )
              }
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;
