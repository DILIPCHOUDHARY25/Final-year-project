const User = require("../models/User");

const getMoodStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $match: {
          role: "student"
        }
      },
      {
        $unwind: "$moodLogs"
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$moodLogs.timestamp" }
          },
          totalEntries: { $sum: 1 },
          averageSentimentScore: { $avg: "$moodLogs.sentiment.score" }
        }
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          totalEntries: 1,
          averageSentimentScore: 1
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);

    return res.status(200).json({ dailyMoodStats: stats });
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch educator stats", error: error.message });
  }
};

module.exports = {
  getMoodStats
};
