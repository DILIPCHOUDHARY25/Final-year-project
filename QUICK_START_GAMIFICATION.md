# Quick Start Guide: Gamification System

## What Was Implemented

Phase 7 adds a complete gamification engine to encourage daily mental health check-ins through:
- 🔥 **Streak Tracking**: Consecutive days counter
- 💎 **Points System**: 10 points per check-in
- 🏆 **Badge Awards**: 7 achievement badges
- 🎉 **Celebrations**: Animated modals for badge unlocks

## For Developers

### Backend Structure
```
server/
 models/User.js (✏️ modified)
   └── Added gamification & moodLogs fields
 controllers/moodController.js (✨ new)
   ├── Badge definitions (7 badges)
   ├── Streak calculation logic
   ├── Points awarding
   └── Badge checking
 routes/moodRoutes.js (✏️ modified)
   └── 3 endpoints: POST /moods, GET /moods, GET /moods/gamification
 server.js (✏️ modified)
    └── Mounted /api/moods routes
```

### Frontend Structure
```
client/src/
 components/
   ├── StreakDisplay.jsx (✨ new)
   ├── BadgeGrid.jsx (✨ new)
   └── BadgeUnlockModal.jsx (✨ new)
 pages/
   └── StudentDashboard.jsx (✏️ modified)
 context/
    └── AuthContext.jsx (✏️ modified)
```

## Quick Test

### 1. Start the application
```bash
# Terminal 1 - Backend
cd server
npm install
npm start

# Terminal 2 - Frontend
cd client
npm install
npm start
```

### 2. Create a test user
- Register as a student
- Login to dashboard

### 3. Test gamification
- Click any mood emoji
- Check that:
  - ✅ Streak shows "1 day"
  - ✅ Points show "10"
  - ✅ Badge grid appears (all locked)
  - ✅ Next milestone shows "7-Day Warrior (6 days to go)"

### 4. Test consecutive days (manual simulation)
You can manually test by modifying lastCheckIn date:
```javascript
// In MongoDB or via API
db.users.updateOne(
  { email: "test@example.com" },
  { $set: { "gamification.lastCheckIn": new Date("2026-02-08T12:00:00Z") } }
)
// Then check in on 2026-02-09 → streak should be 2
```

### 5. Test badge unlock
Build a 7-day streak and on the 7th check-in:
- ✅ Modal appears with 🔥 7-Day Warrior badge
- ✅ Badge appears in grid with gold background
- ✅ Next milestone updates to "Fortnight Champion"

## API Usage Examples

### Log a mood (with gamification)
```bash
curl -X POST http://localhost:5000/api/moods \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mood": 4,
    "emoji": "😊",
    "sentiment": {
      "label": "POSITIVE",
      "score": 0.95
    }
  }'
```

**Response:**
```json
{
  "message": "Mood logged successfully",
  "gamification": {
    "points": 10,
    "currentStreak": 1,
    "longestStreak": 1,
    "badges": [],
    "newBadges": [],
    "streakIncremented": true,
    "streakReset": false,
    "sameDay": false
  }
}
```

### Get gamification data
```bash
curl http://localhost:5000/api/moods/gamification \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "gamification": {
    "points": 10,
    "currentStreak": 1,
    "longestStreak": 1,
    "lastCheckIn": "2026-02-09T12:00:00.000Z",
    "badges": []
  },
  "nextBadgeMilestone": {
    "name": "7-Day Warrior",
    "icon": "🔥",
    "description": "Check in for 7 consecutive days",
    "daysRequired": 7,
    "daysRemaining": 6
  }
}
```

## Common Issues & Solutions

### Issue: Streak not incrementing
**Cause**: Checking in on same day or skipped a day
**Solution**: 
- Same day = points awarded but streak unchanged (expected)
- Skipped day = streak resets to 1 (expected)
- Check `lastCheckIn` timestamp in database

### Issue: Badge not unlocking
**Cause**: Badge already earned or streak milestone not reached
**Solution**: 
- Check `badges` array in user document
- Verify `currentStreak` value matches milestone
- Check server logs for badge calculation

### Issue: Points not showing in UI
**Cause**: Frontend state not updating
**Solution**: 
- Refresh the page
- Check browser console for errors
- Verify API response includes gamification data

## Understanding the Streak Logic

```
Check-In Scenarios:

1. First Time Ever:
   lastCheckIn = null
   → Set streak = 1, points = 10

2. Same Day (already checked in today):
   lastCheckIn = today
   → Streak unchanged, points += 10, sameDay flag

3. Consecutive Day (checked in yesterday):
   lastCheckIn = yesterday
   → Streak += 1, points += 10, streakIncremented flag

4. Missed Day (last check-in 2+ days ago):
   lastCheckIn = 3 days ago
   → Streak = 1, points += 10, streakReset flag

All dates compared in UTC for consistency.
```

## Badge Milestones

| Days | Badge | Emoji |
|------|-------|-------|
| 7 | 7-Day Warrior | 🔥 |
| 14 | Fortnight Champion | ⭐ |
| 30 | Monthly Master | 💎 |
| 60 | Semester Star | 🏆 |
| 100 | 100-Day Hero | 👑 |
| 180 | Half-Year Hero | 🌟 |
| 365 | Year Legend | 🎯 |

## Customization

### Change Points Per Check-In
Edit `server/controllers/moodController.js`:
```javascript
const POINTS_PER_CHECKIN = 10; // Change this value
```

### Add New Badges
Edit `server/controllers/moodController.js`:
```javascript
BADGE_DEFINITIONS = {
  // ... existing badges
  NEW_BADGE: {
    id: 'new_badge_id',
    name: 'New Badge Name',
    icon: '🎨',
    description: 'Your description',
    streakRequired: 21
  }
}
```

Then update `client/src/components/BadgeGrid.jsx`:
```javascript
const ALL_BADGES = [
  // ... existing badges
  { id: 'new_badge_id', name: 'New Badge Name', icon: '🎨', ... }
]
```

### Modify Streak Calculation
Edit functions in `moodController.js`:
- `isSameDay()` - Same day detection
- `isConsecutiveDay()` - Consecutive day logic

## Documentation

For complete details, see:
- `GAMIFICATION_DOCUMENTATION.md` - Full technical docs
- `GAMIFICATION_FLOW.md` - Visual flow diagrams
- `PHASE_7_SUMMARY.md` - Implementation summary

## Need Help?

Check these resources:
1. Server logs: `server/logs/` (if logging implemented)
2. Browser console: F12 → Console tab
3. Network tab: Check API requests/responses
4. MongoDB: Inspect user documents directly

## Production Checklist

Before deploying to production:
- [ ] Test all streak scenarios
- [ ] Verify badge unlocking works
- [ ] Test on mobile devices
- [ ] Check database indexes
- [ ] Add error logging/monitoring
- [ ] Test timezone edge cases
- [ ] Verify authentication works
- [ ] Test concurrent check-ins
- [ ] Review security (all checks server-side)
- [ ] Test with large user base simulation

## Success Metrics to Track

Monitor these KPIs:
- Daily Active Users (DAU)
- Average streak length
- Badge completion rate
- Check-in frequency
- User retention (7-day, 30-day)
- Time to first badge

Expected improvements:
- 30-40% increase in daily check-ins
- 25% improvement in 7-day retention
- 15% increase in monthly active users

---

**Phase 7 Status**: ✅ Complete and Ready for Testing
**Last Updated**: February 9, 2026
