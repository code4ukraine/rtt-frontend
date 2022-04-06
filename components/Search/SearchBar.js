import { React, useEffect, useState } from 'react';
import { useTranslation, useSelectedLanguage } from 'next-export-i18n';
import ResultsContainer from './ResultsContainer';
import {
  cancelBtnStyles,
  inputStyles,
  searchButtonStyles,
  searchStyles,
  staticStyles,
  staticSearchStyles,
} from './styles';
import { initialMapCenter } from '../../pages/index';
import { trackSearchActive } from '../../utils/googleAnalytics';

const isEmptyObj = (obj) => Object.keys(obj).length === 0;

const SearchBar = ({ cities, setMapCenter }) => {
  const { t } = useTranslation();
  const { lang } = useSelectedLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const [filteredCitiesList, setFilteredCitiesList] = useState(cities);
  const [currentCityObj, setCurrentCityObj] = useState({})
  const [searchText, setSearchText] = useState('');
  const [placeholder, setPlaceholder] = useState('');

  useEffect(() => {
    setPlaceholder(t('searchBar.placeholderText'));
    if (!isEmptyObj(currentCityObj)) {
      const { translations } = currentCityObj;
      setSearchText(`${translations[lang]}, ${t('ukraine')}`);
    }
  }, [lang]);

  const filterCities = (input) => {
    return cities.filter((city) => {
      return city.translations[lang]
        ?.toLowerCase()
        .startsWith(input.toLowerCase());
    });
  };

  useEffect(() => {
    setFilteredCitiesList(filterCities(searchText));
  }, [searchText]);

  const handleInput = (event) => {
    setSearchText(event.target.value);
  };

  const handleCancel = () => {
    setIsOpen(false);
    setSearchText('');
    setCurrentCityObj({});
    setMapCenter(initialMapCenter);
  };

  const handleOnClick = () => {
    setIsOpen(true);
    trackSearchActive();
  };

  return (
    // TODO: Cap results suggestion window at viewport height
    // TODO: Make results scrollable
    // TODO: Support phone keyboard?
    // TODO: Keyboard navigation for results list
    <>
      {/* TODO: Rename these ternary styles objects - they are confusing AF */}
      <div style={isOpen ? staticSearchStyles : searchStyles}>
        {isOpen && (
          // TODO: Import this SVG from close.svg (black)
          <svg
            width='25'
            height='25'
            viewBox='0 0 20 20'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M9.33333 14.6667C12.2789 14.6667 14.6667 12.2789 14.6667 9.33333C14.6667 6.38781 12.2789 4 9.33333 4C6.38781 4 4 6.38781 4 9.33333C4 12.2789 6.38781 14.6667 9.33333 14.6667Z'
              stroke='black'
              strokeWidth='1.5'
            />
            <path d='M16 16L13.1 13.1' stroke='black' strokeWidth='1.5' />
          </svg>
        )}
        <input
          autoComplete='off'
          type='text'
          placeholder={placeholder}
          id='city-search'
          name='search'
          onChange={handleInput}
          onClick={handleOnClick}
          // TODO: Also rename these confusing styles
          style={isOpen ? inputStyles : staticStyles}
          value={searchText}
        />
        {isOpen ? (
          <button style={cancelBtnStyles} onClick={handleCancel}>
            {/* TO DO: Import this icon from file */}
            <svg
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M15 5L5 15'
                stroke='white'
                strokeWidth='1.5'
                strokeLinecap='square'
                strokeLinejoin='round'
              />
              <path
                d='M5 5L15 15'
                stroke='white'
                strokeWidth='1.5'
                strokeLinecap='square'
                strokeLinejoin='round'
              />
            </svg>
          </button>
        ) : (
          // TODO: make this button clickable ?
          <button style={searchButtonStyles}>&#128269;</button>
        )}
      </div>

      {isOpen && (
        <ResultsContainer
          results={filteredCitiesList}
          setCurrentCityObj={setCurrentCityObj}
          setMapCenter={setMapCenter}
          setIsOpen={setIsOpen}
          setSearchText={setSearchText}
        />
      )}
    </>
  );
};

SearchBar.defaultProps = {
  cities: [],
  setMapCenter: () => { },
};

export default SearchBar;
