const User = require('../models/User');

const BADGE_DEFINITIONS = {
  WEEK_WARRIOR: {
    id: 'week_warrior',
    name: '7-Day Warrior',
    icon: '🔥',
    description: 'Check in for 7 consecutive days',
    streakRequired: 7
  },
  FORTNIGHT_CHAMPION: {
    id: 'fortnight_champion',
    name: 'Fortnight Champion',
    icon: '⭐',
    description: 'Check in for 14 consecutive days',
    streakRequired: 14
  },
  MONTHLY_MASTER: {
    id: 'monthly_master',
    name: 'Monthly Master',
    icon: '💎',
    description: 'Check in for 30 consecutive days',
    streakRequired: 30
  },
  SEMESTER_STAR: {
    id: 'semester_star',
    name: 'Semester Star',
    icon: '🏆',
    description: 'Check in for 60 consecutive days',
    streakRequired: 60
  },
  HUNDRED_HERO: {
    id: 'hundred_hero',
    name: '100-Day Hero',
    icon: '👑',
    description: 'Check in for 100 consecutive days',
    streakRequired: 100
  },
  HALF_YEAR_HERO: {
    id: 'half_year_hero',
    name: 'Half-Year Hero',
    icon: '🌟',
    description: 'Check in for 180 consecutive days',
    streakRequired: 180
  },
  YEAR_LEGEND: {
    id: 'year_legend',
    name: 'Year Legend',
    icon: '🎯',
    description: 'Check in for 365 consecutive days',
    streakRequired: 365
  }
};

const POINTS_PER_CHECKIN = 10;

const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (
    d1.getUTCFullYear() === d2.getUTCFullYear() &&
    d1.getUTCMonth() === d2.getUTCMonth() &&
    d1.getUTCDate() === d2.getUTCDate()
  );
};

const isConsecutiveDay = (lastCheckIn, currentDate) => {
  const last = new Date(lastCheckIn);
  const current = new Date(currentDate);
  
  const lastUTC = Date.UTC(last.getUTCFullYear(), last.getUTCMonth(), last.getUTCDate());
  const currentUTC = Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), current.getUTCDate());
  
  const dayDiff = (currentUTC - lastUTC) / (1000 * 60 * 60 * 24);
  return dayDiff === 1;
};

const userHasBadge = (user, badgeId) => {
  if (!user.gamification || !user.gamification.badges) return false;
  return user.gamification.badges.some(badge => badge.id === badgeId);
};

const checkAndAwardBadges = (user, newStreak) => {
  const newBadges = [];
  
  Object.values(BADGE_DEFINITIONS).forEach(badgeDef => {
    if (newStreak >= badgeDef.streakRequired && !userHasBadge(user, badgeDef.id)) {
      const badge = {
        id: badgeDef.id,
        name: badgeDef.name,
        icon: badgeDef.icon,
        description: badgeDef.description,
        earnedAt: new Date()
      };
      user.gamification.badges.push(badge);
      newBadges.push(badge);
    }
  });
  
  return newBadges;
};

const logMood = async (req, res) => {
  try {
    const { mood, emoji, sentiment } = req.body;

    if (!mood || !emoji) {
      return res.status(400).json({ message: 'Mood and emoji are required' });
    }

    if (mood < 1 || mood > 5) {
      return res.status(400).json({ message: 'Mood must be between 1 and 5' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const now = new Date();
    let streakIncremented = false;
    let streakReset = false;
    let sameDay = false;

    if (!user.gamification) {
      user.gamification = {
        points: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastCheckIn: null,
        badges: []
      };
    }

    if (!user.gamification.lastCheckIn) {
      user.gamification.currentStreak = 1;
      user.gamification.points += POINTS_PER_CHECKIN;
      streakIncremented = true;
    } else if (isSameDay(user.gamification.lastCheckIn, now)) {
      sameDay = true;
    } else if (isConsecutiveDay(user.gamification.lastCheckIn, now)) {
      user.gamification.currentStreak += 1;
      user.gamification.points += POINTS_PER_CHECKIN;
      streakIncremented = true;
    } else {
      user.gamification.currentStreak = 1;
      user.gamification.points += POINTS_PER_CHECKIN;
      streakReset = true;
    }

    if (user.gamification.currentStreak > user.gamification.longestStreak) {
      user.gamification.longestStreak = user.gamification.currentStreak;
    }

    user.gamification.lastCheckIn = now;

    const newBadges = checkAndAwardBadges(user, user.gamification.currentStreak);

    const moodEntry = {
      mood,
      emoji,
      timestamp: now,
      sentiment: sentiment || null,
    };

    user.moodLogs.push(moodEntry);
    await user.save();

    return res.status(201).json({
      message: 'Mood logged successfully',
      moodEntry,
      gamification: {
        points: user.gamification.points,
        currentStreak: user.gamification.currentStreak,
        longestStreak: user.gamification.longestStreak,
        badges: user.gamification.badges,
        newBadges,
        streakIncremented,
        streakReset,
        sameDay
      },
      moodHistory: user.moodLogs,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to log mood', error: error.message });
  }
};

const getMoodHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('moodLogs');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ moodHistory: user.moodLogs });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch mood history', error: error.message });
  }
};

const getGamificationData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('gamification');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const gamification = user.gamification || {
      points: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastCheckIn: null,
      badges: []
    };

    const nextBadgeMilestone = Object.values(BADGE_DEFINITIONS)
      .filter(badge => !userHasBadge(user, badge.id))
      .sort((a, b) => a.streakRequired - b.streakRequired)[0];

    return res.status(200).json({ 
      gamification,
      nextBadgeMilestone: nextBadgeMilestone ? {
        name: nextBadgeMilestone.name,
        icon: nextBadgeMilestone.icon,
        description: nextBadgeMilestone.description,
        daysRequired: nextBadgeMilestone.streakRequired,
        daysRemaining: Math.max(0, nextBadgeMilestone.streakRequired - gamification.currentStreak)
      } : null
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch gamification data', error: error.message });
  }
};

module.exports = {
  logMood,
  getMoodHistory,
  getGamificationData
};
