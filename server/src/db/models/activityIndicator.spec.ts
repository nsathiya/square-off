const { Challenge, Activity, ActivityIndicator, User } = require('./index');
import { createChallenge, createActivity } from '../../test/helper';
import * as chai from 'chai';
import { expect } from 'chai';
import chaiExclude from 'chai-exclude';
import 'mocha';

chai.use(chaiExclude);

describe('ActivityIndicator model', () => {
  beforeEach(async () => {
    await Challenge.truncate({ cascade: true });
    await Activity.truncate({ cascade: true });
    await ActivityIndicator.truncate({ cascade: true });
    await User.truncate({ cascade: true });
  });

  it('create a new activity indicator', async () => {
    const challenge = await createChallenge();
    const user = await User.create({ username: 'user' });
    const activity = await createActivity(user.id);
    const activityIndicator = (await ActivityIndicator.createActivityIndicator({
      activityId: activity.id,
      challengeId: challenge.id,
    })).get();

    const excludedFields = ['id', 'createdAt', 'updatedAt'];
    expect(activityIndicator.id).to.exist;
    expect(activityIndicator).excluding(excludedFields).to.deep.equal({
      activityId: activity.id,
      challengeId: challenge.id,
    });
  });

  it('bulk create multiple activity indicators', async () => {
    const challenge = await createChallenge();
    const user1 = await User.create({ username: 'user1' });
    const activity = await createActivity(user1.id);
    const user2 = await User.create({ username: 'user2' });
    const activity2 = await createActivity(user2.id, { name: 'activity 2' });

    const activities = await ActivityIndicator.bulkCreateActivityIndicators([
      {
        activityId: activity.id,
        challengeId: challenge.id,
      },
      {
        activityId: activity2.id,
        challengeId: challenge.id,
      }
    ]);

    const excludedFields = ['id', 'createdAt', 'updatedAt'];
    const activityIndicators = (await ActivityIndicator.findAll());
    expect(activityIndicators[0].get()).excluding(excludedFields).to.deep.equal({
      activityId: activity.id,
      challengeId: challenge.id,
    });
    expect(activityIndicators[1].get()).excluding(excludedFields).to.deep.equal({
      activityId: activity2.id,
      challengeId: challenge.id,
    });
  });

});
