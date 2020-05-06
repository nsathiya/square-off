export type Challenge = {
  id?: string;
  name: string;
  exercise: string;
  status: string
  metric: string;
  startTime: Date;
  endTime: Date;
  participants?: Array<string>
};

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
