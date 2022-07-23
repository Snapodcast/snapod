import { ipcRenderer } from 'electron';
import React from 'react';
import Head from '../../../components/Head';
import Icons from '../../../components/Icons';
import { useI18n } from '../../../hooks';

export default function AppSettings() {
  const { language, changeLanguage } = useI18n();

  const currentTheme = ipcRenderer.sendSync('get-theme');
  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    ipcRenderer.invoke('set-theme', e.target.value);
  };

  const updateChannel =
    ipcRenderer.sendSync('store-get', 'updateChannel') || 'stable';
  const handleUpdateChannelChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    ipcRenderer.invoke('store-set', 'updateChannel', e.target.value);
  };

  return (
    <div className="my-4 mx-5">
      <Head title="偏好设置" description="应用程序偏好设置" />
      <section className="mb-5 grid grid-cols-2 gap-x-3">
        <div className="border rounded-lg py-3.5 px-4">
          <div className="items-center mb-1.5 flex">
            <span className="items-center flex ml-1 flex-1">
              <span className="w-4 h-4 text-gray-500 dark:text-white">
                <Icons name="sun" />
              </span>
              <em className="ml-1 text-base font-medium text-gray-500 dark:text-white not-italic">
                外观偏好
              </em>
              <em className="ml-1 text-sm font-medium text-gray-400 dark:text-gray-300 not-italic">
                Appearance
              </em>
            </span>
          </div>
          <select
            onChange={handleThemeChange}
            defaultValue={currentTheme}
            className="mt-1 tracking-wide dark:bg-transparent dark:text-gray-300 dark:border-gray-500 focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-1.5 text-gray-700"
          >
            <option value="system">跟随系统 System</option>
            <option value="light">浅色 Light</option>
            <option value="dark">深色 Dark</option>
          </select>
        </div>
        <div className="border rounded-lg py-3.5 px-4">
          <div className="items-center mb-1.5 flex">
            <span className="items-center flex ml-1 flex-1">
              <span className="w-4 h-4 text-gray-500 dark:text-white">
                <Icons name="translate" />
              </span>
              <em className="ml-1 text-base font-medium text-gray-500 dark:text-white not-italic">
                界面语言
              </em>
              <em className="ml-1 text-sm font-medium text-gray-400 dark:text-gray-300 not-italic">
                Language
              </em>
            </span>
          </div>
          <select
            onChange={(e) => changeLanguage(e.target.value)}
            defaultValue={language}
            className="mt-1 tracking-wide dark:bg-transparent dark:text-gray-300 dark:border-gray-500 focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-1.5 text-gray-700"
          >
            <option value="en">English</option>
            <option value="zh">简体中文</option>
          </select>
        </div>
        <div className="border rounded-lg py-3.5 px-4">
          <div className="items-center mb-1.5 flex">
            <span className="items-center flex ml-1 flex-1">
              <span className="w-4 h-4 text-gray-500 dark:text-white">
                <Icons name="translate" />
              </span>
              <em className="ml-1 text-base font-medium text-gray-500 dark:text-white not-italic">
                更新频道
              </em>
              <em className="ml-1 text-sm font-medium text-gray-400 dark:text-gray-300 not-italic">
                Update Channel
              </em>
            </span>
          </div>
          <select
            onChange={handleUpdateChannelChange}
            defaultValue={updateChannel}
            className="mt-1 tracking-wide dark:bg-transparent dark:text-gray-300 dark:border-gray-500 focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-1.5 text-gray-700"
          >
            <option value="stable">稳定版本 (Stable)</option>
            <option value="beta">测试版本 (Beta)</option>
            <option value="alpha">先行版本 (Alpha)</option>
          </select>
        </div>
      </section>
    </div>
  );
}
