import React, { useRef, useState, useEffect, useMemo } from "react";
import { Wrapper } from "@googlemaps/react-wrapper";
import { createCustomEqual } from "fast-equals";
import { MarkerClusterer as GoogleMapsClusterer } from "@googlemaps/markerclusterer";
import debounce from 'lodash.debounce';

import { trackMapPan, trackMarkerClick } from '../utils/googleAnalytics';

import { EVENT_TYPES } from "../utils/events";
import { daysAgo } from "../utils/time";

const defaultZoom = 5;
const startingLocation = { lat: 48.8314207, lng: 30.8765328 };

export const GOOGLE_MAP_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export function GooglePinMap({ onLocationChanged, mapCenter, bounds }) {
  const [pinLocation, setPinLocation] = useState(mapCenter);

  const handleBoundsChange = (map) => {
    if (map) {
      const center = map.getCenter();
      if (center) {
        setPinLocation(center);
        onLocationChanged(center);
      }
    }
  };

  const debouncedOnBoundsChanged = useMemo(
    () => debounce(handleBoundsChange, 100)
    , []);

  return <>
    <style jsx>{`
    @media(max-width: 576px) {
      #MapComponent {
        width: 100vw !important;
        left: -10px;
      }
    }
  `}</style>
    <div id={'MapComponent'} style={{ display: "flex", width: "100%", height: "60vh", position: 'relative' }}>
      <Map
        onBoundsChanged={debouncedOnBoundsChanged}
        centerPoint={mapCenter}
        bounds={bounds}
        style={{ flexGrow: "1", height: "100%" }}>
        <Marker position={pinLocation} title={"Your sighting"}>
        </Marker>
      </Map>
    </div>
  </>;
}


const iconForMarker = (marker, isSelected) => {
  const { ABANDONED, COMBAT, DEFAULT, SIGHTING, STRIKE } = EVENT_TYPES;
  const { timestamp, rtt_event_type: eventType } = marker;

  let iconFilePath = 'icons/markers/';
  const selectedFilePath = isSelected ? '-selected' : '';
  const daysSinceEvent = daysAgo(timestamp);

  const iconPathByDay = Math.min(Math.max(daysSinceEvent, 1), 7);
  switch (eventType) {
    case ABANDONED.RTT_EVENT_TYPE:
      return iconFilePath += `${iconPathByDay}/abandoned-marker${selectedFilePath}.svg`
    case COMBAT.RTT_EVENT_TYPE:
      return iconFilePath += `${iconPathByDay}/combat-marker${selectedFilePath}.svg`;
    case SIGHTING.RTT_EVENT_TYPE:
      return iconFilePath += `${iconPathByDay}/sighting-marker${selectedFilePath}.svg`;
    case STRIKE.RTT_EVENT_TYPE:
      return iconFilePath += `${iconPathByDay}/strike-marker${selectedFilePath}.svg`;
    case DEFAULT.RTT_EVENT_TYPE:
    default:
      return iconFilePath += `${iconPathByDay}/default-marker${selectedFilePath}.svg`;
  }
}

export function GooglePoweredMap({ markers, onVisibleMarkersChanged,
  onClick, onIdle, onMarkerClick, centerPoint, selectedIdx }) {
  const googleMapReference = useRef();
  const [zoom, setZoom] = useState(defaultZoom);
  const maxClusterZoomLevel = 10;

  const handleBoundsChange = (map) => {
    if (map) {
      const bounds = map.getBounds();
      if (bounds) {
        trackMapPan({ bounds: bounds.toString() });
        const onScreenMarkers = markers.filter(m => bounds.contains({ lat: m.lat, lng: m.lng }));
        onVisibleMarkersChanged(onScreenMarkers);
      }
    }
  };

  const debouncedOnBoundsChanged = useMemo(
    () => debounce(handleBoundsChange, 500)
    , [markers]);

  // if the set of markers changes (eg. due to filtering), recalc visibility
  useEffect(() => {
    debouncedOnBoundsChanged(googleMapReference.current);
  }, [markers]);

  const setGoogleMapReference = (map) => {
    googleMapReference.current = map;
  }

  const onZoomChanged = (map) => {
    if (map) {
      setZoom(map.getZoom());
    }
  };


  return <>
    <style jsx>{`
      @media(max-width: 576px) {
        #MapComponent {
          width: 100vw !important;
          left: -10px;
        }
      }
    `}</style>
    <div id={'MapComponent'} style={{ display: "flex", width: "100%", height: "60vh", position: 'relative' }}>
      <Wrapper
        apiKey={GOOGLE_MAP_API_KEY}
        render={status => <>{status}</>}>
        <Map
          onMapInitialized={setGoogleMapReference}
          onBoundsChanged={debouncedOnBoundsChanged}
          onClick={onClick}
          onIdle={onIdle}
          onZoomChanged={onZoomChanged}
          zoom={defaultZoom}
          style={{ flexGrow: "1", height: "100%" }}
          centerPoint={centerPoint}
        >
          {zoom >= maxClusterZoomLevel ? (
            markers.map((marker, idx) => (
              <Marker key={idx} position={{ lat: marker.lat, lng: marker.lng }}
                title={marker.title}
                onClick={(e) => {
                  trackMarkerClick({ id: idx, lat: e.latLng.lat(), lng: e.latLng.lng() })
                  onMarkerClick(idx)
                }
                }
                icon={iconForMarker(marker, idx == selectedIdx)}>
              </Marker>
            ))
          ) : (
            <MarkerClusterer>
              {markers.map((marker, idx) => (
                <Marker key={idx} position={{ lat: marker.lat, lng: marker.lng }}
                  title={marker.title}
                  onClick={(e) => {
                    trackMarkerClick({ id: idx, lat: e.latLng.lat(), lng: e.latLng.lng() })
                    onMarkerClick(idx)
                  }
                  }
                  icon={iconForMarker(marker, idx == selectedIdx)}>
                </Marker>
              ))}
            </MarkerClusterer>
          )
          }
        </Map>
      </Wrapper>
    </div>
  </>;
}

