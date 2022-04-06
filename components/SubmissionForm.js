import React, { useState, useEffect } from 'react';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styles from './SubmissionForm.module.css';
import {useTranslation} from 'next-export-i18n';
import Link from 'next/link';
import LocationPicker from "./LocationPicker";


const schema = yup.object().shape({
  // yup validation for multiple select sightings options
  sightings: yup.object().shape({
    soldier: yup.boolean(),
    soldierDescription: yup.string(),
    highMobilityVehicle: yup.boolean(),
    highMobilityVehicleDescription: yup.string(),
    APC: yup.boolean(),
    APCDescription: yup.string(),
    tank: yup.boolean(),
    tankDescription: yup.string(),
    artillery: yup.boolean(),
    artilleryDescription: yup.string(),
    rockets: yup.boolean(),
    rocketsDescription: yup.string(),
    supplyTrucks: yup.boolean(),
    supplyTrucksDescription: yup.string(),
    roadBlock: yup.boolean(),
    airdefense: yup.boolean(),
    airdefenseDescription: yup.string(),
    airplaneHelicopter: yup.string(),
    airplaneHelicopterDescription: yup.string(),
    roadBlockDescription: yup.string(),
    soldierCiv: yup.boolean(),
    soldierCivDescription: yup.string(),
    other: yup.boolean(),
    otherDescription: yup.string(),
  }),
  time: yup.string(),
  location: yup.string(),
  description: yup.string(),
  photo: yup.mixed(),
})

const Error = ({children}) => <p className={styles.error}>{children}</p>

const SightingOption = ({form, fieldName, label, fieldDetailsName, detailsPlaceholder}) => {
  const {register, resetField, unregister, formState: {errors}} = form
  const [show, setShow] = useState(false)
  return (
    <label
      key={fieldName}
      onClick={(event) =>  {
        register(`sightings.${fieldDetailsName}`)
        setShow(true)
      }}
      className={styles.sightingOption}
    >
      <input
        key={fieldName}
        type="checkbox"
        onChange={(event) => {
          if (!event.target.checked) {
            unregister(`sightings.${fieldDetailsName}`)
            setShow(false)
          } else {
            setShow(true)
          }
        }}
      />
      {label}
      {/* display if checked */}
      {show && (
        <div className={styles.sightingOptionDetails}>
          <input type="text" placeholder={detailsPlaceholder} {...register(`sightings.${fieldDetailsName}`)} />
          {errors.sightings?.[fieldDetailsName] && <Error>{errors.sightings[fieldDetailsName].message}</Error>}
        </div>
      )}
    </label>
  )
}

function readFileAsync(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        resolve({
          url: reader.result,
          type: "image",
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
};


const SubmissionForm = () => {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const onSubmit = async (data) => {
    setSubmitting(true);
    if (data.photo[0] !== undefined) {
      const fileData = await readFileAsync(data.photo[0]);
      // set to data.photo[0]
      data.photo = fileData.url;
    } else {
      data.photo = '';
    }

    const url = process.env.NEXT_PUBLIC_UPLOAD_URL;
    // api POST request
    try {

      fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        credentials: 'include',
      })
      .then(response => {
        setSubmitting(false);
        if (response.status !== 200) {
          setError(response.statusText || t('errorWithSubmission'));
          setSubmitted(false);
        } else {
          setSubmitted(true);
          setError(null);
        }
        console.log(response)
      })
    } catch (ex) {
      setError(t('errorWithSubmission'));
      setSubmitting(false);
      setSubmitted(false);
    }
  }
  const [photoFile, setPhotoFile] = useState(null)
  const [today] = useState(new Date())
  const time = today.toTimeString()
  // get current time and time zone from date
  const {t} = useTranslation()
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      time: time,
      location: '',
    }
  })
  const {register, handleSubmit, setValue, formState: {errors}, watch} = form;

  useEffect(() => {
    // we will manually setValue when location changes
    register('location')
  }, [])

  const sightingOptions = [
    {
      id: '1',
      label: t('soldier'),
    },
    {
      id: '2',
      label: t('tank'),
    },
    {
      id: '3',
      label: t('highMobilityVehicle'),
    },
    {
      id: '4',
      label: t('APC'),
    },
    {
      id: '5',
      label: t('supplyTrucks'),
    },
    {
      id: '6',
      label: t('artillery'),
    },
    {
      id: '7',
      label: t('airdefense'),
    },
    {
      id: '8',
      label: t('airplaneHelicopter'),
    },
    {
      id: '9',
      label: t('roadBlock'),
    },
    {
      id: '10',
      label: t('soldierCiv'),
    },
    {
      id: '11',
      label: t('other'),
    }
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

      {errors.location && <Error>{JSON.stringify(errors.location)}</Error>}
      <LocationPicker onChange={(location)=>{setValue('location', `${location.lat},${location.lng}`)}}/>

      <h2 className={styles.sectionHeading}>{t('timeTitle')}</h2>
      <p>{t('timeDescription')}</p>
      <div className={styles.description}>
        <input
          type="text"
          // I have this defaulting to the current time, we can use full date time if preferred but we will have this from the api call probably
          placeholder={time || 'Time'}
          {...register('time')}
        />
        {errors.description && <Error>{errors.description.message}</Error>}
      </div>

      <h2 className={styles.sectionHeading}>
        {t('sightingTitle')}
      </h2>
      {sightingOptions.map(option => (
        <SightingOption
          key={option.id}
          form={form}
          fieldName={option.label}
          label={option.label}
          fieldDetailsName={option.label}
          detailsPlaceholder="How many? / What Type?"/>
      ))}

      <h2 className={styles.sectionHeading}>{t('descriptionTitle')}</h2>
        <p>
          {t('descriptionDescription')}
        </p>
      <div className={styles.description}>
        <textarea {...register('description')} />
        {errors.description && <Error>{errors.description.message}</Error>}
      </div>

      <h2 className={styles.sectionHeading}>{t('photoTitle')}</h2>
        <p>{t('photoDescription')}</p>
        <div>
          {/* remove file */}
          {photoFile && (
            <div
              className={styles.btn}
              onClick={() => setPhotoFile(null)}
            >
              <strong>
                {t('photoRemove')}
              </strong>
            </div>
          )}
        </div>
        <input
          type="file"
          {...register('photo', {required: true})}
          onChange={event => {
            setPhotoFile(event.target.files[0])
          }}
        />
      {errors.picture && <Error>{errors.picture.message}</Error>}

      <br/><br/>

      {submitted && !error ?
        <>
          {t('submissionThankYou')}
          <br/><br/>
          <Link href="/"><a style={{color: 'blue'}}>{t('goToMap')}</a></Link>
        </>
         : '' }
      {error && <Error>{error}</Error>}

      {submitting || submitted ? (
        <p>
          {!submitted ? t('submitting') : t('submitted')}
        </p>
      ) : (
        <>
          <input
            type="button"
            className={styles.submit}
            disabled={submitting}
            value={t('submit')}
            onClick={handleSubmit(onSubmit)}
          />
        </>
      )}
    </form>
  )
}

export default SubmissionForm
