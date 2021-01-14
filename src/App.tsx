import React from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import rootPath from './utilities/path';
import usePodcasts, { refetchPodcasts } from './lib/DataFetching/podcasts';

import Header from './components/Header';
import Aside from './components/Aside';
import Podcast from './pages/Options/Podcast';
import Episodes from './pages/Options/Episodes';
import Publish from './pages/Options/Publish';
import Start from './pages/Start';
import New from './pages/Create/New';
import Import from './pages/Create/Import';
import Hosting from './pages/Settings/Hosting';

import { StorageContextProvider } from './lib/Context/storage';
import { HeadContextProvider } from './lib/Context/head';
import { PodcastContextProvider } from './lib/Context/podcast';

export default function App() {
  const { podcastsData, isLoading, isError } = usePodcasts();

  const [podcast, setPodcast] = React.useState<string>('none');
  const podcastValue = { podcast, setPodcast };

  const [storageDir, setStorageDir] = React.useState<string>(rootPath());
  const storageValue = React.useMemo(() => ({ storageDir, setStorageDir }), [
    storageDir,
  ]);

  const [head, setHead] = React.useState<any>({
    title: 'Snapod',
    description: 'Podcasts Self-hosting Solution',
  });
  const headValue = React.useMemo(() => ({ head, setHead }), [head]);

  const [extend, setExtend] = React.useState<'true' | 'false' | 'unset'>(
    'unset'
  );

  const hideSideBarListener = () => {
    setExtend(extend === 'true' ? 'false' : 'true');
  };

  React.useEffect(() => {
    return () => {
      ipcRenderer.removeListener('hide-sidebar', hideSideBarListener);
    };
  });

  // Listen to hiding sidebar event
  ipcRenderer.on('hide-sidebar', hideSideBarListener);

  return (
    <BrowserRouter>
      <PodcastContextProvider value={podcastValue}>
        <div className="flex w-full h-full">
          <Aside
            podcasts={podcastsData}
            isLoading={isLoading}
            isError={isError}
          />
          <div className="absolute bg-white z-10 main h-full main left-220" />
          <main
            className={`main h-full bg-white z-30 absolute ${
              // eslint-disable-next-line no-nested-ternary
              extend === 'true'
                ? 'animate-extendMainBody'
                : extend === 'unset'
                ? 'left-220 snapod animate-firstShow'
                : 'animate-restoreMainBody'
            }`}
          >
            <HeadContextProvider value={headValue}>
              <Header />
              <section className="body p-4 z-20">
                <StorageContextProvider value={storageValue}>
                  <Route exact path="">
                    <Redirect to="/start" />
                  </Route>
                  <Route exact path="/start" component={Start} />
                  <Route exact path="/new">
                    <New mutate={refetchPodcasts} />
                  </Route>
                  <Route exact path="/import" component={Import} />
                  <Route exact path="/podcast" component={Podcast} />
                  <Route exact path="/episodes" component={Episodes} />
                  <Route exact path="/publish" component={Publish} />
                  <Route exact path="/hosting" component={Hosting} />
                </StorageContextProvider>
              </section>
            </HeadContextProvider>
          </main>
        </div>
      </PodcastContextProvider>
    </BrowserRouter>
  );
}
