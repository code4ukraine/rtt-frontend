import {React} from 'react';
import SelectLocale from '../../i18n/SelectLocale';
import {useTranslation} from 'next-export-i18n';
import Link from 'next/link';

const Banner = () => {
  const {t} = useTranslation()
  return (
    <div
      style={{
        borderTop: '1px solid #212529',
      }}
    >
      <div className="container">
        <div
          style={{
            backgroundColor: '#0D0D0D',
            color: 'white',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: 15,
            }}
          >

            <Link href="/"><img
              src="logo.svg"
              style={{
                borderRadius: 2,
                marginRight: 10,
                height: 30,
                width: 'auto',
                cursor: 'pointer'
              }}
              alt="logo"
            /></Link>

            <h1
              style={{
                fontWeight: 'regular',
                fontSize: '1.1rem',
                color: 'white',
                margin: 0,
              }}
            >
              Russian Threat Tracker
            </h1>

            <div style={{flexGrow: 1}}/>

            <SelectLocale/>
          </div>
        </div>
      </div>
      <div
        style={{
          // display: 'sticky',
          // height: 30,
          backgroundColor: '#0D0D0D',
          color: 'white',
          display: 'flex',
        }}
      >
        <div
          style={{
            paddingLeft: '12px',
            paddingBottom: '10px',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              color: 'white',
              display: 'inline',
            }}
          >
            {t('topAbout')}
            {' '}
            <a
              onClick={() => {
                document.getElementById('about').scrollIntoView();
              }}
              style={{
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              {t('learnMore')}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Banner;
