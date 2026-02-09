const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['parent', 'student', 'admin'],
    default: 'student'
  },
  parentPhoneNumber: {
    type: String,
    required: function() { return this.role === 'parent'; }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  moodLogs: [{
    mood: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    emoji: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    sentiment: {
      label: String,
      score: Number
    }
  }],
  gamification: {
    points: {
      type: Number,
      default: 0
    },
    currentStreak: {
      type: Number,
      default: 0
    },
    longestStreak: {
      type: Number,
      default: 0
    },
    lastCheckIn: {
      type: Date,
      default: null
    },
    badges: [{
      id: String,
      name: String,
      icon: String,
      description: String,
      earnedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);