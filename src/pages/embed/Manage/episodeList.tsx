import { useMutation, useQuery } from '@apollo/client';
import React from 'react';
import Icons from '../../../components/Icons';
import { DELETE_EPISODE, GET_EPISODES } from '../../../lib/GraphQL/queries';
import Store from '../../../lib/Store';
import { htmlToText } from 'html-to-text';
import subString from '../../../utilities/substring';
import { useHistory } from 'react-router-dom';
import Head from '../../../components/Head';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { motion } from 'framer-motion';
import { Motion } from '../../../constants';
import { useI18n } from '../../../hooks';

export default function EpisodeList() {
  const { t } = useI18n();
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
    if (window.confirm(t('pleaseConfirmDelete'))) {
      await deleteEpisode({
        variables: {
          episodeCuid,
        },
      })
        .then(async () => {
          setDeleting(false);
          setDeletingCuid('');
          alert(t('successfullyDeleted'));
          await refetch();
        })
        .catch(() => {
          setDeleting(false);
          setDeletingCuid('');
          alert(t('errorDeleting'));
        });
    } else {
      setDeleting(false);
      setDeletingCuid('');
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <span className="w-5 h-5">
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
              {t('reload')}
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="my-4 mx-5">
      <Head
        title={t('manageEpisodeListTitle')}
        description={t('manageEpisodeListDescription')}
      />
      {data && data.episodes.length > 0 ? (
        <div className="mb-5">
          <motion.ul
            initial="hidden"
            animate="visible"
            variants={Motion.LIST.list}
          >
            {data.episodes.map((episode: any, index: number) => (
              <motion.li
                key={episode.cuid}
                variants={Motion.LIST.item}
                transition={{
                  delay: 0.2 * index,
                  type: 'spring',
                  stiffness: 700,
                  damping: 100,
                }}
                className="overflow-hidden episode-item flex mb-3 rounded-md border dark:hover:border-gray-300 dark:border-gray-400 transition-colors shadow-sm cursor-pointer"
              >
                {episode.profile.cover_art_image_url && (
                  <LazyLoadImage
                    src={episode.profile.cover_art_image_url}
                    className="episode-item-image h-full border-r rounded-tl-md rounded-bl-md bg-gray-100"
                  />
                )}
                <div
                  className={`overflow-hidden text-left episode-item-content hover:bg-gray-50 dark:hover:bg-transparent transition-all ${
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
                  <div className="overflow-hidden flex items-center episode-item-container px-5 pt-2">
                    <div className="overflow-hidden">
                      <h2 className="text-lg text-gray-600 font-medium mb-0.5 dark:text-white text-ellipsis overflow-hidden whitespace-nowrap">
                        {episode.title}
                      </h2>
                      <p className="text-sm text-gray-500 mb-2.5 dark:text-gray-200">
                        {subString(htmlToText(episode.content), 100).replaceAll(
                          '<p>',
                          ''
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex episode-item-info text-gray-500 text-xs episode-item-info-container dark:border-gray-400 dark:text-gray-300">
                    {episode.published ? (
                      <div className="flex gap-x-1">
                        <em className="w-4 h-4">
                          <Icons name="online" />
                        </em>
                        {t('published')}
                      </div>
                    ) : (
                      <div className="flex gap-x-1">
                        <em className="w-4 h-4">
                          <Icons name="offline" />
                        </em>
                        {t('draft')}
                      </div>
                    )}
                    {episode.profile.season_number && (
                      <div>{episode.profile.season_number}</div>
                    )}
                    <div>EP {episode.profile.episode_number}</div>
                    <div className="capitalize">
                      {episode.profile.episode_type === 'full'
                        ? t('full')
                        : episode.profile.episode_type === 'trailer'
                        ? t('trailer')
                        : t('bonus')}
                    </div>
                    <div>
                      {episode.profile.audio_duration || t('unknownDuration')}
                    </div>
                  </div>
                </div>
                <div
                  aria-hidden="true"
                  onClick={() => {
                    doDelete(episode.cuid);
                  }}
                  className={`text-red-400 hover:text-red-500 episode-item-delete justify-center items-center px-4 border-l dark:border-gray-400 dark:hover:bg-transparent hover:bg-gray-50 transition-all ${
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
              </motion.li>
            ))}
          </motion.ul>
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
              {t('createANewEpisode')} →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
