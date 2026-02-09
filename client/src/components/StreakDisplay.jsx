import { Flame } from 'lucide-react';

const StreakDisplay = ({ currentStreak, longestStreak, nextBadge }) => {
  return (
    <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-sm p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Daily Streak</h3>
        <Flame className="h-6 w-6 animate-pulse" />
      </div>
      
      <div className="flex items-baseline space-x-2 mb-4">
        <span className="text-5xl font-bold">{currentStreak}</span>
        <span className="text-xl text-orange-100">days</span>
      </div>
      
      <div className="flex items-center justify-between text-sm text-orange-100 mb-4">
        <span>Longest streak: {longestStreak} days</span>
      </div>
      
      {nextBadge && (
        <div className="mt-4 pt-4 border-t border-orange-400">
          <p className="text-sm text-orange-100 mb-2">Next milestone:</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{nextBadge.icon}</span>
              <div>
                <p className="font-semibold text-sm">{nextBadge.name}</p>
                <p className="text-xs text-orange-200">{nextBadge.daysRequired} days</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">{nextBadge.daysRemaining}</p>
              <p className="text-xs text-orange-200">days to go</p>
            </div>
          </div>
        </div>
      )}
      
      {currentStreak === 0 && (
        <div className="mt-4 p-3 bg-orange-400 bg-opacity-30 rounded-lg">
          <p className="text-sm">
            🎯 Check in daily to build your streak and earn badges!
          </p>
        </div>
      )}
    </div>
  );
};

export default StreakDisplay;
