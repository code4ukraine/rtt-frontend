import { React } from 'react';
import Link from "next/link";
import {useTranslation} from 'next-export-i18n';

import { trackSocialMediaClick } from '../../utils/googleAnalytics';

const AddDataBanner = ({password}) => {
  const {t} = useTranslation()
  return (
    <div
      style={{
        borderTop: '1px solid #212529',
        borderBottom: '1px solid #212529',
      }}
    >
      <div className="container">
        <Link href="/submission">
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              backgroundColor: 'red',
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
                color: 'white',
                width: '20px',
                height: '20px',
                marginLeft: '20px',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p
              style={{
                fontSize: '.8rem',
                fontWeight: 'normal',
                color: 'white',
                paddingBottom: '5px',
              }}
            >
              {t('youAreInvited')} - <strong>{t('clickHere')}</strong>
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default AddDataBanner;