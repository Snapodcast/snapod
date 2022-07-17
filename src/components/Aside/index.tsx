/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import Icons from '../Icons/index';
import Store from '../../lib/Store';
import logout from '../../services/logout';
import ApolloClient from '../../lib/GraphQL';
import Tooltip from '../Tooltip';
import { PodcastsDropdown } from '../Dropdown';
import { useI18n } from '../../hooks';

export default function Aside() {
  const { t } = useI18n();
  // router navigation hook
  const history = useHistory();
  const location = useLocation();

  // fullscreen state
  const [fullScreen, setFullScreen] = React.useState<boolean>(false);

  // ICP event and listeners for fullscreen
  const fullScreenListener = (_: any, isFullScreen: boolean) => {
    setFullScreen(isFullScreen);
  };

  React.useEffect(() => {
    return () => {
      ipcRenderer.removeListener('full-screen-change', fullScreenListener);
    };
  });

  // Listen to full screen event
  ipcRenderer.on('full-screen-change', fullScreenListener);

  /* Offline status detection */
  window.addEventListener('offline', () => {
    history.push('/landing/offline');
  });

  return (
    <aside
      className={`animate-firstShow aside border-r ${
        process.platform !== 'darwin'
          ? 'dark:bg-gray-333 border-t border-headerBorder'
          : 'dark:border-black'
      } h-full bg-transparent absolute border-asideBorder`}
    >
      <div
        className={`${
          fullScreen || process.platform !== 'darwin' ? 'h-1.5' : 'h-12'
        } drag`}
      />
      <div className="menu no-drag overflow-hidden overflow-y-auto px-4">
        <PodcastsDropdown />
        <div className="my-3">
          <Link to="/snapod/create/episode">
            <button
              type="submit"
              aria-label="create episode"
              className="flex justify-center align-middle items-center my-3 text-white text-sm hover:bg-gray-700 bg-gray-600 dark:bg-blue-900 dark:hover:bg-blue-800 focus:outline-none rounded-md shadow-md w-full py-1.5 text-center"
            >
              <span className="h-5 w-5 mr-1.5">
                <Icons name="addEpisode" />
              </span>
              {t('newEpisode')}
            </button>
          </Link>
        </div>
        <div className="mt-5 mb-1.5 pl-1.5">
          <h4 className="font-medium text-xs text-gray-400 dark:text-gray-500">
            {t('manage')}
          </h4>
        </div>
        <ul className="menu-list text-sm text-gray-600 dark:text-white">
          <NavLink exact to="/snapod/manage/podcast" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center mt-1 transition-colors cursor-pointer">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="info" />
              </span>
              {t('podcastInfo')}
            </li>
          </NavLink>
          <NavLink
            exact
            to="/snapod/manage/episodes"
            className={
              ['/snapod/manage/episodes', '/snapod/manage/episode'].includes(
                location.pathname
              )
                ? 'active'
                : ''
            }
          >
            <li className="rounded-md py-1.5 px-2 flex items-center transition-colors cursor-pointer">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="episodes" />
              </span>
              {t('epsiodes')}
            </li>
          </NavLink>
          <NavLink exact to="/snapod/manage/metrics" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center transition-colors cursor-pointer">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="presentation-chart" />
              </span>
              {t('analytics')}
            </li>
          </NavLink>
          <NavLink exact to="/snapod/manage/site" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center transition-colors cursor-pointer">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="globe" />
              </span>
              {t('website')}
            </li>
          </NavLink>
        </ul>
        <div className="mt-5 mb-1.5 pl-1.5">
          <h4 className="font-medium text-xs text-gray-400 dark:text-gray-500">
            {t('settings')}
          </h4>
        </div>
        <ul className="menu-list text-sm text-gray-600 dark:text-white">
          <NavLink
            exact
            to="/snapod/settings/distributions"
            activeClassName="active"
          >
            <li className="rounded-md py-1.5 px-2 flex items-center transition-colors cursor-pointer">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="publish" />
              </span>
              {t('distribution')}
            </li>
          </NavLink>
          <NavLink exact to="/snapod/settings/podcast" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center transition-colors cursor-pointer">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="adjust" />
              </span>
              {t('podcastSetting')}
            </li>
          </NavLink>
          <NavLink exact to="/snapod/settings/app" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center transition-colors cursor-pointer">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="gear" />
              </span>
              {t('preferences')}
            </li>
          </NavLink>
        </ul>
        <div className="mt-5 mb-1.5 pl-1.5">
          <h4 className="font-medium text-xs text-gray-400 dark:text-gray-500">
            {t('about')}
          </h4>
        </div>
        <ul className="menu-list text-sm text-gray-600 dark:text-white">
          <NavLink exact to="/snapod/helpCenter" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center transition-colors cursor-pointer">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="questionMark" />
              </span>
              {t('helpCenter')}
            </li>
          </NavLink>
          <NavLink exact to="/snapod/about" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center transition-colors cursor-pointer">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="qrCode" />
              </span>
              {t('versionInfo')}
            </li>
          </NavLink>
        </ul>
      </div>
      <div className="grid grid-cols-7 absolute bottom-0 w-full pb-5 px-6 items-center">
        <div className="col-start-1 col-end-7">
          <h1 className="text-sm font-medium -mb-0.5 text-gray-700 dark:text-white whitespace-nowrap overflow-hidden overflow-ellipsis">
            {Store.get('currentUser.name') || 'Snapod'}
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap overflow-hidden overflow-ellipsis">
            {Store.get('currentUser.email') || 'Grow your podcast with ease'}
          </p>
        </div>
        <Tooltip content="Logout" placement="top">
          <button
            onClick={() => {
              ApolloClient.resetStore();
              logout();
              history.push('/landing/login');
            }}
            aria-label="logout"
            type="button"
            className="col-start-7 col-end-8 hover:bg-gray-50 w-6 h-6 p-1 rounded-md bg-gray-100 justify-center flex items-center text-gray-600 hover:text-gray-700 transition-none"
          >
            <span className="w-3.5 h-3.5">
              <Icons name="out" />
            </span>
          </button>
        </Tooltip>
      </div>
    </aside>
  );
}
