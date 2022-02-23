import React from 'react';
import Store from '../../../lib/Store';
import { useMutation } from '@apollo/client';
import { CREATE_EPISODE } from '../../../lib/GraphQL/queries';
import { Input } from '../../../components/Form';
import Head from '../../../components/Head';
import Icons from '../../../components/Icons';
import selectImageAndUploadToCDN from '../../../lib/Upload/Image';
import Editor from 'rich-markdown-editor';
import { uploadFile } from '../../../lib/Qiniu';
import selectAudioFileAndUploadToCDN from '../../../lib/Upload/Audio';
import Player from '../../../components/Player';
import Switch from 'react-switch';
import { useHistory } from 'react-router';
import { useI18n } from '../../../hooks';

export default function CreateEpisode() {
  const { t } = useI18n();
  const podcastCuid = Store.get('currentPodcast.cuid');
  const history = useHistory();
  const [createEpisode] = useMutation(CREATE_EPISODE);
  const [episodeInfo, setInfo] = React.useState<any>({
    clean_content: true,
    episode_type: 'full',
  });
  const [uploading, setUploading] = React.useState(false);
  const [audioUploading, setAudioUploading] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [saving, setSaving] = React.useState(false);

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

  /* Create episode action */
  const doCreate = async (draft: boolean) => {
    if (draft) {
      setSaving(true);
    } else {
      setCreating(true);
    }
    const variables = {
      podcastCuid,
      published: !draft,
      ...episodeInfo,
      clean_content: episodeInfo.clean_content === 'true',
      episode_number:
        typeof episodeInfo.episode_number !== 'number'
          ? parseInt(episodeInfo.episode_number, 10)
          : episodeInfo.episode_number,
    };
    await createEpisode({
      variables,
    })
      .then(() => {
        alert(t('successfullySavedAnEpisode'));
        if (draft) {
          setSaving(false);
        } else {
          setCreating(false);
        }
        history.push('/snapod/manage/episodes');
      })
      .catch(() => {
        alert(t('failedToSave'));
        if (draft) {
          setSaving(false);
        } else {
          setCreating(false);
        }
      });
  };

  return (
    <div className="mt-4 mb-14">
      <Head
        title={t('createNewEpisode')}
        description={t('createNewEpisodeDescription')}
      />
      <div className="flex justify-center items-center w-full">
        <div className="flex absolute bottom-5 z-10 gap-x-3">
          <button
            className="bg-gray-500 tracking-wide text-center text-sm py-1 px-5 shadow-lg rounded-2xl whitespace-nowrap text-white hover:bg-gray-600"
            aria-label="save as draft"
            type="button"
            onClick={() => {
              if (!uploading && !audioUploading) {
                doCreate(true);
              }
            }}
          >
            {uploading || audioUploading
              ? t('cannotSaveDraft')
              : saving
              ? t('saving')
              : t('saveAsDraft')}
          </button>
          <button
            className="bg-blue-500 tracking-wide text-center text-sm py-1 px-5 shadow-lg rounded-2xl whitespace-nowrap text-white hover:bg-blue-600"
            aria-label="create episode"
            type="button"
            onClick={() => {
              if (!uploading && !audioUploading) {
                doCreate(false);
              }
            }}
          >
            {uploading || audioUploading
              ? t('uploading')
              : creating
              ? t('saving')
              : t('finish')}
          </button>
        </div>
      </div>
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
              backgroundImage: `url(${episodeInfo.image || ''})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {!episodeInfo.image && (
              <span className="text-gray-500">
                <span className="h-20 w-20">
                  <Icons name="microphone" />
                </span>
                <br />
                <span>{t('optional')}</span>
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
              disabled={uploading || audioUploading}
              name={t('episodeTitle')}
              placeholder={t('episodeTitle')}
              onChange={(e: { target: { value: any } }) => {
                setInfo({
                  ...episodeInfo,
                  title: e.target.value,
                });
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
                defaultValue="full"
                disabled={uploading || audioUploading}
                onChange={(e) => {
                  setInfo({ ...episodeInfo, episode_type: e.target.value });
                }}
                className="mt-1 tracking-wide dark:bg-transparent dark:text-gray-300 dark:border-gray-500 focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-1.5 text-gray-700"
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
                defaultValue="true"
                disabled={uploading || audioUploading}
                onChange={(e) => {
                  setInfo({
                    ...episodeInfo,
                    clean_content: e.target.value,
                  });
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
              if (!episodeInfo.audio_url && !uploading && !audioUploading) {
                selectAudio();
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
                    <em className="not-italic rounded-md px-1 bg-gray-50 dark:bg-gray-400 border border-gray-300 dark:border-0 dark:text-gray-700">
                      .mp3
                    </em>
                    <em className="not-italic rounded-md px-1 bg-gray-50 dark:bg-gray-400 border border-gray-300 dark:border-0 dark:text-gray-700">
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
                  onClick={() => selectAudio()}
                  type="button"
                  aria-label="select audio file"
                  className="reupload-btn border-t w-full py-1 rounded-bl-lg rounded-br-lg text-center text-xs mt-1 pt-1 text-gray-500 bg-gray-100 hover:bg-gray-200"
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
              placeholder={t('serialPodcastOnly')}
              type="number"
              min="0"
              onChange={(e: { target: { value: any } }) => {
                setInfo({
                  ...episodeInfo,
                  season_number: e.target.value,
                });
              }}
              className="mt-1 tracking-wide dark:bg-transparent dark:text-gray-300 dark:border-gray-500 focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
            />
          </div>
          <div className="flex-1">
            <Input
              disabled={uploading || audioUploading}
              name={t('episodeNumber')}
              type="number"
              min="0"
              placeholder="1, 2..."
              onChange={(e: { target: { value: any } }) => {
                setInfo({
                  ...episodeInfo,
                  episode_number: e.target.value,
                });
              }}
            />
          </div>
        </div>
      </section>
      <section className="m-5">
        <span className="flex items-center">
          <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
            {t('showNotes')}
          </em>
        </span>
        <div
          className="rounded-lg border py-4 w-full mt-1 text-base px-8"
          style={{
            background:
              window.matchMedia &&
              window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'rgb(25,27,28)'
                : '',
          }}
        >
          <Editor
            readOnly={uploading || audioUploading}
            placeholder={t('episodeNotes')}
            onChange={(value) => {
              setInfo({
                ...episodeInfo,
                content: value(),
              });
            }}
            uploadImage={async (file) => {
              const result = await uploadFile(file);
              return result;
            }}
            dark={
              window.matchMedia &&
              window.matchMedia('(prefers-color-scheme: dark)').matches
            }
          />
        </div>
      </section>
    </div>
  );
}