const MarkerClusterer = ({ children, map, ...options }) => {
  const [clusterer, setClusterer] = useState();
  const childRefs = useRef([])

  useEffect(() => {
    childRefs.current = childRefs.current.slice(0, children.length);
  }, [children]);

  useEffect(() => {
    if (map) {
      const markers = childRefs.current.filter(e => e).map(e => e.state.marker);
      if (clusterer) {
        clusterer.clearMarkers();
      }
      setClusterer(new GoogleMapsClusterer({ markers, map }));
    }
  }, [map, children.length]);

  useDeepCompareEffectForMaps(() => {
    if (clusterer) {
      clusterer.setOptions(options);
    }
  }, [clusterer, options]);

  // Remove clusters on dismount. Used for zoom uncluster trigger.
  useEffect(() => () => {
    if (!clusterer) return;
    clusterer.clearMarkers(true);
  }, [clusterer]);

  return <>{React.Children.map(children, (child, idx) => {
    if (React.isValidElement(child)) {
      // set the ref prop on the child component
      return React.cloneElement(child, { ref: el => childRefs.current[idx] = el });
    }
  })}</>
}


const Map = ({
  onMapInitialized,
  onClick,
  onIdle,
  onBoundsChanged,
  onZoomChanged,
  children,
  style,
  centerPoint,
  bounds,
  ...options
}) => {
  const ref = useRef(null);
  const [map, setMap] = useState();

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {});
      setMap(newMap);
      if (onMapInitialized) {
        onMapInitialized(newMap);
      }
    }
  }, [ref, map]);

  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  useEffect(() => {
    if (map) {
      map.fitBounds(bounds);
    }
  }, [bounds])

  useEffect(() => {
    if (map) {
      // todo unbind events
      // ["click", "idle",/* "bounds_changed"*/].forEach((eventName) =>
      //   google.maps.event.clearListeners(map, eventName)
      // );

      if (onClick) {
        map.addListener("click", onClick);
      }

      if (onIdle) {
        map.addListener("idle", () => onIdle(map));
      }
      if (onBoundsChanged) {
        map.addListener("bounds_changed", () => onBoundsChanged(map));
      }
      if (onZoomChanged) {
        map.addListener("zoom_changed", () => onZoomChanged(map));
      }
    }
  }, [map, onClick, onIdle, onBoundsChanged]);

  useEffect(() => {
    if (!(centerPoint && map)) return;
    const { lat, lng, zoom } = centerPoint;
    if (zoom) {
      map.setZoom(zoom);
    } else {
      map.setZoom(defaultZoom);
    }

    map.panTo(new google.maps.LatLng(lat, lng));

  }, [map, centerPoint]);

  return (
    <>
      <div ref={ref} style={style} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );

};

//Has to be a class so we can get a ref
class Marker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      marker: new google.maps.Marker()
    }
  }
  componentDidMount() {
    ["click",].forEach((eventName) =>
      google.maps.event.clearListeners(this.state.marker, eventName)
    );

    if (this.props.onClick) {
      this.state.marker.addListener("click", this.props.onClick);
    }
  }
  componentWillUnmount() {
    this.state.marker.setMap(null);
  }
  componentDidUpdate(prevProps, prevState) {
    this.state.marker.setOptions(this.props);
  }
  render() {
    return null;
  }
}


// Utils
const deepCompareEqualsForMaps = createCustomEqual(
  (deepEqual) => (a, b) => {
    if (
      a instanceof google.maps.LatLng ||
      b instanceof google.maps.LatLng
    ) {
      return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
    }

    // TODO extend to other types

    // use fast-equals for other objects
    return deepEqual(a, b);
  }
);

function useDeepCompareMemoize(value) {
  const ref = useRef();

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

function useDeepCompareEffectForMaps(
  callback,
  dependencies
) {
  useEffect(callback, dependencies.map(useDeepCompareMemoize));
}

