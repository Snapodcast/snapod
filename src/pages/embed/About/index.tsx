import React from 'react';
import Head from '../../../components/Head';
import snapodLogo from '../../../public/snapod_logo.png';
import Store from '../../../lib/Store';
import configs from '../../../configs';
import { useI18n } from '../../../hooks';

export default function AboutPage() {
  const { t } = useI18n();
  const appVersion = window.require('electron').remote.app.getVersion();
  const [apiVersion, setApiVersion] = React.useState();

  const getAPIVersion = async () => {
    const response = await fetch(`${configs.backend_url}/version`).then(
      (res: any) => {
        return res.json();
      }
    );
    setApiVersion(response.version);
  };

  return (
    <div className="my-4 mx-5">
      <Head
        title={t('aboutPageTitle')}
        description={t('aboutPageDescription')}
      />
      <div>
        <div className="flex items-center gap-x-2 text-gray-600 dark:text-white text-2xl font-medium">
          <img
            src={snapodLogo}
            alt="snapod logo"
            className="w-8 h-8 rounded-full dark:opacity-80"
          />
          <h1>Snapod</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-100 text-sm mt-0.5 pl-0.5">
          {t('slogan')}
        </p>

        <div className="text-gray-500 dark:text-gray-300 mt-8 text-sm">
          <p>Version number: {appVersion}</p>
          <p>
            API service version:{' '}
            {apiVersion || (
              <button
                type="button"
                className="hover:text-gray-600 dark:hover:text-white"
                onClick={getAPIVersion}
              >
                Retrieve →
              </button>
            )}
          </p>
          <hr className="w-20 my-2.5" />
          <p>Podcast name: {Store.get('currentPodcast.name')}</p>
          <p>Podcast ID: {Store.get('currentPodcast.cuid')}</p>
          <p>User name: {Store.get('currentUser.name')}</p>
          <p>User email: {Store.get('currentUser.email')}</p>
          <p>User ID: {Store.get('currentUser.cuid')}</p>
        </div>

        <p className="text-gray-400 dark:text-gray-400 text-sm mt-8">
          &copy; 2021 Snapodcast, All rights reserved.
        </p>
      </div>
    </div>
  );
}
