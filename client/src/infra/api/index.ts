import { post, get } from './httpClient';
import { Challenge } from '../types';

export async function getAllUsers(): Promise<any> {
  const path: string = `/v1/users`;
  const users: [] = await get(path);
  return users;
}

export async function getFriendslist(userId: string): Promise<any> {
  const path: string = `/v1/users/${userId}/friendslist`;
  const friends: [] = await get(path);
  return friends.map(({ user }: { user: any }) => ({
    id: user.id,
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phoneNumber: user.phone_number,
  }));
}

export async function createFriendship(userId: string, userIdForFriend: string): Promise<any> {
  const path: string = `/v1/friendships/user/${userId}/pending`;
  const body: {} = {
    friendId: userIdForFriend
  };
  const { friend } = await post(path, body);
  return {
    id: friend.id,
    username: friend.username,
    firstName: friend.first_name,
    lastName: friend.last_name,
    email: friend.email,
    phoneNumber: friend.phone_number,
  };
}

export async function getChallenges(userId: string): Promise<[Challenge]> {
  const path: string = `/v1/users/${userId}/challenges`;
  const body = await get(path);
  return body.map(({ challenge }: any) => ({
    id: challenge.id,
    name: challenge.name,
    exercise: challenge.exercise,
    metric: challenge.metric,
    status: challenge.status,
    startTime: challenge.start_time,
    endTime: challenge.end_time,
  }));
}

export async function createChallenge({
  name,
  exercise,
  metric,
  startTime,
  endTime,
  participants }: Challenge ): Promise<Challenge> {
  const path: string = `/v1/challenges`;
  const body = {
    name: name,
    exercise: exercise,
    metric: metric,
    start_time: startTime,
    end_time:  endTime,
    participants,
  };
  const { challenge } = await post(path, body);
  return {
    id: challenge.id,
    name: challenge.name,
    exercise: challenge.exercise,
    metric: challenge.metric,
    status: challenge.status,
    startTime: challenge.start_time,
    endTime: challenge.end_time,
    participants: challenge.participants,
  };
}
