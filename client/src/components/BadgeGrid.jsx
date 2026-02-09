import { Award, Lock } from 'lucide-react';

const ALL_BADGES = [
  { id: 'week_warrior', name: '7-Day Warrior', icon: '🔥', description: 'Check in for 7 consecutive days', streakRequired: 7 },
  { id: 'fortnight_champion', name: 'Fortnight Champion', icon: '⭐', description: 'Check in for 14 consecutive days', streakRequired: 14 },
  { id: 'monthly_master', name: 'Monthly Master', icon: '💎', description: 'Check in for 30 consecutive days', streakRequired: 30 },
  { id: 'semester_star', name: 'Semester Star', icon: '🏆', description: 'Check in for 60 consecutive days', streakRequired: 60 },
  { id: 'hundred_hero', name: '100-Day Hero', icon: '👑', description: 'Check in for 100 consecutive days', streakRequired: 100 },
  { id: 'half_year_hero', name: 'Half-Year Hero', icon: '🌟', description: 'Check in for 180 consecutive days', streakRequired: 180 },
  { id: 'year_legend', name: 'Year Legend', icon: '🎯', description: 'Check in for 365 consecutive days', streakRequired: 365 },
];

const BadgeGrid = ({ earnedBadges = [], currentStreak = 0 }) => {
  const hasBadge = (badgeId) => {
    return earnedBadges.some(badge => badge.id === badgeId);
  };

  const getBadgeEarnedDate = (badgeId) => {
    const badge = earnedBadges.find(b => b.id === badgeId);
    return badge ? new Date(badge.earnedAt).toLocaleDateString() : null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Award className="h-5 w-5 text-primary-600" />
          <h2 className="text-lg font-semibold text-gray-900">Achievements</h2>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Earned {earnedBadges.length} of {ALL_BADGES.length} badges
        </p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_BADGES.map((badge) => {
            const earned = hasBadge(badge.id);
            const earnedDate = getBadgeEarnedDate(badge.id);
            const canEarnSoon = !earned && currentStreak >= badge.streakRequired * 0.7;
            
            return (
              <div
                key={badge.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  earned
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-md'
                    : canEarnSoon
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {earned ? (
                      <span className="text-4xl">{badge.icon}</span>
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <Lock className="h-6 w-6 text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm font-semibold ${earned ? 'text-gray-900' : 'text-gray-600'}`}>
                      {badge.name}
                    </h3>
                    <p className={`text-xs mt-1 ${earned ? 'text-gray-600' : 'text-gray-500'}`}>
                      {badge.description}
                    </p>
                    {earned && earnedDate && (
                      <p className="text-xs text-green-600 mt-2 font-medium">
                        ✓ Earned on {earnedDate}
                      </p>
                    )}
                    {!earned && (
                      <p className="text-xs text-gray-500 mt-2">
                        {canEarnSoon ? '🎯 Almost there!' : `🔒 ${badge.streakRequired} day streak`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {earnedBadges.length === 0 && (
          <div className="text-center py-8">
            <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No badges earned yet</p>
            <p className="text-sm text-gray-500 mt-1">
              Keep checking in daily to earn your first badge!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeGrid;
