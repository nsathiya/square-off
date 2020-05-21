// import * as db from './index';
const { Activity, User } = require('./index');
import { DistanceMetric, Exercise } from '../../lib/constants';
import { createActivity } from '../../test/helper';
import * as chai from 'chai';
import { expect } from 'chai';
import * as moment from 'moment';
import chaiExclude from 'chai-exclude';
import 'mocha';

chai.use(chaiExclude);

const timeFormat = 'YYYY-MM-DD HH:mm:ss';

describe('Activity model', () => {
  beforeEach(async () => {
    await Activity.truncate({ cascade: true });
    await User.truncate({ cascade: true });
  });

  it('create a new activity', async () => {
    const user = await User.createUser({ username: 'userA' });
    const data = {
      name: 'Activity 1',
      exercise: Exercise.CYCLE,
      distance: 2.8,
      distanceMetric: DistanceMetric.MILE,
      time: 2100, // 35 mins
      caloriesBurned: 320,
      startTime: moment.utc().format(timeFormat),
      userId: user.id
    };
    const challenge = (await Activity.createActivity(data)).get();

    const excludedFields = ['id', 'createdAt', 'updatedAt'];
    expect(challenge.id).to.exist;
    expect(challenge).excluding(excludedFields).to.deep.equal(data);
  });

  it('get the activity by id', async () => {
    const user = await User.createUser({ username: 'userA' });
    const createdActivity = await createActivity(user.id);

    const retrievedActivity = (await Activity.getById(createdActivity.id)).get();
    expect(retrievedActivity).to.deep.equal(createdActivity);
  });

});
