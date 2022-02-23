/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react';
import { useHistory } from 'react-router-dom';
import CateSelect from '../../../components/CateSelect';
import LangSelect from '../../../components/LangSelect';
import Switch from 'react-switch';
import Icons from '../../../components/Icons';
import { CREATE_PODCAST } from '../../../lib/GraphQL/queries';
import { useMutation } from '@apollo/client';
import Store from '../../../lib/Store';
import selectImageAndUploadToCDN from '../../../lib/Upload/Image';
import { useI18n } from '../../../hooks';

interface ContainerInterface {
  stepNumber: number;
  setStep: any;
  podcastInfo: any;
  setPodcastInfo: any;
  podcastImage: string;
  selectImage: any;
  uploading: boolean;
}

const StepContainer = ({
  stepNumber,
  setStep,
  podcastInfo,
  setPodcastInfo,
  podcastImage,
  selectImage,
  uploading,
}: ContainerInterface) => {
  const { t } = useI18n();
  switch (stepNumber) {
    case 6:
      return (
        <div className="justify-center mt-5 text-center">
          <p className="w-full flex justify-center mb-2">
            <span className="w-6 h-6">
              <Icons name="spinner" />
            </span>
          </p>
          <p className="ml-1 text-xs font-medium text-gray-500">
            {t('saving')}
          </p>
        </div>
      );
    case 5:
      return (
        <div className="mt-5 w-full rounded-md bg-gray-100 h-25 flex p-2.5 gap-x-2">
          <button
            aria-label="upload image"
            type="button"
            onClick={() => {
              if (!uploading) {
                selectImage();
              }
            }}
            className="bg-gray-200 rounded-md h-20 w-20 flex items-center justify-center flex-2 border"
            style={{
              backgroundImage: `url(${podcastImage || ''})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {!podcastImage && (
              <span className="w-6 h-6 text-gray-500">
                <Icons name="image" />
              </span>
            )}
          </button>
          <div className="flex-1 flex items-center">
            <div>
              <p className="ml-1 text-xs font-medium text-gray-500 not-italic">
                {t('coverArt')}
              </p>
              <p className="text-xs text-gray-400 ml-1 mt-1">
                {!uploading ? t('coverArtRequirements') : t('uploading')}
              </p>
            </div>
          </div>
        </div>
      );
    case 4:
      return (
        <div>
          <p className="w-full mt-5">
            <span className="flex items-center">
              <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
                {t('podcastLanguage')}
              </em>
            </span>
            <LangSelect
              podcastLang={podcastInfo.lang}
              setLang={(lang: string) => {
                setPodcastInfo({ ...podcastInfo, ...{ lang } });
              }}
            />
            <span className="text-xs text-gray-400 ml-1 mt-1">
              {t('podcastLanguageDescription')}
            </span>
          </p>
          <p className="w-full mt-5">
            <span className="flex items-center">
              <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
                {t('podcastRating')}
              </em>
            </span>
            <select
              onChange={(e) => {
                setPodcastInfo({
                  ...podcastInfo,
                  ...{ contentType: e.target.value },
                });
              }}
              className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-1.5 text-gray-700"
            >
              <option value="" disabled>
                {t('podcastRatingDescription')}
              </option>
              <option value="yes">{t('explicit')}</option>
              <option value="no">{t('noExplicit')}</option>
            </select>
            <span className="text-xs text-gray-400 ml-1 mt-1">
              {t('podcastRatingDescription')}
            </span>
          </p>
          <div className="w-full mt-5">
            <span className="flex items-center">
              <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
                {t('podcastCopyright')}
              </em>
              <Switch
                onChange={() => {
                  setPodcastInfo({
                    ...podcastInfo,
                    ...{ useCr: !podcastInfo.useCr },
                  });
                }}
                checked={podcastInfo.useCr}
                handleDiameter={14}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                height={16}
                width={34}
                className="react-switch"
              />
            </span>
            <input
              disabled={!podcastInfo.useCr}
              placeholder={t('podcastCopyrightPlaceholder')}
              onChange={(e) => {
                setPodcastInfo({
                  ...podcastInfo,
                  ...{ copyRight: e.target.value },
                });
              }}
              className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
            />
            <span className="text-xs text-gray-400 ml-1 mt-1">
              {t('podcastCopyrightDescription')}
            </span>
          </div>
          <div className="w-full mt-5">
            <span className="flex items-center">
              <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
                {t('podcastOwnerInformation')}
              </em>
              <Switch
                onChange={() => {
                  setPodcastInfo({
                    ...podcastInfo,
                    ...{ useOwner: !podcastInfo.useOwner },
                  });
                }}
                checked={podcastInfo.useOwner}
                handleDiameter={14}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                height={16}
                width={34}
                className="react-switch"
              />
            </span>
            <input
              disabled={!podcastInfo.useOwner}
              placeholder={t('podcastOwnerName')}
              onChange={(e) => {
                setPodcastInfo({
                  ...podcastInfo,
                  ...{ ownerName: e.target.value },
                });
              }}
              className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
            />
            <input
              disabled={!podcastInfo.useOwner}
              placeholder={t('podcastOwnerEmail')}
              onChange={(e) => {
                setPodcastInfo({
                  ...podcastInfo,
                  ...{ ownerEmail: e.target.value },
                });
              }}
              className="mt-2 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
            />
            <span className="text-xs text-gray-400 ml-1 mt-1">
              {t('podcastOwnerDescription')}
            </span>
          </div>
        </div>
      );
    case 3:
      return (
        <p className="w-full mt-5">
          <span className="flex items-center">
            <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
              {t('podcastType')}
            </em>
          </span>
          <select
            onChange={(e) => {
              setPodcastInfo({ ...podcastInfo, ...{ type: e.target.value } });
            }}
            className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-1.5 text-gray-700"
          >
            <option value="" disabled>
              {t('choosePodcastType')}
            </option>
            <option value="episodic">{t('episodic')}</option>
            <option value="serial">{t('serial')}</option>
          </select>
          <span className="text-xs text-gray-400 ml-1 mt-1">
            {t('podcastTypeDescription')}
          </span>
        </p>
      );
    case 2:
      return (
        <p className="w-full mt-5">
          <span className="flex items-center">
            <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
              {t('podcastCategory')}
            </em>
          </span>
          <CateSelect
            podcastCate={podcastInfo.cate}
            setCate={(cate: string) => {
              setPodcastInfo({ ...podcastInfo, ...{ cate } });
            }}
          />
          <span className="text-xs text-gray-400 ml-1 mt-1">
            {t('podcastCategoryDescription')}
          </span>
        </p>
      );
    case 1:
      return (
        <p className="w-full mt-5">
          <span className="flex items-center">
            <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
              {t('podcastDescription')}
            </em>
          </span>
          <textarea
            autoFocus
            placeholder={t('podcastDescriptionPlaceholder')}
            maxLength={255}
            minLength={1}
            rows={3}
            onChange={(e) => {
              setPodcastInfo({ ...podcastInfo, ...{ des: e.target.value } });
            }}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                setStep(stepNumber + 1);
              }
            }}
            className="mt-1 resize-none tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
          />
          <span className="text-xs text-gray-400 ml-1 -mt-0.5">
            {t('podcastDescriptionDescription')}
          </span>
        </p>
      );
    default:
      return (
        <p className="w-full mt-5">
          <span className="flex items-center">
            <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
              {t('podcastName')}
            </em>
          </span>
          <input
            autoFocus
            placeholder={t('podcastNamePlaceholder')}
            maxLength={255}
            minLength={1}
            onChange={(e) => {
              setPodcastInfo({ ...podcastInfo, ...{ name: e.target.value } });
            }}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                setStep(stepNumber + 1);
              }
            }}
            className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
          />
          <span className="text-xs text-gray-400 ml-1 mt-1">
            ({podcastInfo.name ? podcastInfo.name.length : 0} / 255)
            {t('podcastNameDescription')}
          </span>
        </p>
      );
  }
};

export default function CreatePodcast() {
  const { t } = useI18n();
  const history = useHistory();
  const [creatPodcast] = useMutation(CREATE_PODCAST);

  const [stepNumber, setStepNumber] = React.useState(0);
  const [podcastImage, setImage] = React.useState<any>('');
  const [podcastImageUrl, setImageUrl] = React.useState<any>('');
  const [podcastImageUploading, setUploading] = React.useState(false);
  const [podcastInfo, setPodcastInfo] = React.useState({
    name: '',
    des: '',
    type: 'episodic',
    contentType: 'no',
    cate: '',
    lang: 'zh-cn',
    useCr: false,
    useOwner: false,
    ownerName: '',
    ownerEmail: '',
    copyRight: '©️',
  });

  const selectImage = async () => {
    setUploading(true);
    const result = await selectImageAndUploadToCDN();
    setImage(result.imagePath);
    setImageUrl(result.remotePath);
    setUploading(false);
  };

  const doCreatePodcast = async () => {
    await creatPodcast({
      variables: {
        authorCuid: Store.get('currentUser.cuid'),
        name: podcastInfo.name,
        description: podcastInfo.des,
        type: podcastInfo.type,
        language: podcastInfo.lang,
        category: podcastInfo.cate,
        contentClean: podcastInfo.contentType === 'no',
        coverImageUrl: podcastImageUrl,
        copyright: podcastInfo.useCr ? podcastInfo.copyRight : null,
        ownerName: podcastInfo.useOwner ? podcastInfo.ownerName : null,
        ownerEmail: podcastInfo.useOwner ? podcastInfo.ownerEmail : null,
      },
    })
      .then((res: any) => {
        Store.set({
          currentPodcast: res.data.createPodcast,
        });
        alert(t('successfullyCreatedAPodcast'));
        history.push('/snapod');
      })
      .catch(() => {
        alert(t('failedToSave'));
        setStepNumber(5);
      });
  };

  return (
    <div className="z-10 shadow-md rounded-md w-2/5 bg-white px-8 py-7 no-drag animate-slideUp">
      {stepNumber === 0 && (
        <div className="absolute -mt-17 -ml-5 flex w-2/5 pr-7 items-center">
          <div className="flex-1">
            <button
              className="flex-1 rounded-full bg-white shadow-md flex justify-center items-center h-7 w-7 text-gray-600"
              aria-label="select existing podcast"
              type="button"
              onClick={() => {
                history.goBack();
              }}
            >
              ←
            </button>
          </div>
        </div>
      )}
      <div>
        <div className="mb-2 flex gap-x-2 items-center">
          <h2 className="font-bold text-xl tracking-wide flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis">
            <span role="img" aria-label="snapod-logo" className="mr-1">
              🎙️
            </span>
            {podcastInfo.name || t('newPodcast')}
          </h2>
          <span className="text-gray-500 text-sm">
            {t('step')} {stepNumber + 1} / 7
          </span>
        </div>
        <StepContainer
          stepNumber={stepNumber}
          setStep={setStepNumber}
          podcastInfo={podcastInfo}
          setPodcastInfo={setPodcastInfo}
          podcastImage={podcastImage}
          selectImage={selectImage}
          uploading={podcastImageUploading}
        />
        {stepNumber < 6 && (
          <div className="mt-5 w-full flex gap-x-3">
            {stepNumber > 0 && (
              <button
                aria-label="previous step"
                className="flex px-3 items-center text-white text-sm hover:bg-gray-700 bg-gray-600 focus:outline-none rounded-md shadow-md py-1 text-center"
                type="button"
                onClick={() => {
                  setStepNumber(stepNumber - 1);
                }}
              >
                ← {t('previousStep')}
              </button>
            )}
            <button
              aria-label="next step"
              className="flex px-3 items-center text-white text-sm hover:bg-gray-700 bg-gray-600 focus:outline-none rounded-md shadow-md py-1 text-center"
              type="button"
              onClick={() => {
                setStepNumber(stepNumber + 1);
                if (stepNumber === 5 && !podcastImageUploading) {
                  doCreatePodcast();
                }
              }}
            >
              {stepNumber === 5
                ? `${t('createANewPodcast')} →`
                : `${t('nextStep')} →`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
