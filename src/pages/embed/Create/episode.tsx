import React from 'react';
import * as Store from '../../../lib/Store';
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

export default function CreateEpisode() {
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
        alert(`创建成功`);
        if (draft) {
          setSaving(false);
        } else {
          setCreating(false);
        }
        history.push('/snapod/manage/episodes');
      })
      .catch(() => {
        alert(`创建失败\n请检查信息已填写完整`);
        if (draft) {
          setSaving(false);
        } else {
          setCreating(false);
        }
      });
  };

  return (
    <div className="mt-4 mb-14">
      <Head title="新建播客节目" description="为你的播客新增一期音频节目" />
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
              ? '草稿暂不可存'
              : saving
              ? '保存中...'
              : '保存草稿'}
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
              ? '上传中...'
              : creating
              ? '创建中...'
              : '完成新建'}
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
                <span>可选 Optional</span>
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
              disabled={uploading || audioUploading}
              name="节目标题 / Title"
              placeholder="节目标题"
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
                <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
                  节目类型 / Episode Type
                </em>
              </span>
              <select
                defaultValue="full"
                disabled={uploading || audioUploading}
                onChange={(e) => {
                  setInfo({ ...episodeInfo, episode_type: e.target.value });
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
                defaultValue="true"
                disabled={uploading || audioUploading}
                onChange={(e) => {
                  setInfo({
                    ...episodeInfo,
                    clean_content: e.target.value,
                  });
                }}
                className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-1.5 text-gray-700"
              >
                <option value="" disabled>
                  选择内容类型...
                </option>
                <option value="false">
                  包含少儿不宜内容 (Explicit content)
                </option>
                <option value="true">
                  不包含少儿不宜内容 (No explicit content)
                </option>
              </select>
            </div>
          </div>
          <div
            className="flex justify-center items-center mt-5 rounded-lg w-full h-28 border border-gray-300 shadow-lg cursor-pointer"
            onClick={() => {
              if (!episodeInfo.audio_url) {
                selectAudio();
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
                  onClick={() => selectAudio()}
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
              placeholder="季集类型播客可用"
              type="number"
              min="0"
              onChange={(e: { target: { value: any } }) => {
                setInfo({
                  ...episodeInfo,
                  season_number: e.target.value,
                });
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
            节目描述 / Show Notes
          </em>
        </span>
        <div className="rounded-lg border py-4 w-full mt-1 text-base px-8">
          <Editor
            readOnly={uploading || audioUploading}
            placeholder="节目描述..."
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
          />
        </div>
      </section>
    </div>
  );
}
