
import { useState, useEffect } from "react";
import { GooglePinMap, GOOGLE_MAP_API_KEY } from '../components/GoogleMap';
import { useTranslation } from 'next-export-i18n';
import { Wrapper } from "@googlemaps/react-wrapper";
import styles from './SubmissionForm.module.css';

export default function LocationPickerWrapped(props) {
  return <Wrapper
    apiKey={GOOGLE_MAP_API_KEY}
    render={status => <>{status}</>}>
    <LocationPicker {...props} />
  </Wrapper>;
}

const defaultLocation = { lat: 48.2558409, lng: 32.6914268, zoom: 5 };
function LocationPicker({ onChange }) {
  const { t } = useTranslation();
  const [mapCenter, setMapCenter] = useState(defaultLocation);
  const [mapBounds, setMapBounds] = useState();
  const [address, setAddress] = useState("");
  const [addressForGeocoding, setAddressForGeocoding] = useState();
  const [geocoder, setGeocoder] = useState();
  const [selectedLocation, setSelectedLocation] = useState(defaultLocation);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (!geocoder) {
      setGeocoder(new window.google.maps.Geocoder());
    }
  })

  // pan&zoom map based on provided address geocode
  useEffect(async () => {
    if (geocoder && address) {
      const { results } = await geocoder.geocode({ address });
      const bounds = new google.maps.LatLngBounds(
        results[0].geometry.viewport.getSouthWest(),
        results[0].geometry.viewport.getNorthEast()
      );
      setMapBounds(bounds);
    }
  }, [addressForGeocoding])

  // center map based on location auto-detect
  function handleLocationAutodetectClicked() {
    setLocating(true);
    try {
      navigator.geolocation.getCurrentPosition(position => {
        setMapCenter({
          lat: position.coords.latitude.toFixed(3),
          lng: position.coords.longitude.toFixed(3),
          zoom: 10
        })
        setLocating(false);
      })
    } catch (error) {
      console.log(error)
      setLocating(false);
    }
  }

  function handleAddressEdited() {
    setAddressForGeocoding(address);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      setAddressForGeocoding(address);
    }
  }

  function handleLocationChanged(location) {
    const newLocation = { lat: location.lat().toFixed(3), lng: location.lng().toFixed(3) };
    setSelectedLocation(newLocation);
    onChange(newLocation);
  }

  return <>
    <h2 className={styles.sectionHeading}>{t('locationTitle')}</h2>
    <div className={styles.description}>
      <div>
        {!locating ? (
          <div className={styles.btn} onClick={handleLocationAutodetectClicked} >
            {t('locationButton')}
          </div>
        ) : (
          <div className={styles.spinner}>
          </div>
        )}
      </div>

      <p className={styles.subtitle}>
        {t('locationSubTitle')}
      </p>
      <input type="text" placeholder={t('locationPlaceholder')} value={address}
        onChange={(e) => { setAddress(e.target.value) }} onBlur={handleAddressEdited}
        onKeyDown={handleKeyDown} />
    </div>
    <p>{t('locationDescription')}  <strong>{selectedLocation.lat},{selectedLocation.lng}</strong></p>

    <GooglePinMap mapCenter={mapCenter} bounds={mapBounds}
      onLocationChanged={handleLocationChanged} />


  </>;
}
