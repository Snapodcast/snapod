/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/accessible-emoji */
import React, { Fragment } from 'react';
import { Link, NavLink, useHistory, useLocation } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import Icons from '../Icons/index';
import Store from '../../lib/Store';
import logout from '../../services/logout';
import ApolloClient from '../../lib/GraphQL';
import { Menu, Transition } from '@headlessui/react';

export default function Aside() {
  // current podcast
  const currentPodcastName = Store.get('currentPodcast.name');

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
        <Menu as="div">
          <Menu.Button className="grid grid-cols-8 whitespace-nowrap rounded-md text-sm text-gray-500 dark:text-white py-1.5 px-2.5 w-full focus:outline-none bg-select hover:bg-active dark:bg-darkSelect dark:hover:bg-darkSelect mt-1">
            <span className="col-start-1 col-end-8 overflow-hidden overflow-ellipsis">
              {currentPodcastName}
            </span>
            <span className="col-start-8 col-end-9 text-right w-5 h-5 ml-2 -mr-1 dark:text-violet-200 dark:hover:text-violet-100 text-gray-500 hover:text-gray-600">
              <Icons name="chevron-down-solid" />
            </span>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-4 w-select mt-2 origin-top-right text-gray-600 bg-white dark:bg-darkSelectBg dark:text-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="p-1.5 py-2">
                <Menu.Item>
                  <Link to="/landing/start">
                    <button
                      type="button"
                      className="group flex rounded-md items-center w-full px-2.5 py-1.5 text-sm hover:bg-select dark:hover:bg-darkSelect focus:bg-active"
                    >
                      <span className="flex-1 text-left tracking-wide">
                        选择播客
                      </span>
                      <span>👉</span>
                    </button>
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link to="/landing/create/podcast">
                    <button
                      type="button"
                      className="group flex rounded-md items-center w-full px-2.5 py-1.5 text-sm hover:bg-select dark:hover:bg-darkSelect focus:bg-active"
                    >
                      <span className="flex-1 text-left tracking-wide">
                        新建播客
                      </span>
                      <span>🎉</span>
                    </button>
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link to="/landing/import/podcast">
                    <button
                      type="button"
                      className="group flex rounded-md items-center w-full px-2.5 py-1.5 text-sm hover:bg-select dark:hover:bg-darkSelect focus:bg-active"
                    >
                      <span className="flex-1 text-left tracking-wide">
                        导入播客
                      </span>
                      <span>🗂️</span>
                    </button>
                  </Link>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
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
            <li className="rounded-md py-1.5 px-2 flex items-center mt-1 hover:bg-hover dark:hover:bg-darkActive active:bg-click active:text-gray-800 dark:active:text-white/80 dark:active:bg-darkClick transition-colors cursor-pointer">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="info" />
              </span>
              播客信息
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
            <li className="rounded-md py-1.5 px-2 flex items-center hover:bg-hover dark:hover:bg-darkActive active:bg-click active:text-gray-800 dark:active:text-white/80 dark:active:bg-darkClick transition-colors cursor-pointer">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="episodes" />
              </span>
              节目列表
            </li>
          </NavLink>
          <NavLink exact to="/snapod/manage/metrics" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center hover:bg-hover dark:hover:bg-darkActive active:bg-click active:text-gray-800 dark:active:text-white/80 dark:active:bg-darkClick transition-colors cursor-pointer">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="presentation-chart" />
              </span>
              节目数据
            </li>
          </NavLink>
          <NavLink exact to="/snapod/manage/site" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center hover:bg-hover dark:hover:bg-darkActive active:bg-click active:text-gray-800 dark:active:text-white/80 dark:active:bg-darkClick transition-colors cursor-pointer">
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
            <li className="rounded-md py-1.5 px-2 flex items-center hover:bg-hover dark:hover:bg-darkActive active:bg-click active:text-gray-800 dark:active:text-white/80 dark:active:bg-darkClick transition-colors cursor-pointer">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="publish" />
              </span>
              发布渠道
            </li>
          </NavLink>
          <NavLink exact to="/snapod/settings/podcast" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center hover:bg-hover dark:hover:bg-darkActive active:bg-click active:text-gray-800 dark:active:text-white/80 dark:active:bg-darkClick transition-colors cursor-pointer">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="adjust" />
              </span>
              播客设置
            </li>
          </NavLink>
          <NavLink exact to="/snapod/settings/app" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center hover:bg-hover dark:hover:bg-darkActive active:bg-click active:text-gray-800 dark:active:text-white/80 dark:active:bg-darkClick transition-colors cursor-pointer">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="gear" />
              </span>
              偏好设置
            </li>
          </NavLink>
        </ul>
        <div className="mt-5 mb-1.5 pl-1.5">
          <h4 className="font-medium text-xs text-gray-400 dark:text-gray-500">
            关于
          </h4>
        </div>
        <ul className="menu-list text-sm text-gray-600 dark:text-white">
          <NavLink exact to="/snapod/helpCenter" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center hover:bg-hover dark:hover:bg-darkActive active:bg-click active:text-gray-800 dark:active:text-white/80 dark:active:bg-darkClick transition-colors cursor-pointer">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="questionMark" />
              </span>
              帮助中心
            </li>
          </NavLink>
          <NavLink exact to="/snapod/about" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center hover:bg-hover dark:hover:bg-darkActive active:bg-click active:text-gray-800 dark:active:text-white/80 dark:active:bg-darkClick transition-colors cursor-pointer">
              <span className="w-5 h-5 mr-1.5 dark:text-blue-500">
                <Icons name="qrCode" />
              </span>
              版本信息
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
        <button
          onClick={() => {
            ApolloClient.resetStore();
            logout();
            history.push('/landing/login');
          }}
          aria-label="logout"
          type="button"
          className="col-start-7 col-end-8 hover:bg-gray-200 w-6 h-6 p-1 rounded-md bg-gray-100 justify-center flex items-center text-gray-600 hover:text-gray-700"
        >
          <span className="w-3.5 h-3.5">
            <Icons name="out" />
          </span>
        </button>
      </div>
    </aside>
  );
}
