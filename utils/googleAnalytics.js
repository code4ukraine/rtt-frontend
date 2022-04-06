// Logs page view
export const pageview = (url) => {
  const trackCode = process.env.NEXT_PUBLIC_GA_TRACKCODE;

  window.gtag('config', trackCode, {
    page_path: url,
  })
};

// logs an event
const event = ({ action,  params }) => {
  window.gtag('event', action, params)
};

export const trackMapPan = (params) => {
  event({action: 'map', params: {
    type: 'pan',
    ...params,
  }})
}

export const trackMarkerClick = (params) => {
  event({action: 'map', params: {
    type: 'markerClick',
    ...params,
  }})
}

export const trackEventSelection = (params) => {
  event({action: 'event', params: {
    type: 'click',
    ...params
  }})
}

export const trackEventFilterActive = (params) => {
  event({action: 'filter-event', params: {
    type: 'acgive',
    ...params
  }})
}

export const trackEventFilterSelect = (params) => {
  event({action: 'filter-event', params: {
    type: 'select',
    ...params
  }})
}

export const trackSearchActive = () => {
  event({action: 'search', params: {
    type: 'active'
  }})
}

export const trackSearchSelect = (params) => {
  event({action: 'search', params: {
    type: 'select',
    ...params,
  }})
}

export const trackSocialMediaClick = (params) => {
  event({action: 'link', params: {
    type: 'socialMedia',
    ...params
  }});
}