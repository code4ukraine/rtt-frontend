import { React } from 'react';
import {useTranslation} from 'next-export-i18n';

const colorObj = [
  {
    index: 0,
    color: '#FEC876',
  },
  {
    index: 1,
    color: '#FCB25D',
  },
  {
    index: 2,
    color: '#FB9B4F',
  },
  {
    index: 3,
    color: '#F98840',
  },
  {
    index: 4,
    color: '#FA833A',
  },
  {
    index: 5,
    color: '#F9682E',
  },
  {
    index: 6,
    color: '#F84C27',
  },
]

const TimeScale = () => {
  const {t} = useTranslation()

  const handleSelect = (index) => {
    const daysFilter = 7 - index;
  };
  return (
    <div>
      <div
        style={{
          height: 60,
          justifyContent: 'center',
          maxWidth: '100vw',
        }}
      >
        {/* row */}
        <div
          style={{
            display: 'flex-row',
            justifyContent: 'center',
          }}
        >
          <p
            style={{
              fontSize: '10px',
              color: '#495057',
            }}
          >
            {t('timeOfEvent')}
          </p>
        </div>
        <div
          style={{
            marginTop: '5px',
            display: 'flex',
            justifyContent: 'left',
            width: '100%',
          }}
        >
          {/* // rectangles with colors */}
          {colorObj.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => handleSelect(index)}
                style={{
                  width: '16vw',
                  height: '1vw',
                  backgroundColor: item.color,
                  margin: '0px',
                  padding: '0px',
                  marginRight: '2px',
                }}
              />
            );
            }
          )}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <p
            style={{
              fontSize: '10px',
              color: '#495057',
            }}
          >
            {t('sevenDaysAgo')}
          </p>
          <p
            style={{
              fontSize: '10px',
              color: '#495057',
            }}
          >
            {t('oneDayAgo')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TimeScale;
