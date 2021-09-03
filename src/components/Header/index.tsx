import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import HeadContext from '../../lib/Context/head';
import sidebarIcon from '../../public/sidebar_icon.png';

import Icons from '../Icons';

export default function Header() {
  const { head } = React.useContext(HeadContext);
  const [extend, setExtend] = React.useState<'true' | 'false' | 'unset'>(
    'unset'
  );
  const history = useHistory();
  const location = useLocation();

  const hideSideBarListener = () => {
    setExtend(extend === 'true' ? 'false' : 'true');
  };

  React.useEffect(() => {
    return () => {
      ipcRenderer.removeListener('hide-sidebar', hideSideBarListener);
    };
  });

  // Listen to hiding sidebar event
  ipcRenderer.on('hide-sidebar', hideSideBarListener);

  const embedPaths = ['/snapod/manage/episode', '/snapod/create/episode'];

  return (
    <div
      className={`main drag header border-headerBorder bg-headerBg dark:bg-headerDark dark:border-darkSelect fixed z-30 flex py-1 px-4 items-center cursor-default border-b ${
        process.platform !== 'darwin' && 'border-t'
      } ${
        extend === 'true'
          ? `animate-extendMainHeader ${
              process.platform !== 'darwin' ? 'extendWinHeader' : 'pl-24'
            }`
          : extend === 'unset'
          ? 'snapod animate-firstShow'
          : process.platform !== 'darwin'
          ? 'animate-restoreMainHeaderWin'
          : 'animate-restoreMainHeader'
      }`}
    >
      <div className="items-center control mr-3 pr-2 border-r border-gray-200 dark:border-darkSelect">
        <button
          type="button"
          className="focus:outline-none w-8 h-8 hover:bg-select dark:text-gray-200 dark:hover:bg-black rounded-md cursor-default flex justify-center items-center"
          onClick={() => {
            ipcRenderer.send('hide-sidebar');
          }}
        >
          <img alt="hide/show sidebar" src={sidebarIcon} className="w-5 h-5" />
        </button>
      </div>
      <div className="w-full -mt-1">
        <h1 className="text-lg header-title font-medium tracking-normal text-gray-900 dark:text-white whitespace-nowrap overflow-hidden overflow-ellipsis">
          {head.title}
        </h1>
        <p className="text-xs tracking-wide -mt-1 text-gray-500 dark:text-gray-400">
          {head.description}
        </p>
      </div>
      <div className="items-center flex justify-end text-gray-500 space-x-2">
        {embedPaths.indexOf(location.pathname) > -1 && (
          <button
            type="button"
            className="focus:outline-none w-8 h-8 p-1 hover:bg-select rounded-md cursor-default flex items-center justify-center mt-0.5"
            onClick={() => {
              history.goBack();
            }}
          >
            <span className="w-5 h-5 block">
              <Icons name="back" />
            </span>
          </button>
        )}
        <button
          type="button"
          className="focus:outline-none w-8 h-8 p-1 mt-0.5 hover:bg-select dark:hover:bg-black dark:text-gray-200 rounded-md cursor-default flex items-center justify-center"
          onClick={() => {
            history.push('/snapod/start');
          }}
        >
          <span className="w-5 h-5 block">
            <Icons name="home" />
          </span>
        </button>
      </div>
    </div>
  );
}
