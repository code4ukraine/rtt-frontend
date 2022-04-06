import { React } from "react";
import { useTranslation, useSelectedLanguage } from 'next-export-i18n';

import { getDaysAgoText } from "../../utils/time";
import EventIcon from "./EventIcon";
import {
  contentContainerStyles,
  descriptionStyles,
  eventContainerStyles,
  eventTimeContainerStyles,
  eventTitleStyles,
  titleStyles,
} from "./styles";
import { translateEventDetails } from "../../utils/translateEventDetails";

const DEFAULT_ZOOM_LEVEL = 10;

const EventInfo = ({ event, setMapCenter, scrollToMapContainer }) => {
  const { t } = useTranslation();
  const { lang } = useSelectedLanguage();
  const {
    lat,
    lng,
    rtt_event_type: eventType,
    timestamp,
  } = event;

  const { title, description } = translateEventDetails(event, lang);

  const handleOnClick = () => {
    const focusCenter = {
      lat,
      lng,
      zoom: DEFAULT_ZOOM_LEVEL,
    };
    scrollToMapContainer();
    setMapCenter(focusCenter);
  };

  return (
    <li style={eventContainerStyles} onClick={handleOnClick}>
      <div style={eventTimeContainerStyles(timestamp)}>
        <EventIcon eventType={eventType} timestamp={timestamp} />
        <h3 style={eventTitleStyles(timestamp)}>
          {t(eventType)}&#9642;{getDaysAgoText(timestamp)}
        </h3>
      </div>

      <div style={contentContainerStyles}>
        <div>
          <h4 style={titleStyles}>{title}</h4>
          <p style={descriptionStyles}>{description}</p>
        </div>

        <div>
          {/* TODO: import this as component from icons folder after webpack set up */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.5 15L12.5 10L7.5 5"
              stroke="#0D0D0D"
              strokeWidth="1.5"
              strokeLinecap="square"
            />
          </svg>
        </div>
      </div>
    </li>
  );
};

EventInfo.defaultProps = {
  event: {
    description: "",
    lat: "",
    lng: "",
    rtt_event_type: "",
    timestamp: new Date(),
    title: "",
  },
  setMapCenter: () => { },
  scrollToMapContainer: () => { },
};

export default EventInfo;
