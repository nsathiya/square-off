const { User, Friendship } = require("./index");

export function getUserFriendsList(id) {
    const friendships = Friendship.findAll({
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
    return friendships.map(friendship => ({
        status: friendship.status,
        user: friendship.seeker.id !== id ? friendship.seeker : friendship.target
      })
    );
};
