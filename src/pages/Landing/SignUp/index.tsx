import React from 'react';
import { Link } from 'react-router-dom';

export default function SignUp() {
  return (
    <div className="w-full h-full theme-background drag">
      <main className="flex align-middle items-center h-full justify-center">
        <div className="shadow-md rounded-md w-2/5 bg-white px-8 py-10 pb-11">
          <div className="mb-5">
            <h1 className="font-bold text-3xl tracking-wide">
              <span role="img" aria-label="snapod-logo" className="mr-0.5">
                🎙️
              </span>
              Snapod
            </h1>
            <p className="text-gray-400 text-sm ml-1 mt-1">
              Grow your podcast with ease
            </p>
          </div>
          <div className="w-full">
            <p className="w-full">
              <em className="ml-1 text-xs font-medium text-gray-500 not-italic">
                邮箱 / Email
              </em>
              <input
                type="email"
                placeholder="your@email.com"
                className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
              />
            </p>
            <p className="w-full mt-3">
              <em className="ml-1 text-xs font-medium text-gray-500 not-italic">
                密码 / Password
              </em>
              <input
                type="password"
                placeholder="••••••••••••"
                className="mt-1 tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
              />
            </p>
          </div>
          <div className="w-full mt-8 text-center">
            <button
              type="submit"
              aria-label="login"
              className="mb-3 text-white text-sm hover:bg-gray-700 transition-all bg-gray-600 focus:outline-none rounded-md shadow-sm w-full py-2 text-center"
            >
              登入 / Login
            </button>
            <Link to="/landing/login" className="text-sm text-gray-400">
              已有账户? 立刻登入 / Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
