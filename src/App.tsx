import React from 'react';
import { useEffectOnce } from 'react-use';
import { MemoryRouter, Route, Redirect } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import Store from './lib/Store';
// Utilities
import { HeadContextProvider } from './lib/Context/head';
import { PodcastContextProvider } from './lib/Context/podcast';
// Components
import Header from './components/Header';
import Aside from './components/Aside';
import Reset from './components/Refresher';
// Pages (inner)
import Start from './pages/embed/Start';
import CreatePodcast from './pages/embed/Create/podcast';
import ManagePodcast from './pages/embed/Manage/info';
import CreateEpisode from './pages/embed/Create/episode';
import EpisodeList from './pages/embed/Manage/episodeList';
import ManageEpisode from './pages/embed/Manage/episode';
import PodcastSettings from './pages/embed/Settings/podcast';
import DistributionSettings from './pages/embed/Settings/distribution';
import ManageMetrics from './pages/embed/Manage/metrics';
import ManageSite from './pages/embed/Manage/site';
import ImportPodcast from './pages/embed/Import';
import HelpCenter from './pages/embed/HelpCenter';
import AboutPage from './pages/embed/About';
import AppSettings from './pages/embed/Settings/app';
// Pages (fullscreen)
import Login from './pages/single/Login';
import SignUp from './pages/single/SignUp';
import Forgot from './pages/single/Forgot';
import StartSingle from './pages/single/Start';
import OfflinePage from './pages/single/Offline';
import UpdatePage from './pages/single/Update';
import LoadingPage from './pages/single/Loading';
// Data
import Configs from './configs';

export default function App() {
  const userToken = Store.get('currentUser.token');

  const [start, setStart] = React.useState(false);
  const [heartBeat, setHeartBeat] = React.useState('pong');

  /* Check for version update & validate JWT token */
  useEffectOnce(() => {
    // validate JWT token by sending ping to backend
    fetch(`${Configs.backend_url}/ping/auth`, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    })
      .then(async (res) => {
        const result = await res.json();
        setHeartBeat(result.message || 'error');
      })
      .catch(() => {
        setHeartBeat('error');
      });
    // finish fetching data from remote, proceed with local logic
    setStart(true);
  });

  /* Header Info */
  // header info state
  const [head, setHead] = React.useState({
    title: 'Snapod',
    description: 'Grow your podcasts with ease',
  });
  const headValue = React.useMemo(() => ({ head, setHead }), [head]);

  /* Sidebar Extension */
  // sidebar extension status
  const [extend, setExtend] = React.useState<'true' | 'false' | 'unset'>(
    'unset'
  );
  // sidebar extend action handler
  const hideSideBarListener = () => {
    setExtend(extend === 'true' ? 'false' : 'true');
  };
  // sidebar extend action listener
  ipcRenderer.on('hide-sidebar', hideSideBarListener);
  // clean up listener when components are unmounted
  React.useEffect(() => {
    return () => {
      ipcRenderer.removeListener('hide-sidebar', hideSideBarListener);
    };
  });

  /* Podcast Info */
  const [podcastName, setName] = React.useState<string>(
    Store.get('currentPodcast.name')
  );
  const [podcastCuid, setCuid] = React.useState<string>(
    Store.get('currentPodcast.cuid')
  );
  const podcastInfoValue = React.useMemo(
    () => ({
      name: podcastName,
      cuid: podcastCuid,
      setName,
      setCuid,
    }),
    [podcastName, podcastCuid]
  );

  return (
    <MemoryRouter>
      {/* Entry */}
      <Route exact path="">
        {!start ? (
          <Redirect to="/landing/loading" />
        ) : !userToken || heartBeat !== 'pong' ? (
          <Redirect to="/landing/login" />
        ) : (
          <Redirect to="/landing/start" />
        )}
      </Route>
      {/* Landing */}
      <Route path="/landing">
        <div className="w-full h-full theme-background drag">
          <main className="flex align-middle items-center h-full justify-center">
            <Route exact path="/landing">
              <Redirect to="/snapod/login" />
            </Route>
            <Route path="/landing/login" component={Login} />
            <Route path="/landing/signup" component={SignUp} />
            <Route path="/landing/forgot" component={Forgot} />
            <Route path="/landing/start" component={StartSingle} />
            <Route path="/landing/create/podcast" component={CreatePodcast} />
            <Route path="/landing/import/podcast" component={ImportPodcast} />
            <Route path="/landing/offline" component={OfflinePage} />
            <Route path="/landing/update" component={UpdatePage} />
            <Route path="/landing/loading" component={LoadingPage} />
          </main>
        </div>
      </Route>
      {/* Podcast */}
      <Route path="/snapod">
        <PodcastContextProvider value={podcastInfoValue}>
          <div className="flex w-full h-full transition-all snapod animate-firstShow">
            <Aside />
            <div className="absolute bg-white z-10 main h-full main left-220" />
            <main
              className={`main h-full bg-white dark:bg-darkMain z-30 absolute ${
                // eslint-disable-next-line no-nested-ternary
                extend === 'true'
                  ? 'animate-extendMainBody'
                  : extend === 'unset'
                  ? 'left-220'
                  : 'animate-restoreMainBody'
              }`}
            >
              <HeadContextProvider value={headValue}>
                <Header />
                <section className="body p-4 z-20">
                  <Route path="/snapod">
                    <Redirect to="/snapod/start" />
                  </Route>
                  <Route path="/snapod/start" component={Start} />
                  <Route
                    path="/snapod/create/episode"
                    component={CreateEpisode}
                  />
                  <Route
                    path="/snapod/manage/podcast"
                    component={ManagePodcast}
                  />
                  <Route path="/snapod/reset" component={Reset} />
                  <Route
                    path="/snapod/manage/episodes"
                    component={EpisodeList}
                  />
                  <Route
                    path="/snapod/manage/episode"
                    component={ManageEpisode}
                  />
                  <Route
                    path="/snapod/manage/metrics"
                    component={ManageMetrics}
                  />
                  <Route path="/snapod/manage/site" component={ManageSite} />
                  <Route
                    path="/snapod/settings/distributions"
                    component={DistributionSettings}
                  />
                  <Route
                    path="/snapod/settings/podcast"
                    component={PodcastSettings}
                  />
                  <Route path="/snapod/settings/app" component={AppSettings} />
                  <Route path="/snapod/helpCenter" component={HelpCenter} />
                  <Route path="/snapod/about" component={AboutPage} />
                </section>
              </HeadContextProvider>
            </main>
          </div>
        </PodcastContextProvider>
      </Route>
    </MemoryRouter>
  );
}
