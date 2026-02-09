# Gamification System Flow

## User Journey Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Login                               │
│                             ↓                                    │
│                   Fetch Gamification Data                        │
│              (points, streak, badges, next milestone)            │
└─────────────────────────────────────────────────────────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Student Dashboard                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Stats Cards: Points | Completed | Hours | Progress     │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Streak Display            Badge Grid                    │   │
│  │  ┌─────────────┐           ┌───┬───┬───┬───┬───┬───┬──┐│   │
│  │  │ 🔥 5 days   │           │🔥 │⭐ │💎 │🏆 │👑 │🌟 │🎯││   │
│  │  │ Longest: 8  │           │ ✓ │ 🔒│🔒 │🔒 │🔒 │🔒 │🔒││   │
│  │  │ Next: 7-Day │           └───┴───┴───┴───┴───┴───┴──┘│   │
│  │  │ (2 days)    │                                         │   │
│  │  └─────────────┘                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  How are you feeling today?                              │   │
│  │  [ 😢 ] [ 😟 ] [ 😐 ] [ 😊 ] [ 😁 ]                     │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                             ↓
                      User Selects Mood
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                   Backend Processing Flow                        │
└─────────────────────────────────────────────────────────────────┘

1. Sentiment Analysis (AI Engine)
   ↓
2. Mood Entry Creation
   ↓
3. Gamification Logic
   ├─ Check Last Check-In Date
   │  ├─ No Previous Check-In → Start 1-day streak
   │  ├─ Same Day → No streak increment (points still awarded)
   │  ├─ Consecutive Day → Increment streak by 1
   │  └─ Missed Day → Reset streak to 1
   ├─ Award 10 Points
   ├─ Update Longest Streak (if exceeded)
   └─ Check Badge Milestones
      ├─ 7 days → 🔥 7-Day Warrior
      ├─ 14 days → ⭐ Fortnight Champion
      ├─ 30 days → 💎 Monthly Master
      ├─ 60 days → 🏆 Semester Star
      ├─ 100 days → 👑 100-Day Hero
      ├─ 180 days → 🌟 Half-Year Hero
      └─ 365 days → 🎯 Year Legend
   ↓
4. Save to Database
   ↓
5. Return Response with:
   - Mood entry
   - Updated gamification data
   - New badges (if any)
   - Streak metadata

                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend Response Handling                    │
└─────────────────────────────────────────────────────────────────┘

IF new badge unlocked:
   ↓
┌─────────────────────────────────────────────────────────────────┐
│                    🎉 Badge Unlock Modal 🎉                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              ✨ Badge Unlocked! ✨                       │   │
│  │                                                           │   │
│  │                    🔥 (animated)                         │   │
│  │                                                           │   │
│  │                  7-Day Warrior                           │   │
│  │         Check in for 7 consecutive days                  │   │
│  │                                                           │   │
│  │           +10 points earned from this check-in!          │   │
│  │                                                           │   │
│  │               [ Awesome! ]                               │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                             ↓
Update UI:
- Refresh gamification data
- Update streak display
- Update badge grid
- Update points in stats
- Show sentiment analysis result
- Add to mood history visualization
```

## Streak Calculation Logic

```
┌─────────────────────────────────────────────────────────────────┐
│                    Streak Decision Tree                          │
└─────────────────────────────────────────────────────────────────┘

User checks in
    ↓
Is this first check-in ever?
    YES → Set streak = 1, award points
    ↓ NO
Is check-in on same day as last?
    YES → Keep streak, award points, set sameDay flag
    ↓ NO
Is check-in exactly 1 day after last?
    YES → Increment streak, award points, set streakIncremented flag
    ↓ NO
Is check-in 2+ days after last?
    YES → Reset streak = 1, award points, set streakReset flag

After streak update:
    ↓
Is current streak > longest streak?
    YES → Update longest streak
    ↓
Update lastCheckIn to now
    ↓
Check all badge milestones
    ↓
Award badges for reached milestones (if not already earned)
    ↓
Save to database
```

## Date Comparison Algorithm

```
┌─────────────────────────────────────────────────────────────────┐
│                   UTC Date Comparison                            │
└─────────────────────────────────────────────────────────────────┘

isSameDay(date1, date2):
    Extract: year1, month1, day1 (UTC)
    Extract: year2, month2, day2 (UTC)
    Return: (year1 === year2) AND (month1 === month2) AND (day1 === day2)

isConsecutiveDay(lastCheckIn, currentDate):
    Convert lastCheckIn to UTC midnight
    Convert currentDate to UTC midnight
    Calculate difference in milliseconds
    Convert to days: difference / (1000 * 60 * 60 * 24)
    Return: difference === 1

