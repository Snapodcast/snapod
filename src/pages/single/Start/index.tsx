/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { useQuery, ApolloError } from '@apollo/client';
import { GET_PODCASTS } from '../../../lib/GraphQL/queries';
import Store from '../../../lib/Store';
import Icons from '../../../components/Icons';
import { useHistory, Link } from 'react-router-dom';
import podcastInit from '../../../lib/Init';
import { useI18n } from '../../../hooks';

interface ContainerProps {
  loading: boolean;
  error: ApolloError | undefined;
  data: any;
  history: any;
  setAnimation: any;
  refetch: any;
}

const PodcastsContainer = ({
  loading,
  error,
  data,
  history,
  setAnimation,
  refetch,
}: ContainerProps) => {
  const { t } = useI18n();
  if (loading)
    return (
      <div className="flex justify-center">
        <span className="w-5 h-5 spinner-start">
          <Icons name="spinner" />
        </span>
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center gap-x-3">
        <button
          aria-label="create"
          type="button"
          className="flex justify-center align-middle items-center text-white text-sm hover:bg-gray-700 bg-gray-600 focus:outline-none rounded-md shadow-md py-1.5 px-4 text-center"
          onClick={() => {
            refetch();
          }}
        >
          {t('reload')}
        </button>
        <Link to="/landing/login">
          <button
            aria-label="create"
            type="button"
            className="flex justify-center align-middle items-center text-white text-sm hover:bg-gray-700 bg-gray-600 focus:outline-none rounded-md shadow-md py-1.5 px-4 text-center"
          >
            {t('loginAgain')}
          </button>
        </Link>
      </div>
    );

  return (
    <div>
      {data && data.podcasts.length > 0 && (
        <div className="mb-5">
          {data.podcasts.map((podcast: any) => (
            <div
              key={podcast.cuid}
              className="mb-3 rounded-md border shadow-sm flex podcast-item cursor-pointer hover:bg-gray-50 dark:active:bg-neutral-700 dark:hover:bg-transparent dark:border-gray-400 transition-all"
              onClick={() => {
                podcastInit(podcast);
                history.push('/snapod');
              }}
            >
              <div
                style={{
                  backgroundImage: `url(${podcast.profile.cover_art_image_url})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                }}
                className="podcast-item-image border-r rounded-tl-md rounded-bl-md dark:opacity-80"
              />
              <div className="podcast-item-content px-3 py-2 text-left flex items-center">
                <div>
                  <h3 className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
                    {podcast.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {podcast.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-center gap-x-3">
        <button
          aria-label="create"
          type="button"
          className="flex justify-center align-middle items-center text-white text-sm hover:bg-gray-700 bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:text-gray-400 focus:outline-none rounded-md shadow-md py-1.5 px-4 text-center"
          onClick={() => {
            setAnimation(true);
            setTimeout(() => {
              history.push('/landing/create/podcast');
            }, 500);
          }}
        >
          {t('createNewPodcast')} →
        </button>
        <button
          aria-label="create"
          type="button"
          className="flex justify-center align-middle items-center text-gray-600 text-sm hover:bg-gray-50 bg-white dark:bg-gray-300 dark:text-gray-500 dark:hover:text-gray-600 dark:hover:bg-gray-300 dark:border-0 border border-gray-300 focus:outline-none rounded-md shadow-sm py-1.5 px-4 text-center"
          onClick={() => {
            setAnimation(true);
            setTimeout(() => {
              history.push('/landing/import/podcast');
            }, 500);
          }}
        >
          {t('importExistingPodcast')} ↓
        </button>
      </div>
    </div>
  );
};

export default function StartSingle() {
  const { t } = useI18n();
  const authorCuid = Store.get('currentUser.cuid');
  const { loading, error, data, refetch } = useQuery(GET_PODCASTS, {
    variables: { authorCuid },
    fetchPolicy: 'cache-and-network',
  });
  const history = useHistory();
  const [showAnimation, setShowAnimation] = React.useState(false);

  return (
    <div
      className={`z-10 shadow-md rounded-md w-2/5 max-h-100 overflow-y-auto overflow-hidden bg-white dark:bg-neutral-800 px-8 py-7 no-drag animate-slideUp ${
        showAnimation && 'animate-slideDown'
      }`}
    >
      <div className="text-center">
        <h1 className="font-bold text-5xl tracking-wide">
          <span role="img" aria-label="snapod-logo" className="mr-0.5">
            🎙️
          </span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1.5 transition-all">
          {loading
            ? t('loadingContent')
            : error
            ? t('failedToLoad')
            : data.podcasts.length
            ? t('selectaPodcastAndContinue')
            : t('welcomeToSnapodLetsGetStarted')}
        </p>
      </div>
      <div className="justify-center text-center mt-5">
        <PodcastsContainer
          loading={loading}
          error={error}
          data={data}
          history={history}
          setAnimation={setShowAnimation}
          refetch={refetch}
        />
      </div>
    </div>
  );
}
