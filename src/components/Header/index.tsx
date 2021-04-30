import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import HeadContext from '../../lib/Context/head';

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

  return (
    <div
      className={`main drag header border-headerBorder bg-headerBg dark:bg-darkHeader dark:border-darkSelect fixed z-30 flex py-1 px-4 items-center cursor-default border-b ${
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
          className="focus:outline-none w-7 h-7 p-1 hover:bg-select rounded-md cursor-default"
          onClick={() => {
            ipcRenderer.send('hide-sidebar');
          }}
        >
          <Icons name="switch" />
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
        {location.pathname !== '/snapod/start' && (
          <button
            type="button"
            className="focus:outline-none w-7 h-7 p-1 hover:bg-select rounded-md cursor-default"
            onClick={() => {
              history.goBack();
            }}
          >
            <Icons name="back" />
          </button>
        )}
        <button
          type="button"
          className="focus:outline-none w-7 h-7 p-1 hover:bg-select rounded-md cursor-default"
          onClick={() => {
            history.push('/snapod/start');
          }}
        >
          <Icons name="home" />
        </button>
      </div>
    </div>
  );
}
