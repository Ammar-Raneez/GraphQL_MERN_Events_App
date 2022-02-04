import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Navigation from './components/Navigation/Navigation';
import Auth from './pages/Auth';
import Booking from './pages/Booking';
import Event from './pages/Event';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <main className="main-content">
        <Switch>
          <Redirect from="/" to="/auth" exact />
          <Route path="/auth" component={Auth} />
          <Route path="/events" component={Event} />
          <Route path="/bookings" component={Booking} />
        </Switch>
      </main>
    </BrowserRouter>
  );
}

export default App;
