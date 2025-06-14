const UserModel = require('../Models/User');

const getUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id).select(
      'name email questionsSolvedEasy questionsSolvedHard questionsSolvedMedium questionsSolvedTotal'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUser };