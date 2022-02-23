import React from 'react';
import Store from '../../../lib/Store';
import { useQuery, useMutation } from '@apollo/client';
import { GET_EPISODE, MODIFY_EPISODE } from '../../../lib/GraphQL/queries';
import { Input } from '../../../components/Form';
import Head from '../../../components/Head';
import Switch from 'react-switch';
import Editor from 'rich-markdown-editor';
import Icons from '../../../components/Icons';
import selectImageAndUploadToCDN from '../../../lib/Upload/Image';
import Player from '../../../components/Player';
import selectAudioFileAndUploadToCDN from '../../../lib/Upload/Audio';
import { uploadFile } from '../../../lib/Qiniu';
import { useHistory } from 'react-router';
import { motion } from 'framer-motion';
import { useI18n } from '../../../hooks';

export default function ManageEpisode() {
  const { t } = useI18n();
  const history = useHistory();
  const episodeCuid = Store.get('currentEpisode.cuid');
  const episodeTitle = Store.get('currentEpisode.title');
  const [modifyEpisode] = useMutation(MODIFY_EPISODE);
  const [episodeInfo, setInfo] = React.useState<any>({
    title: '',
    content: '',
    published: false,
    audio_url: '',
    audio_duration: '',
    audio_size: 0,
    cover_art_image_url: '',
    episode_type: '',
    clean_content: true,
    season_number: 1,
    episode_number: 1,
    useSeason: false,
  });
  const [savable, setSavable] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);
  const [audioUploading, setAudioUploading] = React.useState(false);

  const { loading, error, data, refetch } = useQuery(GET_EPISODE, {
    variables: { episodeCuid },
    fetchPolicy: 'network-only',
    onCompleted: () => {
      setInfo({
        title: data.episode.title,
        content: data.episode.content,
        published: data.episode.published ? 'true' : 'false',
        audio_url: data.episode.profile.audio_url,
        audio_path: data.episode.profile.audio_url,
        audio_duration: data.episode.profile.audio_duration,
        audio_size: data.episode.profile.audio_size,
        cover_art_image_url: data.episode.profile.cover_art_image_url,
        episode_type: data.episode.profile.episode_type,
        clean_content: data.episode.profile.clean_content ? 'true' : 'false',
        season_number: data.episode.profile.season_number,
        episode_number: data.episode.profile.episode_number,
        useSeason: !!data.episode.profile.season_number,
      });
    },
  });

  /* Select cover art image action */
  const selectImage = async () => {
    setUploading(true);
    const result = await selectImageAndUploadToCDN();
    setInfo({
      ...episodeInfo,
      image: result.imagePath,
      cover_art_image_url: result.remotePath,
    });
    setUploading(false);
  };

  /* Select audio file action */
  const selectAudio = async () => {
    setAudioUploading(true);
    const result = await selectAudioFileAndUploadToCDN();
    setInfo({
      ...episodeInfo,
      audio_path: result.localPath,
      audio_url: result.remotePath,
      audio_size: result.size,
      audio_duration: result.duration,
    });
    setAudioUploading(false);
  };

  /* Save action */
  const doSave = async () => {
    if (!uploading) {
      setSaving(true);
      const variables = {
        ...episodeInfo,
        episodeCuid,
        clean_content: episodeInfo.clean_content === 'true',
        published: episodeInfo.published === 'true',
        episode_number:
          typeof episodeInfo.episode_number !== 'number'
            ? parseInt(episodeInfo.episode_number, 10)
            : episodeInfo.episode_number,
      };

      await modifyEpisode({
        variables,
      })
        .then(() => {
          setSavable(false);
          alert(t('successfullyModified'));
        })
        .catch(() => {
          alert(t('errorModifying'));
        });
      setSaving(false);
    }
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
        <div>
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
    <motion.div
      initial={{ x: -25, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 700, damping: 100 }}
    >
      <div className="mt-4 mb-14">
        <Head title={t('modifyEpisodeInfo')} description={episodeTitle} />
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
                aria-label="create episode"
                type="button"
                onClick={() => {
                  doSave();
                }}
              >
                {uploading || audioUploading
                  ? `${t('uploading')}...`
                  : saving
                  ? `${t('saving')}...`
                  : t('saveChanges')}
              </button>
            </div>
          </div>
        )}
        <section className="flex gap-x-8 pb-8 mx-5">
          <div>
            <button
              aria-label="upload image"
              type="button"
              className={`bg-gray-100 rounded-xl h-64 w-64 flex items-center justify-center shadow-lg border border-gray-300 ${
                episodeInfo.image && 'hover:opacity-90'
              }`}
              onClick={() => {
                if (!uploading && !audioUploading) {
                  if (!episodeInfo.image) {
                    selectImage();
                    setSavable(true);
                  } else {
                    setInfo({
                      ...episodeInfo,
                      image: null,
                      cover_art_image_url: null,
                    });
                  }
                }
              }}
              style={{
                backgroundImage: `url(${
                  episodeInfo.image || episodeInfo.cover_art_image_url
                })`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {!episodeInfo.image && !episodeInfo.cover_art_image_url && (
                <span className="text-gray-500">
                  <span className="episode-image-placeholder flex justify-center">
                    <Icons name="microphone" />
                  </span>
                  <br />
                  <span>{t('coverArt')}</span>
                  <br />
                  <span className="text-xs">({t('optional')})</span>
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
                defaultValue={data.episode.title}
                disabled={uploading || audioUploading}
                name={t('episodeTitle')}
                placeholder={t('episodeTitle')}
                onChange={(e: { target: { value: any } }) => {
                  setInfo({
                    ...episodeInfo,
                    title: e.target.value,
                  });
                  setSavable(true);
                }}
              />
            </div>
            <div className="mt-4 flex gap-x-3">
              <div className="flex-1">
                <span className="flex items-center">
                  <em className="ml-1 text-xs font-medium text-gray-500 dark:text-gray-300 not-italic flex-1">
                    {t('episodeType')}
                  </em>
                </span>
                <select
                  disabled={uploading || audioUploading}
                  defaultValue={data.episode.profile.episode_type}
                  onChange={(e) => {
                    setInfo({ ...episodeInfo, episode_type: e.target.value });
                    setSavable(true);
                  }}
                  className="mt-1 tracking-wide focus:outline-none dark:bg-transparent dark:text-gray-300 dark:border-gray-500 focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-1.5 text-gray-700"
                >
                  <option value="" disabled>
                    {t('chooseEpisodeType')}
                  </option>
                  <option value="full">{t('full')}</option>
                  <option value="trailer">{t('trailer')}</option>
                  <option value="bonus">{t('bonus')}</option>
                </select>
              </div>
              <div className="flex-1">
                <span className="flex items-center">
                  <em className="ml-1 text-xs font-medium text-gray-500 dark:text-gray-300 not-italic flex-1">
                    {t('episodeRating')}
                  </em>
                </span>
                <select
                  disabled={uploading || audioUploading}
                  defaultValue={
                    data.episode.profile.clean_content ? 'true' : 'false'
                  }
                  onChange={(e) => {
                    setInfo({
                      ...episodeInfo,
                      clean_content: e.target.value,
                    });
                    setSavable(true);
                  }}
                  className="mt-1 tracking-wide focus:outline-none dark:bg-transparent dark:text-gray-300 dark:border-gray-500 focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-1.5 text-gray-700"
                >
                  <option value="" disabled>
                    {t('chooseEpisodeRating')}
                  </option>
                  <option value="false">{t('explicit')}</option>
                  <option value="true">{t('noExplicit')}</option>
                </select>
              </div>
            </div>
            <div
              className="flex justify-center items-center mt-5 rounded-lg w-full h-28 border border-gray-300 shadow-lg cursor-pointer"
              onClick={() => {
                if (!episodeInfo.audio_url) {
                  selectAudio();
                  setSavable(true);
                }
              }}
              aria-hidden="true"
            >
              {audioUploading ? (
                <div className="flex justify-center items-center h-full">
                  <span className="w-5 h-5">
                    <Icons name="spinner" />
                  </span>
                </div>
              ) : !episodeInfo.audio_url ? (
                <div>
                  <p className="flex justify-center mb-2">
                    <span className="h-10 w-10 text-gray-600">
                      <Icons name="upload" />
                    </span>
                  </p>
                  <p className="text-xs whitespace-nowrap flex text-gray-500 items-center">
                    {t('chooseA')}{' '}
                    <span className="flex gap-x-1 mx-2">
                      <em className="not-italic rounded-md px-1 bg-gray-50 border border-gray-300">
                        .mp3
                      </em>
                      <em className="not-italic rounded-md px-1 bg-gray-50 border border-gray-300">
                        .m4a
                      </em>
                    </span>{' '}
                    {t('audioFileToUpload')}
                  </p>
                </div>
              ) : (
                <div className="w-full pt-2 wave-player h-full">
                  <Player
                    audioUrl={episodeInfo.audio_path}
                    waveStyles={{
                      cursorWidth: 1,
                      progressColor: '#4B5563',
                      responsive: true,
                      waveColor: '#6B7280',
                      cursorColor: 'transparent',
                      barWidth: 0,
                      height: 45,
                      normalize: true,
                    }}
                    containerStyles={{
                      maxWidth: '100%',
                    }}
                    hideImage="true"
                  />
                  <button
                    onClick={() => {
                      selectAudio();
                      setSavable(true);
                    }}
                    type="button"
                    aria-label="select audio file"
                    className="reupload-btn border-t w-full dark:bg-transparent dark:text-gray-300 py-1 rounded-bl-lg rounded-br-lg text-center text-xs mt-1 pt-1 text-gray-500 bg-gray-100 hover:bg-gray-200 dark:hover:bg-transparent dark:hover:text-white"
                  >
                    {t('chooseAnother')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="mx-5 mt-2">
          <div className="flex gap-x-3">
            <div className="flex-1">
              <span className="flex items-center">
                <em className="ml-1 text-xs font-medium text-gray-500 dark:text-gray-300 not-italic flex-1">
                  {t('seasonNumber')}
                </em>
                <Switch
                  disabled={uploading || audioUploading}
                  onChange={() => {
                    setInfo({
                      ...episodeInfo,
                      useSeason: !episodeInfo.useSeason,
                    });
                    setSavable(true);
                  }}
                  checked={!!episodeInfo.useSeason}
                  handleDiameter={10}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  height={14}
                  width={26}
                  className="react-switch"
                />
              </span>
              <input
                disabled={!episodeInfo.useSeason || uploading || audioUploading}
                defaultValue={data.episode.profile.season_number}
                placeholder={t('serialPodcastOnly')}
                type="number"
                min="0"
                onChange={(e: { target: { value: any } }) => {
                  setInfo({
                    ...episodeInfo,
                    season_number: e.target.value,
                  });
                  setSavable(true);
                }}
                className="mt-1 tracking-wide focus:outline-none dark:bg-transparent dark:text-gray-300 dark:border-gray-500 focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
              />
            </div>
            <div className="flex-1">
              <Input
                disabled={uploading || audioUploading}
                name={t('episodeNumber')}
                type="number"
                min="0"
                placeholder="1, 2..."
                defaultValue={data.episode.profile.episode_number}
                onChange={(e: { target: { value: any } }) => {
                  setInfo({
                    ...episodeInfo,
                    episode_number: e.target.value,
                  });
                  setSavable(true);
                }}
              />
            </div>
            <div className="flex-1">
              <span className="flex items-center">
                <em className="ml-1 text-xs font-medium text-gray-500 dark:text-gray-300 not-italic flex-1">
                  {t('episodeStatus')}
                </em>
              </span>
              <select
                defaultValue={data.episode.published ? 'true' : 'false'}
                disabled={uploading || audioUploading}
                onChange={(e) => {
                  setInfo({
                    ...episodeInfo,
                    published: e.target.value,
                  });
                  setSavable(true);
                }}
                className={`${
                  episodeInfo.published === 'true'
                    ? 'border-green-500'
                    : 'border-yellow-500'
                } border-l-4 mt-1 tracking-wide dark:bg-transparent dark:text-gray-300 dark:border-gray-500 focus:outline-none border rounded-md w-full text-sm py-1.5 px-1.5 text-gray-700`}
              >
                <option value="" disabled>
                  {t('chooseEpisodeStatus')}
                </option>
                <option value="false">{t('draft')}</option>
                <option value="true">{t('published')}</option>
              </select>
            </div>
          </div>
        </section>
        <section className="m-5">
          <span className="flex items-center">
            <em className="ml-1 text-xs font-medium text-gray-500 dark:text-gray-300 not-italic flex-1">
              {t('showNotes')}
            </em>
          </span>
          <div
            className="rounded-lg border py-4 w-full mt-1 text-sm px-8"
            style={{
              background:
                window.matchMedia &&
                window.matchMedia('(prefers-color-scheme: dark)').matches
                  ? 'rgb(25,27,28)'
                  : '',
            }}
          >
            <Editor
              defaultValue={data.episode.content}
              readOnly={uploading || audioUploading}
              placeholder={t('episodeNotes')}
              onChange={(value) => {
                setInfo({
                  ...episodeInfo,
                  content: value(),
                });
                setSavable(true);
              }}
              uploadImage={async (file) => {
                const result = await uploadFile(file);
                return result;
              }}
              dark={
                window.matchMedia &&
                window.matchMedia('(prefers-color-scheme: dark)').matches
              }
              className="text-base"
            />
          </div>
        </section>
      </div>
    </motion.div>
  );
}
