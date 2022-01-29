import { ipcRenderer } from 'electron';
import React from 'react';
import Head from '../../../components/Head';

export default function AppSettings() {
  const currentTheme = ipcRenderer.sendSync('get-theme');

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    ipcRenderer.invoke('set-theme', e.target.value);
  };

  return (
    <div className="my-4 mx-5">
      <Head title="偏好设置" description="应用程序偏好设置" />
      <div className="flex gap-x-3">
        <section className="flex-1 border rounded-lg py-3.5 px-4">
          <div className="items-center mb-2">
            <span className="flex-1 items-center">
              <em className="ml-1 text-base font-medium text-gray-500 dark:text-white not-italic">
                外观偏好
              </em>
              <em className="ml-1 text-xs font-medium text-gray-400 dark:text-gray-300 not-italic">
                Appearance
              </em>
            </span>
          </div>
          <select onChange={handleThemeChange} defaultValue={currentTheme}>
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </section>
      </div>
    </div>
  );
}
