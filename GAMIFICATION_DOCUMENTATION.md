# Gamification Engine Documentation

## Overview
Phase 7 implements a comprehensive gamification system for daily mood check-ins with streak tracking, points system, and badge awards to encourage consistent mental health check-ins.

## Features

### 1. Streak Tracking
- **Current Streak**: Tracks consecutive days of mood check-ins
- **Longest Streak**: Records the user's best streak achievement
- **Last Check-In**: Timestamps the most recent check-in (UTC)

#### Streak Logic
- **First Check-In**: Starts a 1-day streak
- **Consecutive Day**: Increments streak by 1 (must be exactly 24 hours apart)
- **Same Day**: Multiple check-ins on the same day don't increment streak
- **Missed Day**: Resets streak to 1 on next check-in
- **UTC Time**: All date comparisons use UTC to ensure consistency across timezones

### 2. Points System
- **10 points** awarded per mood check-in
- Points accumulate indefinitely
- Displayed prominently in dashboard stats
- Foundation for future reward redemption system

### 3. Badge System
Seven milestone badges based on streak achievements:

| Badge | Streak Required | Icon | Description |
|-------|----------------|------|-------------|
| 7-Day Warrior | 7 days | 🔥 | Check in for 7 consecutive days |
| Fortnight Champion | 14 days | ⭐ | Check in for 14 consecutive days |
| Monthly Master | 30 days | 💎 | Check in for 30 consecutive days |
| Semester Star | 60 days | 🏆 | Check in for 60 consecutive days |
| 100-Day Hero | 100 days | 👑 | Check in for 100 consecutive days |
| Half-Year Hero | 180 days | 🌟 | Check in for 180 consecutive days |
| Year Legend | 365 days | 🎯 | Check in for 365 consecutive days |

#### Badge Features
- Automatically awarded when streak milestone is reached
- Cannot earn the same badge twice
- Celebratory modal animation on unlock
- Visual grid showing earned and locked badges
- "Next milestone" indicator showing progress to next badge

## Backend Implementation

### Data Model
**User Schema** (server/models/User.js)
```javascript
{
  gamification: {
    points: Number (default: 0),
    currentStreak: Number (default: 0),
    longestStreak: Number (default: 0),
    lastCheckIn: Date (default: null),
    badges: [{
      id: String,
      name: String,
      icon: String,
      description: String,
      earnedAt: Date
    }]
  },
  moodLogs: [{
    mood: Number (1-5),
    emoji: String,
    timestamp: Date,
    sentiment: {
      label: String,
      score: Number
    }
  }]
}
```

### API Endpoints

#### POST /api/moods
Logs a mood check-in and processes gamification logic.

**Request:**
```json
{
  "mood": 4,
  "emoji": "😊",
  "sentiment": {
    "label": "POSITIVE",
    "score": 0.95
  }
}
```

**Response:**
```json
{
  "message": "Mood logged successfully",
  "moodEntry": { /* mood entry */ },
  "gamification": {
    "points": 50,
    "currentStreak": 5,
    "longestStreak": 5,
    "badges": [ /* badge array */ ],
    "newBadges": [ /* newly unlocked badges */ ],
    "streakIncremented": true,
    "streakReset": false,
    "sameDay": false
  },
  "moodHistory": [ /* all mood entries */ ]
}
```

#### GET /api/moods/gamification
Retrieves user's gamification data and next badge milestone.

**Response:**
```json
{
  "gamification": {
    "points": 50,
    "currentStreak": 5,
    "longestStreak": 5,
    "lastCheckIn": "2026-02-09T07:00:00.000Z",
    "badges": [ /* badge array */ ]
  },
  "nextBadgeMilestone": {
    "name": "7-Day Warrior",
    "icon": "🔥",
    "description": "Check in for 7 consecutive days",
    "daysRequired": 7,
    "daysRemaining": 2
  }
}
```

#### GET /api/moods
Retrieves mood history (existing endpoint).

**Response:**
```json
{
  "moodHistory": [ /* mood entries */ ]
}
```

### Core Functions

#### isSameDay(date1, date2)
Compares two dates using UTC to determine if they're the same calendar day.

#### isConsecutiveDay(lastCheckIn, currentDate)
Checks if current check-in is exactly one day after the last check-in.

#### userHasBadge(user, badgeId)
Checks if user already has a specific badge to prevent duplicates.

#### checkAndAwardBadges(user, newStreak)
Evaluates streak against all badge milestones and awards new badges.

## Frontend Implementation

### Components

#### StreakDisplay.jsx
Displays current streak with fire animation, longest streak, and next badge milestone progress.

**Props:**
- `currentStreak` (number): Current consecutive days
- `longestStreak` (number): Best streak achieved
- `nextBadge` (object): Next milestone info

