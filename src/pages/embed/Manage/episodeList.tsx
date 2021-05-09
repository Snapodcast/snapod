import { useMutation, useQuery } from '@apollo/client';
import React from 'react';
import Icons from '../../../components/Icons';
import { DELETE_EPISODE, GET_EPISODES } from '../../../lib/GraphQL/queries';
import * as Store from '../../../lib/Store';
import { htmlToText } from 'html-to-text';
import subString from '../../../utilities/substring';
import { useHistory } from 'react-router-dom';
import Head from '../../../components/Head';

export default function EpisodeList() {
  const podcastCuid = Store.get('currentPodcast.cuid');
  const history = useHistory();
  const { loading, error, data, refetch } = useQuery(GET_EPISODES, {
    variables: { podcastCuid },
    fetchPolicy: 'cache-and-network',
  });
  const [deleteEpisode] = useMutation(DELETE_EPISODE);
  const [deleting, setDeleting] = React.useState(false);
  const [deletingCuid, setDeletingCuid] = React.useState('');

  const doDelete = async (episodeCuid: string) => {
    setDeletingCuid(deletingCuid);
    setDeleting(true);
    if (window.confirm('请确认删除\n此操作将不可重做')) {
      await deleteEpisode({
        variables: {
          episodeCuid,
        },
      })
        .then(async () => {
          setDeleting(false);
          setDeletingCuid('');
          alert('删除成功');
          await refetch();
        })
        .catch(() => {
          setDeleting(false);
          setDeletingCuid('');
          alert(`删除失败`);
        });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <span className="animate-spin w-5 h-5">
          <Icons name="spinner" />
        </span>
      </div>
    );

  if (error)
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
              重新加载
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="my-4 mx-5">
      <Head title="管理节目列表" description="查看和修改全部播客节目" />
      {data && data.episodes.length > 0 ? (
        <div className="mb-5">
          {data.episodes.map((episode: any) => (
            <div
              key={episode.cuid}
              className="episode-item flex mb-3 rounded-md border shadow-sm cursor-pointer"
            >
              {episode.profile.cover_art_image_url && (
                <div
                  style={{
                    backgroundImage: `url(${episode.profile.cover_art_image_url})`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                  }}
                  className="episode-item-image h-full border-r rounded-tl-md rounded-bl-md bg-gray-100"
                />
              )}
              <div
                className={`text-left episode-item-content hover:bg-gray-50 transition-all ${
                  !episode.profile.cover_art_image_url &&
                  'rounded-tl-md rounded-bl-md'
                }`}
                onClick={() => {
                  if (!deleting) {
                    Store.set('currentEpisode.cuid', episode.cuid);
                    Store.set('currentEpisode.title', episode.title);
                    history.push('/snapod/manage/episode');
                  }
                }}
                aria-hidden="true"
              >
                <div className="flex items-center episode-item-container px-5 pt-2">
                  <div>
                    <h2 className="text-base text-gray-600 font-medium mb-1.5">
                      {episode.title}
                    </h2>
                    <p className="text-sm text-gray-500 mb-2.5">
                      {subString(htmlToText(episode.content), 100).replaceAll(
                        '<p>',
                        ''
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex episode-item-info text-gray-500 text-xs episode-item-info-container">
                  {episode.published ? (
                    <div className="flex gap-x-1">
                      <em className="w-4 h-4">
                        <Icons name="online" />
                      </em>
                      已发布
                    </div>
                  ) : (
                    <div className="flex gap-x-1">
                      <em className="w-4 h-4">
                        <Icons name="offline" />
                      </em>
                      草稿
                    </div>
                  )}
                  {episode.profile.season_number && (
                    <div>{episode.profile.season_number}</div>
                  )}
                  <div>第 {episode.profile.episode_number} 期</div>
                  <div className="capitalize">
                    {episode.profile.episode_type === 'full'
                      ? '完整节目'
                      : episode.profile.episode_type === 'trailer'
                      ? '先导节目'
                      : '特别节目'}
                  </div>
                  <div>{episode.profile.audio_duration}</div>
                </div>
              </div>
              <div
                aria-hidden="true"
                onClick={() => {
                  doDelete(episode.cuid);
                }}
                className={`text-red-400 hover:text-red-500 episode-item-delete justify-center items-center px-4 border-l hover:bg-gray-50 transition-all ${
                  deletingCuid === episode.cuid &&
                  'hover:bg-red-300 bg-red-300 animate-pulse duration-200'
                }`}
              >
                <p className="flex justify-center">
                  <span className="w-6 h-6">
                    <Icons name="trashBin" />
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center error-container items-center">
          <div>
            <p className="mb-3 flex justify-center">
              <span className="h-28 w-28 text-gray-200">
                <Icons name="episodes" />
              </span>
            </p>
            <button
              aria-label="create"
              type="button"
              className="mt-3 flex justify-center align-middle items-center text-white text-sm hover:bg-gray-600 bg-gray-500 focus:outline-none rounded-md shadow-md py-1.5 px-4 text-center"
              onClick={() => {
                history.push('/snapod/create/episode');
              }}
            >
              创建新节目 →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
