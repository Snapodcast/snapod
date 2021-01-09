import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import Aside from './components/Aside';
import Podcast from './Podcast';
import Episodes from './Episodes';
import Publish from './Publish';

export default function App() {
  return (
    <Router>
      <div className="flex w-full h-full">
        <Aside />
        <main className="main h-full bg-white">
          <Header />
          <section className="body no-drag">
            <Switch>
              <Route exact path="/">
                <p>home</p>
              </Route>
              <Route exact path="/podcast" component={Podcast} />
              <Route exact path="/episodes" component={Episodes} />
              <Route exact path="/publish" component={Publish} />
            </Switch>
          </section>
        </main>
      </div>
    </Router>
  );
}
