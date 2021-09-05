import React from 'react';

export default function UpdatePage() {
  return (
    <div className="z-10 shadow-md rounded-md w-2/5 max-h-96 overflow-y-auto overflow-hidden bg-white dark:bg-darkBg px-8 py-7 no-drag animate-slideUp">
      <div className="text-center">
        <h1 className="font-bold text-5xl tracking-wide">
          <span role="img" aria-label="snapod-logo" className="mr-0.5">
            🌟
          </span>
        </h1>
        <p className="text-gray-500 dark:text-white text-sm mt-1.5 transition-all">
          有新版本可用
        </p>
      </div>
      <div className="justify-center text-center mt-5 text-gray-600">
        <p>新版本的 Snapod 软件已经可用，请前往官网下载更新</p>
        <div className="flex justify-center mt-5">
          <a href="https://app.snapodcast.com" target="_blank" rel="noreferrer">
            <button
              aria-label="navigate to official website"
              type="button"
              className="flex justify-center align-middle items-center text-white text-sm hover:bg-gray-700 bg-gray-600 focus:outline-none rounded-md shadow-md py-1.5 px-4 text-center"
            >
              前往更新 →
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
