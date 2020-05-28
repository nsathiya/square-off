import { post, get } from './httpClient';
import { UserState } from '../reducers/userReducer';
import { UserRelationships } from '../types';

export async function logIn(username: string, password: string): Promise<{}> {
  const path: string = `/v1/login`;
  const body = {
    username: username,
    // password
  };
  const userObj: any = await post(path, body);
  return {
    id: userObj.id,
    username: userObj.username,
    firstName: userObj.first_name,
    lastName: userObj.last_name,
    email: userObj.email,
    phoneNumber: userObj.phone_number,
    relationship: UserRelationships.SELF,
  };
}

export async function logOut(username: string): Promise<{}> {
  const path: string = `/v1/logout`;
  const body = {
    username: username,
  };
  return await post(path, body);
}

export async function signUp(user: any): Promise<any> {
  const path: string = `/v1/users`;
  const body = {
    first_name: user.firstName,
    last_name: user.lastName,
    username: user.username,
    email: user.email,
    phone_number: user.phoneNumber,
  };
  const userObj: any = await post(path, body);
  return {
    id: userObj.id,
    username: userObj.username,
    firstName: userObj.first_name,
    lastName: userObj.last_name,
    email: userObj.email,
    phoneNumber: userObj.phone_number,
    relationship: UserRelationships.SELF,
  };
}
