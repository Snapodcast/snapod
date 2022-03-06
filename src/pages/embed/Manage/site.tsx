import React from 'react';
import Store from '../../../lib/Store';
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
import { useI18n } from '../../../hooks';

export default function ManageSite() {
  const { t } = useI18n();
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
        alert(t('successfullyActivated'));
        history.push('/snapod/reset');
      })
      .catch(() => {
        alert(t('errorActivating'));
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
        alert(t('successfullySubmitted'));
        history.push('/snapod/reset');
      })
      .catch(() => {
        alert(t('errorSubmitting'));
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
              {t('reload')}
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
        <Head
          title={t('activateSnapodSiteTitle')}
          description={t('activateSnapodSiteDescription')}
        />
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
              {activating ? t('submitting') : t('acceptAndActivate')}
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
                  {t('snapodSite')}
                </h1>
                <p className="text-sm tracking-wide text-gray-500 dark:text-gray-300">
                  {t('snapodSiteDescription')}
                </p>
              </div>
              <div className="text-sm text-gray-600">
                <p className="mb-1.5">{t('snapodSiteIntroSectionOne')}</p>
                <p className="mb-1.5">{t('snapodSiteIntroSectionTwo')}</p>
                <p>{t('snapodSiteIntroSectionThree')}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="my-4 mx-5">
      <Head
        title={t('manageSnapodSiteTitle')}
        description={t('manageSnapodSiteDescription')}
      />
      <section className="border rounded-md py-5 text-center">
        <h1 className="text-lg font-medium mb-3 flex gap-x-2 justify-center items-center dark:text-white">
          <span className="w-5 h-5">
            <Icons name="globe" />
          </span>
          {t('snapodSite')}
        </h1>
        {data.podcast.profile.snapod_site_custom_url ? (
          <div className="rounded-md border text-sm inline-block text-gray-600 shadow-sm">
            <p className="border-b py-2 px-3.5 flex gap-2 items-center">
              <span className="rounded-full bg-green-500 text-white text-xs h-5 px-2 flex items-center">
                {t('default')}
              </span>
              <span className="dark:text-gray-300">
                {data.podcast.profile.snapod_site_url}
              </span>
            </p>
            <p className="py-2 px-3.5 flex gap-2 items-center">
              <span className="rounded-full bg-yellow-500 text-white text-xs h-5 px-2 flex items-center">
                {t('custom')}
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
                {t('default')}
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
              {t('customDomainTitle')}
            </em>
            <em className="ml-1 text-sm font-medium text-gray-400 dark:text-gray-300 not-italic">
              {t('customDomainDescription')}
            </em>
          </span>
          <p className="text-xs text-gray-500 mx-1 py-2">
            {t('customDomainFormat')}
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
                {saving ? t('submitting') : t('submitDomain')}
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
                {t('reset')}
              </button>
            </p>
          </div>
        </div>
        {podcastInfo.snapod_site_custom_url && (
          <div className="flex-1 border rounded-lg px-3 py-3.5">
            <span className="flex items-center">
              <em className="ml-1 text-base font-medium text-gray-500 dark:text-white not-italic">
                {t('customDomainConfigurationGuide')}
              </em>
              <em className="ml-1 text-sm font-medium text-gray-400 dark:text-gray-300 not-italic">
                {t('customDomainConfigurationGuideDescription')}
              </em>
              ``
            </span>
            <div className="text-xs text-gray-500 mx-1 py-2">
              <p>
                {t('addADns')}{' '}
                <b>
                  {podcastInfo.snapod_site_custom_url.split('.').length >= 3
                    ? 'CNAME'
                    : 'A'}
                </b>{' '}
                {t('record')}
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
