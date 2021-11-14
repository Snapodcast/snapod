/* eslint-disable @typescript-eslint/naming-convention */
import { useMutation } from '@apollo/client';
import React from 'react';
import { useHistory } from 'react-router';
import Store from '../../../lib/Store';
import { DELETE_PODCAST, MODIFY_PODCAST } from '../../../lib/GraphQL/queries';
import Head from '../../../components/Head';

export default function PodcastSettings() {
  const podcastCuid = Store.get('currentPodcast.cuid');
  const history = useHistory();
  const [deletePodcast] = useMutation(DELETE_PODCAST);
  const [modifyPodcast] = useMutation(MODIFY_PODCAST);
  const [deleting, setDeleting] = React.useState(false);
  const [setting, setSetting] = React.useState(false);
  const [new_feed_url, setNewFeedURL] = React.useState('');
  const [settingCode, setSettingCode] = React.useState(false);
  const [apple_podcasts_code, setAuthCode] = React.useState('');

  const doDelete = async () => {
    setDeleting(true);
    if (window.confirm('请确认删除\n此操作将不可重做')) {
      await deletePodcast({
        variables: {
          podcastCuid,
        },
      })
        .then(async () => {
          setDeleting(false);
          alert('删除成功');
          history.push('/landing/start');
        })
        .catch(() => {
          setDeleting(false);
          alert(`删除失败`);
        });
    } else {
      setDeleting(false);
    }
  };

  const doSetNewFeedURL = async (reset: boolean) => {
    setSetting(true);
    await modifyPodcast({
      variables: {
        podcastCuid,
        new_feed_url: reset ? '' : new_feed_url || '',
      },
    })
      .then(async () => {
        setSetting(false);
        if (apple_podcasts_code && !reset) {
          Store.set('currentPodcast.newFeedURL', new_feed_url || '');
        } else {
          Store.remove('currentPodcast.newFeedURL');
          history.push('/snapod/reset');
        }
        alert('设置成功');
      })
      .catch(() => {
        setSetting(false);
        alert(`设置失败`);
      });
  };

  const doSetAppleAuthCode = async (reset: boolean) => {
    setSettingCode(true);
    await modifyPodcast({
      variables: {
        podcastCuid,
        apple_podcasts_code: reset ? '' : apple_podcasts_code || '',
      },
    })
      .then(async () => {
        setSettingCode(false);
        if (apple_podcasts_code && !reset) {
          Store.set('currentPodcast.appleAuthCode', apple_podcasts_code);
        } else {
          Store.remove('currentPodcast.appleAuthCode');
          history.push('/snapod/reset');
        }
        alert('设置成功');
      })
      .catch(() => {
        setSettingCode(false);
        alert(`设置失败`);
      });
  };

  return (
    <div className="my-4 mx-5">
      <Head title="偏好设置" description="播客及应用程序偏好设置" />
      <div className="flex gap-x-3">
        <section className="flex-1 border rounded-lg py-3.5 px-4">
          <div className="items-center mb-2">
            <span className="flex-1 items-center">
              <em className="ml-1 text-base font-medium text-gray-500 dark:text-white not-italic">
                永久删除播客
              </em>
              <em className="ml-1 text-xs font-medium text-gray-400 dark:text-gray-300 not-italic">
                Delete podcast permanently
              </em>
            </span>
          </div>
          <p className="text-gray-500 text-sm ml-1 mb-2">
            此操作将永久删除当前播客，且将无法被重做，数据删除无法找回
          </p>
          <button
            disabled={settingCode || setting}
            className="flex justify-center align-middle items-center text-white text-sm hover:bg-red-600 bg-red-500 focus:outline-none rounded-md shadow-md py-1.5 px-3 text-center"
            aria-label="delete podcast"
            type="button"
            onClick={() => {
              if (!deleting) {
                doDelete();
              }
            }}
          >
            {deleting ? '删除中 Deleting...' : '删除播客 / Delete Podcast'}
          </button>
        </section>
        <section className="flex-1 border rounded-lg py-3.5 px-4">
          <div className="items-center mb-2">
            <span className="flex-1 items-center">
              <em className="ml-1 text-base font-medium text-gray-500 dark:text-white not-italic">
                播客跳转
              </em>
              <em className="ml-1 text-sm font-medium text-gray-400 dark:text-gray-300 not-italic">
                New feed URL
              </em>
            </span>
          </div>
          <input
            disabled={deleting || settingCode}
            defaultValue={Store.get('currentPodcast.newFeedURL')}
            placeholder="新 RSS 订阅地址(如果可用)"
            onChange={(e: { target: { value: any } }) => {
              setNewFeedURL(e.target.value);
            }}
            className="mb-2.5 tracking-wide dark:bg-transparent dark:text-gray-300 dark:border-gray-500 focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
          />
          <div className="flex gap-x-2">
            <button
              aria-label="modify feed url"
              type="button"
              className="flex justify-center align-middle items-center text-white text-sm hover:bg-gray-700 bg-gray-600 focus:outline-none rounded-md shadow-md py-1.5 px-3 text-center"
              onClick={() => {
                doSetNewFeedURL(false);
              }}
            >
              {setting ? '设置中 Setting...' : '确认设置 / Confirm'}
            </button>
            <button
              aria-label="modify feed url"
              type="button"
              className="flex justify-center align-middle items-center text-white text-sm hover:bg-gray-600 bg-gray-500 focus:outline-none rounded-md shadow-md py-1.5 px-3 text-center"
              onClick={() => {
                doSetNewFeedURL(true);
              }}
            >
              重置 / Reset
            </button>
          </div>
        </section>
      </div>
      <div className="flex gap-x-3 mt-3">
        <section className="flex-1 border rounded-lg py-3.5 px-4">
          <div className="items-center mb-2">
            <span className="flex-1 items-center">
              <em className="ml-1 text-base font-medium text-gray-500 dark:text-white not-italic">
                苹果播客验证码
              </em>
              <em className="ml-1 text-sm font-medium text-gray-400 dark:text-gray-300 not-italic">
                Apple Podcasts Authorization Code
              </em>
            </span>
          </div>
          <input
            disabled={deleting || setting}
            defaultValue={Store.get('currentPodcast.appleAuthCode')}
            placeholder="苹果播客平台验证码(如果可用)"
            onChange={(e: { target: { value: any } }) => {
              setAuthCode(e.target.value);
            }}
            className="mb-2.5 tracking-wide dark:bg-transparent dark:text-gray-300 dark:border-gray-500 focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
          />
          <div className="flex gap-x-2">
            <button
              aria-label="modify feed url"
              type="button"
              className="flex justify-center align-middle items-center text-white text-sm hover:bg-gray-700 bg-gray-600 focus:outline-none rounded-md shadow-md py-1.5 px-3 text-center"
              onClick={() => {
                doSetAppleAuthCode(false);
              }}
            >
              {settingCode ? '设置中 Setting...' : '确认设置 / Confirm'}
            </button>
            <button
              aria-label="modify feed url"
              type="button"
              className="flex justify-center align-middle items-center text-white text-sm hover:bg-gray-600 bg-gray-500 focus:outline-none rounded-md shadow-md py-1.5 px-3 text-center"
              onClick={() => {
                doSetAppleAuthCode(true);
              }}
            >
              重置 / Reset
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
