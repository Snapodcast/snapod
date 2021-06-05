/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/accessible-emoji */
import React from 'react';
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import Icons from '../Icons/index';
import * as Store from '../../lib/Store';
import logout from '../../services/logout';
import ApolloClient from '../../lib/GraphQL';

export default function Aside() {
  // current podcast
  const currentPodcastName = Store.get('currentPodcast.name');

  // router navigation hook
  const history = useHistory();
  const location = useLocation();

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
        <select
          value={currentPodcastName}
          onChange={(e) => {
            if (e.target.value === 'create') {
              history.push('/landing/create/podcast');
            } else if (e.target.value === 'select') {
              history.push('/landing/start');
            }
          }}
          className="rounded-md text-sm text-gray-500 dark:text-white p-1.5 px-2 w-full focus:outline-none bg-select dark:bg-darkSelect dark:border-gray-300 mt-1"
        >
          <option value="origin">{currentPodcastName}</option>
          <option value="select">选择已有播客👉</option>
          <option value="create">新建播客🎉</option>
        </select>
        <div className="my-3">
          <Link to="/snapod/create/episode">
            <button
              type="submit"
              aria-label="create episode"
              className="flex justify-center align-middle items-center my-3 text-white text-sm hover:bg-gray-700 bg-gray-600 dark:bg-gray-500 dark:hover:bg-gray-400 focus:outline-none rounded-md shadow-md w-full py-1.5 text-center"
            >
              <span className="h-5 w-5 mr-1.5">
                <Icons name="addEpisode" />
              </span>
              新建节目
            </button>
          </Link>
        </div>
        <div className="mt-5 mb-1.5 pl-1.5">
          <h4 className="font-medium text-xs text-gray-400 dark:text-gray-500">
            管理
          </h4>
        </div>
        <ul className="menu-list text-sm text-gray-600 dark:text-white">
          <NavLink exact to="/snapod/manage/podcast" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center mt-1">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="info" />
              </span>
              播客信息
            </li>
          </NavLink>

          {location.pathname === '/snapod/manage/episode' ? (
            <div>
              <NavLink exact to="/snapod/manage/episodes" className="active">
                <li className="rounded-md rounded-br-none py-1.5 px-2 flex items-center active">
                  <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                    <Icons name="episodes" />
                  </span>
                  节目列表
                </li>
              </NavLink>
              <a href="#" className="active">
                <li className="rounded-bl-md rounded-br-md py-1.5 px-2 flex items-center ml-4 mt-1">
                  <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                    <Icons name="episode" />
                  </span>
                  节目详情
                </li>
              </a>
            </div>
          ) : (
            <NavLink
              exact
              to="/snapod/manage/episodes"
              activeClassName="active"
            >
              <li className="rounded-md py-1.5 px-2 flex items-center">
                <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                  <Icons name="episodes" />
                </span>
                节目列表
              </li>
            </NavLink>
          )}
          <NavLink exact to="/snapod/manage/metrics" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="presentation-chart" />
              </span>
              节目数据
            </li>
          </NavLink>
          <NavLink exact to="/snapod/manage/site" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="globe" />
              </span>
              播客站点
            </li>
          </NavLink>
        </ul>
        <div className="mt-5 mb-1.5 pl-1.5">
          <h4 className="font-medium text-xs text-gray-400 dark:text-gray-500">
            设置
          </h4>
        </div>
        <ul className="menu-list text-sm text-gray-600 dark:text-white">
          <NavLink
            exact
            to="/snapod/settings/distributions"
            activeClassName="active"
          >
            <li className="rounded-md py-1.5 px-2 flex items-center">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="publish" />
              </span>
              发布渠道
            </li>
          </NavLink>
          <NavLink exact to="/snapod/settings/podcast" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="gear" />
              </span>
              偏好设置
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
            ApolloClient.resetStore();
            logout();
            history.push('/landing/login');
          }}
          aria-label="logout"
          type="button"
          className="col-start-7 col-end-8 hover:shadow-md w-6 h-6 p-1 rounded-md bg-gray-100 justify-center flex items-center"
        >
          <span className="w-3.5 h-3.5">
            <Icons name="out" />
          </span>
        </button>
      </div>
    </aside>
  );
}
