import React from 'react';
import * as Store from '../../../lib/Store';
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

export default function ManageEpisode() {
  const history = useHistory();
  const episodeCuid = Store.get('currentEpisode.cuid');
  const episodeTitle = Store.get('currentEpisode.title');
  const { loading, error, data, refetch } = useQuery(GET_EPISODE, {
    variables: { episodeCuid },
    fetchPolicy: 'network-only',
  });
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
          alert('修改成功');
        })
        .catch(() => {
          alert(`修改失败`);
        });
      setSaving(false);
    }
  };

  /* Fill in default values */
  const isDataFirstRun = React.useRef(true);
  if (data && isDataFirstRun.current) {
    setInfo({
      title: data.episode.title,
      content: data.episode.content,
      published: data.episode.published.toString(),
      audio_url: data.episode.profile.audio_url,
      audio_path: data.episode.profile.audio_url,
      audio_duration: data.episode.profile.audio_duration,
      audio_size: data.episode.profile.audio_size,
      cover_art_image_url: data.episode.profile.cover_art_image_url,
      episode_type: data.episode.profile.episode_type,
      clean_content: data.episode.profile.clean_content.toString(),
      season_number: data.episode.profile.season_number,
      episode_number: data.episode.profile.episode_number,
      useSeason: !!data.episode.profile.season_number,
    });
    isDataFirstRun.current = false;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="animate-spin w-5 h-5">
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
              重新加载
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 mb-14">
      <Head title="修改节目信息" description={episodeTitle} />
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
              重置
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
                ? '上传中...'
                : saving
                ? '保存中...'
                : '保存更改'}
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
                <span>封面图 Cover Art</span>
                <br />
                <span className="text-xs">(可选)</span>
              </span>
            )}
          </button>
          {uploading && (
            <div className="flex justify-center">
              <span className="bg-blue-500 py-1 px-3 text-xs text-white rounded-xl absolute -mt-9 shadow-lg">
                上传中...
              </span>
            </div>
          )}
        </div>
        <div className="flex-1">
          <div>
            <Input
              defaultValue={episodeInfo.title}
              disabled={uploading || audioUploading}
              name="节目标题 / Title"
              placeholder="节目标题"
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
                <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
                  节目类型 / Episode Type
                </em>
              </span>
              <select
                disabled={uploading || audioUploading}
                defaultValue={episodeInfo.episode_type}
                onChange={(e) => {
                  setInfo({ ...episodeInfo, episode_type: e.target.value });
                  setSavable(true);
                }}
                className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-1.5 text-gray-700"
              >
                <option value="" disabled>
                  选择节目类型...
                </option>
                <option value="full">完整 (Full)</option>
                <option value="trailer">先导 (Trailer)</option>
                <option value="bonus">特别 (Bonus)</option>
              </select>
            </div>
            <div className="flex-1">
              <span className="flex items-center">
                <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
                  内容类型 / Content Type
                </em>
              </span>
              <select
                disabled={uploading || audioUploading}
                defaultValue={episodeInfo.clean_content}
                onChange={(e) => {
                  setInfo({
                    ...episodeInfo,
                    clean_content: e.target.value,
                  });
                  setSavable(true);
                }}
                className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-1.5 text-gray-700"
              >
                <option value="" disabled>
                  选择内容类型...
                </option>
                <option value="false">
                  包含潜在不当内容 (Explicit content)
                </option>
                <option value="true">
                  不包含潜在不当内容 (No explicit content)
                </option>
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
                <span className="animate-spin w-5 h-5">
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
                  选择一个{' '}
                  <span className="flex gap-x-1 mx-2">
                    <em className="not-italic rounded-md px-1 bg-gray-50 border border-gray-300">
                      .mp3
                    </em>
                    <em className="not-italic rounded-md px-1 bg-gray-50 border border-gray-300">
                      .m4a
                    </em>
                  </span>{' '}
                  音频文件以上传
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
                  className="reupload-btn border-t w-full py-1 rounded-bl-lg rounded-br-lg text-center text-xs mt-1 pt-1 text-gray-500 bg-gray-100 hover:bg-gray-200"
                >
                  重新选择 / Reselect
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
              <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
                节目季数 / Season Number
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
              disabled={!episodeInfo.useSeason || uploading || audioUploading}
              defaultValue={episodeInfo.season_number}
              placeholder="季集类型播客可用"
              type="number"
              min="0"
              onChange={(e: { target: { value: any } }) => {
                setInfo({
                  ...episodeInfo,
                  season_number: e.target.value,
                });
                setSavable(true);
              }}
              className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
            />
          </div>
          <div className="flex-1">
            <Input
              disabled={uploading || audioUploading}
              name="节目期数 / Episode Number"
              type="number"
              min="0"
              placeholder="1, 2..."
              defaultValue={episodeInfo.episode_number}
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
              <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
                节目状态 / Episode Status
              </em>
            </span>
            <select
              defaultValue={episodeInfo.published}
              disabled={uploading || audioUploading}
              onChange={(e) => {
                setInfo({
                  ...episodeInfo,
                  published: e.target.value,
                });
                setSavable(true);
              }}
              className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-1.5 text-gray-700"
            >
              <option value="" disabled>
                选择节目状态...
              </option>
              <option value="false">草稿 (Draft)</option>
              <option value="true">已发布 (Published)</option>
            </select>
          </div>
        </div>
      </section>
      <section className="m-5">
        <span className="flex items-center">
          <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
            节目描述 / Show Notes
          </em>
        </span>
        <div className="rounded-lg border py-4 w-full mt-1 text-base px-8">
          <Editor
            defaultValue={episodeInfo.content}
            readOnly={uploading || audioUploading}
            placeholder="节目描述..."
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
            className="text-base"
          />
        </div>
      </section>
    </div>
  );
}
