import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useTranslation, useSelectedLanguage } from 'next-export-i18n';

import { trackEventFilterActive,trackEventFilterSelect } from '../utils/googleAnalytics';


const customStyles = {
  //add black border on container with icon left of label
  container: (provided) => ({
    ...provided,
    border: "1px solid black",
    borderRadius: "4px",
    width: "100%",
  })
}

export default function FilterDropdown(props) {
  const {t} = useTranslation();
  const { lang } = useSelectedLanguage();

  const selectOptions = [
    { value: 'Sighting', label: t('typeSightings'),
      icon: <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M9 2H10V7H9V2ZM7 9H2V10H7V9ZM9 12V17H10V12H9ZM12 10H17V9H12V10Z" fill="black"/>
            </svg>
    },
    { value: 'Combat', label: t('typeCombat'),
      icon: <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M9 2H10V7H9V2ZM7 9H2V10H7V9ZM9 12V17H10V12H9ZM12 10H17V9H12V10Z" fill="black"/>
            </svg>
    },
    { value: 'Strike', label: t('typeStrikes'),
      icon: <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M9 2H10V7H9V2ZM7 9H2V10H7V9ZM9 12V17H10V12H9ZM12 10H17V9H12V10Z" fill="black"/>
            </svg>
    },
    { value: 'Abandoned', label: t('typeAbandoned'),
      icon: <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M9 2H10V7H9V2ZM7 9H2V10H7V9ZM9 12V17H10V12H9ZM12 10H17V9H12V10Z" fill="black"/>
            </svg>
    },
    { value: 'all events',
      label: t('allEvents'),
      icon: <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M9 2H10V7H9V2ZM7 9H2V10H7V9ZM9 12V17H10V12H9ZM12 10H17V9H12V10Z" fill="black"/>
            </svg>
    },
  ]

  const timeOptions = [
    { value: 1,
      label: t('past24Hours'),
      icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 25 25" stroke="black" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
    },
    { value: 3, label: t('past3Days'),
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 25 25" stroke="black" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
    },
    { value: 7, label: t('pastWeek'),
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 25 25" stroke="black" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
    }
  ]

  const { onFilter, onTimeFilter } = props;
  const [optionValue, setOptionValue] = useState(selectOptions[4]);
  const [timeValue, setTimeValue] = useState(timeOptions[2]);

  const handleSelect = (e) => {
    trackEventFilterSelect({category: 'engagement', value: e.value})
    onFilter(e.value);
    setOptionValue(e);
  };
  const handleTimeSelect = (e) => {
    trackEventFilterSelect({category: 'time', value: e.value})
    onTimeFilter(e.value);
    setTimeValue(e);
  };

  useEffect(() => {
    onFilter(optionValue.value);
    setOptionValue(optionValue);
  }, [selectOptions[4].label]);

  useEffect(() => {
    onTimeFilter(timeValue.value);
    setTimeValue(timeValue);
  }, [timeOptions[2].label]);

  useEffect(() => {
    onFilter(selectOptions[4].value)
    onTimeFilter(timeOptions[2].value)
    setOptionValue(selectOptions[4]);
    setTimeValue(timeOptions[2]);
  }, [lang]);

  return (
    <div>
      <div
        style={{
          float: 'left',
          width: '47.5%',
          margin: 'auto',
        }}
      >
        <h3>{t('eventType')}</h3>
        <br />
        <Select
          instanceId={'type-select'}
          isSearchable={false}
          options={selectOptions}
          styles={customStyles}
          defaultValue={selectOptions[2]}
          onClick={() => trackEventFilterActive({category: 'engagement'})}
          onChange={handleSelect}
          value={optionValue}
          getOptionLabel={e => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {e.icon ? e.icon : null}
              <span style={{ marginLeft: 5 }}>{e.label}</span>
            </div>
          )}
        />
      </div>
      <div
        style={{
          float: 'right',
          width: '47.5%',
        }}
      >
        <h3>{t('time')}</h3>
        <br />
        <Select
          instanceId={'type-select'}
          isSearchable={false}
          options={timeOptions}
          defaultValue={timeOptions[0]}
          styles={customStyles}
          onClick={() => trackEventFilterActive({category: 'time'})}
          onChange={handleTimeSelect}
          value={timeValue}
          getOptionLabel={e => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {e.icon}
              <span style={{ marginLeft: 5 }}>{e.label}</span>
            </div>
          )}
        />
      </div>
    </div>
  );
}
