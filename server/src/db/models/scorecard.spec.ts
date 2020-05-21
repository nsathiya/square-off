const { User, Challenge, Scorecard } = require('./index');
const { ScorecardStatus } = require('../../lib/constants');
import { createChallenge } from '../../test/helper';
import * as chai from 'chai';
import { expect } from 'chai';
import chaiExclude from 'chai-exclude';
import 'mocha';

chai.use(chaiExclude);

describe('Scorecard model', () => {
  beforeEach(async () => {
    await User.truncate({ cascade: true });
    await Challenge.truncate({ cascade: true });
    await Scorecard.truncate({ cascade: true });
  });

  it('create a new scorecard', async () => {
    const userA = await User.createUser({ username: 'userA' });

    const challenge = await createChallenge();
    const scorecard = (await Scorecard.createScorecard({
      userId: userA.id,
      challengeId: challenge.id,
    })).get();

    const excludedFields = ['id', 'createdAt', 'updatedAt'];
    expect(scorecard.id).to.exist;
    expect(scorecard).excluding(excludedFields).to.deep.equal({
      userId: userA.id,
      challengeId: challenge.id,
      status: ScorecardStatus.ACCEPTED,
      data: { score: 0 },
    });
  });

  it('create scorecards', async () => {
    const userA = await User.createUser({ username: 'userA' });

    const challenge = await createChallenge();
    const scorecard = (await Scorecard.createScorecard({
      userId: userA.id,
      challengeId: challenge.id,
    })).get();

    const excludedFields = ['id', 'createdAt', 'updatedAt'];
    expect(scorecard.id).to.exist;
    expect(scorecard).excluding(excludedFields).to.deep.equal({
      userId: userA.id,
      challengeId: challenge.id,
      status: ScorecardStatus.ACCEPTED,
      data: { score: 0 },
    });
  });

});
