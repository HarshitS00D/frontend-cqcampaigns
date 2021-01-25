import moment from "moment";

export const parseTimeStamp = (timeStamp, format) =>
  moment(timeStamp).format(format);

export const parseMilliseconds = (timeStamp, format) =>
  moment(timeStamp, "x").format(format);

export const getDiffInMilliseconds = (timeStamp1, timeStamp2) =>
  moment.duration(moment(timeStamp1).diff(moment(timeStamp2))).asMilliseconds();
