import { X, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const BadgeUnlockModal = ({ badge, onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [badge]);

  if (!badge) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <div className="text-center">
            <Sparkles className="h-8 w-8 mx-auto mb-2 animate-pulse" />
            <h2 className="text-2xl font-bold mb-2">Badge Unlocked!</h2>
            <p className="text-yellow-100 text-sm">Congratulations on your achievement!</p>
          </div>
        </div>
        
        <div className="p-8 text-center">
          <div className={`transform transition-all duration-500 ${isAnimating ? 'scale-0 rotate-180' : 'scale-100 rotate-0'}`}>
            <span className="text-8xl inline-block mb-4">{badge.icon}</span>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{badge.name}</h3>
          <p className="text-gray-600 mb-6">{badge.description}</p>
          
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">+10 points</span> earned from this check-in!
            </p>
          </div>
          
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all transform hover:scale-105"
          >
            Awesome!
          </button>
        </div>
      </div>
    </div>
  );
};

export default BadgeUnlockModal;
