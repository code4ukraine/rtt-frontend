import { daysAgo } from "./time";

const filterEvents = (data, type) => {
  if (type === "all events") {
    return data;
  } else {
    return data.filter(event => event.rtt_event_type === type);
  }
};

const filterTime = (data, timePeriod) => {
  //Filter events more recent than the selected time
  return data.filter(event => {
    const { timestamp } = event;
    const matchDate = daysAgo(timestamp);
    return matchDate <= timePeriod;
  });
};

export const filterData = (data, eventType, timePeriod) => {
  let returnData = data;
  if (eventType != "all events") {
    returnData = filterEvents(data, eventType);
  }
  if (timePeriod >= 0) {
    returnData = filterTime(returnData, timePeriod);
  }
  return returnData;
}