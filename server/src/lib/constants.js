
const FriendStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
}

const ChallengeStatus = {
  HAVE_NOT_STARTED: 'HAVE_NOT_STARTED',
  ACTIVE: 'ACTIVE',
  FINISHED: 'FINISHED',
}

const ScorecardStatus = {
  ACCEPTED: 'ACCEPTED',
  DECLINED: 'DECLINED',
}

const DistanceMetric = {
  MILE: 'MILE',
  KILOMETER: 'KILOMETER',
  METER: 'METER',
}

const Exercise = {
  CYCLE: 'CYCLE',
  RUN: 'RUN',
  CROSSFIT: 'CROSSFIT',
  INDOOR_CYCLE: 'INDOOR_CYCLE',
  INDOOR_RUN: 'INDOOR_RUN',
  YOGA: 'YOGA'
}

const ExerciseMetric = {
  TIME: 'TIME',
  DISTANCE: 'DISTANCE',
  CALORIES: 'CALORIES',
}

module.exports = {
  FriendStatus,
  ChallengeStatus,
  ScorecardStatus,
  Exercise,
  ExerciseMetric,
  DistanceMetric,
}
