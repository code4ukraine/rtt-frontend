import { daysAgo } from "./time";

const colorScale = [
  "#FF6B00", // newest
  "#FF7A1A",
  "#FF8933",
  "#FF974C",
  "#FFA666",
  "#FFB57F",
  "#FFC499", // oldest
];

export const getColorByTimestamp = (timestamp) => {
  const days = daysAgo(timestamp);
  return days < 7 ? colorScale[days] : colorScale[colorScale.length - 1];
};
