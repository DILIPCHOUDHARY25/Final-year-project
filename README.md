# MindFull - Mental Health Support Platform

A comprehensive mental health support platform for students with AI-powered assistance, mood tracking, and gamification features to encourage consistent mental health check-ins.

## Features

### Core Features
- **User Authentication**: Secure JWT-based authentication with role-based access (student, parent, educator, admin)
- **AI Mental Health Support**: Chat interface powered by AI for mental health guidance and support
- **Daily Mood Check-ins**: Track emotional well-being with sentiment analysis
- **Parent Verification**: OCR-based verification using government-issued ID cards
- **Peer Support Groups**: Community features for student support
- **Student Dashboard**: Comprehensive dashboard with mood tracking and gamification

### Phase 7: Gamification Engine (NEW)
- **🔥 Streak Tracking**: Track consecutive days of mood check-ins with automatic streak calculation
- **💎 Points System**: Earn 10 points per daily check-in, with points accumulating over time
- **🏆 Badge System**: Unlock 7 achievement badges based on streak milestones:
  - 🔥 7-Day Warrior (7 days)
  - ⭐ Fortnight Champion (14 days)
  - 💎 Monthly Master (30 days)
  - 🏆 Semester Star (60 days)
  - 👑 100-Day Hero (100 days)
  - 🌟 Half-Year Hero (180 days)
  - 🎯 Year Legend (365 days)
- **🎉 Badge Celebrations**: Animated modal when unlocking new achievements
- **📊 Progress Tracking**: Visual display of current streak, longest streak, and next milestone
- **🎯 Motivation**: "Days remaining" counter to encourage streak building

## Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Multer for file uploads
- Tesseract.js for OCR processing
- JWT for authentication

### Frontend
- React.js
- React Router for navigation
- Axios for API calls
- CSS for styling

## Installation

### Server
```bash
cd server
npm install
npm start
```

### Client
```bash
cd client
npm install
npm start
```

## Environment Variables

Create a `.env` file in the server directory based on `.env.example`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/parent_verification
JWT_SECRET=your_jwt_secret_here
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login existing user
- `POST /api/auth/verify-parent-id` - Verify parent ID (requires authentication)

### Mood Tracking & Gamification
- `POST /api/moods` - Log a mood check-in with gamification processing
- `GET /api/moods` - Retrieve mood history
- `GET /api/moods/gamification` - Get gamification data and next badge milestone

## Usage

### For Students
1. Register as a student user
2. Login to access the Student Dashboard
3. Check in daily by selecting your mood emoji
4. Build your streak to unlock badges and earn points
5. Chat with the AI assistant for mental health support
6. Track your progress and achievements

### For Parents
1. Register as a parent user
2. Login with your credentials
3. Upload a photo of your government-issued ID
4. The system will extract the phone number and verify it against your registered phone
5. Once verified, you'll have access to parent features

### Gamification System
- **Daily Check-ins**: Select your mood emoji once per day
- **Streak Building**: Check in consecutive days to build your streak
- **Badge Unlocking**: Reach milestones (7, 14, 30, 60, 100, 180, 365 days) to earn badges
- **Points**: Earn 10 points per check-in, regardless of streak status
- **Progress Tracking**: View your current streak, longest streak, and progress to next badge

## File Upload Requirements

- **File Types**: JPG, JPEG, PNG
- **Max Size**: 5MB (configurable)
- **Content**: Must contain a visible 10-digit phone number

## Development Notes

### Backend
- Tesseract.js downloads language data on first run (~50MB)
- For production, consider using cloud storage (S3) instead of local filesystem
- Add rate limiting for verification attempts in production
- Implement proper error handling and logging
- Gamification uses UTC timestamps for consistent streak tracking across timezones

### Frontend
- React components use Lucide React for icons
- TailwindCSS for styling with custom gradient backgrounds
- State management via React hooks and Context API
- Axios interceptors handle authentication tokens

### Gamification System
- Streaks calculated based on consecutive UTC days
- Badge checks run automatically on each mood check-in
- Points accumulate infinitely (foundation for future reward system)
- Same-day multiple check-ins don't increment streak but still award points
- All gamification logic server-side to prevent client manipulation

## Project Structure

```
/server
  /controllers
    - moodController.js (gamification logic)
  /models
    - User.js (with gamification fields)
  /routes
    - moodRoutes.js
  /tests
    - gamification.test.js

/client
  /src
    /components
      - StreakDisplay.jsx
      - BadgeGrid.jsx
      - BadgeUnlockModal.jsx
      - ChatWidget.jsx
      - Navbar.jsx
      - Sidebar.jsx
    /pages
      - StudentDashboard.jsx (main gamification UI)
    /context
      - AuthContext.jsx
```

## Documentation

See `GAMIFICATION_DOCUMENTATION.md` for comprehensive documentation on:
- Streak tracking logic
- Points system
- Badge definitions and milestones
- API endpoint details
- Frontend component props
- Testing strategy
- Future enhancement plans

## Future Enhancements

- Leaderboard system for friendly competition
- Streak freeze/vacation mode
- Custom badges for other achievements
- Points redemption for rewards
- Social sharing of achievements
- Push notifications for daily reminders
- Team challenges
- Streak recovery option

## License

MIT