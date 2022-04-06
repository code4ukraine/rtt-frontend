import {useTranslation} from 'next-export-i18n';
import {trackSocialMediaClick} from '../utils/googleAnalytics'

const About = () => {
  const pressEmail = process.env.NEXT_PUBLIC_PRESS_EMAIL;
  const {t} = useTranslation();

  return (
    <div
      id="about"
      style={{
        backgroundColor: '#0D0D0D',
        padding: '3vw',
      }}
    >
      <div
        style={{
          color: '#737373',
          paddingTop: 20,
          paddingBottom: 20,
        }}
      >
        <h3
          style={{
            color: 'white',
            fontWeight: 'bold',
            paddingBottom: 20,
          }}
        >
          {t('about')}
        </h3>
        <p
          style={{
            color: '#CCCCCC',
            lineHeight: 1.5
          }}
        >
          {t('aboutBody')}
        </p>
      </div>
      <div
        style={{
          color: '#CCCCCC',
          paddingBottom: 20,
        }}
      >
        <h3
          id="disclaimer"
          style={{
            color: 'white',
            fontWeight: 'bold',
            paddingTop: 20,
            paddingBottom: 20,
          }}
        >
          {t('disclaimer')}
        </h3>
        <p
          style={{
            color: '#CCCCCC',
          }}
        >
          {t('disclaimerBody')}
        </p>
      </div>
      <div
        style={{
          color: '#CCCCCC',
        }}
      >
        <h3
          id="contact"
          style={{
            color: 'white',
            fontWeight: 'bold',
            paddingBottom: 20,
          }}
        >
          {t('contact')}
        </h3>
        <p
          style={{
            color: '#CCCCCC',
          }}
        >
          {t('contactBody')} <a href={`mailto:${pressEmail}`} style={{color:'#FAE937'}}>{pressEmail}</a>
          <br/><br/>
        </p>
      </div>
      <div
        style={{
          color: '#CCCCCC',
        }}
      >
        <h3
          id="contact"
          style={{
            color: 'white',
            fontWeight: 'bold',
            paddingBottom: 20,
          }}
        >
          {t('followUs')}
        </h3>
        <p
          style={{
            color: '#737373',
          }}
        >
          <a
            style={{color: '#FAE937'}}
            href="https://twitter.com/russiantracker"
            onClick={() => {trackSocialMediaClick({service: 'twitter'})}}
            target="_blank"
            rel="noopener noreferrer"
          >Twitter</a>
        </p>
      </div>
    </div>
  );
};

export default About;
