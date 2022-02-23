import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import Icons from '../Icons/index';
import { useI18n } from '../../hooks';

const LanguagesDropdown = () => {
  const { language, changeLanguage } = useI18n();

  return (
    <Menu as="div" className="w-32">
      <Menu.Button className="flex whitespace-nowrap rounded-md text-sm text-gray-500 dark:text-white py-1.5 px-3 w-full focus:outline-none bg-select hover:bg-active dark:bg-darkSelect dark:hover:bg-darkSelect mt-1">
        <span className="flex-2 text-right w-5 h-5 mr-2">
          <Icons name="translate" />
        </span>
        <span className="flex-1 overflow-hidden overflow-ellipsis text-center">
          {language === 'zh' ? '简体中文' : 'English'}
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
        <Menu.Items className="z-10 absolute -translate-y-full -mt-10 w-32 text-gray-600 bg-white dark:bg-darkSelectBg dark:text-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="p-1.5 py-2">
            <Menu.Item>
              <button
                onClick={() => changeLanguage('en')}
                type="button"
                className="group flex rounded-md items-center w-full px-2.5 py-1.5 text-sm hover:bg-select dark:hover:bg-darkSelect focus:bg-active"
              >
                <span className="flex-1 text-left tracking-wide">English</span>
                <span>🌏</span>
              </button>
            </Menu.Item>
            <Menu.Item>
              <button
                onClick={() => changeLanguage('zh')}
                type="button"
                className="group flex rounded-md items-center w-full px-2.5 py-1.5 text-sm hover:bg-select dark:hover:bg-darkSelect focus:bg-active"
              >
                <span className="flex-1 text-left tracking-wide">简体中文</span>
                <span>🇨🇳</span>
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default LanguagesDropdown;
