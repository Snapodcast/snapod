import React from 'react';
import { NavLink } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import Icons from '../Icons/index';
import PodcastContext from '../../lib/Context/podcast';
import StorageContext from '../../lib/Context/storage';

export default function Aside({
  podcasts,
  isLoading,
  isError,
}: {
  podcasts: any;
  isLoading: boolean;
  isError: boolean;
}) {
  const { storageDir, setStorageDir } = React.useContext(StorageContext);
  const { podcast, setPodcast } = React.useContext(PodcastContext);
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
      className={`animate-firstShow aside border-r border-asideBorder ${
        process.platform !== 'darwin' ? 'dark:bg-gray-333' : 'dark:border-black'
      } h-full bg-transparent absolute`}
    >
      <div
        className={`${
          fullScreen || process.platform !== 'darwin' ? 'h-1.5' : 'h-12'
        } drag`}
      />
      <div className="menu no-drag overflow-hidden overflow-y-auto px-4">
        <select
          value={
            podcast !== ''
              ? JSON.stringify({
                  id: podcast,
                  dir: storageDir,
                })
              : ''
          }
          onChange={(e) => {
            const item = JSON.parse(e.target.value);
            setPodcast(item.id);
            setStorageDir(item.dir);
          }}
          className="rounded-md text-sm text-gray-500 dark:text-white p-1.5 px-2 w-full focus:outline-none bg-select dark:bg-darkSelect dark:border-gray-300 mt-1"
        >
          <option value="" disabled>
            Choose a podcast...
          </option>
          {!isLoading &&
            !isError &&
            podcasts.map((item: PodcastFull) => {
              return (
                <option
                  value={JSON.stringify({
                    id: item.id,
                    dir: item.dir,
                  })}
                  key={item.id}
                >
                  {item.name}
                </option>
              );
            })}
        </select>
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
          <NavLink exact to="/new/episode" activeClassName="active">
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
