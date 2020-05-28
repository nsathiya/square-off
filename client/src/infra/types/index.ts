export type Challenge = {
  id: string;
  name: string;
  exercise: string;
  status: string
  metric: string;
  startTime: Date;
  endTime: Date;
  participants?: Array<string>
  activities?: Array<string>
  scorecards?: Array<string>
};

export type Activity = {
  id: string;
  userId: string;
  name: string;
  distance: number;
  distanceMetric?: DistanceMetric;
  time: number; // in minutes
  caloriesBurned?: number;
  startTime: Date;
  exercise: Exercise;
  photos?: Array<any>;
};

export type Scorecard = {
  id: string;
  userId: string;
  challengeId: string;
  data: {};
  score: number;
};

export enum DistanceMetric {
  MILE = 'MILE',
  KILOMETER = 'KILOMETER',
  METER = 'METER',
}

export enum UserRelationships {
  FRIEND = 'FRIEND',
  SELF = 'SELF',
}

export enum ChallengeStatus {
  HAVE_NOT_STARTED = 'HAVE_NOT_STARTED',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
}

export enum Exercise {
  CYCLE = 'CYCLE',
  RUN = 'RUN',
  CROSSFIT = 'CROSSFIT',
  INDOOR_CYCLE = 'INDOOR_CYCLE',
  INDOOR_RUN = 'INDOOR_RUN',
  YOGA = 'YOGA',
}

export enum ExerciseMetric {
  TIME = 'TIME',
  DISTANCE = 'DISTANCE',
  CALORIES = 'CALORIES',
}
