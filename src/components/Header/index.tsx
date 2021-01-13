import React from 'react';
import { useHistory } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import HeadContext from '../../lib/Context/head';

import Icons from '../Icons';

export default function Header() {
  const { head } = React.useContext(HeadContext);
  const [extend, setExtend] = React.useState<'true' | 'false' | 'unset'>(
    'unset'
  );
  const history = useHistory();

  // Listen to hiding sidebar event
  ipcRenderer.on('hide-sidebar', () => {
    setExtend(extend === 'true' ? 'false' : 'true');
  });

  return (
    <div
      className={`main drag header fixed z-50 flex py-1 px-4 items-center cursor-default ${
        // eslint-disable-next-line no-nested-ternary
        extend === 'true'
          ? 'animate-extendMainHeader pl-24'
          : extend === 'unset'
          ? ''
          : 'animate-restoreMainHeader'
      }`}
    >
      <div className="items-center text-gray-500 mr-3 pr-2 border-r border-gray-200">
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
      <div className="w-full">
        <h1 className="text-lg font-medium tracking-normal text-gray-900">
          {head.title}
        </h1>
        <p className="text-xs tracking-wide -mt-1 text-gray-500">
          {head.description}
        </p>
      </div>
      <div className="items-center flex justify-end text-gray-500 space-x-2">
        <button
          type="button"
          className="focus:outline-none w-7 h-7 p-1 hover:bg-select rounded-md cursor-default"
          onClick={() => {
            history.goBack();
          }}
        >
          <Icons name="back" />
        </button>
        <button
          type="button"
          className="focus:outline-none w-7 h-7 p-1 hover:bg-select rounded-md cursor-default"
          onClick={() => {
            history.push('/start');
          }}
        >
          <Icons name="home" />
        </button>
      </div>
    </div>
  );
}
