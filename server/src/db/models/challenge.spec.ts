// import * as db from './index';
const { Challenge } = require('./index');
import { ChallengeStatus, Exercise, ExerciseMetric } from '../../lib/constants';
import * as chai from 'chai';
import { expect } from 'chai';
import chaiExclude from 'chai-exclude';
import * as moment from 'moment';
import 'mocha';

chai.use(chaiExclude);

const timeFormat = 'YYYY-MM-DD HH:mm:ss';

describe('Challenge model', () => {
  beforeEach(async () => {
    await Challenge.truncate({ cascade: true });
  });

  it('create a new challenge', async () => {
    const startTime = moment.utc().format(timeFormat);
    const endTime = moment.utc().add(5, 'days').format(timeFormat);

    const challenge = (await Challenge.createChallenge({
      name: 'Challenge 1',
      exercise: Exercise.CYCLE,
      metric: ExerciseMetric.DISTANCE,
      status: ChallengeStatus.HAVE_NOT_STARTED,
      start_time: startTime,
      end_time: endTime,
    })).get();

    const excludedFields = ['id', 'createdAt', 'updatedAt'];
    expect(challenge.id).to.exist;
    expect(challenge).excluding(excludedFields).to.deep.equal({
      name: 'Challenge 1',
      exercise: Exercise.CYCLE,
      metric: ExerciseMetric.DISTANCE,
      status: ChallengeStatus.HAVE_NOT_STARTED,
      start_time: startTime,
      end_time: endTime,
    });
  });

  it('get the challenge by id', async () => {
    const startTime = moment().format(timeFormat);
    const endTime = moment().add(5, 'days').format(timeFormat);
    const createdChallenge = (await Challenge.createChallenge({
      name: 'Challenge 1',
      exercise: Exercise.CYCLE,
      metric: ExerciseMetric.DISTANCE,
      status: ChallengeStatus.HAVE_NOT_STARTED,
      start_time: startTime,
      end_time: endTime,
    })).get();

    const retrievedChallenge = (await Challenge.getById(createdChallenge.id)).get();
    expect(retrievedChallenge).to.deep.equal(createdChallenge);
  });

  it('edit challenge', async () => {
    const startTime = moment().format(timeFormat);
    const endTime = moment().add(5, 'days').format(timeFormat);
    const createdChallenge = await Challenge.createChallenge({
      name: 'Challenge 1',
      exercise: Exercise.CYCLE,
      metric: ExerciseMetric.DISTANCE,
      status: ChallengeStatus.HAVE_NOT_STARTED,
      start_time: startTime,
      end_time: endTime,
    });

    await Challenge.editChallenge(createdChallenge.id, {
      name: 'Challenge Number 1',
      metric: ExerciseMetric.TIME,
    });

    const retrievedChallenge = await Challenge.getById(createdChallenge.id);
    expect(retrievedChallenge.name).to.equal('Challenge Number 1');
    expect(retrievedChallenge.metric).to.equal(ExerciseMetric.TIME);
    expect(retrievedChallenge.start_time).to.equal(startTime);
    expect(retrievedChallenge.end_time).to.equal(endTime);
  });

});
