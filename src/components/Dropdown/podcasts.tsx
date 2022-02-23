import React, { Fragment, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { PodcastContext } from '../../lib/Context';
import Icons from '../Icons/index';
import { useEffectOnce } from 'react-use';
import Store from '../../lib/Store';
import { useI18n } from '../../hooks';

const PodcastsDropdown = () => {
  const { t } = useI18n();
  // current podcast
  const { name, setName } = useContext(PodcastContext);

  useEffectOnce(() => {
    setName(Store.get('currentPodcast.name'));
  });

  return (
    <Menu as="div">
      <Menu.Button className="grid grid-cols-8 whitespace-nowrap rounded-md text-sm text-gray-500 dark:text-white py-1.5 px-2.5 w-full focus:outline-none bg-select hover:bg-active dark:bg-darkSelect dark:hover:bg-darkSelect mt-1">
        <span className="col-start-1 col-end-8 overflow-hidden overflow-ellipsis text-left">
          {name}
        </span>
        <span className="col-start-8 col-end-9 text-right w-5 h-5 ml-2 -mr-1">
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
                    {t('choosePodcast')}
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
                    {t('createPodcast')}
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
                    {t('importPodcast')}
                  </span>
                  <span>🗂️</span>
                </button>
              </Link>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default PodcastsDropdown;
