import React from 'react';
import { NavLink } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import { Titlebar } from 'react-titlebar-osx';
import Icons from '../Icons/index';
import PodcastContext from '../../lib/Context/podcast';

export default function Aside({
  podcasts,
  isLoading,
  isError,
}: {
  podcasts: any;
  isLoading: boolean;
  isError: boolean;
}) {
  const { podcast, setPodcast } = React.useContext(PodcastContext);

  const minimizeWin = () => {
    ipcRenderer.send('window-min');
  };
  const fullWin = () => {
    ipcRenderer.send('window-full');
  };
  const closeWin = () => {
    ipcRenderer.send('window-close');
  };

  return (
    <aside className="aside border-r border-gray-200 h-full bg-transparent">
      <div className="controls p-3">
        <Titlebar
          transparent
          draggable
          onClose={() => closeWin()}
          onMaximize={() => fullWin()}
          onFullscreen={() => fullWin()}
          onMinimize={() => minimizeWin()}
        />
      </div>
      <div className="menu no-drag overflow-hidden overflow-y-auto px-4">
        <select
          defaultValue="none"
          value={podcast}
          onChange={(e) => {
            setPodcast(e.target.value);
          }}
          className="rounded-md text-sm text-gray-500 p-1.5 px-2 w-full focus:outline-none bg-select mt-1"
        >
          <option value="none" disabled>
            Choose a podcast...
          </option>
          {!isLoading &&
            !isError &&
            podcasts.map((item) => {
              return (
                <option value={item.name} key={item.name}>
                  {item.name}
                </option>
              );
            })}
        </select>
        <div className="mt-5 mb-1.5 pl-1.5">
          <h4 className="font-medium text-xs text-gray-400">Create</h4>
        </div>
        <ul className="menu-list text-sm text-gray-600">
          <NavLink exact to="/new" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center">
              <span className="w-5 h-5 mr-1.5">
                <Icons name="add" />
              </span>
              New Podcast
            </li>
          </NavLink>
          <NavLink exact to="/import" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center mt-1">
              <span className="w-5 h-5 mr-1.5">
                <Icons name="import" />
              </span>
              Import Podcast
            </li>
          </NavLink>
        </ul>
        <div className="mt-5 mb-1.5 pl-1.5">
          <h4 className="font-medium text-xs text-gray-400">Options</h4>
        </div>
        <ul className="menu-list text-sm text-gray-600">
          <NavLink exact to="/podcast" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center">
              <span className="w-5 h-5 mr-1.5">
                <Icons name="info" />
              </span>
              Podcast
            </li>
          </NavLink>
          <NavLink exact to="/episodes" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center mt-1">
              <span className="w-5 h-5 mr-1.5">
                <Icons name="episodes" />
              </span>
              Episodes
            </li>
          </NavLink>
          <NavLink exact to="/publish" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center mt-1">
              <span className="w-5 h-5 mr-1.5">
                <Icons name="publish" />
              </span>
              Publish
            </li>
          </NavLink>
        </ul>
        <div className="mt-5 mb-1.5 pl-1.5">
          <h4 className="font-medium text-xs text-gray-400">Settings</h4>
        </div>
        <ul className="menu-list text-sm text-gray-600">
          <NavLink exact to="/hosting" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center">
              <span className="w-5 h-5 mr-1.5">
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
