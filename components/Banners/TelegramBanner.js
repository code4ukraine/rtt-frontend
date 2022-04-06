import { React } from 'react';
import Link from "next/link";
import {useTranslation} from 'next-export-i18n';

import { trackSocialMediaClick } from '../../utils/googleAnalytics';

const TelegramBanner = () => {
  const {t} = useTranslation()
  return (
    <div
      style={{
        borderTop: '1px solid #212529',
        borderBottom: '1px solid #212529',
      }}
    >
      <div className="container">
        <Link href="/">
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              backgroundColor: '#FAE937',
              justifyContent: {
                xs: 'center',
                sm: 'space-between',
              },
              columnGap: 15,
              minHeight: 5,
            }}
          >
            <div
              style={{
                display: 'inline-block',
                color: '#0D0D0D',
                width: '20px',
                height: '20px',
                marginLeft: '20px',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <p
              style={{
                fontSize: '.8rem',
                fontWeight: 'normal',
                color: '#0D0D0D',
                paddingBottom: '5px',
              }}
            >
              {t('topSocialBanner')}
            <a
              href="https://twitter.com/russiantracker?s=21"
              onClick={() => {
                // TODO - account not created yet
                trackSocialMediaClick({service: 'twitter'})
                window.open('https://twitter.com/russiantracker');
              }}
            >
              <strong> Twitter → </strong>
            </a>
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default TelegramBanner;