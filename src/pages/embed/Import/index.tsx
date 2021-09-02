/* eslint-disable jsx-a11y/no-autofocus */
import React from 'react';
import { useHistory } from 'react-router-dom';
import * as Store from '../../../lib/Store';
import Icons from '../../../components/Icons';
import { GET_PREVIEW, IMPORT_PODCAST } from '../../../lib/GraphQL/queries';
import { useLazyQuery, useMutation } from '@apollo/client';

export default function ImportPodcast() {
  const history = useHistory();
  const authorCuid = Store.get('currentUser.cuid');

  const [importing, setImporting] = React.useState(false);
  const [podcastRssUrl, setRssUrl] = React.useState('');
  const [previewing, setPreview] = React.useState(false);

  const [getPreview, { loading, error, data }] = useLazyQuery(GET_PREVIEW, {
    fetchPolicy: 'network-only',
  });
  const [importPodcast] = useMutation(IMPORT_PODCAST);

  const doPreview = () => {
    getPreview({ variables: { podcastRssUrl } });
    setPreview(true);
  };

  const doImport = async () => {
    setImporting(true);
    await importPodcast({
      variables: { authorCuid, podcastRssUrl },
    })
      .then((res: any) => {
        Store.set({
          currentPodcast: res.data.importPodcast,
        });
        alert(`导入成功`);
        history.push('/snapod');
      })
      .catch(() => {
        alert(`导入失败\n订阅地址解析可能不正常`);
        setImporting(false);
      });
  };

  return (
    <div className="z-10 shadow-md rounded-md w-2/5 bg-white px-8 py-7 no-drag animate-slideUp">
      <div className="absolute -mt-17 -ml-5 flex w-2/5 pr-7 items-center">
        <div className="flex-1">
          <button
            className="flex-1 rounded-full bg-white shadow-md flex justify-center items-center h-7 w-7 text-gray-600"
            aria-label="select existing podcast"
            type="button"
            onClick={() => {
              if (importing) {
                setImporting(false);
              } else {
                history.goBack();
              }
            }}
          >
            ←
          </button>
        </div>
      </div>
      <div>
        <div className="mb-2 flex gap-x-2 items-center">
          <h2 className="font-bold text-xl tracking-wide flex-1 whitespace-nowrap overflow-hidden overflow-ellipsis">
            <span role="img" aria-label="snapod-logo" className="mr-1">
              🗂️
            </span>
            导入播客
          </h2>
          <span className="text-gray-500 text-sm">
            步骤 {previewing ? 2 : 1} / 2
          </span>
        </div>
        {!previewing ? (
          <div>
            <p className="w-full mt-5">
              <span className="flex items-center">
                <em className="ml-1 text-xs font-medium text-gray-500 not-italic flex-1">
                  RSS 地址 / Podcast RSS URL
                </em>
              </span>
              <input
                autoFocus
                placeholder="https://rss.example.com"
                maxLength={255}
                minLength={1}
                onChange={(e) => {
                  setRssUrl(e.target.value);
                }}
                className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
              />
              <span className="text-xs text-gray-400 ml-1 mt-1">
                RSS 地址须于外网可用
              </span>
            </p>
            <button
              aria-label="next step"
              className="mt-5 flex px-3 items-center text-white text-sm hover:bg-gray-700 bg-gray-600 focus:outline-none rounded-md shadow-md py-1 text-center"
              type="button"
              onClick={doPreview}
            >
              下一步 →
            </button>
          </div>
        ) : (
          <div>
            {loading ? (
              <div className="w-full flex justify-center mt-7">
                <span className="w-6 h-6">
                  <Icons name="spinner" />
                </span>
              </div>
            ) : (
              <div>
                {error || !data ? (
                  <div className="bg-gray-100 text-gray-500 justify-center text-sm h-20 mt-6 rounded-md flex items-center">
                    <p>RSS 暂时无法解析</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-500 text-sm tracking-wide">
                      请确认导入播客的信息。部分地址的解析可能无法完全匹配，导入后可重新修改播客与节目详情。现在就完成导入吧...
                    </p>
                    <div className="mb-3 mt-5 rounded-md border dark:border-gray-500 shadow-sm flex podcast-item dark:bg-darkBg dark:hover:bg-black">
                      <div
                        style={{
                          backgroundImage: `url(${data.previewPodcast.profile.cover_art_image_url})`,
                          backgroundRepeat: 'no-repeat',
                          backgroundSize: 'cover',
                        }}
                        className="podcast-item-image border-r rounded-tl-md rounded-bl-md"
                      />
                      <div className="podcast-item-content px-3 py-2 text-left flex items-center">
                        <div>
                          <h3 className="text-sm text-gray-600 dark:text-gray-200 font-medium mb-1">
                            {data.previewPodcast.podcast.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-200">
                            {data.previewPodcast.podcast.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3 grid grid-cols-2 gap-x-3 text-sm text-gray-600">
                      <div className="flex gap-x-2 px-2 py-1.5 rounded-md shadow-sm border items-center">
                        <span className="flex h-5 w-5 -mt-1">
                          <Icons name="user" />
                        </span>
                        <p>{data.previewPodcast.podcast.author}</p>
                      </div>
                      <div className="flex gap-x-2 px-2 py-1.5 rounded-md shadow-sm border items-center">
                        <span className="flex h-5 w-5 -mt-1">
                          <Icons name="translate" />
                        </span>
                        <p className="uppercase">
                          {data.previewPodcast.profile.language}
                        </p>
                      </div>
                    </div>
                    <div>
                      {data.previewPodcast.episodes.map((episode: any) => {
                        return (
                          <div
                            key={episode.profile.episode_number}
                            className="flex rounded-md shadow-sm border py-1.5 px-2 text-sm text-gray-600 items-center gap-x-3 mb-2"
                          >
                            <div className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 flex items-center justify-center">
                              {episode.profile.episode_number}
                            </div>
                            <p>{episode.episode.title}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="mt-5 w-full flex gap-x-3">
                  <button
                    aria-label="next step"
                    className="mt-5 flex px-3 items-center text-white text-sm hover:bg-gray-700 bg-gray-600 focus:outline-none rounded-md shadow-md py-1 text-center"
                    type="button"
                    onClick={() => {
                      setPreview(false);
                    }}
                  >
                    ← 上一步
                  </button>
                  <button
                    aria-label="next step"
                    className={`mt-5 flex ${
                      importing ? 'px-8' : 'px-3'
                    } items-center text-white text-sm hover:bg-gray-700 bg-gray-600 focus:outline-none rounded-md shadow-md py-1 text-center`}
                    type="button"
                    onClick={doImport}
                  >
                    {importing ? (
                      <span className="h-4 w-4 duration-200">
                        <Icons name="spinner" />
                      </span>
                    ) : (
                      '完成导入 →'
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
