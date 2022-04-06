import { React } from "react";
import { getColorByTimestamp } from "../../utils/colors";
import { EVENT_TYPES } from "../../utils/events";

const EventIcon = ({ eventType, timestamp }) => {
  const getPath = (event) => {
    const { ABANDONED, COMBAT, SIGHTING, STRIKE, DEFAULT } = EVENT_TYPES;
    switch (event) {
      case ABANDONED.RTT_EVENT_TYPE:
        return ABANDONED.ICON_PATH;

      case COMBAT.RTT_EVENT_TYPE:
        return COMBAT.ICON_PATH;

      case SIGHTING.RTT_EVENT_TYPE:
        return SIGHTING.ICON_PATH;

      case STRIKE.RTT_EVENT_TYPE:
        return STRIKE.ICON_PATH;

      case DEFAULT.RTT_EVENT_TYPE:
      default:
        return DEFAULT.ICON_PATH;
    }
  };

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d={getPath(eventType)}
        fill={getColorByTimestamp(timestamp)}
      />
    </svg>
  );
};

EventIcon.defaultProps = {
  eventType: "",
  timestamp: new Date(),
};

export default EventIcon;