Why UTC?
- Consistent across all timezones
- Prevents edge cases where user travels
- Ensures fair streak calculation
- Avoids daylight saving time issues
```

## Data Flow Diagram

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Frontend   │────▶│   Backend    │────▶│   Database   │
│ (React/JSX)  │     │ (Express.js) │     │  (MongoDB)   │
└──────────────┘     └──────────────┘     └──────────────┘
       │                     │                     │
       │  POST /api/moods    │                     │
       │ mood, emoji, sent.  │                     │
       │────────────────────▶│                     │
       │                     │ Find user           │
       │                     │────────────────────▶│
       │                     │◀────────────────────│
       │                     │ User document       │
       │                     │                     │
       │                     │ Calculate streak    │
       │                     │ Award points        │
       │                     │ Check badges        │
       │                     │                     │
       │                     │ Update user         │
       │                     │────────────────────▶│
       │                     │◀────────────────────│
       │                     │ Success             │
       │◀────────────────────│                     │
       │ Gamification data   │                     │
       │                     │                     │
       │ GET /gamification   │                     │
       │────────────────────▶│                     │
       │                     │ Find user           │
       │                     │────────────────────▶│
       │                     │◀────────────────────│
       │◀────────────────────│ Gamification data   │
       │ Next badge milestone│                     │
```

## Component Hierarchy

```
StudentDashboard
├── Navbar
├── Sidebar
├── Stats Cards
│   └── Points Card (gamification.points)
├── Gamification Section
│   ├── StreakDisplay
│   │   ├── Current Streak
│   │   ├── Longest Streak
│   │   └── Next Badge Progress
│   └── BadgeGrid
│       ├── Badge Card (7-Day Warrior) - Earned
│       ├── Badge Card (Fortnight) - Locked
│       ├── Badge Card (Monthly) - Locked
│       ├── Badge Card (Semester) - Locked
│       ├── Badge Card (100-Day) - Locked
│       ├── Badge Card (Half-Year) - Locked
│       └── Badge Card (Year Legend) - Locked
├── Mood Check-In Section
│   └── Mood Buttons (5 emojis)
├── Tasks & Activity
└── BadgeUnlockModal (conditional)
    ├── Celebration Header
    ├── Badge Icon (animated)
    ├── Badge Details
    └── Close Button
```

## State Management Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         React State                              │
└─────────────────────────────────────────────────────────────────┘

Initial State:
{
  gamification: {
    points: 0,
    currentStreak: 0,
    longestStreak: 0,
    badges: []
  },
  nextBadge: null,
  newBadgeUnlocked: null
}

On Mount:
  fetchGamificationData()
    ↓
  GET /api/moods/gamification
    ↓
  Update state with server data

On Mood Check-In:
  handleMoodClick(mood)
    ↓
  POST /api/moods
    ↓
  Response includes gamification data
    ↓
  Update gamification state
    ↓
  IF newBadges.length > 0:
    Set newBadgeUnlocked state
    ↓
    BadgeUnlockModal renders
    ↓
  fetchGamificationData() (refresh next milestone)

User Closes Modal:
  setNewBadgeUnlocked(null)
    ↓
  Modal unmounts
```

## Badge Unlock Animation Sequence

```
1. Mood check-in completes
2. Server detects streak milestone reached
3. Badge added to user.gamification.badges
4. Response includes newBadges array
5. Frontend receives response
6. newBadgeUnlocked state updated
7. BadgeUnlockModal component mounts
8. Modal fades in with backdrop
9. Badge icon scales from 0 to 100% with rotation
10. Sparkles icon pulses
11. Badge details slide in
12. User clicks "Awesome!" button
13. Modal fades out
14. Component unmounts
15. Dashboard shows updated badge grid
```

## Error Handling Flow

```
Error Scenarios:

1. Network Error:
   POST /api/moods fails
   ↓
   Catch error in frontend
   ↓
   Show error alert
   ↓
   Gamification state unchanged

2. Authentication Error:
   No valid token
   ↓
   Middleware rejects request
   ↓
   401 Unauthorized
   ↓
   Redirect to login

3. Invalid Mood Data:
   Mood < 1 or > 5
   ↓
   Server validation fails
   ↓
   400 Bad Request
   ↓
   Show validation error

4. Database Error:
   MongoDB connection lost
   ↓
   500 Internal Server Error
   ↓
   Show generic error message
   ↓
   Log error for debugging
```

## Performance Optimization

```
Optimization Strategies:

1. Data Fetching:
   - Load gamification data once on mount
   - Update locally after actions
   - Re-fetch only when necessary

2. Badge Checking:
   - O(7) complexity (7 badges)
   - Runs server-side only
   - No impact on frontend performance

3. State Updates:
   - Minimize re-renders with React.memo
   - Use callback refs for stable functions
   - Avoid unnecessary state updates

4. Database:
   - Gamification embedded in User document
   - No joins required
   - Single query per operation
   - Index on user ID
```
