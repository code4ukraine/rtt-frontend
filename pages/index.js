import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import cities from '../public/cities';
import TelegramBanner from '../components/Banners/TelegramBanner';
import AddDataBanner from '../components/Banners/AddDataBanner';
import MainBanner from '../components/Banners/MainBanner';
import SearchBar from '../components/Search/SearchBar';
import TimeScale from '../components/TimeScale';
import EventInfo from '../components/Events/EventInfo';
import SocialBox from '../components/SocialBox';
import About from '../components/About';
import { GooglePoweredMap as GoogleMap } from '../components/GoogleMap';
import MapTooltip from '../components/MapTooltip';
import TypeDropdown from '../components/Dropdown';
import CTA from '../components/CTA';
import SocialModal from '../components/SocialModal';
import { filterData } from '../utils/filterData';
import { useTranslation, useSelectedLanguage } from 'next-export-i18n';
import { translateEventDetails } from '../utils/translateEventDetails';

export const initialMapCenter = { lat: 48.2558409, lng: 32.6914268, zoom: 5 };

export default function Home() {
  const [visibleMarkers, setVisibleMarkers] = useState([]);
  const [selected, setSelected] = useState(-1);
  const [sourceData, setSourceData] = useState([]);
  const [finalData, setFinalData] = useState([]);
  const [type, setType] = useState('all events');
  const [timeFilterPeriod, setTimeFilterPeriod] = useState(7);
  const [mapCenter, setMapCenter] = useState(initialMapCenter);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);

  const { t } = useTranslation();
  const router = useRouter();
  const { lang } = useSelectedLanguage();

  const handleVisibleMarkersChanged = (newVisibleMarkers) => {
    setVisibleMarkers(newVisibleMarkers);
  };

  const handleMarkerClick = (id) => {
    setSelected(id);
  };

  const handleCTAClick = () => {
    if (isSignedIn) {
      router.push('/submission');
    } else {
      setShowSocialModal(true);
    }
  };

  const onInfoBoxClose = () => {
    setSelected(-1);
  };

  const scrollToMapContainer = () => {
    document.getElementById('MapComponent').scrollIntoView();
  }

  useEffect(() => {
    setIsSignedIn(document.cookie.indexOf('SignedInHint') > -1);
  }, []);

  // Initial retrieval of data
  useEffect(async () => {
    if (!sourceData.length) {
      const resp = await fetch('data/data.json');
      setSourceData(await resp.json());
    }
  }, []);

  // reset finalData based on filtered type and timeFilterPeriod
  useEffect(() => {
    if (sourceData.length) {
      setSelected(-1);
      const filteredData = filterData(sourceData, type, timeFilterPeriod);
      setFinalData(filteredData);
    }
  }, [type, timeFilterPeriod, sourceData]);


  return (
    <>
      <Head>
        <title>Russian Threat Tracker</title>
        <meta name='description' content='' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <MainBanner />
      {isSignedIn ?
        <AddDataBanner />
        : <>
          <TelegramBanner />
        </>
      }
      <SearchBar cities={cities} setMapCenter={setMapCenter} />
      <div style={{ backgroundColor: 'white' }}>
        <div style={{ margin: 10, marginTop: 0 }}>
          <h2 style={{ paddingTop: 20 }}>{t('ukraine')}</h2>
          <h3 style={{ paddingBottom: 10 }}>
            {finalData.length === 0 ? 'No' : finalData.length}{' '}
            {type === 'all events' ? t('events') : `${type}s`} {t('inthe')}{' '}
            {timeFilterPeriod === 7
              ? t('pastWeek').toString().toLowerCase()
              : timeFilterPeriod === 1
                ? 'past day'
                : `past ${timeFilterPeriod} days`}
          </h3>
        </div>
        <div
          style={{
            margin: 10,
            display: 'flex',
            flexDirection: 'column',
            rowGap: 20,
          }}
        >
          <div style={{ position: 'relative' }} >
            <GoogleMap
              markers={finalData}
              centerPoint={mapCenter}
              onClick={onInfoBoxClose}
              onMarkerClick={handleMarkerClick}
              onVisibleMarkersChanged={handleVisibleMarkersChanged}
              selectedIdx={selected}
            />
            {selected > -1 &&
              <MapTooltip
                event={translateEventDetails(finalData[selected], lang).description}
                time={finalData[selected].timestamp}
              />}
          </div>
          <TypeDropdown onFilter={setType} onTimeFilter={setTimeFilterPeriod} />
          <TimeScale />
          <ul style={{ paddingLeft: 0 }}>
            {visibleMarkers.slice(0, 10).map((m, idx) => (
              <EventInfo
                key={idx}
                event={m}
                setMapCenter={setMapCenter}
                scrollToMapContainer={scrollToMapContainer}
              />
            ))}
          </ul>
        </div>
      </div>
      {isSignedIn ? '' : <SocialBox />}
      <About />
      <CTA handleCTA={handleCTAClick} />
      {showSocialModal && <SocialModal setShowModal={setShowSocialModal} />}
    </>
  );
}
