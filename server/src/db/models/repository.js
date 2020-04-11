const { User, Friendship } = require("./index");

function getAllFriendsForUser(id) {
    return Friendship.findAll({
      where: {
        $or: [
          { user: id },
          { friend: id },
        ]
      },
      include: [
        {
          model: User,
          as: 'seeker',
        },
        {
          model: User,
          as: 'target',
        }
      ],
      order: [['createdAt', 'DESC']],
      raw: true,
      nest: true,
    });
}

module.exports = {
  getAllFriendsForUser
};
