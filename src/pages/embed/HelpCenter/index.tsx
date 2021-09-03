import React from 'react';
import Head from '../../../components/Head';

export default function HelpCenter() {
  return (
    <div className="my-4 mx-5">
      <Head title="帮助中心" description="查看有关此版本的帮助信息" />
      <div>
        <div className="text-gray-600 dark:text-white">
          <h1 className="text-2xl font-medium">Snapod Beta</h1>
          <p>内测版本</p>
        </div>
        <div className="mt-5">
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            You are using a beta version of Snapod, we cannot guarantee our
            service quality and may introduce breaking changes at any time.
            Please understand that it is your obligation to prevent this version
            of application from leaking to other users without previous access
            to this application, we reserve any rights to block/delete/modify
            any account that has violated this term of use.
          </p>
        </div>
        <div className="mt-5">
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            你正在使用 Snapod
            的内测版软件，我们将无法保证服务质量并随时可能对功能、界面等进行调整和修改。请勿将此版本分享给还未获得内测权限的用户，我们保留对任何违反这一规则的账户进行封禁/删除/修改的权利。
          </p>
        </div>
        <div className="mt-5 grid grid-cols-4 gap-2 text-gray-500 dark:text-gray-300 text-sm">
          <a
            href="https://shimo.im/forms/kvrPJqD9cY3y3tWP/fill"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 hover:text-blue-600"
          >
            反馈 Feedback →
          </a>
          <a
            href="https://www.snapodcast.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-gray-600"
          >
            官网 Website →
          </a>
          <a
            href="https://status.snapodcast.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-gray-600"
          >
            服务状态 Status →
          </a>
          <a
            href="https://www.ouorz.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-gray-600"
          >
            博客 Blog →
          </a>
          <a
            href="https://github.com/Snapodcast"
            target="_blank"
            rel="noreferrer"
            className="hover:text-gray-600"
          >
            开源 Github →
          </a>
          <a
            href="https://twitter.com/Snapodcast"
            target="_blank"
            rel="noreferrer"
            className="hover:text-gray-600"
          >
            推特 Twitter →
          </a>
        </div>
      </div>
    </div>
  );
}
