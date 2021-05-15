import React from 'react';
import * as Store from '../../../lib/Store';
import { useQuery, useMutation } from '@apollo/client';
import { GET_SITE, MODIFY_PODCAST } from '../../../lib/GraphQL/queries';
import Head from '../../../components/Head';
import Icons from '../../../components/Icons';
import { useHistory } from 'react-router';
import SnapodLogoImage from '../../../public/snapod_logo.png';
import NetlifyLogoImage from '../../../public/netlify_logo.png';
import Configs from '../../../configs';

export default function ManageSite() {
  const podcastCuid = Store.get('currentPodcast.cuid');
  const history = useHistory();
  const { loading, error, data, refetch } = useQuery(GET_SITE, {
    variables: { podcastCuid },
    fetchPolicy: 'network-only',
  });
  const [modifySite] = useMutation(MODIFY_PODCAST);
  const [podcastInfo, setInfo] = React.useState<any>({
    snapod_site_url: '',
    snapod_site_custom_url: '',
  });
  const [savable, setSavable] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [activating, setActivating] = React.useState(false);

  /* Save action */
  const doSave = async () => {
    setSaving(true);
    const variables = {
      ...podcastInfo,
      podcastCuid,
      clean_content: podcastInfo.clean_content === 'true',
      copyright: podcastInfo.useCr ? podcastInfo.copyright : null,
      ownerName: podcastInfo.useOwner ? podcastInfo.ownerName : null,
      ownerEmail: podcastInfo.useOwner ? podcastInfo.ownerEmail : null,
      complete: podcastInfo.complete === 'true',
      block: podcastInfo.block === 'true',
    };

    await modifySite({
      variables,
    })
      .then(() => {
        setSavable(false);
        alert('修改成功');
      })
      .catch(() => {
        alert(`修改失败`);
      });
    setSaving(false);
  };

  /* Fill in default values */
  const isDataFirstRun = React.useRef(true);
  if (data && isDataFirstRun.current) {
    setInfo({
      snapod_site_url: data.podcast.profile.snapod_site_url,
      snapod_site_custom_url: data.podcast.profile.snapod_site_custom_url,
    });
    isDataFirstRun.current = false;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <span className="animate-spin w-5 h-5">
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

  /* Activation action */
  const doActivate = async () => {
    setActivating(true);
    const variables = {
      podcastCuid,
      snapod_site_url: `${Configs.site_url}/${46800 + data.podcast.id}`,
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

  // Snapod 站点未启用
  if (!data.podcast.profile.snapod_site_url) {
    return (
      <div className="my-4 mx-5">
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
                <h1 className="text-2xl text-gray-700 font-medium mb-0.5 tracking-wide">
                  Snapod 播客站点
                </h1>
                <p className="text-sm tracking-wide text-gray-500">
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
      {savable && (
        <div className="flex justify-center items-center w-full">
          <div className="flex absolute bottom-5 z-10 gap-x-3">
            <button
              className="bg-gray-500 tracking-wide text-center text-sm py-1 px-5 shadow-lg rounded-2xl whitespace-nowrap text-white hover:bg-gray-600"
              aria-label="save changes"
              type="button"
              onClick={() => {
                history.push('/snapod/reset');
              }}
            >
              重置
            </button>
            <button
              className="bg-blue-500 tracking-wide text-center text-sm py-1 px-5 shadow-lg rounded-2xl whitespace-nowrap text-white hover:bg-blue-600"
              aria-label="save changes"
              type="button"
              onClick={() => {
                doSave();
              }}
            >
              {saving ? '保存中...' : '保存更改'}
            </button>
          </div>
        </div>
      )}
      <section className="border rounded-md py-5 text-center">
        <h1 className="text-base font-medium tracking-wide mb-3 flex gap-x-2 justify-center items-center">
          <span className="w-5 h-5">
            <Icons name="globe" />
          </span>
          播客站点 / Snapod Site
        </h1>
        {data.podcast.profile.snapod_site_custom_url ? (
          <div>
            <p>{data.podcast.profile.snapod_site_url}</p>
            <p>{data.podcast.profile.snapod_site_custom_url}</p>
          </div>
        ) : (
          <p className="rounded-md bg-gray-100 border py-1.5 px-3.5 text-sm inline-block text-gray-600">
            {data.podcast.profile.snapod_site_url}
          </p>
        )}
      </section>
    </div>
  );
}
