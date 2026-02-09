const User = require("../models/User");

const linkChild = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Child email is required" });
    }

    const parent = await User.findById(req.user.id);
    if (!parent) {
      return res.status(404).json({ message: "Parent account not found" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const child = await User.findOne({ email: normalizedEmail });

    if (!child) {
      return res.status(404).json({ message: "Student account not found" });
    }

    if (child._id.toString() === parent._id.toString()) {
      return res.status(400).json({ message: "You cannot link your own account as a child" });
    }

    if (child.role !== "student") {
      return res.status(400).json({ message: "Only student accounts can be linked" });
    }

    const alreadyLinked = parent.children.some(
      (childId) => childId.toString() === child._id.toString()
    );

    if (alreadyLinked) {
      return res.status(409).json({ message: "Child is already linked to your account" });
    }

    if (child.parentId && child.parentId.toString() !== parent._id.toString()) {
      return res.status(409).json({ message: "Child is already linked to another parent" });
    }

    parent.children.push(child._id);
    child.parentId = parent._id;

    await Promise.all([parent.save(), child.save()]);

    return res.status(200).json({
      message: "Child linked successfully",
      child: {
        id: child._id,
        name: child.name,
        email: child.email,
        role: child.role
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to link child", error: error.message });
  }
};

module.exports = {
  linkChild
};