**Features:**
- Gradient orange-to-red background
- Animated flame icon
- Days remaining countdown
- Motivational prompt when streak is 0

#### BadgeGrid.jsx
Grid layout showing all badges (earned and locked).

**Props:**
- `earnedBadges` (array): Array of earned badge objects
- `currentStreak` (number): Current streak for "almost there" hints

**Features:**
- Earned badges: Gold gradient background with earned date
- Locked badges: Gray background with lock icon
- "Almost there" hint for badges at 70% progress
- Empty state message for new users

#### BadgeUnlockModal.jsx
Celebratory modal that appears when user unlocks a badge.

**Props:**
- `badge` (object): The newly unlocked badge
- `onClose` (function): Close handler

**Features:**
- Full-screen overlay
- Gradient background with sparkles
- Scale-in animation
- Badge icon with rotation effect
- Points reward notification

### Integration in StudentDashboard

1. **State Management**: Tracks gamification data, next badge, and new badge unlocks
2. **Data Fetching**: Loads gamification data on mount via `fetchGamificationData()`
3. **Mood Check-In**: Updates gamification state after mood submission
4. **UI Components**: 
   - Points displayed in stats cards
   - Streak display in prominent position
   - Badge grid shows all achievements
   - Modal appears for new badge unlocks

## User Flow

1. **First Check-In**:
   - User selects mood emoji
   - Sentiment analysis runs
   - Streak starts at 1 day
   - Earns 10 points
   - Data saved to database

2. **Consecutive Check-Ins**:
   - Each consecutive day increments streak
   - 10 points awarded per check-in
   - Badge check runs automatically
   - If milestone reached, modal celebrates unlock

3. **Same-Day Check-Ins**:
   - Allowed but don't increment streak
   - Points still awarded
   - Prevents gaming the system

4. **Missed Days**:
   - Streak resets to 1
   - Longest streak preserved
   - User encouraged to rebuild

5. **Badge Unlocking**:
   - Automatic check on each check-in
   - Modal appears immediately
   - Badge permanently saved
   - Progress shown toward next badge

## Testing Strategy

### Streak Logic Tests
- ✅ First check-in starts 1-day streak
- ✅ Consecutive days increment streak
- ✅ Same-day check-ins don't increment
- ✅ Missed days reset streak
- ✅ Longest streak updates correctly
- ✅ UTC time prevents timezone issues

### Points Tests
- ✅ 10 points per check-in
- ✅ Points accumulate correctly
- ✅ Points display in UI

### Badge Tests
- ✅ Badges unlock at correct milestones
- ✅ Cannot earn same badge twice
- ✅ All 7 badges defined and functional
- ✅ Next badge calculation correct
- ✅ "Days remaining" accurate

### Edge Cases
- ✅ Leap years handled correctly
- ✅ Month/year boundaries work
- ✅ Timezone consistency (UTC)
- ✅ Multiple check-ins same day
- ✅ Long gaps between check-ins

## Future Enhancements

### Planned Features
1. **Leaderboard**: Weekly/monthly rankings
2. **Streak Freezes**: "Vacation mode" to preserve streaks
3. **Custom Badges**: Achievement badges for other activities
4. **Points Redemption**: Exchange points for rewards
5. **Social Sharing**: Share achievements with friends
6. **Push Notifications**: Daily reminder to check in
7. **Streak Recovery**: One-time recovery if streak broken
8. **Team Challenges**: Compete with friends/classmates

### Extensibility
- Badge definitions easily configurable
- Points system can award variable amounts
- Gamification model supports additional fields
- API endpoints support pagination
- Frontend components accept custom styling

## Performance Considerations

1. **Database Queries**: 
   - Single query per check-in
   - Gamification data embedded in User document
   - No separate collections needed

2. **Frontend Caching**:
   - Gamification data fetched on mount
   - Local state updates after actions
   - Reduces unnecessary API calls

3. **Badge Calculation**:
   - O(n) complexity where n = number of badges (7)
   - Runs in milliseconds
   - No performance impact

## Maintenance

### Updating Badge Definitions
Edit `BADGE_DEFINITIONS` in `server/controllers/moodController.js` and `ALL_BADGES` in `client/src/components/BadgeGrid.jsx` to add new badges or modify existing ones.

### Adjusting Points
Change `POINTS_PER_CHECKIN` constant in `moodController.js`.

### Modifying Streak Logic
Core functions (`isSameDay`, `isConsecutiveDay`) can be customized for different streak rules.

## Security

- All endpoints protected by authentication middleware
- User can only access their own gamification data
- Badge awarding handled server-side (cannot be spoofed)
- Timestamps validated server-side
- No client-side manipulation possible

## Monitoring

Recommended metrics to track:
- Average streak length
- Badge unlock rate
- Daily active users (DAU)
- Check-in frequency
- Points distribution
- Badge completion rate
