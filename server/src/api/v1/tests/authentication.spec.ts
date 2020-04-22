const { User, Friendship } = require('../../../db/models');
import * as chai from 'chai';
import { expect } from 'chai';
import chaiHttp = require('chai-http');
import chaiExclude from 'chai-exclude';
import app from '../../../index';
const { FriendStatus } = require('../../../lib/constants');
import 'mocha';

chai.use(chaiExclude);
chai.use(chaiHttp);

describe('Authentication routes', () => {
  beforeEach(async () => {
    await Friendship.truncate({ cascade: true });
    await User.truncate({ cascade: true });
  });

  describe('log in a user', () => {
    it('with correct input should respond with 200', async () => {
      const user = await User.create({
        first_name: 'john',
        last_name: 'doe',
        username: 'johnd',
        email: 'john@test.com',
        phone_number: '2342344567'
      });
      const response: any = await chai.request(app)
          .post(`/api/v1/login`)
          .set('content-type', 'application/json')
          .send({
            username: 'johnd',
          });

          console.log('response', response.body);

      expect(response.statusCode).to.equal(200);
      expect(response.body.message.username).to.equal('johnd');
      expect(response.body.message.first_name).to.equal('john');
      expect(response.body.message.last_name).to.equal('doe');
      expect(response.body.message.phone_number).to.equal('2342344567');

      const users = await User.findAll({});
      expect(users[0].username).to.equal('johnd');
    });

    it('with no username should respond with 400', async () => {
      const response: any = await chai.request(app)
          .post(`/api/v1/login/`)
          .set('content-type', 'application/json')
          .send({});

      expect(response.statusCode).to.equal(400);
      expect(response.text).to.equal('Error validating request body. "username" is required.');

      const users = await User.findAll({});
      expect(users.length).to.equal(0);
    });
  });

});
