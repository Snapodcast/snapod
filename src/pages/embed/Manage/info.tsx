import React, { useContext } from 'react';
import Store from '../../../lib/Store';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PODCAST, MODIFY_PODCAST } from '../../../lib/GraphQL/queries';
import { Input, TextArea } from '../../../components/Form';
import Head from '../../../components/Head';
import CateSelect from '../../../components/CateSelect';
import Switch from 'react-switch';
import LangSelect from '../../../components/LangSelect';
import Icons from '../../../components/Icons';
import selectImageAndUploadToCDN from '../../../lib/Upload/Image';
import { useHistory } from 'react-router';
import { PodcastContext } from '../../../lib/Context';
import { useI18n } from '../../../hooks';

export default function ManagePodcast() {
  const { t } = useI18n();
  const podcastCuid = Store.get('currentPodcast.cuid');
  const { setName } = useContext(PodcastContext);
  const history = useHistory();
  const [modifyPodcast] = useMutation(MODIFY_PODCAST);
  const [podcastInfo, setInfo] = React.useState<any>({
    name: '',
    description: '',
    type: 'episodic',
    clean_content: 'false',
    language: 'zh-cn',
    category_name: '',
    useCr: false,
    copyright: '',
    useOwner: false,
    ownerName: '',
    ownerEmail: '',
    complete: 'false',
    block: 'false',
  });
  const [savable, setSavable] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);

  const { loading, error, data, refetch } = useQuery(GET_PODCAST, {
    variables: { podcastCuid },
    fetchPolicy: 'network-only',
    onCompleted: () => {
      setInfo({
        name: data.podcast.name,
        description: data.podcast.description,
        type: data.podcast.type,
        clean_content: data.podcast.profile.clean_content ? 'true' : 'false',
        language: data.podcast.profile.language,
        category_name: data.podcast.profile.category_name,
        useCr: !!data.podcast.profile.copyright,
        copyright: data.podcast.profile.copyright,
        useOwner: !!data.podcast.profile.ownerName,
        ownerName: data.podcast.profile.ownerName,
        ownerEmail: data.podcast.profile.ownerEmail,
        complete: data.podcast.profile.complete.toString(),
        block: data.podcast.profile.block.toString(),
        cover_art_image_url: data.podcast.profile.cover_art_image_url,
      });
    },
  });

  /* Save action */
  const doSave = async () => {
    if (!uploading) {
      setSaving(true);
      const variables = {
        ...podcastInfo,
        podcastCuid,
        clean_content: podcastInfo.clean_content === 'true',
        copyright: podcastInfo.useCr ? podcastInfo.copyright : null,
        ownerName: podcastInfo.useOwner ? podcastInfo.ownerName : null,
        ownerEmail: podcastInfo.useOwner ? podcastInfo.ownerEmail : null,
        complete: podcastInfo.complete === 'true',
        block: podcastInfo.block === 'true',
      };

      await modifyPodcast({
        variables,
      })
        .then((res: any) => {
          Store.set('currentPodcast.name', res.data.modifyPodcast.name);
          setName(res.data.modifyPodcast.name);
          setSavable(false);
          alert(t('successfullyModified'));
        })
        .catch(() => {
          alert(t('errorModifying'));
        });
      setSaving(false);
    }
  };

  /* Select cover art image action */
  const selectImage = async () => {
    setUploading(true);
    const result = await selectImageAndUploadToCDN();
    setInfo({
      ...podcastInfo,
      image: result.imagePath,
      cover_art_image_url: result.remotePath,
    });
    setUploading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="w-5 h-5">
          <Icons name="spinner" />
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center error-container">
        <div className="-mt-3">
          <p className="mb-3 flex justify-center">
            <span className="h-28 w-28 text-gray-200">
              <Icons name="warning" />
            </span>
          </p>
          <div className="justify-center flex">
            <button
              aria-label="refetch"
              type="button"
              className="flex justify-center align-middle items-center text-white text-sm hover:bg-gray-600 bg-gray-500 focus:outline-none rounded-md shadow-md py-1.5 px-4 text-center"
              onClick={() => {
                refetch();
              }}
            >
              {t('reload')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 mb-14">
      <Head
        title={t('manageInfoTitle')}
        description={t('manageInfoDescription')}
      />
      {savable && (
        <div className="flex justify-center items-center w-full">
          <div className="flex absolute bottom-5 z-10 gap-x-3">
            <button
              className="bg-gray-500 tracking-wide text-center text-sm py-1 px-5 shadow-lg rounded-2xl whitespace-nowrap text-white hover:bg-gray-600"
              aria-label="save changes"
              type="button"
              onClick={() => {
                history.push('/snapod/reset');
              }}
            >
              {t('reset')}
            </button>
            <button
              className="bg-blue-500 tracking-wide text-center text-sm py-1 px-5 shadow-lg rounded-2xl whitespace-nowrap text-white hover:bg-blue-600"
              aria-label="save changes"
              type="button"
              onClick={() => {
                doSave();
              }}
            >
              {saving
                ? t('saving')
                : uploading
                ? t('uploading')
                : t('saveChanges')}
            </button>
          </div>
        </div>
      )}
      <section className="border-b flex gap-x-8 mb-4 pb-8 mx-5 border-gray-200 dark:border-gray-500">
        <div>
          <button
            aria-label="upload image"
            type="button"
            className="bg-gray-100 rounded-xl h-64 w-64 flex items-center justify-center shadow-lg border border-gray-300"
            onClick={() => {
              if (!uploading) {
                selectImage();
              }
              setSavable(true);
            }}
            style={{
              backgroundImage: `url(${
                podcastInfo.image || podcastInfo.cover_art_image_url
              })`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {!podcastInfo.image && !podcastInfo.cover_art_image_url && (
              <span className="text-gray-500">
                <span className="episode-image-placeholder flex justify-center">
                  <Icons name="microphone" />
                </span>
                <br />
                <span>{t('coverArt')}</span>
              </span>
            )}
          </button>
          {uploading && (
            <div className="flex justify-center">
              <span className="bg-blue-500 py-1 px-3 text-xs text-white rounded-xl absolute -mt-9 shadow-lg">
                {t('uploading')}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <div>
            <Input
              disabled={uploading}
              name={t('podcastName')}
              placeholder={data.podcast.name}
              defaultValue={data.podcast.name}
              onChange={(e: { target: { value: any } }) => {
                setInfo({
                  ...podcastInfo,
                  name: e.target.value,
                });
                setSavable(true);
              }}
            />
          </div>
          <div className="mt-5">
            <TextArea
              disabled={uploading}
              name={t('podcastDescription')}
              placeholder={data.podcast.description}
              defaultValue={data.podcast.description}
              onChange={(e: { target: { value: any } }) => {
                setInfo({
                  ...podcastInfo,
                  description: e.target.value,
                });
                setSavable(true);
              }}
              maxLength={255}
              minLength={1}
              rows={3}
            />
          </div>
          <div className="mt-3 flex gap-x-3">
            <div className="flex-1">
              <span className="flex items-center">
                <em className="ml-1 text-xs font-medium text-gray-500 dark:text-white not-italic flex-1">
                  {t('podcastType')}
                </em>
              </span>
              <select
                disabled={uploading}
                defaultValue={data.podcast.type}
                onChange={(e) => {
                  setInfo({ ...podcastInfo, type: e.target.value });
                  setSavable(true);
                }}
                className="mt-1 tracking-wide dark:bg-transparent dark:text-gray-300 dark:border-gray-500 focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-1.5 text-gray-700"
              >
                <option value="" disabled>
                  {t('choosePodcastType')}
                </option>
                <option value="episodic">{t('episodic')}</option>
                <option value="serial">{t('serial')}</option>
              </select>
            </div>
            <div className="flex-1">
              <span className="flex items-center">
                <em className="ml-1 text-xs font-medium text-gray-500 dark:text-white not-italic flex-1">
                  {t('podcastRating')}
                </em>
              </span>
              <select
                disabled={uploading}
                defaultValue={
                  data.podcast.profile.clean_content ? 'true' : 'false'
                }
                onChange={(e) => {
                  setInfo({
                    ...podcastInfo,
                    clean_content: e.target.value,
                  });
                  setSavable(true);
                }}
                className="mt-1 tracking-wide dark:bg-transparent dark:text-gray-300 dark:border-gray-500 focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-1.5 text-gray-700"
              >
                <option value="" disabled>
                  {t('choosePodcastRating')}
                </option>
                <option value="false">{t('explicit')}</option>
                <option value="true">{t('noExplicit')}</option>
              </select>
            </div>
          </div>
        </div>
      </section>
      <section className="flex gap-x-4 pt-3 mx-5">
        <section className="flex-1 border dark:border-gray-500 rounded-lg px-3 py-3.5">
          <div className="items-center mb-4">
            <span className="flex-1 items-center">
              <em className="ml-1 text-base font-medium text-gray-500 dark:text-white not-italic">
                {t('podcastMetadata')}
              </em>
              <em className="ml-1 text-sm font-medium text-gray-400 dark:text-white not-italic">
                {t('podcastMetadataDescription')}
              </em>
            </span>
          </div>
          <div>
            <span className="flex items-center">
              <em className="ml-1 text-xs font-medium text-gray-500 dark:text-gray-300 not-italic flex-1">
                {t('podcastLanguage')}
              </em>
            </span>
            <LangSelect
              disabled={uploading}
              podcastLang={podcastInfo.language}
              setLang={(language: string) => {
                setInfo({ ...podcastInfo, language });
                setSavable(true);
              }}
            />
          </div>
          <div className="mt-5">
            <span className="flex items-center">
              <em className="ml-1 text-xs font-medium text-gray-500 dark:text-gray-300 not-italic flex-1">
                {t('podcastCategory')}
              </em>
            </span>
            <CateSelect
              disabled={uploading}
              podcastCate={podcastInfo.category_name}
              setCate={(category_name: string) => {
                setInfo({ ...podcastInfo, category_name });
                setSavable(true);
              }}
            />
          </div>
          <div className="mt-5">
            <span className="flex items-center">
              <em className="ml-1 text-xs font-medium text-gray-500 dark:text-gray-300 not-italic flex-1">
                {t('podcastCopyright')}
              </em>
              <Switch
                disabled={uploading}
                onChange={() => {
                  setInfo({
                    ...podcastInfo,
                    useCr: !podcastInfo.useCr,
                  });
                  setSavable(true);
                }}
                checked={podcastInfo.useCr}
                handleDiameter={10}
                uncheckedIcon={false}
                checkedIcon={false}
                height={14}
                width={26}
                className="react-switch"
              />
            </span>
            <input
              disabled={!podcastInfo.useCr || uploading}
              placeholder={data.podcast.profile.copyright}
              defaultValue={data.podcast.profile.copyright}
              onChange={(e: { target: { value: any } }) => {
                setInfo({
                  ...podcastInfo,
                  copyright: e.target.value,
                });
                setSavable(true);
              }}
              className="mt-1 tracking-wide dark:bg-transparent dark:text-gray-300 dark:border-gray-500 focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
            />
          </div>
        </section>
        <section>
          <section className="border dark:border-gray-500 rounded-lg px-3 py-3.5">
            <div className="flex items-center mb-4">
              <span className="flex-1 items-center">
                <em className="ml-1 text-base font-medium text-gray-500 dark:text-white not-italic">
                  {t('podcastOwnerInfo')}
                </em>
                <em className="ml-1 text-sm font-medium text-gray-400 dark:text-white not-italic">
                  {t('podcastOwnerInfoDescription')}
                </em>
              </span>
              <Switch
                disabled={uploading}
                onChange={() => {
                  setInfo({
                    ...podcastInfo,
                    useOwner: !podcastInfo.useOwner,
                  });
                  setSavable(true);
                }}
                checked={podcastInfo.useOwner}
                handleDiameter={14}
                uncheckedIcon={false}
                checkedIcon={false}
                height={18}
                width={34}
                className="react-switch"
              />
            </div>
            <div>
              <Input
                disabled={!podcastInfo.useOwner || uploading}
                name={t('podcastOwnerName')}
                placeholder={data.podcast.profile.ownerName}
                defaultValue={data.podcast.profile.ownerName}
                onChange={(e: { target: { value: any } }) => {
                  setInfo({
                    ...podcastInfo,
                    ...{ ownerName: e.target.value },
                  });
                  setSavable(true);
                }}
              />
            </div>
            <div className="mt-3">
              <Input
                disabled={!podcastInfo.useOwner || uploading}
                name={t('podcastOwnerEmail')}
                placeholder={data.podcast.profile.ownerEmail}
                defaultValue={data.podcast.profile.ownerEmail}
                onChange={(e: { target: { value: any } }) => {
                  setInfo({
                    ...podcastInfo,
                    ownerEmail: e.target.value,
                  });
                  setSavable(true);
                }}
              />
            </div>
          </section>
          <section className="mt-4 flex gap-x-3 border rounded-lg px-3 py-3.5">
            <div className="flex-1">
              <span className="flex items-center">
                <em className="ml-1 text-xs font-medium text-gray-500 dark:text-white not-italic flex-1">
                  {t('podcastCompletion')}
                </em>
              </span>
              <select
                disabled={uploading}
                defaultValue={data.podcast.profile.complete}
                onChange={(e) => {
                  setInfo({
                    ...podcastInfo,
                    complete: e.target.value,
                  });
                  setSavable(true);
                }}
                className="mt-1 tracking-wide focus:outline-none dark:bg-transparent dark:text-white dark:border-gray-500 focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-1.5 text-gray-700"
              >
                <option value="" disabled>
                  {t('isPodcastCompleted')}
                </option>
                <option value="true">{t('completed')}</option>
                <option value="false">{t('incomplted')}</option>
              </select>
            </div>
            <div className="flex-1">
              <span className="flex items-center">
                <em className="ml-1 text-xs font-medium text-gray-500 dark:text-gray-300 not-italic flex-1">
                  {t('podcastSearchEngineIndexing')}
                </em>
              </span>
              <select
                disabled={uploading}
                defaultValue={data.podcast.profile.block}
                onChange={(e) => {
                  setInfo({
                    ...podcastInfo,
                    block: e.target.value,
                  });
                  setSavable(true);
                }}
                className="mt-1 tracking-wide focus:outline-none dark:bg-transparent dark:text-gray-300 dark:border-gray-500 focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-1.5 text-gray-700"
              >
                <option value="" disabled>
                  {t('blockSearchEngineIndexing')}
                </option>
                <option value="true">{t('blocked')}</option>
                <option value="false">{t('notBlocked')}</option>
              </select>
            </div>
          </section>
        </section>
      </section>
    </div>
  );
}
