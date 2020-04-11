// import * as db from './index';
const { User, Friendship } = require("./index");
import { expect } from 'chai';
import 'mocha';

describe('User model', () => {
  beforeEach(async () => {
    await Friendship.truncate({ cascade: true });
    await User.truncate({ cascade: true });
  });

  it('create a new user', async () => {
    const user = await User.createUser({
      userId: 'user_test',
      firstName: 'John',
      lastName: 'Smith',
      phoneNumber: '3413422837',
      email: 'a@gmail.com'
    })

    expect(user.id).to.exist;
    expect(user.updatedAt).to.exist;
    expect(user.createdAt).to.exist;
    expect(user.user_id).to.equal('user_test');
    expect(user.first_name).to.equal('John');
    expect(user.last_name).to.equal('Smith');
    expect(user.email).to.equal('a@gmail.com');
    expect(user.phone_number).to.equal('3413422837');
  });

  it('get the user by id', async () => {
    const createdUser = await User.createUser({
      userId: 'user_get_id',
      firstName: 'John',
      lastName: 'Smith',
      phoneNumber: '3413422837',
      email: 'a@gmail.com'
    });

    const retrievedUser = await User.getUserById(createdUser.id);
    expect(retrievedUser.user_id).to.equal('user_get_id')
    expect(retrievedUser.id).to.equal(createdUser.id);
    expect(retrievedUser.first_name).to.equal('John');
    expect(retrievedUser.last_name).to.equal('Smith');
    expect(retrievedUser.email).to.equal('a@gmail.com');
    expect(retrievedUser.phone_number).to.equal('3413422837');
  });

});
