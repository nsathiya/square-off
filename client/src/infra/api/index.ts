import { post, get } from './httpClient';
import {
  Challenge,
  Activity,
  Scorecard,
  DistanceMetric,
  Exercise,
} from '../types';

export async function getAllUsers(): Promise<any> {
  const path: string = `/v1/users`;
  const users: [] = await get(path);
  return users.map((user: any) => ({
    id: user.id,
    username: user.username,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phoneNumber: user.phone_number,
  }));
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

export async function getActivities(userId: string): Promise<[Activity]> {
  const path: string = `/v1/users/${userId}/activities`;
  const activities = await get(path);
  return activities.map((activity: any) => ({
    id: activity.id,
    name: activity.name,
    distance: activity.distance,
    distanceMetric: activity.distanceMetric,
    time: activity.time,
    caloriesBurned: activity.caloriesBurned,
    exercise: activity.exercise,
    userId: activity.userId,
    photos: activity.photos,
  }));
}

export async function createActivity({
  name,
  distance,
  distanceMetric,
  time,
  caloriesBurned,
  exercise,
  startTime,
  userId,
}: {
  name: string;
  distance: number;
  distanceMetric?: DistanceMetric;
  time: number; // in minutes
  caloriesBurned?: number;
  startTime: Date;
  userId: string;
  exercise: Exercise;
}): Promise<Activity> {
  const path: string = `/v1/activities`;
  const body = {
    name,
    distance,
    distance_metric: distanceMetric,
    time,
    caloriesBurned,
    startTime,
    userId,
    exercise,
  };
  const response = await post(path, body);
  const { activity } = response;
  return {
    id: activity.id,
    name: activity.name,
    distance: activity.distance,
    distanceMetric: activity.distance_metric,
    time: activity.time,
    userId: activity.userId,
    startTime: activity.start_time,
    caloriesBurned: activity.calories_burned,
    exercise: activity.exercise,
  };
}

export async function getDetailsOfChallenge(challengeId: string): Promise<Challenge> {
  const path: string = `/v1/challenges/${challengeId}`;
  const challenge = await get(path);
  return {
    id: challenge.id,
    name: challenge.name,
    exercise: challenge.exercise,
    metric: challenge.metric,
    status: challenge.status,
    startTime: challenge.start_time,
    endTime: challenge.end_time,
  };
}

export async function getActivitiesOfChallenge(challengeId: string): Promise<[Activity]> {
  const path: string = `/v1/challenges/${challengeId}/activities`;
  const body = await get(path);
  return body.map((activity: any) => ({
    id: activity.id,
    name: activity.name,
    distance: activity.distance,
    distanceMetric: activity.distanceMetric,
    time: activity.time,
    caloriesBurned: activity.caloriesBurned,
    exercise: activity.exercise,
    photos: activity.photos,
  }));
}

export async function getScorecardsOfChallenge(challengeId: string): Promise<[Scorecard]> {
  const path: string = `/v1/challenges/${challengeId}/scorecards`;
  const body = await get(path);
  return body.map((scorecard: any) => ({
    id: scorecard.id,
    challengeId: scorecard.challengeId,
    score: scorecard.data.score,
    status: scorecard.status,
    userId: scorecard.userId,
  }));
}
