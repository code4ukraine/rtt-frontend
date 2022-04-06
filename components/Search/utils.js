// TODO: Refactor this to work with data
const lastEventText = () => {
  // TODO: Calculcate days since last event
  const daysSinceLastEvent = 14;

  if (daysSinceLastEvent === 0) {
    // TODO: Calculate hours since last event??
    const hoursSinceLastEvent = 3;
    return `Last event ${hoursSinceLastEvent} hours ago`;
  } else if (daysSinceLastEvent === 1) {
    return `Last event 1 day ago`;
  } else if (daysSinceLastEvent < 7 && daysSinceLastEvent > 0) {
    return `Last event ${daysSinceLastEvent} days ago`;
  }
  return '';
};

// TODO: Refactor this to work with data
const withinWeekText = () => {
  //  TODO: Calculate number of events within week
  const eventsWithinWeek = 0;

  if (eventsWithinWeek === 1) return '- 1 event within week';
  else if (eventsWithinWeek > 1)
    return `- ${eventsWithinWeek} events within week`;
  return '';
};

// TODO: Refactor this to work with data
const eventsWithinPreviousWeekText = () => {
  // TODO: Calculate number of events within two weeks
  const eventsWithinPreviousWeek = 2;

  if (eventsWithinPreviousWeek === 1) return '1 event within previous week';
  else if (eventsWithinPreviousWeek > 1)
    return `${eventsWithinPreviousWeek} events within previous week`;
  return '';
};

// TODO: Refactor this to work with data
const eventsText = () => {
  // TODO: Get list of all events from city
  // TODO: Get timestamp of latest event

  // If last event within week
  // show text saying day since last event and # events this week
  // If last event over a week ago
  // show text saying number of events within two weeks
  // if no events within last two weeks
  // don't show any text

  return `${lastEventText()} ${withinWeekText()} ${eventsWithinPreviousWeekText()}`;
};
