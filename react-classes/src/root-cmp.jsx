import { AppHeader } from './cmps/app-header';
import { Route, Router, Switch } from 'react-router-dom';
import { HomeRoute } from './pages/home-route';

function App() {
  return (
    <Router>
      <div className='main-app'>
        <AppHeader />
        <main className=''>
          <Switch>
            <Route path="/" component={HomeRoute}/>
          </Switch>
        </main>
      </div>
    </Router>
  )
}

export default App;
