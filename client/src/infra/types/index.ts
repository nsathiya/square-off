export type Challenge = {
  id?: string;
  name: string;
  exercise: string;
  status: string
  metric: string;
  startTime: Date;
  endTime: Date;
  participants?: []
};
