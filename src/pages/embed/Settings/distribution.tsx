import { useMutation, useQuery } from '@apollo/client';
import React from 'react';
import * as Store from '../../../lib/Store';
import { GET_PODCAST, MODIFY_PODCAST } from '../../../lib/GraphQL/queries';
import Head from '../../../components/Head';
import Icons from '../../../components/Icons';
import applePodcastsImage from '../../../public/apple_podcasts.png';
import googlePodcastsImage from '../../../public/google_podcasts.png';
import breakerImage from '../../../public/breaker.png';
import castboxImage from '../../../public/castbox.png';
import overcastImage from '../../../public/overcast.png';
import pocketCastImage from '../../../public/pocketcasts.png';
import radioPublicImage from '../../../public/radiopublic.png';
import spotifyImage from '../../../public/spotify.png';
import neteaseImage from '../../../public/netease_music.jpg';
import qqmusicImage from '../../../public/qqmusic.png';
import ximalayaImage from '../../../public/ximalaya.png';
import xiaoyuzhouImage from '../../../public/xiaoyuzhou.png';
import { useHistory } from 'react-router';
import { useCopyToClipboard } from 'react-use';

export default function DistributionSettings() {
  const [state, copyToClipboard] = useCopyToClipboard();
  const history = useHistory();
  const podcastCuid = Store.get('currentPodcast.cuid');
  const [modifyPodcast] = useMutation(MODIFY_PODCAST);
  const [saving, setSaving] = React.useState(false);
  const [distributions, setDistributions] = React.useState<any>({
    apple_podcasts_url: '',
    google_podcasts_url: '',
    breaker_url: '',
    castbox_url: '',
    overcast_url: '',
    pocketcast_url: '',
    radiopublic_url: '',
    spotify: '',
    netease_url: '',
    qqmusic_url: '',
    ximalaya_url: '',
    xiaoyuzhou_url: '',
    website_url: '',
  });

  const { loading, error, data, refetch } = useQuery(GET_PODCAST, {
    variables: { podcastCuid },
    fetchPolicy: 'network-only',
  });

  const doModify = async () => {
    setSaving(true);
    await modifyPodcast({
      variables: {
        podcastCuid,
        ...distributions,
      },
    })
      .then(() => {
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
    setDistributions({
      apple_podcasts_url: data.podcast.profile.apple_podcasts_url,
      google_podcasts_url: data.podcast.profile.google_podcasts_url,
      breaker_url: data.podcast.profile.breaker_url,
      castbox_url: data.podcast.profile.castbox_url,
      overcast_url: data.podcast.profile.overcast_url,
      pocketcast_url: data.podcast.profile.pocketcast_url,
      radiopublic_url: data.podcast.profile.radiopublic_url,
      spotify: data.podcast.profile.spotify,
      netease_url: data.podcast.profile.netease_url,
      qqmusic_url: data.podcast.profile.qqmusic_url,
      ximalaya_url: data.podcast.profile.ximalaya_url,
      xiaoyuzhou_url: data.podcast.profile.xiaoyuzhou_url,
      website_url: data.podcast.profile.website_url,
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

  return (
    <div className="my-4 mx-5 mb-12">
      <Head title="发布渠道设置" description="查看和配置播客节目发布渠道" />
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
            还原更改
          </button>
          <button
            className="bg-blue-500 tracking-wide text-center text-sm py-1 px-5 shadow-lg rounded-2xl whitespace-nowrap text-white hover:bg-blue-600"
            aria-label="save changes"
            type="button"
            onClick={() => {
              doModify();
            }}
          >
            {saving ? '保存中...' : '保存更改'}
          </button>
        </div>
      </div>
      <section className="mb-5 grid grid-cols-2 gap-x-3 border-b pb-5">
        <div className="border rounded-lg py-3.5 px-4">
          <div className="items-center mb-1.5 flex">
            <span className="items-center flex ml-1 flex-1">
              <span className="w-4 h-4 text-gray-500">
                <Icons name="rss" />
              </span>
              <em className="ml-1 text-sm font-medium text-gray-500 not-italic">
                RSS 地址
              </em>
              <em className="ml-1 text-xs font-medium text-gray-400 not-italic">
                Feed URL
              </em>
            </span>
            <button
              type="button"
              aria-label="copy"
              className="border rounded-md px-2 py-0.5 text-xs text-gray-500 hover:bg-gray-50"
              onClick={() => {
                copyToClipboard(`https://rss.snapodcast.com/${podcastCuid}`);
              }}
            >
              {state.error ? '需手动复制' : state.value ? '已复制' : '复制'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-2 mx-1">
            此地址可用于泛用性播客客户端订阅、播客平台发布等用途
          </p>
          <p className="text-gray-600 text-sm whitespace-nowrap overflow-x-auto border shadow-sm rounded-md py-1 px-2">
            https://rss.snapodcast.com/{podcastCuid}
          </p>
        </div>
        <div className="border rounded-lg py-3.5 px-4">
          <div className="items-center mb-2">
            <span className="items-center flex ml-1">
              <span className="w-4 h-4 text-gray-500">
                <Icons name="globe" />
              </span>
              <em className="ml-1 text-sm font-medium text-gray-500 not-italic">
                播客网站
              </em>
              <em className="ml-1 text-xs font-medium text-gray-400 not-italic">
                Podcast Website
              </em>
            </span>
          </div>
          <div className="mt-1">
            <p className="text-xs text-gray-500 mb-2 mx-1">
              开启 Snapod 站点后播客网站仍可自行设置,
              但单期节目对应网址链接将失效
            </p>
            <div className="flex gap-x-2">
              <input
                disabled={saving}
                defaultValue={distributions.website_url}
                placeholder={distributions.website_url || 'https://example.com'}
                onChange={(e: { target: { value: any } }) => {
                  setDistributions({
                    ...distributions,
                    website_url: e.target.value,
                  });
                }}
                className="shadow-sm tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1 px-3 text-gray-700"
              />
              <button
                type="button"
                aria-label="snapod site"
                className="text-xs rounded-md shadow-sm bg-blue-500 py-1 px-3 whitespace-nowrap text-white hover:bg-blue-600"
                onClick={() => {
                  history.push('/snapod/manage/site');
                }}
              >
                Snapod 站点
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-2 gap-3">
        <div className="border rounded-lg py-3.5 px-4">
          <div className="items-center mb-2">
            <span className="items-center flex ml-1">
              <img
                src={applePodcastsImage}
                alt="apple podcasts"
                className="w-5 h-5 rounded-full"
              />
              <em className="ml-1 text-sm font-medium text-gray-500 not-italic">
                苹果播客
              </em>
              <em className="ml-1 text-xs font-medium text-gray-400 not-italic">
                Apple Podcasts
              </em>
            </span>
          </div>
          <input
            disabled={saving}
            defaultValue={distributions.apple_podcasts_url}
            placeholder="Apple Podcasts 播客页地址"
            onChange={(e: { target: { value: any } }) => {
              setDistributions({
                ...distributions,
                apple_podcasts_url: e.target.value,
              });
            }}
            className="tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
          />
        </div>
        <div className="border rounded-lg py-3.5 px-4">
          <div className="items-center mb-2">
            <span className="items-center flex ml-1">
              <img
                src={googlePodcastsImage}
                alt="google podcasts"
                className="w-5 h-5 rounded-full"
              />
              <em className="ml-1 text-sm font-medium text-gray-500 not-italic">
                谷歌播客
              </em>
              <em className="ml-1 text-xs font-medium text-gray-400 not-italic">
                Google Podcasts
              </em>
            </span>
          </div>
          <input
            disabled={saving}
            defaultValue={distributions.google_podcasts_url}
            placeholder="Google Podcasts 播客页地址"
            onChange={(e: { target: { value: any } }) => {
              setDistributions({
                ...distributions,
                google_podcasts_url: e.target.value,
              });
            }}
            className="tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
          />
        </div>
        <div className="border rounded-lg py-3.5 px-4">
          <div className="items-center mb-2">
            <span className="items-center flex ml-1">
              <img
                src={breakerImage}
                alt="breaker"
                className="w-4 h-4 rounded-full mr-0.5"
              />
              <em className="ml-1 text-sm font-medium text-gray-500 not-italic">
                Breaker 播客
              </em>
              <em className="ml-1 text-xs font-medium text-gray-400 not-italic">
                Breaker
              </em>
            </span>
          </div>
          <input
            disabled={saving}
            defaultValue={distributions.breaker_url}
            placeholder="Breaker 播客页地址"
            onChange={(e: { target: { value: any } }) => {
              setDistributions({
                ...distributions,
                breaker_url: e.target.value,
              });
            }}
            className="tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
          />
        </div>
        <div className="border rounded-lg py-3.5 px-4">
          <div className="items-center mb-2">
            <span className="items-center flex ml-1">
              <img
                src={castboxImage}
                alt="castbox"
                className="w-4 h-4 rounded-full mr-0.5"
              />
              <em className="ml-1 text-sm font-medium text-gray-500 not-italic">
                CastBox 播客
              </em>
              <em className="ml-1 text-xs font-medium text-gray-400 not-italic">
                CastBox
              </em>
            </span>
          </div>
          <input
            disabled={saving}
            defaultValue={distributions.castbox_url}
            placeholder="Breaker 播客页地址"
            onChange={(e: { target: { value: any } }) => {
              setDistributions({
                ...distributions,
                castbox_url: e.target.value,
              });
            }}
            className="tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
          />
        </div>
        <div className="border rounded-lg py-3.5 px-4">
          <div className="items-center mb-2">
            <span className="items-center flex ml-1">
              <img
                src={overcastImage}
                alt="overcast"
                className="w-4 h-4 rounded-full mr-0.5"
              />
              <em className="ml-1 text-sm font-medium text-gray-500 not-italic">
                Overcast 播客
              </em>
              <em className="ml-1 text-xs font-medium text-gray-400 not-italic">
                Overcast
              </em>
            </span>
          </div>
          <input
            disabled={saving}
            defaultValue={distributions.overcast_url}
            placeholder="Overcast 播客页地址"
            onChange={(e: { target: { value: any } }) => {
              setDistributions({
                ...distributions,
                overcast_url: e.target.value,
              });
            }}
            className="tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
          />
        </div>
        <div className="border rounded-lg py-3.5 px-4">
          <div className="items-center mb-2">
            <span className="items-center flex ml-1">
              <img
                src={pocketCastImage}
                alt="overcast"
                className="w-4 h-4 rounded-full mr-0.5"
              />
              <em className="ml-1 text-sm font-medium text-gray-500 not-italic">
                PocketCast 播客
              </em>
              <em className="ml-1 text-xs font-medium text-gray-400 not-italic">
                PocketCast
              </em>
            </span>
          </div>
          <input
            disabled={saving}
            defaultValue={distributions.pocketcast_url}
            placeholder="PocketCast 播客页地址"
            onChange={(e: { target: { value: any } }) => {
              setDistributions({
                ...distributions,
                pocketcast_url: e.target.value,
              });
            }}
            className="tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
          />
        </div>
        <div className="border rounded-lg py-3.5 px-4">
          <div className="items-center mb-2">
            <span className="items-center flex ml-1">
              <img
                src={radioPublicImage}
                alt="radiopublic"
                className="w-4 h-4 rounded-full mr-0.5"
              />
              <em className="ml-1 text-sm font-medium text-gray-500 not-italic">
                RadioPublic 播客
              </em>
              <em className="ml-1 text-xs font-medium text-gray-400 not-italic">
                RadioPublic
              </em>
            </span>
          </div>
          <input
            disabled={saving}
            defaultValue={distributions.radiopublic_url}
            placeholder="RadioPublic 播客页地址"
            onChange={(e: { target: { value: any } }) => {
              setDistributions({
                ...distributions,
                radiopublic_url: e.target.value,
              });
            }}
            className="tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
          />
        </div>
        <div className="border rounded-lg py-3.5 px-4">
          <div className="items-center mb-2">
            <span className="items-center flex ml-1">
              <img
                src={spotifyImage}
                alt="spotify"
                className="w-4 h-4 rounded-full mr-0.5"
              />
              <em className="ml-1 text-sm font-medium text-gray-500 not-italic">
                Spotify 播客
              </em>
              <em className="ml-1 text-xs font-medium text-gray-400 not-italic">
                Spotify Podcasts
              </em>
            </span>
          </div>
          <input
            disabled={saving}
            defaultValue={distributions.spotify}
            placeholder="Spotify 播客页地址"
            onChange={(e: { target: { value: any } }) => {
              setDistributions({
                ...distributions,
                spotify: e.target.value,
              });
            }}
            className="tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
          />
        </div>
        <div className="border rounded-lg py-3.5 px-4">
          <div className="items-center mb-2">
            <span className="items-center flex ml-1">
              <img
                src={neteaseImage}
                alt="netease music"
                className="w-4 h-4 rounded-full mr-0.5"
              />
              <em className="ml-1 text-sm font-medium text-gray-500 not-italic">
                网易云音乐
              </em>
              <em className="ml-1 text-xs font-medium text-gray-400 not-italic">
                Netease Music
              </em>
            </span>
          </div>
          <input
            disabled={saving}
            defaultValue={distributions.netease_url}
            placeholder="网易云音乐播客页地址"
            onChange={(e: { target: { value: any } }) => {
              setDistributions({
                ...distributions,
                netease_url: e.target.value,
              });
            }}
            className="tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
          />
        </div>
        <div className="border rounded-lg py-3.5 px-4">
          <div className="items-center mb-2">
            <span className="items-center flex ml-1">
              <img
                src={qqmusicImage}
                alt="qqmusic music"
                className="w-4 h-4 rounded-full mr-0.5"
              />
              <em className="ml-1 text-sm font-medium text-gray-500 not-italic">
                QQ 音乐
              </em>
              <em className="ml-1 text-xs font-medium text-gray-400 not-italic">
                QQ Music
              </em>
            </span>
          </div>
          <input
            disabled={saving}
            defaultValue={distributions.qqmusic_url}
            placeholder="QQ 音乐播客页地址"
            onChange={(e: { target: { value: any } }) => {
              setDistributions({
                ...distributions,
                qqmusic_url: e.target.value,
              });
            }}
            className="tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
          />
        </div>
        <div className="border rounded-lg py-3.5 px-4">
          <div className="items-center mb-2">
            <span className="items-center flex ml-1">
              <img
                src={ximalayaImage}
                alt="ximalaya"
                className="w-4 h-4 rounded-full mr-0.5"
              />
              <em className="ml-1 text-sm font-medium text-gray-500 not-italic">
                喜马拉雅
              </em>
              <em className="ml-1 text-xs font-medium text-gray-400 not-italic">
                Ximalaya
              </em>
            </span>
          </div>
          <input
            disabled={saving}
            defaultValue={distributions.ximalaya_url}
            placeholder="喜马拉雅播客页地址"
            onChange={(e: { target: { value: any } }) => {
              setDistributions({
                ...distributions,
                ximalaya_url: e.target.value,
              });
            }}
            className="tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
          />
        </div>
        <div className="border rounded-lg py-3.5 px-4">
          <div className="items-center mb-2">
            <span className="items-center flex ml-1">
              <img
                src={xiaoyuzhouImage}
                alt="xiaoyuzhou"
                className="w-4 h-4 rounded-full mr-0.5"
              />
              <em className="ml-1 text-sm font-medium text-gray-500 not-italic">
                小宇宙
              </em>
              <em className="ml-1 text-xs font-medium text-gray-400 not-italic">
                Xiaoyuzhou
              </em>
            </span>
          </div>
          <input
            disabled={saving}
            defaultValue={distributions.xiaoyuzhou_url}
            placeholder="小宇宙播客页地址"
            onChange={(e: { target: { value: any } }) => {
              setDistributions({
                ...distributions,
                xiaoyuzhou_url: e.target.value,
              });
            }}
            className="tracking-wide focus:outline-none focus:border-gray-400 border rounded-md w-full text-sm py-1.5 px-3 text-gray-700"
          />
        </div>
      </section>
    </div>
  );
}
