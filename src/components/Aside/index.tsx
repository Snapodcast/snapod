import React from 'react';
import { NavLink } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import Icons from '../Icons/index';

export default function Aside() {
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
    </aside>
  );
}
