const { User, Friendship } = require('../../../db/models');
import * as chai from 'chai';
import { expect } from 'chai';
import chaiHttp = require('chai-http');
import app from '../../../index';
import 'mocha';

chai.use(chaiHttp);

describe('Users routes', () => {
  beforeEach(async () => {
    await Friendship.truncate({ cascade: true });
    await User.truncate({ cascade: true });
  });

  describe('create a new user', () => {
    it('with correct input should response with 200', async () => {
      const response: any = await chai.request(app)
          .post(`/api/v1/users`)
          .set('content-type', 'application/json')
          .send({
            first_name: 'john',
            last_name: 'doe',
            user_id: 'johntest',
            email: 'john@test.com',
            phone_number: '2342344567'
          });

      const responseBody = response;
      expect(response.statusCode).to.equal(200);
      expect(response.body.message.user_id).to.equal('johntest');
      expect(response.body.message.first_name).to.equal('john');
      expect(response.body.message.last_name).to.equal('doe');
      expect(response.body.message.phone_number).to.equal('2342344567');

      const users = await User.findAll({});
      expect(users[0].user_id).to.equal('johntest');
      // TODO remove id from response.
      expect(users[0].id).to.equal(response.body.message.id);
    });

    it('with no user_id should response with 400', async () => {
      const response: any = await chai.request(app)
          .post(`/api/v1/users`)
          .set('content-type', 'application/json')
          .send({
            first_name: 'john',
            last_name: 'doe',
            email: 'john@test.com',
            phone_number: '2342344567'
          });

      const responseBody = response;
      expect(response.statusCode).to.equal(400);
      expect(response.text).to.equal('Error validating request body. "user_id" is required.')

      const users = await User.findAll({});
      expect(users.length).to.equal(0);
    });

    it('with only user_id should response with 200', async () => {
      const response: any = await chai.request(app)
          .post(`/api/v1/users`)
          .set('content-type', 'application/json')
          .send({
            user_id: 'johnd',
          });

      const responseBody = response;
      expect(response.statusCode).to.equal(200);

      const users = await User.findAll({});
      expect(users.length).to.equal(1);
    });
  });

});
