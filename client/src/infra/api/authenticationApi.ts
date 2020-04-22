import { post, get } from './httpClient';

export async function logIn(username: string, password: string): Promise<{}> {
  const path: string = `/v1/login`;
  const body = {
    username: username,
    // password
  };
  const userObj: {} = await post(path, body);
  return userObj;
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
  const userObj: {} = await post(path, body);
  return userObj;
}
