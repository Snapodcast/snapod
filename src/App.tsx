import React from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { ipcRenderer } from 'electron';
import * as Store from './lib/Store';

import Header from './components/Header';
import Aside from './components/Aside';
import Start from './pages/Start';
import Login from './pages/Landing/Login';
import SignUp from './pages/Landing/SignUp';
import NewEpisode from './pages/Create/New/episode';

import { HeadContextProvider } from './lib/Context/head';

export default function App() {
  /* Header Info */
  // header info state
  const [head, setHead] = React.useState({
    title: 'Snapod',
    description: 'Podcasts Self-hosting Solution',
  });
  const headValue = React.useMemo(() => ({ head, setHead }), [head]);

  /* Sidebar Hiding */
  // sidebar status state
  const [extend, setExtend] = React.useState<'true' | 'false' | 'unset'>(
    'unset'
  );
  // sidebar extend action listener
  const hideSideBarListener = () => {
    setExtend(extend === 'true' ? 'false' : 'true');
  };
  // set sidebar extending listener
  ipcRenderer.on('hide-sidebar', hideSideBarListener);
  // clean up listener when components are unmounted
  React.useEffect(() => {
    return () => {
      ipcRenderer.removeListener('hide-sidebar', hideSideBarListener);
    };
  });

  return (
    <BrowserRouter>
      <Route exact path="">
        {!Store.get('currentUser.token') ? (
          <Redirect to="/landing/login" />
        ) : (
          <Redirect to="/snapod" />
        )}
      </Route>
      <Route path="/landing/login" component={Login} />
      <Route path="/landing/signup" component={SignUp} />
      <Route path="/snapod">
        <div className="flex w-full h-full transition-all">
          <Aside />
          <div className="absolute bg-white z-10 main h-full main left-220" />
          <main
            className={`main h-full bg-white dark:bg-darkMain z-30 absolute ${
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
                <Route exact path="/snapod">
                  <Redirect to="/snapod/start" />
                </Route>
                <Route exact path="/snapod/start" component={Start} />
                <Route exact path="/snapod/new" component={NewEpisode} />
              </section>
            </HeadContextProvider>
          </main>
        </div>
      </Route>
    </BrowserRouter>
  );
}
