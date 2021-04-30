import React from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import Icons from '../Icons/index';
import * as Store from '../../lib/Store';
import logout from '../../services/logout';
import ApolloClient from '../../lib/GraphQL';

export default function Aside() {
  // apollo client hook

  // router navigation hook
  const history = useHistory();

  // fullscreen state
  const [fullScreen, setFullScreen] = React.useState<boolean>(false);

  // ICP event and listeners for fullscreen
  const fullScreenListener = () => {
    setFullScreen(!fullScreen);
  };

  React.useEffect(() => {
    return () => {
      ipcRenderer.removeListener('full-screen-change', fullScreenListener);
    };
  });

  // Listen to full screen event
  ipcRenderer.on('full-screen-change', fullScreenListener);

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
        <div className="mt-5 mb-1.5 pl-1.5">
          <h4 className="font-medium text-xs text-gray-400 dark:text-gray-500">
            Create
          </h4>
        </div>
        <ul className="menu-list text-sm text-gray-600 dark:text-white">
          <NavLink exact to="/new/podcast" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="add" />
              </span>
              New Podcast
            </li>
          </NavLink>
          <NavLink exact to="/snapod/new" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center mt-1">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="addEpisode" />
              </span>
              New Episode
            </li>
          </NavLink>
        </ul>
        <div className="mt-5 mb-1.5 pl-1.5">
          <h4 className="font-medium text-xs text-gray-400 dark:text-gray-500">
            Options
          </h4>
        </div>
        <ul className="menu-list text-sm text-gray-600 dark:text-white">
          <NavLink exact to="/podcast" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="info" />
              </span>
              Podcast
            </li>
          </NavLink>
          <NavLink exact to="/episodes" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center mt-1">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="episodes" />
              </span>
              Episodes
            </li>
          </NavLink>
          <NavLink exact to="/publish" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center mt-1">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="publish" />
              </span>
              Publish
            </li>
          </NavLink>
        </ul>
        <div className="mt-5 mb-1.5 pl-1.5">
          <h4 className="font-medium text-xs text-gray-400 dark:text-gray-500">
            Settings
          </h4>
        </div>
        <ul className="menu-list text-sm text-gray-600 dark:text-white">
          <NavLink exact to="/hosting" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="hosting" />
              </span>
              Hosting
            </li>
          </NavLink>
        </ul>
      </div>
      <div className="grid grid-cols-7 absolute bottom-0 w-full pb-5 px-6 items-center">
        <div className="col-start-1 col-end-7">
          <h1 className="text-sm font-medium -mb-0.5 text-gray-700 whitespace-nowrap overflow-hidden overflow-ellipsis">
            {Store.get('currentUser.name') || 'Snapod'}
          </h1>
          <p className="text-xs text-gray-600 whitespace-nowrap overflow-hidden overflow-ellipsis">
            {Store.get('currentUser.email') || 'Grow your podcast with ease'}
          </p>
        </div>
        <button
          onClick={() => {
            logout();
            ApolloClient.resetStore();
            history.push('/landing/login');
          }}
          aria-label="logout"
          type="button"
          className="col-start-7 col-end-8 hover:bg-gray-200 w-6 h-6 p-1 rounded-md bg-gray-100 justify-center flex items-center"
        >
          <span className="w-3.5 h-3.5">
            <Icons name="out" />
          </span>
        </button>
      </div>
    </aside>
  );
}
