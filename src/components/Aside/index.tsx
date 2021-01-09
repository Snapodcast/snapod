import React from 'react';
import { NavLink } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import { Titlebar } from 'react-titlebar-osx';
import Icons from '../Icons/index';

export default function Aside() {
  const minimizeWin = () => {
    ipcRenderer.send('window-min'); // 通知主进程我要进行窗口最小化操作
  };
  const fullWin = () => {
    ipcRenderer.send('window-full');
  };
  const closeWin = () => {
    ipcRenderer.send('window-close');
  };
  return (
    <aside className="aside border-r border-gray-100 h-full bg-transparent">
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
        <select className="rounded-md text-sm text-gray-500 p-1.5 px-2 w-full focus:outline-none bg-select mt-1">
          <option>Choose or create a show</option>
          <option>已知未知 Known Unknowns</option>
        </select>
        <div className="mt-5 mb-1.5">
          <h4 className="font-medium text-xs text-gray-400">Options</h4>
        </div>
        <ul className="menu-list text-sm text-gray-600">
          <NavLink to="/podcast" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center">
              <span className="w-5 h-5 mr-1.5">
                <Icons name="show" />
              </span>
              Podcast
            </li>
          </NavLink>
          <NavLink to="/episodes" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center mt-1">
              <span className="w-5 h-5 mr-1.5">
                <Icons name="episodes" />
              </span>
              Episodes
            </li>
          </NavLink>
          <NavLink to="/publish" activeClassName="active">
            <li className="rounded-md py-1.5 px-2 flex items-center mt-1">
              <span className="w-5 h-5 mr-1.5">
                <Icons name="publish" />
              </span>
              Publish
            </li>
          </NavLink>
        </ul>
      </div>
    </aside>
  );
}
