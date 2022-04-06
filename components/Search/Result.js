import { React } from 'react';
import { trackSearchSelect } from '../../utils/googleAnalytics';
import { resultStyle, resultTextStyles } from './styles';
import { useTranslation, useSelectedLanguage } from 'next-export-i18n';

const ZOOM_LEVEL = 10;

const Result = ({
  cityObj,
  setCurrentCityObj,
  setMapCenter,
  setIsOpen,
  setSearchText
}) => {
  const { t } = useTranslation();
  const { lang } = useSelectedLanguage();
  const {
    city,
    lat,
    lng,
    translations,
    country
  } = cityObj;

  const handleOnClick = () => {
    setCurrentCityObj(cityObj);
    setMapCenter({ lat, lng, zoom: ZOOM_LEVEL });
    setIsOpen(false);
    setSearchText(`${translations[lang]}, ${t('ukraine')}`);
    trackSearchSelect({ city, country });
  };

  return (
    <li className='result' onClick={handleOnClick}>
      <style>{resultStyle}</style>
      <h4 style={resultTextStyles}>{translations[lang]}</h4>
      {/* TODO: Add/style results of list with color status,
      last event time, number of events in area within last week */}
    </li>
  );
};

Result.defaultProps = {
  cityObj: {
    city: '',
    lat: '',
    lng: '',
    country: '',
    translations: {
      en: '',
      ru: '',
      uk: ''
    }
  },
  setMapCenter: () => {},
  setIsOpen: () => {},
  setSearchText: () => {},
  setCurrentCityObj: () => {},
};

export default Result;
