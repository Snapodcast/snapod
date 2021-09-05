import React from 'react';
import * as Store from '../../../lib/Store';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_SITE,
  MODIFY_CUSTOM_DOMAIN,
  MODIFY_PODCAST,
} from '../../../lib/GraphQL/queries';
import Head from '../../../components/Head';
import Icons from '../../../components/Icons';
import { useHistory } from 'react-router';
import SnapodLogoImage from '../../../public/snapod_logo.png';
import NetlifyLogoImage from '../../../public/netlify_logo.png';
import Configs from '../../../configs';

export default function ManageSite() {
  const podcastCuid = Store.get('currentPodcast.cuid');
  const history = useHistory();
  const [podcastInfo, setInfo] = React.useState<{
    snapod_site_url: string;
    snapod_site_custom_url: string;
  }>({
    snapod_site_url: '',
    snapod_site_custom_url: '',
  });
  const [saving, setSaving] = React.useState(false);
  const [activating, setActivating] = React.useState(false);

  const { loading, error, data, refetch } = useQuery(GET_SITE, {
    variables: { podcastCuid },
    fetchPolicy: 'network-only',
    onCompleted: () => {
      setInfo({
        snapod_site_url: data.podcast.profile.snapod_site_url,
        snapod_site_custom_url: data.podcast.profile.snapod_site_custom_url,
      });
    },
  });

  const [modifySite] = useMutation(MODIFY_PODCAST);
  const [modifyCustomDomain] = useMutation(MODIFY_CUSTOM_DOMAIN);

  /* Activation action */
  const doActivate = async () => {
    setActivating(true);
    const variables = {
      podcastCuid,
      snapod_site_url: `${Configs.site_url}/${
        46800 + parseInt(data.podcast.id, 10)
      }`,
    };

    await modifySite({
      variables,
    })
      .then(() => {
        alert('启用成功');
        history.push('/snapod/reset');
      })
      .catch(() => {
        alert(`启用失败`);
        setActivating(false);
      });
  };

  /* Modification action */
  const doModifyDomain = async (reset: boolean) => {
    setSaving(true);
    const variables = {
      podcastCuid,
      customDomain: reset ? '' : podcastInfo.snapod_site_custom_url,
    };

    await modifyCustomDomain({
      variables,
    })
      .then(() => {
        alert('提交成功');
        history.push('/snapod/reset');
      })
      .catch(() => {
        alert(`提交失败`);
        setSaving(false);
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="w-5 h-5">
          <Icons name="spinner" />
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center error-container">
        <div className="-mt-3">
          <p className="mb-3 flex justify-center">
            <span className="h-28 w-28 text-gray-200">
              <Icons name="warning" />
            </span>
          </p>
          <div className="justify-center flex">
            <button
              aria-label="refetch"
              type="button"
              className="flex justify-center align-middle items-center text-white text-sm hover:bg-gray-600 bg-gray-500 focus:outline-none rounded-md shadow-md py-1.5 px-4 text-center"
              onClick={() => {
                refetch();
              }}
            >
              重新加载
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Snapod site is not activated
  if (!data.podcast.profile.snapod_site_url) {
    return (
      <div className="my-4 mx-5">
        <Head title="开启播客站点" description="为你的播客创建一个独立站点" />
        <div className="flex justify-center items-center w-full">
          <div className="flex absolute bottom-5 z-10 gap-x-3">
            <button
              className="bg-blue-500 tracking-wide text-center text-sm py-1 px-5 shadow-lg rounded-2xl whitespace-nowrap text-white hover:bg-blue-600"
              aria-label="save changes"
              type="button"
              onClick={() => {
                doActivate();
              }}
            >
              {activating ? '提交中...' : '同意并启用'}
            </button>
          </div>
        </div>
        <div className="site-agreement">
          <section className="flex justify-center items-center">
            <div className="flex gap-x-5">
              <div className="flex justify-center items-center">
                <img
                  src={SnapodLogoImage}
                  alt="snapod logo"
                  className="h-14 w-14"
                />
              </div>
              <div className="flex justify-center items-center">
                <span className="text-xl text-gray-300">X</span>
              </div>
              <div className="flex justify-center items-center">
                <img
                  src={NetlifyLogoImage}
                  alt="netlify logo"
                  className="h-12 w-12"
                />
              </div>
            </div>
          </section>
          <section className="flex justify-center items-center mt-4">
            <div>
              <div className="mb-8 text-center">
                <h1 className="text-2xl text-gray-700 dark:text-white font-medium mb-0.5 tracking-wide">
                  Snapod 播客站点
                </h1>
                <p className="text-sm tracking-wide text-gray-500 dark:text-gray-300">
                  Snapod Site
                </p>
              </div>
              <div className="text-sm text-gray-600">
                <p className="mb-1.5">
                  Snapod Site 是 Snapod
                  提供的播客站点生成、托管服务，借助领先的云服务提供商 Netlify
                  提供的站点部署、CDN 及其他有关服务的支持面向在 Snapod
                  平台上新建或导入的播客开放。
                </p>
                <p className="mb-1.5">
                  在你的使用过程中，Snapod 将无法对播客、节目信息及相关数据
                  (不含密码等隐私内容) 的安全、完整性负责。第三方平台 (Netlify)
                  可能会对以上信息进行储存、展示和传播，Snapod
                  将无法做出任何限制。
                </p>
                <p>
                  请在开启此功能前知悉并同意以上内容以确保你的权益得到保障。同意并开启
                  Snapod Site
                  后此播客将获得一个唯一站点地址，你也可在稍后进行自定义域名绑定。
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="my-4 mx-5">
      <Head title="管理播客站点" description="修改播客站点设置与自定义域名" />
      <section className="border rounded-md py-5 text-center">
        <h1 className="text-lg font-medium mb-3 flex gap-x-2 justify-center items-center dark:text-white">
          <span className="w-5 h-5">
            <Icons name="globe" />
          </span>
          播客站点 / Snapod Site
        </h1>
        {data.podcast.profile.snapod_site_custom_url ? (
          <div className="rounded-md border text-sm inline-block text-gray-600 shadow-sm">
            <p className="border-b py-2 px-3.5 flex gap-2 items-center">
              <span className="rounded-full bg-green-500 text-white text-xs h-5 px-2 flex items-center">
                Default
              </span>
              <span className="dark:text-gray-300">
                {data.podcast.profile.snapod_site_url}
              </span>
            </p>
            <p className="py-2 px-3.5 flex gap-2 items-center">
              <span className="rounded-full bg-yellow-500 text-white text-xs h-5 px-2 flex items-center">
                Custom
              </span>
              <span className="dark:text-gray-300">
                https://
                {data.podcast.profile.snapod_site_custom_url}
              </span>
            </p>
          </div>
        ) : (
          <div className="inline-block shadow-sm">
            <p className="rounded-md border py-2 px-3.5 gap-2 items-center text-sm flex text-gray-600">
              <span className="rounded-full bg-green-500 text-white text-xs h-5 px-2 flex items-center">
                Default
              </span>
              {data.podcast.profile.snapod_site_url}
            </p>
          </div>
        )}
      </section>
      <section className="flex gap-x-4 border-t pt-5 mt-5">
        <div className="flex-1 border rounded-lg px-3 py-3.5">
          <span className="flex items-center">
            <em className="ml-1 text-base font-medium text-gray-500 dark:text-white not-italic">
              自定义域名
            </em>
            <em className="ml-1 text-sm font-medium text-gray-400 dark:text-gray-300 not-italic">
              Custom Domain
            </em>
          </span>
          <p className="text-xs text-gray-500 mx-1 py-2">
            域名格式为 <code>example.com</code>, 不含 <code>http</code> 或{' '}
            <code>https://</code>, 如 <code>snapodcast.com</code>。
          </p>
          <div>
            <input
              disabled={saving || activating}
              placeholder={
                data.podcast.profile.snapod_site_custom_url || 'example.com'
              }
              defaultValue={data.podcast.profile.snapod_site_custom_url}
              onChange={(e: { target: { value: any } }) => {
                setInfo({
                  ...podcastInfo,
                  snapod_site_custom_url: e.target.value,
                });
              }}
              className="mb-2.5 tracking-wide dark:bg-transparent dark:text-gray-300 dark:border-gray-500 focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
            />
            <p className="flex gap-x-2">
              <button
                disabled={saving || activating}
                className="flex justify-center align-middle items-center text-white text-sm hover:bg-gray-500 bg-gray-600 focus:outline-none rounded-md shadow-md py-1.5 px-3 text-center"
                aria-label="delete podcast"
                type="button"
                onClick={() => {
                  doModifyDomain(false);
                }}
              >
                {saving ? '提交中...' : '提交域名'}
              </button>
              <button
                disabled={saving || activating}
                className="flex justify-center align-middle items-center text-white text-sm hover:bg-gray-600 bg-gray-500 focus:outline-none rounded-md shadow-md py-1.5 px-3 text-center"
                aria-label="delete podcast"
                type="button"
                onClick={() => {
                  doModifyDomain(true);
                }}
              >
                重置 / Reset
              </button>
            </p>
          </div>
        </div>
        {podcastInfo.snapod_site_custom_url && (
          <div className="flex-1 border rounded-lg px-3 py-3.5">
            <span className="flex items-center">
              <em className="ml-1 text-base font-medium text-gray-500 dark:text-white not-italic">
                自定义域名配置指南
              </em>
              <em className="ml-1 text-sm font-medium text-gray-400 dark:text-gray-300 not-italic">
                Configuration Guide
              </em>
            </span>
            <div className="text-xs text-gray-500 mx-1 py-2">
              <p>
                提交后请前往域名注册/解析服务提供方配置{' '}
                <b>
                  {podcastInfo.snapod_site_custom_url.split('.').length >= 3
                    ? 'CNAME'
                    : 'A'}
                </b>{' '}
                解析记录, 预计在 24 小时内生效
                {podcastInfo.snapod_site_custom_url ? ':' : '。'}
              </p>
              {podcastInfo.snapod_site_custom_url && (
                <div className="mt-3 border-t border-b py-1">
                  {podcastInfo.snapod_site_custom_url.split('.').length >= 3 ? (
                    <ul>
                      <li className="flex">
                        <span className="flex-1">
                          {podcastInfo.snapod_site_custom_url
                            .split('.')
                            .slice(
                              0,
                              podcastInfo.snapod_site_custom_url.split('.')
                                .length - 2
                            )
                            .join('.')}
                        </span>
                        <span>snapod-site.netlify.app.</span>
                      </li>
                    </ul>
                  ) : (
                    <ul>
                      <li className="flex">
                        <span className="flex-1">@</span>
                        <span>75.2.60.5</span>
                      </li>
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
