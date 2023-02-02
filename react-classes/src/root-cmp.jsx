import {HashRouter as Route, Router, Switch } from 'react-router-dom';

import { AppHeader } from './cmps/app-header';
import { HomeRoute } from './pages/home-route';

function App() {
  return (
    // <Router>
      <div className='main-app'>
        {/* <AppHeader /> */}
        <main className=''>
          {/* <Switch> */}
            {/* <Route path="/" component={HomeRoute}/> */}
            <HomeRoute />
          {/* </Switch> */}
        </main>
      </div>
    // </Router>
  )
}

export default App;
